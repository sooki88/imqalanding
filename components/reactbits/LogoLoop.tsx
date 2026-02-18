"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./LogoLoop.css";

export type LogoItem =
  | {
      node: React.ReactNode;
      href?: string;
      title?: string;
      ariaLabel?: string;
    }
  | {
      src: string;
      alt?: string;
      href?: string;
      title?: string;
      srcSet?: string;
      sizes?: string;
      width?: number;
      height?: number;
    };

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number; // px/s (기존과 동일)
  direction?: "left" | "right" | "up" | "down";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoItem, key: React.Key) => React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const toCssLength = (value?: number | string): string | undefined =>
  typeof value === "number" ? `${value}px` : value;

function isNodeItem(
  item: LogoItem,
): item is Extract<LogoItem, { node: React.ReactNode }> {
  return (item as any).node !== undefined;
}

export default function LogoLoop({
  logos,
  speed = 120,
  direction = "left",
  width = "100%",
  logoHeight = 28,
  gap = 32,
  pauseOnHover = false,
  fadeOut = false,
  fadeOutColor,
  scaleOnHover = false,
  renderItem,
  ariaLabel = "Partner logos",
  className,
  style,
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);

  const [durationSec, setDurationSec] = useState<number>(20); // fallback
  const [ready, setReady] = useState(false);

  const isVertical = direction === "up" || direction === "down";
  const dirSign = direction === "left" || direction === "up" ? 1 : -1;

  // ✅ CSS 애니메이션 duration 계산 (px/s 기반)
  useEffect(() => {
    const container = containerRef.current;
    const seq = seqRef.current;
    if (!container || !seq) return;

    const update = () => {
      // seq는 “한 덩어리(1회 반복)”의 길이
      const rect = seq.getBoundingClientRect();
      const size = isVertical ? rect.height : rect.width;
      const pxPerSec = Math.max(1, Math.abs(speed)); // 0 방지
      const nextDuration = Math.max(6, size / pxPerSec); // 너무 빠른 깜빡임 방지용 최소 6s
      setDurationSec(nextDuration);
      setReady(size > 0);
    };

    // 이미지 로드 완료 후 측정
    const imgs = Array.from(seq.querySelectorAll("img")) as HTMLImageElement[];
    let remain = imgs.length;
    if (remain === 0) update();
    else {
      const done = () => {
        remain -= 1;
        if (remain <= 0) update();
      };
      imgs.forEach((img) => {
        if (img.complete) done();
        else {
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        }
      });
    }

    // ResizeObserver로 폭/높이 바뀌면 duration 재계산
    const ro = new ResizeObserver(() => update());
    ro.observe(container);
    ro.observe(seq);

    update();

    return () => ro.disconnect();
  }, [logos, speed, isVertical]);

  const cssVars = useMemo(
    () =>
      ({
        "--logoloop-gap": `${gap}px`,
        "--logoloop-logoHeight": `${logoHeight}px`,
        "--logoloop-duration": `${durationSec}s`,
        "--logoloop-dir": String(dirSign),
        ...(fadeOutColor ? { "--logoloop-fadeColor": fadeOutColor } : null),
        width: toCssLength(width) ?? "100%",
        ...style,
      }) as React.CSSProperties,
    [gap, logoHeight, durationSec, dirSign, fadeOutColor, width, style],
  );

  const rootClassName = useMemo(
    () =>
      [
        "logoloop-css",
        isVertical ? "logoloop-css--vertical" : "logoloop-css--horizontal",
        pauseOnHover && "logoloop-css--pauseOnHover",
        fadeOut && "logoloop-css--fade",
        scaleOnHover && "logoloop-css--scaleHover",
        !ready && "logoloop-css--notready",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [isVertical, pauseOnHover, fadeOut, scaleOnHover, ready, className],
  );

  const renderLogoItem = (item: LogoItem, key: React.Key) => {
    if (renderItem) {
      return (
        <li className="logoloop-css__item" key={key} role="listitem">
          {renderItem(item, key)}
        </li>
      );
    }

    const content = isNodeItem(item) ? (
      <span className="logoloop-css__node">{item.node}</span>
    ) : (
      <img
        src={item.src}
        srcSet={item.srcSet}
        sizes={item.sizes}
        width={item.width}
        height={item.height}
        alt={item.alt ?? ""}
        title={item.title}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    );

    const a11y = isNodeItem(item)
      ? (item.ariaLabel ?? item.title)
      : (item.alt ?? item.title);

    return (
      <li className="logoloop-css__item" key={key} role="listitem">
        {item.href ? (
          <a
            className="logoloop-css__link"
            href={item.href}
            aria-label={a11y || "logo link"}
            target="_blank"
            rel="noreferrer noopener"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </li>
    );
  };

  return (
    <div
      ref={containerRef}
      className={rootClassName}
      style={cssVars}
      role="region"
      aria-label={ariaLabel}
    >
      {/* track: CSS keyframes로만 이동 */}
      <div className="logoloop-css__track" aria-hidden={!ready}>
        {/* 시퀀스 1 */}
        <ul className="logoloop-css__list" role="list" ref={seqRef}>
          {logos.map((item, i) => renderLogoItem(item, `a-${i}`))}
        </ul>

        {/* 시퀀스 2 (끊김 없는 무한 루프용) */}
        <ul className="logoloop-css__list" role="list" aria-hidden="true">
          {logos.map((item, i) => renderLogoItem(item, `b-${i}`))}
        </ul>
      </div>
    </div>
  );
}
