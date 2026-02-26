"use client";

import { ReactNode, useEffect, useRef } from "react";

type FadeUpOnViewProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
};

export default function FadeUpOnView({
  children,
  className = "",
  delay = 0,
  duration = 1000,
  y = 100,
  once = true,
  threshold = 0.1,
  rootMargin = "0px 0px -10% 0px",
}: FadeUpOnViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      el.dataset.inview = "true";
      return;
    }

    // 초기 스타일은 hidden 상태로 고정 (렌더 후 스타일 변경 최소화)
    el.dataset.inview = "false";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // React state 대신 DOM attribute만 변경 → 리렌더 없음
          el.dataset.inview = "true";
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.dataset.inview = "false";
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        // data-inview 값에 따라만 바뀜 (리렌더 없이 attribute만 바뀌어도 CSS 적용됨)
        opacity: undefined,
        transform: undefined,
        transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
        transitionDelay: `${delay}ms`,
        willChange: "transform, opacity",
      }}
      // data attribute 기반으로 스타일 적용
      data-inview="false"
      // 인라인로 완전 제어하고 싶으면 아래처럼 CSS 변수 방식도 가능
    >
      <style jsx>{`
        div[data-inview="false"] {
          opacity: 0;
          transform: translate3d(0, ${y}px, 0);
        }
        div[data-inview="true"] {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
        @media (prefers-reduced-motion: reduce) {
          div[data-inview="false"],
          div[data-inview="true"] {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {children}
    </div>
  );
}
