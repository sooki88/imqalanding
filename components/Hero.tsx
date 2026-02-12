// "use client";

// import SplitText from "./SplitText";
// import GlareHover from "./GlareHover";
// import ShapeBlur from "./ShapeBlur";
// import Magnet from "./Magnet";

// export default function Hero() {
//   const handleAnimationComplete = () => {
//     console.log("Animation completed!");
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6">
//       <h2 className="bg-[linear-gradient(270deg,_#00D0FF_41.3%,_#00FFB7_59.14%)] bg-clip-text text-transparent text-[56px] font-semibold leading-[1.3]">
//         모바일 앱부터 웹까지
//       </h2>
//       <SplitText
//         text="사용자 경험을 실시간으로 읽다"
//         className="text-[56px] font-semibold text-white leading-[1.3]"
//         delay={50}
//         duration={1.25}
//         ease="power3.out"
//         splitType="chars"
//         from={{ opacity: 0, y: 40 }}
//         to={{ opacity: 1, y: 0 }}
//         threshold={0.1}
//         rootMargin="-100px"
//         textAlign="center"
//         onLetterAnimationComplete={handleAnimationComplete}
//       />
//       <p className="text-white font-normal leading-[1.5] text-xl mt-8">
//         사용자 이용 패턴과 성능 저하 구간을 즉시 파악하고 <br /> 문제를 해결하는
//         데 필요한 핵심 데이터를 확보할 수 있습니다.
//       </p>
//       <div className="flex gap-4 mt-8">
//         <GlareHover
//           glareColor="#ffffff"
//           glareOpacity={0.3}
//           glareAngle={-80}
//           glareSize={600}
//           width="172px"
//           height="44px"
//           borderRadius="4px"
//           borderColor="#fff"
//           transitionDuration={1000}
//           playOnce={false}
//           style={{
//             background: "rgba(255, 255, 255, 0.05)",
//             backdropFilter: "blur(8px)",
//             WebkitBackdropFilter: "blur(8px)",
//             borderWidth: "0.7px",
//           }}
//         >
//           <h2 className="text-white text-base font-medium leading-[1.5]">
//             IMQA 기능 살펴보기
//           </h2>
//         </GlareHover>
//         <GlareHover
//           glareColor="#000"
//           glareOpacity={0.3}
//           glareAngle={-80}
//           glareSize={600}
//           width="172px"
//           height="44px"
//           borderRadius="4px"
//           borderColor="#fff"
//           transitionDuration={1000}
//           playOnce={false}
//           style={{
//             background: "rgba(255, 255, 255, 1)",
//             backdropFilter: "blur(8px)",
//             WebkitBackdropFilter: "blur(8px)",
//             borderWidth: "0.7px",
//           }}
//         >
//           <h2 className="text-black text-base font-medium leading-[1.5]">
//             IMQA 도입 문의하기
//           </h2>
//         </GlareHover>
//         {/* <Magnet padding={50} disabled={false} magnetStrength={10}>
//           <p className="rounded-sm border-[0.5px] border-white px-5 py-[10px] text-white text-base font-medium leading-[1.5] backdrop-blur-[15px] hover:bg-white/15 duration-300">
//             IMQA 기능 살펴보기
//           </p>
//         </Magnet>
//         <Magnet padding={50} disabled={false} magnetStrength={10}>
//           <p className="rounded-sm bg-white px-5 py-[10px] text-black text-base font-medium leading-[1.5] backdrop-blur-[15px] hover:bg-white/85 duration-300">
//             IMQA 도입 문의하기
//           </p>
//         </Magnet> */}
//       </div>
//     </div>
//   );
// }

"use client";

import SplitText from "./SplitText";
import GlareHover from "./GlareHover";
import Aurora from "./Aurora";
import Threads from "./Threads";
import { useState } from "react";

export default function Hero() {
  const [animationKey, setAnimationKey] = useState(0);

  const handleAnimationComplete = () => {
    // 애니메이션이 끝나고 2초 뒤에 다시 시작하고 싶다면
    setTimeout(() => {
      setAnimationKey((prev) => prev + 1);
    }, 2000);
  };

  return (
    // relative를 주어 Threads가 이 안에서만 꽉 차게 만듭니다.
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* 배경 레이어 */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#66fffc", "#0011ff", "#6929ff"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>
      <div className="absolute inset-0 z-0 mix-blend-screen">
        <Threads
          amplitude={5}
          distance={0.1}
          enableMouseInteraction={true}
          color={[0.23921568627450981, 0.49411764705882355, 1]}
        />
      </div>

      {/* 콘텐츠 레이어: z-10과 pointer-events-none 조합 */}
      {/* pointer-events-none을 부모에 주고, 실제 버튼에만 auto를 주면 마우스가 배경까지 전달됩니다. */}
      <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center">
        <h2 className="bg-[linear-gradient(270deg,_#00D0FF_41.3%,_#00FFB7_59.14%)] bg-clip-text text-transparent text-[56px] font-semibold leading-[1.3]">
          모바일 앱부터 웹까지
        </h2>
        <SplitText
          key={animationKey}
          text="사용자 경험을 실시간으로 읽다"
          className="text-[56px] font-semibold text-white leading-[1.3]"
          delay={50}
          duration={1.25}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
        />
        <p className="text-white font-normal leading-[1.5] text-xl mt-8">
          사용자 이용 패턴과 성능 저하 구간을 즉시 파악하고 <br /> 문제를
          해결하는 데 필요한 핵심 데이터를 확보할 수 있습니다.
        </p>

        {/* 버튼 영역: 여기는 다시 마우스 클릭이 되어야 하므로 pointer-events-auto 추가 */}
        <div className="flex gap-4 mt-12 pointer-events-auto">
          <GlareHover
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-80}
            glareSize={600}
            width="172px"
            height="44px"
            borderRadius="4px"
            borderColor="#fff"
            transitionDuration={1000}
            playOnce={false}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderWidth: "0.7px",
            }}
          >
            <h2 className="text-white text-base font-medium leading-[1.5]">
              IMQA 기능 살펴보기
            </h2>
          </GlareHover>

          <GlareHover
            glareColor="#000"
            glareOpacity={0.3}
            glareAngle={-80}
            glareSize={600}
            width="172px"
            height="44px"
            borderRadius="4px"
            borderColor="#fff"
            transitionDuration={1000}
            playOnce={false}
            style={{
              background: "rgba(255, 255, 255, 1)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderWidth: "0.7px",
            }}
          >
            <h2 className="text-black text-base font-medium leading-[1.5]">
              IMQA 도입 문의하기
            </h2>
          </GlareHover>
        </div>
      </div>
    </section>
  );
}
