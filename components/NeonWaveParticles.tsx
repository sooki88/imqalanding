"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { createNoise3D, createNoise4D } from "simplex-noise";

type Nullable<T> = T | null;

export default function NeonWaveParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ---------- CONFIG ----------
    const CONFIG = {
      particleCount: 15000,
      shapeSize: 14,

      // neon fixed
      colorScheme: "neon" as const,
      particleSizeRange: [0.08, 0.25] as const,
      starCount: 18000,

      bloomStrength: 1.3,
      bloomRadius: 0.5,
      bloomThreshold: 0.05,

      idleFlowStrength: 0.25,
      idleFlowSpeed: 0.08,

      // kept (shader refs)
      morphSizeFactor: 0.5,
      morphBrightnessFactor: 0.6,
    };

    const COLOR_SCHEMES = {
      neon: { startHue: 300, endHue: 180, saturation: 1.0, lightness: 0.65 },
    } as const;

    // ---------- STATE ----------
    let scene: Nullable<THREE.Scene> = null;
    let camera: Nullable<THREE.PerspectiveCamera> = null;
    let renderer: Nullable<THREE.WebGLRenderer> = null;
    let controls: Nullable<OrbitControls> = null;
    let composer: Nullable<EffectComposer> = null;

    let clock: Nullable<THREE.Clock> = null;

    let particlesGeometry: Nullable<THREE.BufferGeometry> = null;
    let particlesMaterial: Nullable<THREE.ShaderMaterial> = null;
    let particleSystem: Nullable<THREE.Points> = null;

    let currentPositions: Float32Array;
    let sourcePositions: Float32Array;

    let noise3D = createNoise3D(() => Math.random());
    let noise4D = createNoise4D(() => Math.random());

    const tempVec = new THREE.Vector3();
    const sourceVec = new THREE.Vector3();
    const flowVec = new THREE.Vector3();
    const currentVec = new THREE.Vector3();

    // progress helper
    let p = 0;
    const bump = (inc: number) => {
      p = Math.min(100, p + inc);
      setProgress(p);
      if (p >= 100) {
        // fade out 느낌만 간단히
        window.setTimeout(() => setLoading(false), 200);
      }
    };

    // ---------- HELPERS ----------
    function generateWave(count: number, size: number) {
      const points = new Float32Array(count * 3);
      const waveScale = size * 0.4;
      const frequency = 3;

      for (let i = 0; i < count; i++) {
        const u = Math.random() * 2 - 1;
        const v = Math.random() * 2 - 1;

        const x = u * size;
        const z = v * size;

        const dist = Math.sqrt(u * u + v * v);
        const angle = Math.atan2(v, u);

        const y =
          Math.sin(dist * Math.PI * frequency) *
          Math.cos(angle * 2) *
          waveScale *
          (1 - dist);

        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
      }
      return points;
    }

    function createStarTexture() {
      const size = 64;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d")!;

      const g = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.2, "rgba(255,255,255,0.8)");
      g.addColorStop(0.5, "rgba(255,255,255,0.3)");
      g.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);

      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    }

    function updateColorArray(
      colors: Float32Array,
      positionsArray: Float32Array,
    ) {
      const scheme = COLOR_SCHEMES.neon;
      const center = new THREE.Vector3(0, 0, 0);
      const maxRadius = CONFIG.shapeSize * 1.1;

      for (let i = 0; i < CONFIG.particleCount; i++) {
        const i3 = i * 3;
        tempVec.fromArray(positionsArray, i3);
        const dist = tempVec.distanceTo(center);

        const hue = THREE.MathUtils.mapLinear(
          dist,
          0,
          maxRadius,
          scheme.startHue,
          scheme.endHue,
        );

        const noiseValue =
          (noise3D(tempVec.x * 0.2, tempVec.y * 0.2, tempVec.z * 0.2) + 1) *
          0.5;

        const saturation = THREE.MathUtils.clamp(
          scheme.saturation * (0.9 + noiseValue * 0.2),
          0,
          1,
        );
        const lightness = THREE.MathUtils.clamp(
          scheme.lightness * (0.85 + noiseValue * 0.3),
          0.1,
          0.9,
        );

        new THREE.Color()
          .setHSL(hue / 360, saturation, lightness)
          .toArray(colors, i3);
      }
    }

    function createStarfield() {
      if (!scene) return;

      const starVertices: number[] = [];
      const starSizes: number[] = [];
      const starColors: number[] = [];

      const starGeometry = new THREE.BufferGeometry();

      for (let i = 0; i < CONFIG.starCount; i++) {
        tempVec.set(
          THREE.MathUtils.randFloatSpread(400),
          THREE.MathUtils.randFloatSpread(400),
          THREE.MathUtils.randFloatSpread(400),
        );
        if (tempVec.length() < 100)
          tempVec.setLength(100 + Math.random() * 300);

        starVertices.push(tempVec.x, tempVec.y, tempVec.z);
        starSizes.push(Math.random() * 0.15 + 0.05);

        const color = new THREE.Color();
        if (Math.random() < 0.1) {
          color.setHSL(Math.random(), 0.7, 0.65);
        } else {
          color.setHSL(0.6, Math.random() * 0.1, 0.8 + Math.random() * 0.2);
        }
        starColors.push(color.r, color.g, color.b);
      }

      starGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starVertices, 3),
      );
      starGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(starColors, 3),
      );
      starGeometry.setAttribute(
        "size",
        new THREE.Float32BufferAttribute(starSizes, 1),
      );

      const starMaterial = new THREE.ShaderMaterial({
        uniforms: { pointTexture: { value: createStarTexture() } },
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (400.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }`,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          void main() {
            float alpha = texture2D(pointTexture, gl_PointCoord).a;
            if (alpha < 0.1) discard;
            gl_FragColor = vec4(vColor, alpha * 0.9);
          }`,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        vertexColors: true,
      });

      scene.add(new THREE.Points(starGeometry, starMaterial));
    }

    function setupParticleSystem() {
      if (!scene) return;

      const wavePositions = generateWave(
        CONFIG.particleCount,
        CONFIG.shapeSize,
      );

      particlesGeometry = new THREE.BufferGeometry();
      currentPositions = new Float32Array(wavePositions);
      sourcePositions = new Float32Array(wavePositions);

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(currentPositions, 3),
      );

      const particleSizes = new Float32Array(CONFIG.particleCount);
      const particleOpacities = new Float32Array(CONFIG.particleCount);
      const particleEffectStrengths = new Float32Array(CONFIG.particleCount);

      for (let i = 0; i < CONFIG.particleCount; i++) {
        particleSizes[i] = THREE.MathUtils.randFloat(
          CONFIG.particleSizeRange[0],
          CONFIG.particleSizeRange[1],
        );
        particleOpacities[i] = 1.0;
        particleEffectStrengths[i] = 0.0;
      }

      particlesGeometry.setAttribute(
        "size",
        new THREE.BufferAttribute(particleSizes, 1),
      );
      particlesGeometry.setAttribute(
        "opacity",
        new THREE.BufferAttribute(particleOpacities, 1),
      );
      particlesGeometry.setAttribute(
        "aEffectStrength",
        new THREE.BufferAttribute(particleEffectStrengths, 1),
      );

      const colors = new Float32Array(CONFIG.particleCount * 3);
      updateColorArray(colors, currentPositions);
      particlesGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3),
      );

      particlesMaterial = new THREE.ShaderMaterial({
        uniforms: { pointTexture: { value: createStarTexture() } },
        vertexShader: `
          attribute float size;
          attribute float opacity;
          attribute float aEffectStrength;
          varying vec3 vColor;
          varying float vOpacity;
          varying float vEffectStrength;

          void main() {
            vColor = color;
            vOpacity = opacity;
            vEffectStrength = aEffectStrength;

            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

            float sizeScale = 1.0 - vEffectStrength * ${CONFIG.morphSizeFactor.toFixed(2)};
            gl_PointSize = size * sizeScale * (400.0 / -mvPosition.z);

            gl_Position = projectionMatrix * mvPosition;
          }`,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          varying float vOpacity;
          varying float vEffectStrength;

          void main() {
            float alpha = texture2D(pointTexture, gl_PointCoord).a;
            if (alpha < 0.05) discard;

            vec3 finalColor = vColor * (1.0 + vEffectStrength * ${CONFIG.morphBrightnessFactor.toFixed(2)});
            gl_FragColor = vec4(finalColor, alpha * vOpacity);
          }`,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        depthWrite: false,
        transparent: true,
        vertexColors: true,
      });

      particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particleSystem);
    }

    function setupPostProcessing() {
      if (!renderer || !scene || !camera) return;

      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));

      composer.addPass(
        new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          CONFIG.bloomStrength,
          CONFIG.bloomRadius,
          CONFIG.bloomThreshold,
        ),
      );
    }

    function updateIdleAnimation(positions: Float32Array, elapsedTime: number) {
      const breathScale = 1.0 + Math.sin(elapsedTime * 0.5) * 0.015;
      const timeScaled = elapsedTime * CONFIG.idleFlowSpeed;
      const freq = 0.1;

      for (let i = 0; i < CONFIG.particleCount; i++) {
        const i3 = i * 3;

        sourceVec.fromArray(sourcePositions, i3);
        tempVec.copy(sourceVec).multiplyScalar(breathScale);

        flowVec.set(
          noise4D(
            tempVec.x * freq,
            tempVec.y * freq,
            tempVec.z * freq,
            timeScaled,
          ),
          noise4D(
            tempVec.x * freq + 10,
            tempVec.y * freq + 10,
            tempVec.z * freq + 10,
            timeScaled,
          ),
          noise4D(
            tempVec.x * freq + 20,
            tempVec.y * freq + 20,
            tempVec.z * freq + 20,
            timeScaled,
          ),
        );

        tempVec.addScaledVector(flowVec, CONFIG.idleFlowStrength);

        currentVec.fromArray(positions, i3);
        currentVec.lerp(tempVec, 0.05);

        positions[i3] = currentVec.x;
        positions[i3 + 1] = currentVec.y;
        positions[i3 + 2] = currentVec.z;
      }
    }

    function onResize() {
      if (!camera || !renderer || !composer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    }

    // ---------- INIT ----------
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000308, 0.03);
    bump(10);

    clock = new THREE.Clock();
    bump(5);

    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 8, 28);
    camera.lookAt(scene.position);
    bump(10);

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    bump(15);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 80;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    bump(10);

    scene.add(new THREE.AmbientLight(0x404060));
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(15, 20, 10);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0x88aaff, 0.9);
    dirLight2.position.set(-15, -10, -15);
    scene.add(dirLight2);
    bump(10);

    setupPostProcessing();
    bump(10);

    createStarfield();
    bump(15);

    setupParticleSystem();
    bump(15);

    window.addEventListener("resize", onResize);

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (!clock || !controls || !composer || !particlesGeometry) return;

      const elapsedTime = clock.getElapsedTime();
      const deltaTime = clock.getDelta();

      controls.update();

      const positions = particlesGeometry.attributes.position
        .array as Float32Array;
      updateIdleAnimation(positions, elapsedTime);
      particlesGeometry.attributes.position.needsUpdate = true;

      composer.render(deltaTime);
    };

    animate();

    // ---------- CLEANUP ----------
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      controls?.dispose();

      // Dispose THREE resources
      if (scene) {
        scene.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if ((mesh as any).geometry) (mesh as any).geometry.dispose?.();
          if ((mesh as any).material) {
            const m = (mesh as any).material;
            if (Array.isArray(m)) m.forEach((mm) => mm.dispose?.());
            else m.dispose?.();
          }
        });
      }

      particlesGeometry?.dispose();
      particlesMaterial?.dispose();

      composer?.dispose();
      renderer?.dispose();

      // hint: WebGL context release (optional)
      try {
        renderer?.forceContextLoss?.();
      } catch {}

      scene = null;
      camera = null;
      renderer = null;
      controls = null;
      composer = null;
      clock = null;
      particlesGeometry = null;
      particlesMaterial = null;
      particleSystem = null;
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#000",
      }}
    >
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            transition: "opacity 0.6s ease-out",
          }}
        >
          <span style={{ fontSize: 24, letterSpacing: 2, marginBottom: 15 }}>
            Initializing Particles...
          </span>
          <div
            style={{
              width: "60%",
              maxWidth: 300,
              height: 6,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #00a2ff, #00ffea)",
                transition: "width 0.3s ease",
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
