"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

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
  duration = 450,
  y = 20,
  once = true,
  threshold = 0.1,
  rootMargin = "0px 0px -10% 0px",
}: FadeUpOnViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(media.matches);

    const onChange = () => setReduceMotion(media.matches);
    media.addEventListener?.("change", onChange);

    return () => media.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin, reduceMotion]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
        transition: reduceMotion
          ? "none"
          : `opacity ${duration}ms ease, transform ${duration}ms ease`,
        transitionDelay: reduceMotion ? "0ms" : `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
