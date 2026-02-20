"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const imageLogos = [
  { src: "/logo_samsung2.webp", alt: "삼성 로고" },
  { src: "/logo_financial.webp", alt: "금융결제원 로고" },
  { src: "/logo_bnk.webp", alt: "부산은행 로고" },
  { src: "/logo_lina2.webp", alt: "라이나 로고" },
  { src: "/logo_seomin.webp", alt: "서민금융 로고" },
  { src: "/logo_cj.webp", alt: "cj 대한통운 로고" },
  { src: "/logo_dongwon.webp", alt: "동원 로고" },
  { src: "/logo_seoul.webp", alt: "서울자전거 로고" },
  { src: "/logo_kangwon.webp", alt: "강원랜드 로고" },
  { src: "/logo_cardoc.webp", alt: "카닥 로고" },
  { src: "/logo_aswon.webp", alt: "에스원 로고" },
];

export default function LogoLoop() {
  const setRef = useRef<HTMLDivElement | null>(null);
  const [distance, setDistance] = useState(0);
  const [loaded, setLoaded] = useState(0);

  const total = imageLogos.length;
  const GAP_SIZE = 100;

  const measure = () => {
    const el = setRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      // 1세트 너비 + 간격 1개를 더해줘야 끊김이 없습니다.
      setDistance(el.scrollWidth + GAP_SIZE);
    });
  };

  // 1. 이미지 로딩 카운트가 다 찼을 때 실행
  useEffect(() => {
    if (loaded >= total) {
      measure();
    }
  }, [loaded, total]);

  // 2. 새로고침 시 캐시된 이미지를 위해 마운트 직후 강제 측정
  useEffect(() => {
    // 혹시 이미 로드된 상태일 수 있으므로 0.5초 정도 뒤에 한 번 더 측정
    const timer = setTimeout(() => {
      measure();
    }, 500);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="overflow-hidden w-full -mt-14">
      <div
        className="logo-track flex w-max h-[90px] gap-[100px]"
        style={{
          ["--logo-distance" as any]: `${distance}px`,
          animation: distance ? `logo-scroll 30s linear infinite` : "none",
          willChange: "transform",
          transform: "translate3d(0,0,0)",
        }}
      >
        {/* 원본 1세트 (폭 측정용) */}
        <div ref={setRef} className="flex gap-[100px]">
          {imageLogos.map((logo) => (
            <Image
              key={`first-${logo.alt}`}
              src={logo.src}
              alt={logo.alt}
              width={200}
              height={90}
              className="h-[90px] w-auto object-contain select-none pointer-events-none"
              draggable={false}
              onLoad={() => setLoaded((v) => v + 1)}
            />
          ))}
        </div>

        {/* 복제 세트 */}
        <div className="flex gap-[100px]" aria-hidden="true">
          {imageLogos.map((logo) => (
            <Image
              key={`second-${logo.alt}`}
              src={logo.src}
              alt={logo.alt}
              width={200}
              height={90}
              className="h-[90px] w-auto object-contain select-none pointer-events-none"
              draggable={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
