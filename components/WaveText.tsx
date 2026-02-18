"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  text: string;
  charDelayMs?: number;
  riseMs?: number;
  holdMs?: number; // 다 보여진 상태 유지 시간
  fadeOutMs?: number; //  리셋 직전 페이드아웃 시간(짧게)
  offsetPx?: number;
};

export default function WaveText({
  text,
  charDelayMs = 90,
  riseMs = 900,
  holdMs = 2000,
  fadeOutMs = 180, //  0.18초 정도면 자연스럽고 “리셋” 안 보임
  offsetPx = 18,
}: Props) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [cycle, setCycle] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  const totalVisibleMs = useMemo(() => {
    const lastDelay = Math.max(0, chars.length - 1) * charDelayMs;
    return lastDelay + riseMs + holdMs;
  }, [chars.length, charDelayMs, riseMs, holdMs]);

  useEffect(() => {
    // 1) 다 올라오고 + 홀드 끝나면, 전체를 짧게 페이드아웃
    const t1 = window.setTimeout(() => setFadingOut(true), totalVisibleMs);

    // 2) 페이드아웃 끝난 뒤에 DOM 재마운트(=모든 글자 동시에 아래+투명으로 리셋)
    const t2 = window.setTimeout(() => {
      setCycle((c) => c + 1);
      setFadingOut(false);
    }, totalVisibleMs + fadeOutMs);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [totalVisibleMs, fadeOutMs]);

  return (
    <span
      key={cycle}
      className="wave-text"
      style={
        {
          ["--char-delay-ms" as any]: `${charDelayMs}ms`,
          ["--rise-ms" as any]: `${riseMs}ms`,
          ["--offset" as any]: `${offsetPx}px`,
          opacity: fadingOut ? 0 : 1, //  전체 페이드아웃
          transition: `opacity ${fadeOutMs}ms ease-in-out`, //  부드럽게
        } as React.CSSProperties
      }
      aria-label={text}
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          className="wave-char"
          style={{ ["--i" as any]: i } as React.CSSProperties}
          aria-hidden="true"
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}
