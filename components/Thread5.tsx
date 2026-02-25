"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

type SimpleNoiseBezierTrailProps = {
  className?: string;
  background?: string; // 예: "#050018" (투명 배경이면 잔상 페이드가 안 먹음)
  bumps?: number;
  curveFactor?: number;
  amplitude?: number;
  speed?: number; // 작을수록 느림
  lineAlpha?: number; // 새로 그리는 선 투명도
  lineWidth?: number;
  fadeAlpha?: number; // 잔상 지워지는 속도 (0.01~0.08 추천)
  rightPadding?: number;
};

export default function SimpleNoiseBezierTrail({
  className,
  background = "#050018",
  bumps = 5,
  curveFactor = 0.8,
  amplitude = 220,
  speed = 0.008,
  lineAlpha = 0.2,
  lineWidth = 2,
  fadeAlpha = 0.035,
  rightPadding = 100,
}: SimpleNoiseBezierTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { desynchronized: true });
    if (!ctx) return;

    const noise2D = createNoise2D();

    let rafId = 0;
    let resizeTimer: number | undefined;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let j = 0;
    let firstFrame = true;

    const DPR_CAP = 1.5;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // 리사이즈 직후 잔상 초기화
      firstFrame = true;
    };

    const drawTrailFade = () => {
      // 첫 프레임은 완전 초기화
      if (firstFrame) {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
        firstFrame = false;
        return;
      }

      // 아주 약하게 배경을 덮어 잔상을 서서히 지움
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = fadeAlpha;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
    };

    const drawLine = () => {
      j += speed;

      const centerY = height / 2;
      const bumpCount = Math.max(1, Math.round(bumps));
      const curve = (width / bumpCount / 2) * curveFactor;

      ctx.strokeStyle = `rgba(255,255,255,${lineAlpha})`;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();

      let lastX = 0;
      let lastY = centerY;

      for (let i = 0; i < bumpCount; i++) {
        const x = (i * (width - rightPadding)) / bumpCount;
        const y = centerY + noise2D(i, j) * amplitude;

        if (i === 0) {
          ctx.moveTo(0, y);
        } else {
          ctx.bezierCurveTo(lastX + curve, lastY, x - curve, y, x, y);
        }

        lastX = x;
        lastY = y;
      }

      // 끝점 마무리
      const endX = width - rightPadding;
      const endY = centerY;
      ctx.bezierCurveTo(lastX + curve, lastY, endX - curve, endY, endX, endY);

      ctx.stroke();
    };

    const render = () => {
      drawTrailFade();
      drawLine();
      rafId = window.requestAnimationFrame(render);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 80);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(rafId);
      } else {
        rafId = window.requestAnimationFrame(render);
      }
    };

    resize();
    rafId = window.requestAnimationFrame(render);

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [
    background,
    bumps,
    curveFactor,
    amplitude,
    speed,
    lineAlpha,
    lineWidth,
    fadeAlpha,
    rightPadding,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    />
  );
}
