'use client'

// import BlurText from "./BlurText";
import SplitText from "./SplitText";
import ShapeBlur from './ShapeBlur';
import Magnet from "./Magnet";

export default function Hero() {
    const handleAnimationComplete = () => {
        console.log('Animation completed!');
    };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6">
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
        rootMargin="-100px"
        textAlign="center"
        onLetterAnimationComplete={handleAnimationComplete}
    />
    <p className="text-white font-normal leading-[1.5] text-xl mt-8">사용자 이용 패턴과 성능 저하 구간을 즉시 파악하고 <br/> 문제를 해결하는 데 필요한 핵심 데이터를 확보할 수 있습니다.</p>
        <div className="flex gap-4 mt-8">
            <Magnet padding={50} disabled={false} magnetStrength={10}>
                <p className="rounded-sm border-[0.5px] border-white px-5 py-[10px] text-white text-base font-medium leading-[1.5] backdrop-blur-[15px] hover:bg-white/15 duration-300">IMQA 기능 살펴보기</p>
            </Magnet>
            <Magnet padding={50} disabled={false} magnetStrength={10}>
                <p className="rounded-sm bg-white px-5 py-[10px] text-black text-base font-medium leading-[1.5] backdrop-blur-[15px] hover:bg-white/85 duration-300">IMQA 도입 문의하기</p>
            </Magnet>
        </div>
    </div>
  );
}
