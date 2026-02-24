"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  title: string;
  intervalMs?: number; // 기본 3000ms
  fadeMs?: number; // 기본 1000ms
};

export default function CyclingImage({
  images,
  title,
  intervalMs = 2000,
  fadeMs = 500,
}: Props) {
  const safe = images.filter(Boolean);
  const len = safe.length;

  const [aSrc, setASrc] = useState(safe[0] ?? "");
  const [bSrc, setBSrc] = useState(safe[1] ?? safe[0] ?? "");
  const [showA, setShowA] = useState(true);

  const nextRef = useRef(1);

  useEffect(() => {
    if (len === 0) return;
    setASrc(safe[0]);
    setBSrc(safe[1] ?? safe[0]);
    setShowA(true);
    nextRef.current = len > 1 ? 1 : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len, safe.join("|")]);

  useEffect(() => {
    if (len <= 1) return;

    const id = window.setInterval(() => {
      const nextIdx = nextRef.current % len;
      const nextSrc = safe[nextIdx];

      if (showA) setBSrc(nextSrc);
      else setASrc(nextSrc);

      requestAnimationFrame(() => setShowA((v) => !v));
      nextRef.current = (nextIdx + 1) % len;
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [len, safe, intervalMs, showA]);

  if (len === 0) return null;

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-slate-800 hover:border hover:border-slate-700">
      {/* 레이어 A */}
      <div
        className="absolute inset-0"
        style={{
          opacity: showA ? 1 : 0,
          transition: `opacity ${fadeMs}ms ease-in-out`,
          willChange: "opacity",
        }}
      >
        <Image
          src={aSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 50vw, 600px"
        />
      </div>

      {/* 레이어 B */}
      <div
        className="absolute inset-0"
        style={{
          opacity: showA ? 0 : 1,
          transition: `opacity ${fadeMs}ms ease-in-out`,
          willChange: "opacity",
        }}
      >
        <Image
          src={bSrc}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 50vw, 600px"
        />
      </div>
    </div>
  );
}
