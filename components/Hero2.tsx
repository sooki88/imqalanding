"use client";

import SplitText from "./reactbits/SplitText";
import GlareHover from "./reactbits/GlareHover";
import Hyperspeed from "./reactbits/Hyperspeed"; // Threads 임포트 확인

export default function Hero2() {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    // relative를 주어 Threads가 이 안에서만 꽉 차게 만듭니다.
    <section className="relative min-h-screen w-full flex flex-col items-center text-center py-50 px-6 overflow-hidden">
      {/* 배경 레이어 */}
      <div className="absolute inset-0 z-0">
        <Hyperspeed
          effectOptions={{
            distortion: "turbulentDistortion",
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 20,
            lightPairsPerRoadWay: 40,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [12, 80],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.8, 0.8],
            carFloorSeparation: [0, 5],
            colors: {
              roadColor: 526344,
              islandColor: 657930,
              background: 0,
              shoulderLines: 1250072,
              brokenLines: 1250072,
              leftCars: [14177983, 6770850, 12732332],
              rightCars: [242627, 941733, 3294549],
              sticks: 242627,
            },
          }}
        />
      </div>

      {/* 콘텐츠 레이어: z-10과 pointer-events-none 조합 */}
      {/* pointer-events-none을 부모에 주고, 실제 버튼에만 auto를 주면 마우스가 배경까지 전달됩니다. */}
      <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center">
        <h2 className="bg-[linear-gradient(270deg,_#00D0FF_41.3%,_#00FFB7_59.14%)] bg-clip-text text-transparent text-[56px] font-semibold leading-[1.3]">
          모바일 앱부터 웹까지
        </h2>
        <SplitText
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
