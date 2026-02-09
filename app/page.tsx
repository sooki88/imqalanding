import Image from "next/image";
import ColorBends from "@/components/ColorBends";
import Hero from "@/components/Hero";
import FloatingLines from "@/components/FloatingLines";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full overflow-hidden">
      {/* 히어로섹션 */}
      <section className="relative w-full">
        <Hero />
        <div className="fixed inset-0 -z-10">
          <FloatingLines
            enabledWaves="top,middle,bottom"
            // Array - specify line count per wave; Number - same count for all waves
            lineCount={7}
            // Array - specify line distance per wave; Number - same distance for all waves
            lineDistance={2}
            bendRadius={30}
            bendStrength={15}
            interactive={true}
            parallax={true}
          />
          {/* <ColorBends
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
          /> */}
        </div>
      </section>
        
      {/* 두번째 섹션 */}
      <section className="">
            <h2 className="text-white text-[40px] font-semibold leading-[1.3]">
              <span className="bg-[linear-gradient(270deg,_#00D0FF_41.3%,_#00FFB7_59.14%)] bg-clip-text text-transparent">Observability</span>를 프론트엔드에서 시작하다
            </h2>
            <p className="mt-6 text-white font-normal leading-[1.5] text-lg mt-8 text-center">
              사용자 이용 패턴과 성능 저하 구간을 즉시 파악하고 <br /> 문제를 해결하는
              데 필요한 핵심 데이터를 확보할 수 있습니다.
            </p>
      </section>

    </main>
  );
}
