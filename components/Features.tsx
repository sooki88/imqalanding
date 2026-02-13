// 세번째 섹션

"use client";

import { ThreeColors } from "@/constants/ThreeColors";

export default function Features() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center gap-20 text-center px-6 py-25 overflow-hidden">
      {FeatureContents.map((item, index) => {
        const currentColor = ThreeColors[index % ThreeColors.length];
        const direction = index % 2 === 0 ? "left" : "right";

        return (
          <Card
            key={`${item.category}-${index}`}
            color={currentColor}
            direction={direction}
            content={item}
          />
        );
      })}
    </section>
  );
}

interface contentType {
  category: string;
  title: string;
  description: string;
  tags: string[];
}

function Card({
  color,
  direction,
  content,
}: {
  color: string;
  direction: string;
  content: contentType;
}) {
  const isImageLeft = direction === "left";

  return (
    <div
      className={`flex gap-25 w-full max-w-[1200px] items-start ${
        isImageLeft ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {/* ✅ 이미지 영역: 1:1 + 좌우 동일 너비 */}
      <div className="w-1/2">
        <div className="w-full aspect-square bg-[#101010] rounded-lg overflow-hidden relative flex items-center justify-center">
          이미지
          {/* 실제 이미지면 이렇게 (1:1에 꽉 채우기, 왜곡X)
        {content.imageSrc && (
          <Image
            src={content.imageSrc}
            alt={content.title}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 50vw, 600px"
          />
        )}
        */}
        </div>
      </div>

      {/* ✅ 텍스트 영역: 좌우 동일 너비 */}
      <div className="w-1/2 flex flex-col gap-6">
        <span
          className="text-sm font-medium leading-[1.5] inline-flex w-fit px-3 py-1 rounded-full border"
          style={{ borderColor: color, color }}
        >
          {content.category}
        </span>

        <h3 className="text-white text-4xl max-w-[370px] text-left font-semibold leading-[1.3] break-keep">
          {content.title}
        </h3>

        <p className="text-white/80 text-base text-left leading-[1.5]">
          {content.description}
        </p>

        <div className="flex gap-x-8 gap-y-2 flex-wrap">
          {content.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs rounded-[4px] px-2 py-1 border text-white/90"
              style={{ borderColor: color }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureContents = [
  {
    category: "Customized Real-time Dashboard",
    title: "전체/업무별/맞춤형 다 있는 실시간 대시보드",
    description:
      "5초 간격으로 주요 서비스의 성능을 실시간 모니터링하는 통합 대시보드, 원하는 기간과 서비스에 맞게 사용자가 직접 패널을 선택하고 레이아웃을 편집할 수 있는 서비스 대시보드와 MY 대시보드가 있습니다. 이를 통해 모바일 앱과 웹 서비스의 현재 상황과 이슈 포인트를 실시간으로 파악할 수 있습니다.",
    tags: [
      "다양한 뷰포인트",
      "변동 발생 지점 감지",
      "실시간 모니터링",
      "사용자 맞춤형 패널 구성",
      "현황 및 이슈 포인트 파악",
    ],
  },
  {
    category: "Real User Analysis",
    title: "사용자 경험을 재현하는 세션 분석",
    description:
      "서비스 시작부터 종료까지, 고객의 여정에서의 모든 상호작용을 하나의 세션으로 연결합니다. 실제 사용자가 어떻게 탐색하고 반응하는지 파악하여 문제 구간과 개선 포인트를 명확하게 발견할 수 있습니다. ",
    tags: [
      "특정 사용자 세션 추적",
      "이슈 발생 세션 추적",
      "세션↔︎트레이스 분석",
      "성능 ∙ 이벤트 ∙ 에러 파악",
    ],
  },
  {
    category: "Distributed Tracing",
    title: "서비스 가시성 향상을 위한 트레이스 분석",
    description:
      "앱·웹 애플리케이션에서 발생하는 사용자 요청별 기록을 기반으로 데이터 흐름을 작업 단위까지 정밀 추적합니다. 사용자 요청에 서비스가 어떻게 응답했고, 어떤 요소에서 문제가 있었는지 파악하여 성능 저하 원인을 빠르게 식별할 수 있습니다.",
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
  },
  {
    category: "Exception, Error, Log ㅡ User",
    title: "문제 해결 인사이트 크래시 분석 ∙ 로그",
    description:
      "사용자의 문제 상황을 파악하세요. 가장 많이 발생한 문제와 과정부터 원인까지 분석하고 추적할 수 있습니다. 서비스에서의 중요한 로직과 거래 추적, 문제 패턴과 예외 확인을 위한 커스텀 메시지를 남기고 식별하세요.",
    tags: [
      "스택 트레이스",
      "사용자 환경 정보",
      "커스텀 로그",
      "로그↔︎세션 분석",
      "크래시・ANR・에러",
      "에러 메시지",
      "기타 메타데이터",
    ],
  },
];
