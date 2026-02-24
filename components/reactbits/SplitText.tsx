import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(GSAPSplitText, useGSAP);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number; // ms, 글자 간 간격(stagger)
  duration?: number; // s
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;

  /** Hero 전용에서 IntersectionObserver용 */
  threshold?: number;
  rootMargin?: string;

  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];

  /** 반복 옵션 */
  repeat?: boolean; // 기본 true
  repeatDelay?: number; // 초 단위, 기본 3초

  /** 화면 밖이면 멈출지 */
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
    let mounted = true;

    if (document.fonts?.status === "loaded") {
      if (mounted) setFontsLoaded(true);
    } else {
      document.fonts?.ready.then(() => {
        if (mounted) setFontsLoaded(true);
      });
    }

    return () => {
      mounted = false;
    };
  }, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !text || !fontsLoaded) return;

      const anyEl = el as any;

      // 이전 split 정리
      if (anyEl._rbsplitInstance) {
        try {
          anyEl._rbsplitInstance.revert();
        } catch {}
        anyEl._rbsplitInstance = undefined;
      }

      // 이전 timeline 정리
      if (anyEl._rbsplitTimeline) {
        try {
          anyEl._rbsplitTimeline.kill();
        } catch {}
        anyEl._rbsplitTimeline = undefined;
      }

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
          // 타겟 결정
          if (splitType.includes("chars") && self.chars?.length) {
            targets = self.chars;
          }
          if (
            !targets.length &&
            splitType.includes("words") &&
            self.words?.length
          ) {
            targets = self.words;
          }
          if (
            !targets.length &&
            splitType.includes("lines") &&
            self.lines?.length
          ) {
            targets = self.lines;
          }
          if (!targets.length) {
            targets = self.chars || self.words || self.lines || [];
          }

          const tl = gsap.timeline({
            paused: true, // IO/visibility에서 제어
            repeat: repeat ? -1 : 0,
            repeatDelay,
            defaults: { ease },
          });

          // 1) 시작 상태 세팅
          tl.set(targets, {
            ...from,
            willChange: "transform, opacity",
            // force3D는 텍스트에선 항상 이득 아님. 필요시만 켜기.
            // force3D: true,
          });

          // 2) 애니메이션
          tl.to(targets, {
            ...to,
            duration,
            stagger: delay / 1000,
            onComplete: () => {
              onCompleteRef.current?.();
            },
          });

          anyEl._rbsplitTimeline = tl;
          return tl;
        },
      });

      anyEl._rbsplitInstance = splitInstance;

      const tl: gsap.core.Timeline | undefined = anyEl._rbsplitTimeline;
      if (!tl) return;

      // ---- 가벼운 재생/정지 제어 ----
      let isInView = !pauseWhenOutOfView; // pause 옵션 끄면 항상 true 취급
      let isDocVisible = !document.hidden;

      const syncPlayback = () => {
        const shouldPlay = !pauseWhenOutOfView || (isInView && isDocVisible);

        if (shouldPlay) {
          // 처음 또는 다시 보일 때 한 사이클을 처음부터 재생
          // 반복형 텍스트 연출이라 play(0)로 맞추는 게 보통 자연스러움
          tl.play(0);
        } else {
          tl.pause();
        }
      };

      // 문서 숨김/복귀 대응
      const handleVisibilityChange = () => {
        isDocVisible = !document.hidden;
        syncPlayback();
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Hero 전용: ScrollTrigger 대신 IntersectionObserver
      let observer: IntersectionObserver | null = null;

      if (pauseWhenOutOfView) {
        observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            isInView = !!entry?.isIntersecting;
            syncPlayback();
          },
          {
            threshold,
            root: null,
            rootMargin,
          },
        );

        observer.observe(el);
      } else {
        // 화면 밖 pause 안 하면 바로 시작
        isInView = true;
        syncPlayback();
      }

      // 초기 1회 동기화 (observer 콜백 전에 시작 안 되는 경우 방지)
      syncPlayback();

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );

        if (observer) {
          observer.disconnect();
          observer = null;
        }

        if (anyEl._rbsplitTimeline) {
          try {
            anyEl._rbsplitTimeline.kill();
          } catch {}
          anyEl._rbsplitTimeline = undefined;
        }

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

  return (
    <Tag
      ref={ref as any}
      style={{ textAlign, wordWrap: "break-word" }}
      className={`split-parent overflow-hidden inline-block whitespace-normal ${className}`}
    >
      {text}
    </Tag>
  );
};

export default SplitText;
