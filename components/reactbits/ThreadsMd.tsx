"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";

interface ThreadsProps {
  color?: [number, number, number];
  amplitude?: number;
  distance?: number;
  enableMouseInteraction?: boolean;
}

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;

#define PI 3.1415926538

const int u_line_count = 40;
const float u_line_width = 7.0;
const float u_line_blur = 10.0;

float Perlin2D(vec2 P) {
    vec2 Pi = floor(P);
    vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
    vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    Pt += vec2(26.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    vec4 grad_x = hash_x - 0.49999;
    vec4 grad_y = hash_y - 0.49999;
    vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
        * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
    grad_results *= 1.4142135623730950;
    vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
               * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
    vec4 blend2 = vec4(blend, vec2(1.0 - blend));
    return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float pixel(float count, vec2 resolution) {
    return (1.0 / max(resolution.x, resolution.y)) * count;
}

float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {
    float split_offset = (perc * 0.4);
    float split_point = 0.1 + split_offset;

    float amplitude_normal = smoothstep(split_point, 0.7, st.x);
    float amplitude_strength = 0.5;
    float finalAmplitude = amplitude_normal * amplitude_strength
                           * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);

    float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
    float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;

    float xnoise = mix(
        Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
        Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
        st.x * 0.3
    );

    float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;

    float line_start = smoothstep(
        y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        y,
        st.y
    );

    float line_end = smoothstep(
        y,
        y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        st.y
    );

    return clamp(
        (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
        0.0,
        1.0
    );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;

    float line_strength = 1.0;
    for (int i = 0; i < u_line_count; i++) {
        float p = float(i) / float(u_line_count);
        line_strength *= (1.0 - lineFn(
            uv,
            u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
            p,
            (PI * 1.0) * p,
            uMouse,
            iTime,
            uAmplitude,
            uDistance
        ));
    }

    float colorVal = 1.0 - line_strength;
    fragColor = vec4(uColor * colorVal, colorVal);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

const ThreadsMd: React.FC<ThreadsProps> = ({
  color = [1, 1, 1],
  amplitude = 1,
  distance = 0,
  enableMouseInteraction = false,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const renderer = new Renderer({ alpha: true });
    const gl = renderer.gl;

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // 캔버스가 레이아웃을 방해하지 않도록
    gl.canvas.style.display = "block";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";

    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height,
          ),
        },
        uColor: { value: new Color(...color) },
        uAmplitude: { value: amplitude },
        uDistance: { value: distance },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // ===== Perf metrics (15초마다 출력) =====
    const METRICS_WINDOW_MS = 15000;
    let mStart = performance.now();
    let lastT: number | null = null;
    let frames = 0;
    let dropped = 0;
    const frameTimes: number[] = [];

    // 60fps 기준 16.7ms. 배경 애니 기준이면 33.3ms로 바꿔도 됨.
    const budgetMs = 16.7;

    // ===== 해상도 스케일 설정 =====
    const renderScale = 0.85;
    const dprCap = 1.0;

    let loggedOnce = false;

    function resize() {
      const { clientWidth, clientHeight } = container;
      if (clientWidth <= 0 || clientHeight <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);

      const scaledW = Math.max(1, Math.floor(clientWidth * renderScale * dpr));
      const scaledH = Math.max(1, Math.floor(clientHeight * renderScale * dpr));

      // 내부 버퍼(=GPU 비용)는 scaledW/H로
      renderer.setSize(scaledW, scaledH);

      // ogl이 px로 덮어쓰는 경우가 있어서, 화면은 항상 꽉 차게 강제
      gl.canvas.style.width = `${clientWidth}px`;
      gl.canvas.style.height = `${clientHeight}px`;

      // 셰이더에도 실제 버퍼 해상도 전달
      program.uniforms.iResolution.value.r = scaledW;
      program.uniforms.iResolution.value.g = scaledH;
      program.uniforms.iResolution.value.b = scaledW / scaledH;

      if (!loggedOnce) {
        loggedOnce = true;
        console.log("canvas buffer:", gl.canvas.width, gl.canvas.height);
        console.log("css size:", gl.canvas.clientWidth, gl.canvas.clientHeight);
        console.log("device dpr:", window.devicePixelRatio, "capped:", dpr);
        console.log("renderScale:", renderScale, "dprCap:", dprCap);
      }
    }

    window.addEventListener("resize", resize);
    resize();

    let currentMouse: [number, number] = [0.5, 0.5];
    let targetMouse: [number, number] = [0.5, 0.5];

    function handleMouseMove(e: MouseEvent) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse = [x, y];
    }

    function handleMouseLeave() {
      targetMouse = [0.5, 0.5];
    }

    if (enableMouseInteraction) {
      container.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      container.addEventListener("mouseleave", handleMouseLeave, {
        passive: true,
      });
    }

    function update(t: number) {
      // ===== perf collect =====
      if (lastT !== null) {
        const dt = t - lastT; // ms
        frameTimes.push(dt);
        if (dt > budgetMs) dropped += 1;
      }
      lastT = t;
      frames += 1;

      if (t - mStart >= METRICS_WINDOW_MS) {
        const sorted = frameTimes.slice().sort((a, b) => a - b);
        const avg = sorted.reduce((s, v) => s + v, 0) / (sorted.length || 1);
        const p = (q: number) =>
          sorted[Math.floor((sorted.length - 1) * q)] ?? 0;

        const seconds = (t - mStart) / 1000;
        const fps = frames / seconds;
        const dropPct = frames ? (dropped / frames) * 100 : 0;

        console.log("[Threads metrics]", {
          seconds: Number(seconds.toFixed(2)),
          fps_avg: Number(fps.toFixed(1)),
          frame_ms_avg: Number(avg.toFixed(2)),
          frame_ms_p95: Number(p(0.95).toFixed(2)),
          frame_ms_p99: Number(p(0.99).toFixed(2)),
          dropped_frames: dropped,
          dropped_ratio_pct: Number(dropPct.toFixed(2)),
          budget_ms: budgetMs,
          renderScale,
          dprCap,
        });

        // reset
        mStart = t;
        lastT = null;
        frames = 0;
        dropped = 0;
        frameTimes.length = 0;
      }
      // ===== /perf collect =====

      if (enableMouseInteraction) {
        const smoothing = 0.05;
        currentMouse[0] += smoothing * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += smoothing * (targetMouse[1] - currentMouse[1]);
        program.uniforms.uMouse.value[0] = currentMouse[0];
        program.uniforms.uMouse.value[1] = currentMouse[1];
      } else {
        program.uniforms.uMouse.value[0] = 0.5;
        program.uniforms.uMouse.value[1] = 0.5;
      }

      program.uniforms.iTime.value = t * 0.001;

      renderer.render({ scene: mesh });
      animationFrameId.current = requestAnimationFrame(update);
    }

    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("resize", resize);

      if (enableMouseInteraction) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }

      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color, amplitude, distance, enableMouseInteraction]);

  return (
    <div ref={containerRef} className="w-full h-full relative" {...rest} />
  );
};

export default ThreadsMd;
