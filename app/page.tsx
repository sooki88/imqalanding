import Image from "next/image";
import ColorBends from "@/components/ColorBends";
import Hero from "@/components/Hero";
import FluidGlass from "@/components/FluidGlass";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full overflow-hidden">
      {/* 히어로섹션 */}
      <section className="relative w-full">
        <Hero />
        <div className="fixed inset-0 -z-10">
          <ColorBends
            rotation={45}
            speed={0.2}
            colors={["#3d4aff","#5e3dff"]}
            transparent
            autoRotate={0}
            scale={0.8}
            frequency={1}
            warpStrength={1}
            mouseInfluence={0.8}
            parallax={0.5}
            noise={0.1}
          />
        </div>
      </section>
        
      

    </main>
  );
}
