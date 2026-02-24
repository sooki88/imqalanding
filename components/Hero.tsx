"use client";

import Link from "next/link";
import SplitText from "./reactbits/SplitText";
import Threads from "./reactbits/Threads";

export default function Hero() {
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <section className="min-h-screen">
      {/* 배경 레이어 */}

      <div className="absolute bottom-[8%] left-0 right-0 md:inset-0 z-0 mix-blend-screen">
        <Threads
          amplitude={2.5}
          distance={0.1}
          enableMouseInteraction={true}
          color={[1, 1, 1]}
        />
        {/* <Threads color={[1, 1, 1]} amplitude={0.8} distance={0.15} maxDpr={1} /> */}
      </div>

      <div className="relative z-10 pointer-events-none flex flex-col items-center pb-[20%] md:pb-0">
        <h1 className="text-main-gradient text-4xl md:text-[clamp(56px,4.26vw+4.8px,64px)] font-semibold leading-[1.3] break-keep">
          모바일 앱부터 웹까지
        </h1>

        <SplitText
          text="사용자 경험을 실시간으로 읽다"
          className="text-4xl md:text-[clamp(56px,4.26vw+4.8px,64px)] font-semibold text-white leading-[1.3]"
          delay={50}
          duration={1.25}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
        />

        <p className="text-white font-normal leading-[1.6] text-base md:text-lg lg:text-xl mt-8 opacity-80 break-keep">
          사용자 이용 패턴과 성능 저하 구간을 즉시 파악하고
          <br className="hidden md:block" /> 문제를 해결하는 데 필요한 핵심
          데이터를 확보할 수 있습니다.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-12 pointer-events-auto">
          <Link
            href="#features"
            className="py-[10px] px-5 border-[0.7px] border-white bg-[rgba(0, 0, 0, 0.05)] rounded-sm text-white text-base font-medium leading-[1.5] backdrop-blur-xs hover:bg-white/10 duration-300 ease-in-out"
          >
            IMQA 기능 살펴보기
          </Link>
          <Link
            href="/contact"
            className="py-[10px] px-5 border-[0.7px] border-white bg-white rounded-sm text-black font-medium leading-[1.5] backdrop-blur-xs hover:bg-white/90 duration-300 ease-in-out"
          >
            IMQA 도입 문의하기
          </Link>
        </div>
      </div>
    </section>
  );
}
