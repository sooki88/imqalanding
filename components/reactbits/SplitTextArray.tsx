import React, { useRef, useEffect, useMemo, useState } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(GSAPSplitText, useGSAP);

export interface SplitTextArrayProps {
  /** 항상 배열로만 받음 */
  texts: string[];

  /** 초기 레이아웃 고정용 (안 주면 texts 중 가장 긴 문구 사용) */
  reserveText?: string;

  rotate?: boolean; // 기본 true
  rotateDelay?: number; // 초, 기본 1.2

  className?: string;
  delay?: number; // ms
  duration?: number; // s
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;

  threshold?: number;
  rootMargin?: string;

  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];

  pauseWhenOutOfView?: boolean;

  onLetterAnimationComplete?: () => void;
}

const SplitTextArray: React.FC<SplitTextArrayProps> = ({
  texts,
  reserveText,

  rotate = true,
  rotateDelay = 1.2,

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
  pauseWhenOutOfView = true,
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const onCompleteRef = useRef(onLetterAnimationComplete);

  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  // texts가 비었을 때는 아무것도 안 하게
  const list = useMemo(() => (texts?.length ? texts : []), [texts]);
  const shouldRotate = useMemo(
    () => (rotate && list.length > 1 ? true : false),
    [rotate, list.length],
  );

  const currentText = list[idx] ?? "";

  // 초기 높이 확보용 문구(안 보이지만 공간 차지)
  const reserved = useMemo(() => {
    if (reserveText && reserveText.length) return reserveText;
    if (!list.length) return "";
    // 가장 긴 문구로 높이 확보 (줄바꿈 가능성 최소화)
    return [...list].sort((a, b) => b.length - a.length)[0];
  }, [reserveText, list]);

  useEffect(() => {
    // texts가 바뀌면 처음부터
    setIdx(0);
  }, [texts]);

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
      if (!el || !fontsLoaded || !currentText) return;

      const anyEl = el as any;

      // 기존 split/tl 정리
      if (anyEl._rbsplitInstance) {
        try {
          anyEl._rbsplitInstance.revert();
        } catch {}
        anyEl._rbsplitInstance = undefined;
      }
      if (anyEl._rbsplitTimeline) {
        try {
          anyEl._rbsplitTimeline.kill();
        } catch {}
        anyEl._rbsplitTimeline = undefined;
      }

      // 평문 프레임 방지: 먼저 숨김
      gsap.set(el, { opacity: 0 });

      // placeholder(span) 제거 후 텍스트 주입
      el.innerHTML = "";
      el.textContent = currentText;

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
          if (!targets.length)
            targets = self.chars || self.words || self.lines || [];

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease },
          });

          // 시작 상태 세팅 (아직 el은 opacity:0)
          tl.set(targets, {
            ...from,
            willChange: "transform, opacity",
          });

          // split+from 적용 후 보여주기
          tl.call(() => {
            gsap.set(el, { opacity: 1 });
          });

          tl.to(targets, {
            ...to,
            duration,
            stagger: delay / 1000,
            onComplete: () => {
              onCompleteRef.current?.();

              if (shouldRotate) {
                window.setTimeout(() => {
                  setIdx((prev) => (prev + 1) % list.length);
                }, rotateDelay * 1000);
              }
            },
          });

          anyEl._rbsplitTimeline = tl;
          return tl;
        },
      });

      anyEl._rbsplitInstance = splitInstance;

      const tl: gsap.core.Timeline | undefined = anyEl._rbsplitTimeline;
      if (!tl) return;

      // ---- visibility + IO ----
      let isInView = !pauseWhenOutOfView;
      let isDocVisible = !document.hidden;

      const playSafely = () => {
        requestAnimationFrame(() => {
          tl.play(0);
        });
      };

      const syncPlayback = () => {
        const shouldPlay = !pauseWhenOutOfView || (isInView && isDocVisible);
        if (shouldPlay) playSafely();
        else tl.pause();
      };

      const handleVisibilityChange = () => {
        isDocVisible = !document.hidden;
        syncPlayback();
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      let observer: IntersectionObserver | null = null;

      if (pauseWhenOutOfView) {
        observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            isInView = !!entry?.isIntersecting;
            syncPlayback();
          },
          { threshold, root: null, rootMargin },
        );
        observer.observe(el);
      } else {
        isInView = true;
      }

      // 초기 1회
      syncPlayback();

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        if (observer) observer.disconnect();

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
        currentText,
        list.length,
        shouldRotate,
        rotateDelay,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
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
      suppressHydrationWarning
    >
      {/* 레이아웃 자리 확보용(안 보임) */}
      <span style={{ visibility: "hidden" }}>{reserved}</span>
    </Tag>
  );
};

export default SplitTextArray;
