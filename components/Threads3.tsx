"use client";

import { useEffect, useRef } from "react";

type LegacyWaveProps = {
  className?: string;
  background?: string;
};

type WaveConfig = {
  color: string;
  alpha: number;
  zoom: number;
  phase: number; // 기존 delay 대신 "작은 위상차" 사용
  offsetY: number; // 라인 간 세로 분리
  ampScale: number; // 라인별 진폭 차이
};

export default function LegacyWave({
  className,
  background = "transparent",
}: LegacyWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { desynchronized: true });
    if (!context) return;

    let width = 0;
    let height = 0;
    let xAxis = 0;
    const yAxis = 0;
    const unit = 320; // 원본 400보다 살짝 줄여서 화면 내에서 보기 좋게

    let rafId = 0;
    let resizeTimer: number | undefined;
    let seconds = 0;

    const DPR_CAP = 1.75;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      xAxis = Math.floor(height / 2);
      context.lineWidth = 1.2;
      context.lineCap = "round";
      context.lineJoin = "round";
    };

    const drawSine = (
      t: number,
      zoom: number,
      phase: number,
      offsetY: number,
      ampScale: number,
    ) => {
      let x = t;
      let y = Math.sin(x + phase);

      context.moveTo(yAxis, unit * (y / 3) * ampScale + xAxis + offsetY);

      // 성능/부드러움 균형 (10~12 추천)
      for (let i = yAxis; i <= width + 10; i += 10) {
        x = t + (-yAxis + i) / unit / zoom;
        y = Math.sin(x + phase);
        context.lineTo(i, unit * (y / 3) * ampScale + xAxis + offsetY);
      }
    };

    const drawWave = (wave: WaveConfig, t: number) => {
      context.strokeStyle = wave.color;
      context.globalAlpha = wave.alpha;
      context.beginPath();
      drawSine(t / 2, wave.zoom, wave.phase, wave.offsetY, wave.ampScale);
      context.stroke();
    };

    const buildWaves = (): WaveConfig[] => {
      // 라인 수 늘리고 싶으면 count만 올리면 됨
      const count = 12;

      // 화면 높이에 맞춰 자동 간격 계산
      const spacing = Math.min(18, Math.max(8, height * 0.018));
      const center = (count - 1) / 2;

      const waves: WaveConfig[] = [];

      for (let i = 0; i < count; i++) {
        const idxFromCenter = i - center;
        const dist = Math.abs(idxFromCenter) / Math.max(center, 1);

        waves.push({
          color: i % 2 === 0 ? "#FFFFFF" : "#EEEEEE",
          alpha: 0.06 + (1 - dist) * 0.18, // 중앙이 더 선명
          zoom: 1.8 + i * 0.18, // 파장 조금씩 차이
          phase: i * 0.35, // 위상차 (너무 크게 주지 않음)
          offsetY: idxFromCenter * spacing, // 겹치지 않게 세로 분리
          ampScale: 0.85 + (1 - dist) * 0.35, // 중앙이 약간 더 큼
        });
      }

      return waves;
    };

    let waves = buildWaves();

    const draw = () => {
      context.globalAlpha = 1;
      context.clearRect(0, 0, width, height);

      if (background !== "transparent") {
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
      }

      const t = seconds * Math.PI;

      for (const wave of waves) {
        drawWave(wave, t);
      }

      seconds += 0.014;
      rafId = window.requestAnimationFrame(draw);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        waves = buildWaves(); // 화면 크기 바뀌면 간격 다시 계산
      }, 80);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(rafId);
      } else {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    resize();
    waves = buildWaves();
    rafId = window.requestAnimationFrame(draw);

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [background]);

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
        aria-hidden="true"
      />
    </div>
  );
}
