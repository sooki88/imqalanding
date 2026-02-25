// 세번째 섹션

"use client";

import FadeUpOnView from "./FadeUpOnView";
import LogoLoop from "./reactbits/LogoLoop";
import { ColorArray } from "@/constants/ColorArray";

export default function Business() {
  return (
    <FadeUpOnView delay={50} className="w-full">
      <section>
        {/* 타이틀 */}
        <h2>
          최적의 사용자 경험은 <br className="only-mobile" />
          비즈니스를 움직인다
        </h2>
        <p className="mt-6 text-slate-400 font-normal leading-[1.6] text-base md:text-lg text-center  break-keep">
          대한민국 대표 금융·보험·이커머스 기업들은 IMQA를 통해{" "}
          <br className="only-pc" />
          사용자 경험 품질을 개선하고 고객 만족도를 향상시키고 있습니다.
        </p>
      </section>

      {/* 로고들 */}
      <LogoLoop />

      <section>
        {/* 카드 */}
        <div className="flex flex-col lg:flex-row gap-6 -mt-12 w-full max-w-[1200px]">
          {BusinessCardContent.map((item, index) => {
            const currentColor = ColorArray[index % ColorArray.length];

            return (
              <div
                key={index}
                className="group relative w-full rounded-sm border border-[#1c293d] p-5 lg:p-6 pb-4 lg:pb-18 overflow-hidden bg-[#1e293b]/50"
              >
                {/* hover 시 currentColor / 30% */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                  style={{ backgroundColor: currentColor }}
                />

                <div className="relative z-10">
                  <h4 className="lg:max-w-[270px]">
                    <span style={{ color: currentColor }}>
                      {item.emphasis}&nbsp;
                    </span>
                    {item.title}
                  </h4>

                  <div className="flex flex-col gap-1 lg:gap-2 mt-4 lg:mt-6">
                    {item.content.map((i, idx) => (
                      <div
                        key={idx}
                        className="flex gap-2 items-start text-sm md:text-base lg:text-lg text-slate-400 leading-[1.6] text-left break-keep transition-colors duration-200 group-hover:text-white"
                      >
                        <CheckIcon
                          color={currentColor}
                          className="mt-[2px] md:mt-1 lg:mt-[6px] shrink-0"
                        />
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </FadeUpOnView>
  );
}

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
