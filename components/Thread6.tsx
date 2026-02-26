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

    const parent = el.parentElement;
    if (!parent) return;

    const ctx = el.getContext("2d", { desynchronized: true });
    if (!ctx) return;

    // ===== 기본 옵션 =====
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

    const DPR_CAP = 1.75;

    const waves: WaveConfig[] = [
      // 메인 웨이브
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

    const resizeToParent = () => {
      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

      const rect = parent.getBoundingClientRect();
      const cssW = Math.max(1, Math.floor(rect.width));
      const cssH = Math.max(1, Math.floor(rect.height));

      width = Math.max(1, Math.floor(cssW * dpr));
      height = Math.max(1, Math.floor(cssH * dpr));

      el.width = width;
      el.height = height;
      el.style.width = `${cssW}px`;
      el.style.height = `${cssH}px`;

      waveWidth = width * 0.95;
      waveLeft = width * 0.025;
    };

    const applyResizeStyles = () => {
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
      // ✅ "중앙"이 아니라 부모 영역 기준으로 y축 잡기
      // 하단에 배치하고 싶으면 0.5 -> 0.8 같은 값으로 내리면 됨
      const yAxis = height * 0.7;

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

    // ✅ 부모 사이즈 변경 대응: ResizeObserver가 정답
    const ro = new ResizeObserver(() => {
      resizeToParent();
      applyResizeStyles();
    });

    resizeToParent();
    applyResizeStyles();
    rafId = window.requestAnimationFrame(loop);

    ro.observe(parent);

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(rafId);
      } else {
        rafId = window.requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      ro.disconnect();
    };
  }, [background]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        display: "block",
        width: "100%",
        height: "100%",
      }}
      aria-hidden="true"
    />
  );
}
