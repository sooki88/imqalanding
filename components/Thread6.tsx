"use client";

import { useEffect, useRef } from "react";

type WaveConfig = {
  speed?: number;
  amplitude?: number;
  wavelength?: number;
  segmentLength?: number;
  lineWidth?: number;
  strokeStyle?: string | CanvasGradient;
  timeModifier?: number;
};

type WavesBackgroundProps = {
  className?: string;
  background?: string; // 투명 배경이면 "transparent"
};

export default function WavesBackground({
  className,
  background = "transparent",
}: WavesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const ctx = el.getContext("2d", { desynchronized: true });
    if (!ctx) return;

    // ===== 기본 옵션 (원본 기반) =====
    const base = {
      speed: 6,
      amplitude: 50,
      wavelength: 50,
      segmentLength: 10,
      lineWidth: 8,
      strokeStyle: "rgba(255, 255, 255, 0.2)",
    };

    let dpr = 1;
    let width = 0;
    let height = 0;
    let waveWidth = 0;
    let waveLeft = 0;
    let time = 0;
    let rafId = 0;
    let resizeTimer: number | undefined;

    const DPR_CAP = 1.75;

    // const waves: WaveConfig[] = [
    //   // 메인 웨이브
    //   { amplitude: 150, wavelength: 200, segmentLength: 20, lineWidth: 2 },
    //   {
    //     speed: 0.02,
    //     amplitude: -150,
    //     wavelength: 200,
    //     segmentLength: 20,
    //     lineWidth: 1.5,
    //   },

    //   // 보조 웨이브
    //   {
    //     speed: 0.2,
    //     amplitude: 100,
    //     wavelength: 150,
    //     lineWidth: 1.2,
    //     timeModifier: 0.8,
    //   },
    //   { amplitude: -100, wavelength: 150, lineWidth: 1.0, timeModifier: 0.7 },

    //   // 고주파
    //   { amplitude: 80, wavelength: 80, segmentLength: 15, lineWidth: 0.8 },
    //   { amplitude: -80, wavelength: 80, segmentLength: 15, lineWidth: 0.6 },

    //   // 배경 라인
    //   { amplitude: 50, wavelength: 300, lineWidth: 0.5, timeModifier: 0.5 },
    //   { amplitude: -50, wavelength: 300, lineWidth: 0.4, timeModifier: 0.4 },
    // ];

    const waves: WaveConfig[] = [
      // 메인 웨이브 (더 크게)
      { amplitude: 260, wavelength: 220, segmentLength: 20, lineWidth: 2.2 },
      {
        speed: 0.02,
        amplitude: -260,
        wavelength: 220,
        segmentLength: 20,
        lineWidth: 1.8,
      },

      // 보조 웨이브
      {
        speed: 0.2,
        amplitude: 180,
        wavelength: 170,
        lineWidth: 1.4,
        timeModifier: 0.8,
      },
      { amplitude: -180, wavelength: 170, lineWidth: 1.2, timeModifier: 0.7 },

      // 고주파
      { amplitude: 130, wavelength: 95, segmentLength: 15, lineWidth: 0.9 },
      { amplitude: -130, wavelength: 95, segmentLength: 15, lineWidth: 0.7 },

      // 배경 라인
      { amplitude: 90, wavelength: 340, lineWidth: 0.6, timeModifier: 0.5 },
      { amplitude: -90, wavelength: 340, lineWidth: 0.5, timeModifier: 0.4 },
    ];

    const resizeWidth = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      width = Math.max(1, Math.floor(vw * dpr));
      height = Math.max(1, Math.floor(vh * dpr));

      el.width = width;
      el.height = height;
      el.style.width = `${vw}px`;
      el.style.height = `${vh}px`;

      // 내부 계산은 dpr 포함 좌표계 기준 (원본 로직 유지)
      waveWidth = width * 0.95;
      waveLeft = width * 0.025;
    };

    const applyResizeStyles = () => {
      // 각 웨이브에 그라디언트 적용
      waves.forEach((wave, index) => {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);

        if (index % 2 === 0) {
          gradient.addColorStop(0, "rgba(63, 81, 181, 0.5)");
          gradient.addColorStop(1, "rgba(156, 39, 176, 0.5)");
        } else {
          gradient.addColorStop(0, "rgba(76, 175, 80, 0.3)");
          gradient.addColorStop(1, "rgba(233, 30, 99, 0.3)");
        }

        wave.strokeStyle = gradient;
      });
    };

    const clear = () => {
      ctx.clearRect(0, 0, width, height);

      if (background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
      }
    };

    const ease = (percent: number, amplitude: number) => {
      return (
        amplitude * (Math.sin(percent * Math.PI * 2 - Math.PI / 2) + 1) * 0.5
      );
    };

    const drawSine = (t: number, options: WaveConfig) => {
      const yAxis = height / 2;

      ctx.lineWidth = (options.lineWidth ?? base.lineWidth) * dpr;
      ctx.strokeStyle = (options.strokeStyle ?? base.strokeStyle) as
        | string
        | CanvasGradient;

      ctx.beginPath();
      ctx.moveTo(0, yAxis);

      const seg = options.segmentLength ?? base.segmentLength;
      const wavelength = options.wavelength ?? base.wavelength;
      const amplitude = options.amplitude ?? base.amplitude;
      const speed = options.speed ?? base.speed;

      for (let i = 0; i < waveWidth; i += seg) {
        const x = t * speed + (-yAxis + i) / wavelength;
        const y = ease(i / waveWidth, amplitude) * Math.sin(x);
        ctx.lineTo(i + waveLeft, y + yAxis);
      }

      ctx.lineTo(width, yAxis);
      ctx.stroke();
    };

    const update = () => {
      time -= 0.007;
      for (const wave of waves) {
        drawSine(time * (wave.timeModifier ?? 1), wave);
      }
    };

    const loop = () => {
      clear();
      update();
      rafId = window.requestAnimationFrame(loop);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeWidth();
        applyResizeStyles();
      }, 80);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(rafId);
      } else {
        rafId = window.requestAnimationFrame(loop);
      }
    };

    resizeWidth();
    applyResizeStyles();
    rafId = window.requestAnimationFrame(loop);

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
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        display: "block",
      }}
      aria-hidden="true"
    />
  );
}
