// 다섯번째 섹션 (뉴스)

"use client";

import { useEffect, useMemo, useState } from "react";

export default function News() {
  const pauseMs = 2000; // 멈춤 시간
  const transitionMs = 450; // 전환 시간
  const shift = 28; // 이동 거리(px)

  const [index, setIndex] = useState(0);

  // hold: 멈춤 / transition: 교차 이동 / reset: 위치 리셋(transition 끔)
  const [phase, setPhase] = useState<"hold" | "transition" | "reset">("hold");

  const nextIndex = useMemo(() => (index + 1) % NEWS.length, [index]);

  useEffect(() => {
    if (NEWS.length <= 1) return;

    let t: number | undefined;

    if (phase === "hold") {
      t = window.setTimeout(() => setPhase("transition"), pauseMs);
    }

    if (phase === "transition") {
      t = window.setTimeout(() => {
        // 전환이 끝난 시점: index만 바꾸고, 레이어는 "reset(transition 없음)"으로 순간이동시킴
        setIndex(nextIndex);
        setPhase("reset");
      }, transitionMs);
    }

    if (phase === "reset") {
      // 다음 프레임에 transition 다시 켜서 hold로 복귀 (이때 깜빡/역방향 이동 없음)
      const raf = requestAnimationFrame(() => setPhase("hold"));
      return () => cancelAnimationFrame(raf);
    }

    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [phase, index, nextIndex]);

  const current = NEWS[index];
  const next = NEWS[nextIndex];

  // reset 단계에서는 transition을 꺼서 “순간이동”
  const transitionStyle =
    phase === "reset"
      ? "none"
      : `transform ${transitionMs}ms ease, opacity ${transitionMs}ms ease`;

  return (
    <section className="py-0 bg-[rgba(0,119,255,0.5)]">
      <div
        className="
        mx-auto w-full max-w-6xl
        flex flex-col lg:flex-row
        gap-2 lg:gap-20
        py-6
        text-white font-light leading-[1.3]
      "
      >
        {/* 라벨 */}
        <h4 className="text-base lg:text-[28px] shrink-0 mt-0 lg:mt-1 opacity-70 text-left">
          NEWS
        </h4>

        {/* 슬라이더 */}
        <div
          className="
          relative lg:flex-1 overflow-hidden
          w-full
        "
          style={{ height: 72 }}
        >
          {/* 현재(위로 사라짐) */}
          <div
            className="absolute inset-0 flex flex-col justify-center gap-2"
            style={{
              transform:
                phase === "transition"
                  ? `translateY(-${shift}px)`
                  : "translateY(0px)",
              opacity: phase === "transition" ? 0 : 1,
              transition: transitionStyle,
              willChange: "transform, opacity",
            }}
          >
            <h4 className="font-medium">
              {current.title}
              <span className="ml-3 align-middle text-xs text-slate-400">
                {current.date}
              </span>
            </h4>
            <p className="text-left text-slate-400 text-sm truncate only-pc">
              {current.content}
            </p>
          </div>

          {/* 다음(아래에서 올라옴) */}
          <div
            className="absolute inset-0 flex flex-col justify-center gap-2"
            style={{
              transform:
                phase === "transition"
                  ? "translateY(0px)"
                  : `translateY(${shift}px)`,
              opacity: phase === "transition" ? 1 : 0,
              transition: transitionStyle,
              willChange: "transform, opacity",
            }}
          >
            <h4 className="font-medium">
              {next.title}
              <span className="ml-3 align-middle text-xs text-slate-400">
                {next.date}
              </span>
            </h4>
            <p className="text-left text-slate-400 text-sm truncate only-pc">
              {next.content}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// 뉴스 내용
const NEWS = [
  {
    title: "라이나 생명에 프론트엔드 성능 관리 솔루션 IMQA 구축",
    date: "2025.06.25",
    content:
      "라이나 생명에 프론트엔드 성능 관리 솔루션 IMQA 구축 완료 라이나 생명에 프론트엔드 성능 관리 솔루션 IMQA 구축 완료 라이나 생명에 프론트엔드 성능 관리 솔루션 IMQA 구축 완료",
  },
  {
    title: "삼성생명과 IMQA 공급 계약 체결",
    date: "2025.04.15",
    content:
      "내용 수정 필요. 삼성생명과 IMQA 공급 계약 체결삼성생명과 IMQA 공급 계약 체결삼성생명과 IMQA 공급 계약 체결삼성생명과 IMQA 공급 계약 체결삼성생명과 IMQA 공급 계약 체결",
  },
  {
    title: "NH농협은행에 프론트엔드 성능 관리 솔루션 IMQA 구축",
    date: "2025.12.25",
    content:
      "라이나 생명에 프론트엔드 성능 관리 솔루션 IMQA 구축 완료 라이나 생명에 프론트엔드 성능 관리 솔루션 IMQA 구축 완료 라이나 생명에 프론트엔드 성능 관리 솔루션 IMQA 구축 완료",
  },
];
