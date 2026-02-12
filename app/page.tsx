// import Image from "next/image";
// import ColorBends from "@/components/ColorBends";
// import Hero from "@/components/Hero";
// import LiquidEther from "@/components/LiquidEther";
// import Prism from "@/components/Prism";
// import FloatingLines from "@/components/FloatingLines";
// import Threads from "@/components/Threads";

// export default function Home() {
//   return (
//     <main className="flex flex-col items-center min-h-screen w-full overflow-hidden">
//       {/* 히어로섹션 */}
//       <section className="relative w-full">
//         <Hero />
//         <div className="fixed inset-0 -z-10">
//           {/* <Prism
//             animationType="rotate"
//             timeScale={0.5}
//             height={3.5}
//             baseWidth={5.5}
//             scale={3.6}
//             hueShift={0}
//             colorFrequency={1}
//             noise={0}
//             glow={1}
//           /> */}
//           <Threads amplitude={5} distance={0.1} enableMouseInteraction />
//         </div>

//         {/* 배경 섞고 싶을때<div className="fixed inset-0 -z-10 mix-blend-screen">
//           <FloatingLines
//             ...
//           />
//         </div> */}
//       </section>

//       {/* 두번째 섹션 */}
//       <section className="">
//         <h2 className="text-white text-[40px] font-semibold leading-[1.3]">
//           <span className="bg-[linear-gradient(270deg,_#00D0FF_41.3%,_#00FFB7_59.14%)] bg-clip-text text-transparent">
//             Observability
//           </span>
//           를 프론트엔드에서 시작하다
//         </h2>
//         <p className="mt-6 text-white font-normal leading-[1.5] text-lg mt-8 text-center">
//           사용자 이용 패턴과 성능 저하 구간을 즉시 파악하고 <br /> 문제를
//           해결하는 데 필요한 핵심 데이터를 확보할 수 있습니다.
//         </p>
//       </section>
//     </main>
//   );
// }

import Image from "next/image";
import ColorBends from "@/components/ColorBends";
import Hero from "@/components/Hero";
import Hero2 from "@/components/Hero2";
import LiquidEther from "@/components/LiquidEther";
import Prism from "@/components/Prism";
import FloatingLines from "@/components/FloatingLines";
import Threads from "@/components/Threads";
import Hero3 from "@/components/Hero3";

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen w-full overflow-hidden">
      {/* 히어로섹션 */}
      <Hero />
      {/* <Hero2 /> */}
      {/* <Hero3 /> */}

      {/* 두번째 섹션 */}
      <section className="">
        <h2 className="text-white text-[40px] font-semibold leading-[1.3]">
          <span className="bg-[linear-gradient(270deg,_#00D0FF_41.3%,_#00FFB7_59.14%)] bg-clip-text text-transparent">
            Observability
          </span>
          를 프론트엔드에서 시작하다
        </h2>
        <p className="mt-6 text-white font-normal leading-[1.5] text-lg mt-8 text-center">
          사용자 이용 패턴과 성능 저하 구간을 즉시 파악하고 <br /> 문제를
          해결하는 데 필요한 핵심 데이터를 확보할 수 있습니다.
        </p>
      </section>
    </main>
  );
}
