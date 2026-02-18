import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number; // ms, 글자 간 간격(stagger)
  duration?: number; // s
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];

  /**  반복 옵션 */
  repeat?: boolean; // 기본 true
  repeatDelay?: number; // 초 단위, 기본 2초

  /**  화면 밖이면 멈출지 */
  pauseWhenOutOfView?: boolean; // 기본 true

  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 50,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",

  repeat = true,
  repeatDelay = 3,
  pauseWhenOutOfView = true,

  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts?.status === "loaded") setFontsLoaded(true);
    else document.fonts?.ready.then(() => setFontsLoaded(true));
  }, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !text || !fontsLoaded) return;

      // 이전 Split 인스턴스 정리
      const anyEl = el as any;
      if (anyEl._rbsplitInstance) {
        try {
          anyEl._rbsplitInstance.revert();
        } catch {}
        anyEl._rbsplitInstance = undefined;
      }

      // ScrollTrigger start 계산(기존 로직 유지)
      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
      const sign =
        marginValue === 0
          ? ""
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      let targets: Element[] = [];

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,

        onSplit: (self: GSAPSplitText) => {
          // 타겟 할당
          if (splitType.includes("chars") && self.chars?.length)
            targets = self.chars;
          if (
            !targets.length &&
            splitType.includes("words") &&
            self.words?.length
          )
            targets = self.words;
          if (
            !targets.length &&
            splitType.includes("lines") &&
            self.lines?.length
          )
            targets = self.lines;
          if (!targets.length) targets = self.chars || self.words || self.lines;

          //  반복 타임라인 생성
          const tl = gsap.timeline({
            paused: pauseWhenOutOfView, // 밖이면 일단 멈춘 상태로 시작
            repeat: repeat ? -1 : 0,
            repeatDelay,
            defaults: { ease },
            scrollTrigger: {
              trigger: el,
              start,
              //  once:true 제거 (반복 가능하게)
              onEnter: () => tl.play(0),
              onEnterBack: () => tl.play(0),
              ...(pauseWhenOutOfView
                ? {
                    onLeave: () => tl.pause(),
                    onLeaveBack: () => tl.pause(),
                  }
                : {}),
              fastScrollEnd: true,
              anticipatePin: 0.4,
            },
          });

          //  매 반복마다 from 상태로 되돌린 후 재생
          tl.set(targets, {
            ...from,
            willChange: "transform, opacity",
            force3D: true,
          });
          tl.to(targets, {
            ...to,
            duration,
            stagger: delay / 1000,
            onComplete: () => {
              onCompleteRef.current?.(); // “한 사이클 끝” 콜백
            },
          });

          return tl;
        },
      });

      anyEl._rbsplitInstance = splitInstance;

      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === el) st.kill();
        });
        try {
          splitInstance.revert();
        } catch {}
        anyEl._rbsplitInstance = undefined;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        repeat,
        repeatDelay,
        pauseWhenOutOfView,
      ],
      scope: ref,
    },
  );

  const Tag = (tag || "p") as React.ElementType;
  const style: React.CSSProperties = {
    textAlign,
    wordWrap: "break-word",
  };

  return (
    <Tag
      ref={ref as any}
      style={style}
      className={`split-parent overflow-hidden inline-block whitespace-normal ${className}`}
    >
      {text}
    </Tag>
  );
};

export default SplitText;
