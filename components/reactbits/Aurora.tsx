"use client";

import { useEffect, useMemo, useRef } from "react";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                              \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                      \
     bool isInBetween = currentColor.position <= factor;      \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                           \
  ColorStop currentColor = colors[index];                     \
  ColorStop nextColor = colors[index + 1];                    \
  float range = nextColor.position - currentColor.position;   \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

interface AuroraProps {
  colorStops?: [string, string, string] | string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
  /** 저사양 대응용 DPR 상한 */
  maxDpr?: number;
  /** 렌더링 프레임 제한 (30/45 추천). 0이면 제한 없음 */
  targetFps?: number;
}

export default function Aurora({
  colorStops = ["#5227FF", "#7cff67", "#5227FF"],
  amplitude = 1.0,
  blend = 0.5,
  time,
  speed = 1.0,
  maxDpr = 1.25,
  targetFps = 45,
}: AuroraProps) {
  const ctnDom = useRef<HTMLDivElement>(null);

  // 최신 props를 RAF에서 참조
  const propsRef = useRef({
    amplitude,
    blend,
    time,
    speed,
  });
  propsRef.current = { amplitude, blend, time, speed };

  // ✅ 색상 변환 캐싱: colorStops가 바뀔 때만 계산
  const colorStopsArray = useMemo(() => {
    const normalized = (
      colorStops.length >= 3
        ? colorStops.slice(0, 3)
        : ["#5227FF", "#7cff67", "#5227FF"]
    ) as string[];

    return normalized.map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });
  }, [colorStops]);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: false, // ✅ 풀스크린 배경엔 끄는 게 보통 이득
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [1, 1] as [number, number] },
        uBlend: { value: blend },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    function resize() {
      const el = ctnDom.current;
      if (!el) return;

      const width = el.clientWidth;
      const height = el.clientHeight;
      if (!width || !height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      (renderer as Renderer & { dpr?: number }).dpr = dpr;

      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
    }

    window.addEventListener("resize", resize, { passive: true });
    resize();

    // 탭 숨김 / 뷰포트 밖 pause
    let isHidden = document.hidden;
    let isInView = true;

    function handleVisibility() {
      isHidden = document.hidden;
    }
    document.addEventListener("visibilitychange", handleVisibility);

    const observer = new IntersectionObserver(
      (entries) => {
        isInView = !!entries[0]?.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(ctn);

    // ✅ FPS 제한 (발열/팬 소음에 효과 큼)
    let animateId = 0;
    let lastRenderTime = 0;
    const frameInterval = targetFps > 0 ? 1000 / targetFps : 0;

    const update = (t: number) => {
      animateId = requestAnimationFrame(update);

      if (isHidden || !isInView) return;

      if (frameInterval > 0 && t - lastRenderTime < frameInterval) return;
      lastRenderTime = t;

      const current = propsRef.current;
      const derivedTime = current.time ?? t * 0.01;

      program.uniforms.uTime.value = derivedTime * (current.speed ?? 1) * 0.1;
      program.uniforms.uAmplitude.value = current.amplitude ?? 1.0;
      program.uniforms.uBlend.value = current.blend ?? 0.5;

      // 색상은 props 변경 때만 effect로 갱신 (매 프레임 X)
      renderer.render({ scene: mesh });
    };

    animateId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      observer.disconnect();

      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, blend, speed, time, maxDpr, targetFps, colorStopsArray]);

  return (
    <div
      ref={ctnDom}
      className="w-full h-full"
      style={{
        contain: "layout paint size",
        isolation: "isolate",
      }}
    />
  );
}
