"use client";

import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

type NoiseWaveLinesLiteProps = {
  className?: string;
  background?: string; // "transparent" 가능
  lineColor?: string; // 기본 선색
  lineAlpha?: number; // 전체 선 투명도
  xCount?: number; // 가로 샘플 수 (부드러움)
  yCount?: number; // 라인 개수
  lineWidth?: number; // 선 두께
  speed?: number; // 애니메이션 속도
};

export default function NoiseWaveLinesLite({
  className,
  background = "transparent",
  lineColor = "#FFFFFF",
  lineAlpha = 0.18,
  xCount = 36,
  yCount = 36,
  lineWidth = 1.2,
  speed = 1,
}: NoiseWaveLinesLiteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { desynchronized: true });
    if (!ctx) return;

    const noise3D = createNoise3D();

    let rafId = 0;
    let resizeTimer: number | undefined;

    let width = 0;
    let height = 0;
    let widthHalf = 0;
    let heightHalf = 0;
    let dpr = 1;

    const DPR_CAP = 1.5; // 초경량용 더 낮게
    const TAU = Math.PI * 2;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      widthHalf = width / 2;
      heightHalf = height / 2;

      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    const draw = (ms: number) => {
      let time = ms * 0.0006 * speed; // 너무 빠르지 않게
      const iX = 1 / Math.max(1, xCount - 1);
      const iY = 1 / Math.max(1, yCount - 1);

      // clear + background
      ctx.clearRect(0, 0, width, height);
      if (background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
      }

      // 중앙 기준 좌표
      ctx.save();
      ctx.translate(widthHalf, heightHalf);

      // 선 스타일 (한 번만 설정)
      ctx.strokeStyle = lineColor;
      ctx.globalAlpha = lineAlpha;
      ctx.lineWidth = lineWidth;

      // 각 라인을 개별 stroke (가볍고 제어 쉬움)
      for (let j = 0; j < yCount; j++) {
        const tj = j * iY;
        const z = Math.cos(tj * TAU + time) * 0.12; // 라인별 변주
        const rowPhase = j * 0.012;

        ctx.beginPath();

        for (let i = 0; i < xCount; i++) {
          const tx = i * iX;

          // simplex noise (-1 ~ 1)
          const n = noise3D(tx * 1.15, time + rowPhase, z);

          // x는 좌->우 균등
          const x = tx * (width + 24) - widthHalf - 12;

          // y는 노이즈 기반 (화면 절반 높이 안쪽)
          const y = n * (heightHalf * 0.85);

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();

        // 시간 조금씩 이동 (원본 timeStep 역할)
        time += 0.008;
      }

      ctx.restore();
      ctx.globalAlpha = 1;

      rafId = window.requestAnimationFrame(draw);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 80);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(rafId);
      } else {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    resize();
    rafId = window.requestAnimationFrame(draw);

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [background, lineColor, lineAlpha, xCount, yCount, lineWidth, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    />
  );
}
