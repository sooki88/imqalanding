// "use client";

// import Image from "next/image";
// import { useEffect, useMemo, useState } from "react";

// export default function CyclingImage({
//   images,
//   alt,
//   intervalMs = 2000, // 2초 유지
//   fadeMs = 900, // 0.9초 페이드
//   preloadCount = 3, // 처음 3장은 미리 로드
// }: {
//   images: string[];
//   alt: string;
//   intervalMs?: number;
//   fadeMs?: number;
//   preloadCount?: number;
// }) {
//   const safeImages = useMemo(() => images.filter(Boolean), [images]);

//   const [active, setActive] = useState(0); // 현재 “고정”된 이미지
//   const [incoming, setIncoming] = useState(1); // 페이드인할 다음 이미지
//   const [isFading, setIsFading] = useState(false);

//   useEffect(() => {
//     if (safeImages.length <= 1) return;

//     // 다음 인덱스 계산(항상 active 기준)
//     const next = (active + 1) % safeImages.length;
//     setIncoming(next);

//     let startFadeTimer: number | undefined;
//     let commitTimer: number | undefined;

//     // 1) interval 동안 “유지”
//     startFadeTimer = window.setTimeout(() => {
//       // 2) 페이드 시작
//       setIsFading(true);

//       // 3) 페이드 끝나면 active 확정 + 페이드 종료
//       commitTimer = window.setTimeout(() => {
//         setActive(next);
//         setIsFading(false);
//       }, fadeMs);
//     }, intervalMs);

//     return () => {
//       if (startFadeTimer) window.clearTimeout(startFadeTimer);
//       if (commitTimer) window.clearTimeout(commitTimer);
//     };
//   }, [active, safeImages.length, intervalMs, fadeMs]);

//   if (safeImages.length === 0) return null;

//   const activeSrc = safeImages[active];
//   const incomingSrc = safeImages[incoming] ?? activeSrc;

//   return (
//     <div className="absolute inset-0">
//       {/* 현재 이미지(바닥) */}
//       <Image
//         src={activeSrc}
//         alt={alt}
//         fill
//         className="object-cover"
//         sizes="(max-width: 1200px) 50vw, 600px"
//         priority
//       />

//       {/* 다음 이미지(위에 올려서 opacity로 페이드인) */}
//       {safeImages.length > 1 && (
//         <Image
//           src={incomingSrc}
//           alt={alt}
//           fill
//           className="object-cover"
//           sizes="(max-width: 1200px) 50vw, 600px"
//           style={{
//             opacity: isFading ? 1 : 0,
//             transition: `opacity ${fadeMs}ms ease-in-out`,
//             willChange: "opacity",
//           }}
//         />
//       )}

//       {/* ✅ preload: 처음 몇 장은 미리 로드해서 “로드 깜빡임” 제거 */}
//       {safeImages.slice(0, preloadCount).map((src, i) => (
//         <Image
//           key={src}
//           src={src}
//           alt=""
//           width={1}
//           height={1}
//           className="hidden"
//           priority={i === 0}
//         />
//       ))}
//     </div>
//   );
// }
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
          priority
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
