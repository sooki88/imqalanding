// 네번째 섹션

"use client";

import { ColorArray } from "@/constants/ColorArray";
import CyclingImage from "./CyclingImage";
import FadeUpOnView from "./FadeUpOnView";

export default function Features() {
  return (
    <FadeUpOnView delay={30}>
      <section id="features">
        {/* 타이틀 */}
        <h2>단절된 데이터를 넘어 서비스의 전 과정을 관통하다</h2>

        {FeatureContents.map((item, index) => {
          const currentColor = ColorArray[index % ColorArray.length];
          const direction = index % 2 === 0 ? "left" : "right";

          return (
            <Card
              key={`${item.category}-${index}`}
              color={currentColor}
              direction={direction}
              content={item}
              index={index}
            />
          );
        })}
      </section>
    </FadeUpOnView>
  );
}

interface contentType {
  category: string;
  title: string[];
  description: string[];
  tags: string[];
  images: string[];
}

function Card({
  color,
  direction,
  content,
  index,
}: {
  color: string;
  direction: string;
  content: contentType;
  index: number;
}) {
  const isImageLeft = direction === "left";

  return (
    <div
      // id="features"
      className={`flex gap-12 md:gap-20 w-full max-w-[1200px] items-start ${index == 0 ? "mt-20" : "mt-25"} ${
        isImageLeft
          ? "flex-col-reverse lg:flex-row"
          : "flex-col-reverse lg:flex-row-reverse"
      }`}
    >
      {/* 이미지 영역: 1:1 + 좌우 동일 너비 */}
      <div className="w-full max-w-[580px] lg:w-1/2">
        <div className="w-full aspect-square bg-rgba(255, 255, 255, 0.05) rounded-sm overflow-hidden relative flex items-center justify-center">
          <CyclingImage images={content.images} title={content.title[1]} />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col gap-4 md:gap-6">
        <span
          className="text-xs md:text-sm font-semibold leading-[1.5] inline-flex w-fit py border-b"
          style={{ borderColor: color, color }}
        >
          {content.category}
        </span>

        <div className="flex flex-wrap items-baseline gap-x-2 lg:block">
          {content.title.map((title, index) => (
            <h3
              key={title}
              className={`${index === 0 ? "text-slate-300" : "text-white"}`}
            >
              {title}
            </h3>
          ))}
        </div>

        <div>
          {content.description.map((des) => (
            <p
              key={des}
              className="text-slate-300 text-base md:text-lg text-left leading-[1.6] break-keep"
            >
              {des}
            </p>
          ))}
        </div>

        <div className="flex gap-x-2 gap-y-2 flex-wrap">
          {content.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm rounded-[4px] px-2 py-1 border-[0.7]"
              style={{ borderColor: color, color: color }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// 내용
const FeatureContents = [
  {
    category: "Customized Real-time Dashboard",
    title: ["전체/업무별/맞춤형 다 있는", "실시간 대시보드"],
    description: [
      "5초 간격으로 주요 서비스의 성능을 실시간 모니터링하는 통합 대시보드, 원하는 기간과 서비스에 맞게 사용자가 직접 패널을 선택하고 레이아웃을 편집할 수 있는 서비스 대시보드와 MY 대시보드가 있습니다.",
      "이를 통해 모바일 앱과 웹 서비스의 현재 상황과 이슈 포인트를 실시간으로 파악할 수 있습니다.",
    ],
    tags: [
      "다양한 뷰포인트",
      "변동 발생 지점 감지",
      "실시간 모니터링",
      "사용자 맞춤형 패널 구성",
      "현황 및 이슈 포인트 파악",
    ],
    images: ["/dashboard1.webp", "/dashboard2.webp"],
  },
  {
    category: "Real User Analysis",
    title: ["사용자 경험을 재현하는", "세션 분석"],
    description: [
      "서비스 시작부터 종료까지, 고객의 여정에서의 모든 상호작용을 하나의 세션으로 연결합니다.",
      "실제 사용자가 어떻게 탐색하고 반응하는지 파악하여 문제 구간과 개선 포인트를 명확하게 발견할 수 있습니다. ",
    ],
    tags: [
      "특정 사용자 세션 추적",
      "이슈 발생 세션 추적",
      "세션↔︎트레이스 분석",
      "성능 ∙ 이벤트 ∙ 에러 파악",
    ],
    images: ["/session_1.webp", "/session_2.webp"],
  },
  {
    category: "Distributed Tracing",
    title: ["서비스 가시성 향상을 위한", "트레이스 분석"],
    description: [
      "앱·웹 애플리케이션에서 발생하는 사용자 요청별 기록을 기반으로 데이터 흐름을 작업 단위까지 정밀 추적합니다.",
      "사용자 요청에 서비스가 어떻게 응답했고, 어떤 요소에서 문제가 있었는지 파악하여 성능 저하 원인을 빠르게 식별할 수 있습니다.",
    ],
    tags: [
      "앱 전환 상태",
      "커스텀 로그",
      "Long Tasks",
      "사용자 이벤트",
      "크래시・ANR・에러",
      "네이티브 로드",
      "XHR・Fetch",
      "웹 페이지 로드",
    ],
    images: ["/trace_1.webp", "/trace_2.webp"],
  },
  {
    category: "Exception, Error, Log ㅡ User",
    title: ["문제 해결 인사이트", "크래시 분석 ∙ 로그"],
    description: [
      "사용자의 문제 상황을 파악하세요. 가장 많이 발생한 문제와 과정부터 원인까지 분석하고 추적할 수 있습니다.",
      "서비스에서의 중요한 로직과 거래 추적, 문제 패턴과 예외 확인을 위한 커스텀 메시지를 남기고 식별하세요.",
    ],
    tags: [
      "스택 트레이스",
      "사용자 환경 정보",
      "커스텀 로그",
      "로그↔︎세션 분석",
      "크래시・ANR・에러",
      "에러 메시지",
      "기타 메타데이터",
    ],
    images: ["/log1.webp", "/log2.webp"],
  },
];
