"use client";

import SplitText from "./SplitText";
import GlareHover from "./GlareHover";
import Aurora from "./Aurora";
import Threads from "./Threads";
import { useState } from "react";

export default function Hero() {
  // const [animationKey, setAnimationKey] = useState(0);

  const handleAnimationComplete = () => {
    console.log("끝");
    // 애니메이션이 끝나고 2초 뒤에 다시 시작하고 싶다면
    // setTimeout(() => {
    //   setAnimationKey((prev) => prev + 1);
    // }, 2000);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* 배경 레이어 */}
      {/* <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#66fffc", "#0011ff", "#6929ff"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div> */}
      <div className="absolute inset-0 z-0 mix-blend-screen">
        <Threads
          amplitude={3}
          distance={0.1}
          enableMouseInteraction={true}
          color={[0.23921568627450981, 0.49411764705882355, 1]}
        />
      </div>

      <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center">
        <h2 className="bg-[linear-gradient(270deg,_#00D0FF_41.3%,_#00FFB7_59.14%)] bg-clip-text text-transparent text-[56px] font-semibold leading-[1.3]">
          모바일 앱부터 웹까지
        </h2>
        <SplitText
          // key={animationKey}
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
        <p className="text-white font-normal leading-[1.5] text-xl mt-8 opacity-80">
          사용자 이용 패턴과 성능 저하 구간을 즉시 파악하고 <br /> 문제를
          해결하는 데 필요한 핵심 데이터를 확보할 수 있습니다.
        </p>

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
              background: "rgba(0, 0, 0, 0.05)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
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
