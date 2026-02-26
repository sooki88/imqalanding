"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";

interface ThreadsRowProps {
  color?: [number, number, number];
  amplitude?: number;
  distance?: number;
  enableMouseInteraction?: boolean;
}

/** vertex는 그대로 */
const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/**
 * ✅ 핵심 변경점:
 * - const int u_line_count 제거
 * - uniform int uLineCount 추가
 * - for-loop는 최대치(MAX_LINES)로 고정하고, i >= uLineCount면 break
 */
const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;
uniform int uLineCount;

#define PI 3.1415926538
#define MAX_LINES 40

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

float lineFn(vec2 st, float width, float perc, vec2 mouse, float time, float amplitude, float distance) {
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

    for (int i = 0; i < MAX_LINES; i++) {
        if (i >= uLineCount) break;

        float p = float(i) / float(uLineCount);
        line_strength *= (1.0 - lineFn(
            uv,
            u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
            p,
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

type PerfTier = "HIGH" | "LOW";

function detectPerfTier(): PerfTier {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  if (prefersReduced) return "LOW";

  const hc =
    typeof navigator !== "undefined" ? (navigator.hardwareConcurrency ?? 4) : 4;

  const dm =
    typeof navigator !== "undefined"
      ? ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8)
      : 8;

  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

  if (hc <= 4 || dm <= 4 || dpr >= 2) return "LOW";
  return "HIGH";
}

const ThreadsRow: React.FC<ThreadsRowProps> = ({
  color = [1, 1, 1],
  amplitude = 1,
  distance = 0,
  enableMouseInteraction = false,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);

  const isVisibleRef = useRef(true);
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const tier = detectPerfTier();

    const perf =
      tier === "LOW"
        ? {
            renderScale: 0.7,
            dprCap: 1.25,
            targetFps: 30,
            lineCount: 18,
            mouseSmoothing: 0.08,
          }
        : {
            renderScale: 0.85,
            dprCap: 1.75,
            targetFps: 45,
            lineCount: 32,
            mouseSmoothing: 0.05,
          };

    const renderer = new Renderer({ alpha: true });
    const gl = renderer.gl;

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // ✅ canvas가 컨테이너를 "레이아웃상" 꽉 채우도록
    gl.canvas.style.position = "absolute";
    gl.canvas.style.inset = "0";
    gl.canvas.style.display = "block";

    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Color(1, 1, 1) },
        uColor: { value: new Color(...color) },
        uAmplitude: { value: amplitude },
        uDistance: { value: distance },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uLineCount: { value: perf.lineCount },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    // ✅ 1) 렌더링 해상도 낮추기 + setSize가 style을 덮어쓰는 문제 해결
    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth <= 0 || clientHeight <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, perf.dprCap);

      // 내부 렌더 버퍼(=GPU 비용)는 줄임
      const scaledW = Math.max(
        1,
        Math.floor(clientWidth * perf.renderScale * dpr),
      );
      const scaledH = Math.max(
        1,
        Math.floor(clientHeight * perf.renderScale * dpr),
      );

      renderer.setSize(scaledW, scaledH);

      // ✅ 중요: 보여지는 크기는 컨테이너 크기로 "강제"
      // (ogl의 setSize가 canvas.style.width/height를 px로 덮어써버리기 때문)
      gl.canvas.style.width = `${clientWidth}px`;
      gl.canvas.style.height = `${clientHeight}px`;

      program.uniforms.iResolution.value.r = scaledW;
      program.uniforms.iResolution.value.g = scaledH;
      program.uniforms.iResolution.value.b = scaledW / scaledH;
    };

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 100);
    };
    window.addEventListener("resize", onResize, { passive: true });
    resize();

    // 마우스(옵션)
    let currentMouse: [number, number] = [0.5, 0.5];
    let targetMouse: [number, number] = [0.5, 0.5];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse = [x, y];
    };

    const handleMouseLeave = () => {
      targetMouse = [0.5, 0.5];
    };

    if (enableMouseInteraction) {
      container.addEventListener("mousemove", handleMouseMove, {
        passive: true,
      });
      container.addEventListener("mouseleave", handleMouseLeave, {
        passive: true,
      });
    }

    // ✅ 4) 보일 때만 돌리기
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = !!entry?.isIntersecting;

        if (isVisibleRef.current && !isRunningRef.current) {
          isRunningRef.current = true;
          lastFrameTime = 0;
          animationFrameId.current = requestAnimationFrame(update);
        }
      },
      { root: null, threshold: 0.01 },
    );
    io.observe(container);

    const onVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
      } else {
        isVisibleRef.current = true;
        if (!isRunningRef.current) {
          isRunningRef.current = true;
          lastFrameTime = 0;
          animationFrameId.current = requestAnimationFrame(update);
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // ✅ 2) FPS 제한
    const targetInterval = 1000 / perf.targetFps;
    let lastFrameTime = 0;

    const update = (t: number) => {
      if (!isVisibleRef.current) {
        isRunningRef.current = false;
        return;
      }

      if (lastFrameTime && t - lastFrameTime < targetInterval) {
        animationFrameId.current = requestAnimationFrame(update);
        return;
      }
      lastFrameTime = t;

      if (enableMouseInteraction) {
        const s = perf.mouseSmoothing;
        currentMouse[0] += s * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += s * (targetMouse[1] - currentMouse[1]);
        program.uniforms.uMouse.value[0] = currentMouse[0];
        program.uniforms.uMouse.value[1] = currentMouse[1];
      } else {
        program.uniforms.uMouse.value[0] = 0.5;
        program.uniforms.uMouse.value[1] = 0.5;
      }

      program.uniforms.iTime.value = t * 0.001;

      renderer.render({ scene: mesh });
      animationFrameId.current = requestAnimationFrame(update);
    };

    isRunningRef.current = true;
    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);

      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);

      document.removeEventListener("visibilitychange", onVisibilityChange);

      io.disconnect();

      if (enableMouseInteraction) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }

      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color, amplitude, distance, enableMouseInteraction]);

  // ✅ 캔버스 absolute로 깔았으니 부모는 relative + 크기 확실히
  return (
    <div ref={containerRef} className="w-full h-full relative" {...rest} />
  );
};

export default ThreadsRow;
