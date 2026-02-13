// 세번째 섹션

"use client";

import Image from "next/image";
import LogoLoop from "./reactbits/LogoLoop";
import PixelCard from "./reactbits/PixelCard";
import SpotlightCard from "./reactbits/SpotlightCard";
import { ThreeColors } from "@/constants/ThreeColors";

export default function Business() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center text-center px-6 py-25 overflow-hidden">
      {/* <div className="absolute inset-0 z-0 mix-blend-screen">
        <DarkVeil
          hueShift={6}
          noiseIntensity={0}
          scanlineIntensity={0.17}
          speed={2}
          scanlineFrequency={0.5}
          warpAmount={0}
        />
      </div> */}
      {/* 타이틀 */}
      <h2 className="text-white text-[40px] font-semibold leading-[1.3]">
        최적의 사용자 경험은 비즈니스를 움직인다
      </h2>
      <p className="mt-6 text-white font-normal leading-[1.5] text-lg text-center opacity-80">
        대한민국 대표 금융·보험·이커머스 기업들은 IMQA를 통해 <br /> 사용자 경험
        품질을 개선하고 고객 만족도를 향상시키고 있습니다.
      </p>

      {/* 로고들 */}
      {/* <div
        style={{
          height: "90px",
          position: "relative",
          overflow: "hidden",
          marginTop: "56px",
        }}
      > */}
      <div className="h-[90px] relative overflow-hidden mt-14">
        <LogoLoop
          logos={imageLogos}
          speed={90}
          direction="left"
          logoHeight={90}
          gap={100}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="client"
        />
      </div>

      {/* 카드 */}
      <div className="flex gap-6 mt-14 w-full max-w-[1200px]">
        {BusinessCardContent.map((item, index) => {
          const currentColor = ThreeColors[index];

          return (
            <SpotlightCard
              key={index}
              className="custom-spotlight-card"
              spotlightColor={currentColor}
            >
              <h3 className="text-white text-[28px] font-semibold leading-[1.4] max-w-[270px] text-left break-keep">
                <span style={{ color: currentColor }}>{item.emphasis}</span>
                {item.title}
              </h3>

              <div className="flex flex-col gap-2 mt-6">
                {item.content.map((i, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 items-start text-lg text-white/80 text-left break-keep"
                  >
                    <CheckIcon
                      color={currentColor}
                      className="mt-[6px] shrink-0"
                    />
                    {i}
                  </div>
                ))}
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}

const imageLogos = [
  {
    src: "/logo_samsung.webp",
    alt: "심성 로고",
  },
  {
    src: "/logo_financial.webp",
    alt: "금융결제원 로고",
  },
  {
    src: "/logo_bnk.webp",
    alt: "부산은행 로고",
  },
  {
    src: "/logo_lina.webp",
    alt: "라이나 로고",
  },
  {
    src: "/logo_seomin.webp",
    alt: "서민금융 로고",
  },
  {
    src: "/logo_cj.webp",
    alt: "cj 대한통운 로고",
  },
  {
    src: "/logo_dongwon.webp",
    alt: "동원 로고",
  },
  {
    src: "/logo_seoul.webp",
    alt: "서울자전거 로고",
  },
  {
    src: "/logo_kangwon.webp",
    alt: "강원랜드 로고",
  },
  {
    src: "/logo_cardoc.webp",
    alt: "카닥 로고",
  },
  {
    src: "/logo_aswon.webp",
    alt: "에스원 로고",
  },
];

const BusinessCardContent = [
  {
    emphasis: "금융/보험",
    title: "고객에 맞춘 안정적 서비스 운영",
    content: [
      "특정 사용자 분석으로 빠른 민원 해결",
      "서비스의 상태와 위험 상황 감지 알림",
      "비즈니스 로직, 거래 트래킹, API 연계 응답 트래킹을 위한 커스텀 로깅",
    ],
  },
  {
    emphasis: "이커머스",
    title: "고품질 이미지 제공 성능 최적화",
    content: [
      "로그인 후 구매 단계까지 고객 여정 분석 및 이슈 트래킹",
      "고품질 콘텐츠 노출을 위한 화면 로딩시간 측정 및 개선",
      "내부 API별 응답시간 모니터링 및 최적화",
    ],
  },
  {
    emphasis: "공공/사내",
    title: "구성원 대상 서비스 운영",
    content: [
      "안정적인 서비스를 위한 실시간 모니터링",
      "주 사용자 환경에 따른 성능 최적화",
      "조회 기간과 집계 지표를 선택하여 내부 회의에 필요한 데이터 또는 보고서 템플릿 다운로드",
    ],
  },
];

// 체크 아이콘
const CheckIcon = ({
  color,
  className,
}: {
  color: string;
  className: string;
}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3.2002 7.20078L6.8002 10.8008L12.8002 4.80078"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
