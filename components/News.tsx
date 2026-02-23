// 다섯번째 섹션 (뉴스)

"use client";

import useNewsQuery from "@/hooks/use-news-query";
import { formatDateTime } from "@/lib/FormatDateTime";
import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function News() {
  const newsQuery = useNewsQuery();

  const news = useMemo(() => {
    if (!Array.isArray(newsQuery.data)) return [];
    return newsQuery.data;
  }, [newsQuery.data]);

  const pauseMs = 2000; // 멈춤 시간
  const transitionMs = 450; // 전환 시간
  const shift = 28; // 이동 거리(px)

  const [index, setIndex] = useState(0);

  // hold: 멈춤 / transition: 교차 이동 / reset: 위치 리셋(transition 끔)
  const [phase, setPhase] = useState<"hold" | "transition" | "reset">("hold");

  const nextIndex = useMemo(() => {
    if (news.length === 0) return 0;
    return (index + 1) % news.length;
  }, [index, news.length]);
  // const nextIndex = useMemo(() => (index + 1) % news.length, [index]);

  useEffect(() => {
    if (news.length === 0) {
      setIndex(0);
      return;
    }
    if (index >= news.length) {
      setIndex(0);
    }
  }, [news.length, index]);

  useEffect(() => {
    if (news.length <= 1) return;

    let t: number | undefined;

    if (phase === "hold") {
      t = window.setTimeout(() => setPhase("transition"), pauseMs);
    }

    if (phase === "transition") {
      t = window.setTimeout(() => {
        setIndex(nextIndex);
        setPhase("reset");
      }, transitionMs);
    }

    if (phase === "reset") {
      const raf = requestAnimationFrame(() => setPhase("hold"));
      return () => cancelAnimationFrame(raf);
    }

    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [phase, news.length, nextIndex, pauseMs, transitionMs]);

  const current = news[index];
  const next = news[nextIndex];

  // reset 단계에서는 transition을 꺼서 “순간이동”
  const transitionStyle =
    phase === "reset"
      ? "none"
      : `transform ${transitionMs}ms ease, opacity ${transitionMs}ms ease`;

  if (newsQuery.isError) {
    console.error("뉴스 데이터를 불러오지 못했습니다.");
    return null;
  }

  if (news.length === 0) {
    console.log("등록된 뉴스가 없습니다.");
    return null;
  }

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

        {newsQuery.isLoading ? (
          <LoadingSpinner />
        ) : (
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
                  {formatDateTime(current.news_date, { withTime: false })}
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
                  {formatDateTime(next.news_date, { withTime: false })}
                </span>
              </h4>
              <p className="text-left text-slate-400 text-sm truncate only-pc">
                {next.content}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
