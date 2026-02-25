"use client";

import { useEffect, useRef } from "react";

type WaveLinesProps = {
  className?: string;
  lineCount?: number; // 기본 40
  segments?: number; // 기본 160 (높을수록 부드럽고 무거움)
  amplitude?: number; // 기본 82
  speed?: number; // 기본 0.00135
  frequency?: number; // 기본 1.35
  background?: string; // 기본 #050018
};

export default function WaveLinesCanvas({
  className,
  lineCount = 40,
  segments = 160,
  amplitude = 82,
  speed = 0.00135,
  frequency = 1.35,
  background = "#050018",
}: WaveLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!ctx) return;

    // ===== 성능 튜닝값 =====
    const DPR_CAP = 1.75; // 고해상도 과부하 방지
    const TAPER_START = 0.18; // 왼쪽에서 퍼지기 시작하는 지점
    const ALPHA_MIN = 0.06;
    const ALPHA_MAX = 0.75;
    // =====================

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cy = 0;
    let rafId = 0;
    let lastTs = 0;
    let resizeTimer: number | undefined;

    // 매 프레임 객체 생성 방지 (성능)
    const offsets = new Float32Array(lineCount);
    const alphas = new Float32Array(lineCount);
    const phases = new Float32Array(lineCount);

    const initLines = () => {
      for (let i = 0; i < lineCount; i++) {
        const t = lineCount === 1 ? 0 : i / (lineCount - 1); // 0 ~ 1
        const centered = (t - 0.5) * 2; // -1 ~ 1
        offsets[i] = centered;

        // 중앙선 밝고, 바깥선 흐리게
        const centerWeight = 1 - Math.abs(centered);
        alphas[i] =
          ALPHA_MIN + (ALPHA_MAX - ALPHA_MIN) * Math.pow(centerWeight, 0.7);

        // 선마다 위상 살짝 다르게
        phases[i] = centered * 0.85;
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      cy = h * 0.5;

      dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      // transform으로 DPR 처리 (매 좌표 계산 단순화)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineWidth = 1.35;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    const splitEnvelope = (nx: number) => {
      // 0~1
      if (nx <= TAPER_START) {
        return Math.pow(nx / TAPER_START, 3) * 0.12;
      }
      const t = (nx - TAPER_START) / (1 - TAPER_START);
      return 0.12 + 0.88 * (t * t * (3 - 2 * t)); // smoothstep
    };

    const ampEnvelope = (nx: number) => {
      const rise = Math.sin(Math.min(1, nx) * Math.PI);
      return 0.35 + 0.9 * Math.pow(rise, 1.2); // 중~후반 강조
    };

    const render = (ts: number) => {
      if (!lastTs) lastTs = ts;
      lastTs = ts;

      // 배경
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);

      const t = ts * speed;

      for (let i = 0; i < lineCount; i++) {
        const offsetNorm = offsets[i];
        const alpha = alphas[i];
        const phase = phases[i];

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;

        for (let s = 0; s <= segments; s++) {
          const nx = s / segments;
          const x = nx * w;

          // 왼쪽 한 줄 -> 점점 40줄로 분리
          const split = splitEnvelope(nx);
          const spreadY = offsetNorm * split * (h * 0.22);

          // 파형 (가벼운 사인 2개 조합)
          const amp =
            amplitude *
            ampEnvelope(nx) *
            (0.85 + 0.25 * (1 - Math.abs(offsetNorm)));

          const wave =
            Math.sin(nx * Math.PI * 2 * frequency + t * 6.2 + phase) * amp +
            Math.sin(
              nx * Math.PI * 2 * (frequency * 0.48) + t * 3.1 + phase * 0.7,
            ) *
              amp *
              0.16;

          const y = cy + spreadY + wave;

          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
      }

      rafId = window.requestAnimationFrame(render);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
      }, 80);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(rafId);
      } else {
        lastTs = 0;
        rafId = window.requestAnimationFrame(render);
      }
    };

    initLines();
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
  }, [lineCount, segments, amplitude, speed, frequency, background]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
      }}
      aria-hidden="true"
    />
  );
}
