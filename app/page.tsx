import Image from "next/image";
import ColorBends from "@/components/ColorBends";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      
        {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        /> */}
       
       <div style={{ width: '100%', height: '100%', position: 'relative' }}>
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
        
    </main>
  );
}
