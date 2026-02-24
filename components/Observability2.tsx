// 두번째 섹션

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const steps = ["step1", "step2", "step3", "step4"];

export default function Observability() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((v) => (v + 1) % steps.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <section>
      {/* 타이틀 */}
      {/* <h2 className="text-white text-[40px] font-semibold leading-[1.3]"> */}
      <h2>
        Observability를 <br className="only-mobile" />
        프론트엔드에서 시작하다
      </h2>
      <p className="mt-6 text-slate-400 font-normal leading-[1.6] text-base md:text-lg text-center  break-keep">
        사용자 이용 패턴과 성능 저하 구간을 즉시 파악하고
        <br className="only-pc" /> 문제를 해결하는 데 필요한 핵심 데이터를
        확보할 수 있습니다.
      </p>
      {/* front-end */}
      <Step
        number="01"
        title="Front-end"
        className="mt-14"
        active={active == 0}
      >
        {FrontEndImages.map((img) => (
          <div key={img.alt} className="relative w-8 md:w-10 h-8 md:h-10">
            <Image
              fill
              src={img.src}
              alt={img.alt}
              sizes="(max-width: 768px) 32px, 40px"
              className="object-contain"
            />
          </div>
        ))}
      </Step>

      <Line />

      {/* 02 SDK/Agent */}
      <Step number="02" title="SDK/Agent" active={active == 1}>
        <div className="relative w-[90px] md:w-[95px] aspect-[90/21]">
          <Image
            fill
            src="/imqa_logo_wht.svg"
            alt="IMQA logo"
            sizes="(max-width: 768px) 90px, 95px"
            className="object-contain"
          />
        </div>
        <Image
          src="/icon_close_wht.svg"
          alt="X 아이콘"
          width={20}
          height={20}
          priority
        />
        <div className="-ml-1 mb-2 relative w-[127px] md:w-[133px] aspect-[127/44]">
          <Image
            fill
            src="/open_telemetry.webp"
            alt="open telemetry"
            sizes="(max-width: 768px) 127px, 133px"
            className="object-contain"
          />
        </div>
      </Step>

      <Line />

      {/* 03 Data Sources */}
      <Step number="03" title="Data Sources" active={active == 2}>
        <div className="flex flex-wrap gap-x-8 gap-y-1 max-w-[600px] justify-center my-1 md:my-2">
          {DataSources.map((item) => (
            <span
              key={item}
              className="text-base md:text-lg text-white leading-[1.5]"
            >
              {item}
            </span>
          ))}
        </div>
      </Step>

      <Line />

      {/* 04 IMQA Observability Solution */}
      <Step
        number="04"
        title="IMQA Observability Solution"
        active={active == 3}
      >
        <div className="flex flex-wrap gap-x-6 gap-y-4 max-w-[620px] justify-center my-1 md:my-2">
          {ObservabilitySolution.map((item) => (
            <div
              key={item.title}
              className="flex flex-col w-full max-w-[260px] md:max-w-[130px] items-start"
            >
              <span className="text-base md:text-lg text-white leading-[1.5]">
                {item.title}
              </span>
              <span className="text-slate-400 text-xs leading-[1.6] font-light text-left mt-1">
                {item.summary}
              </span>
            </div>
          ))}
        </div>
      </Step>
    </section>
  );
}

// 라인
function Line() {
  return (
    <div className="w-[1px] h-[16px] md:h-[20px] bg-slate-500 rounded-full my-1 md:my-2"></div>
  );
}

// 단계
interface StepProps {
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  active: boolean;
}

function Step({ number, title, children, className = "", active }: StepProps) {
  return (
    <div
      className={[
        "rounded-sm border transition-all duration-500",
        "flex flex-col items-center gap-2 max-w-[680px] pt-2 pb-3 px-6 md:px-10 text-xs font-medium leading-[1.5] bg-[rgba(30,41,59,0.5)]",
        active
          ? "border-[rgba(0,119,255,1)] text-[#0077ff]"
          : "border-slate-8000 text-slate-400",
        number == "01" ? "mt-14" : "",
      ].join(" ")}
    >
      {number} {title}
      <div className="flex gap-4 items-center justify-center">{children}</div>
    </div>
  );
}

// 04 IMQA Observability Solution
const ObservabilitySolution = [
  {
    title: "성능 분석",
    summary: "사용자에게 발생한 성능 저하 유형과 패턴 확인 및 분석",
  },
  {
    title: "대시보드",
    summary: "전체/서비스별 앱·웹 앱의 현황과 이슈 실시간 파악",
  },
  {
    title: "세션 분석",
    summary: "시작부터 종료까지, 고객 여정을 하나의 세션으로 연결",
  },
  {
    title: "크래시 분석",
    summary: "가장 많이 발생한 문제와 과정, 원일을 분석하고 추적",
  },
  {
    title: "트레이스",
    summary: "사용자 요청 경로 기록으로 흐름을 작업 단위까지 추적",
  },
  {
    title: "로그",
    summary: "다양한 기록으로 문제해결 위한 마지막 인사이트 확보",
  },
  {
    title: "알림",
    summary: "임계치 알림 설정으로 앱·웹 앱과 사용자의 신호 알림",
  },
  {
    title: "관리",
    summary: "효율적인 업무를 위한 관리기능 지원",
  },
];

// front-end 아이콘 리스트
const FrontEndImages = [
  { src: "/icon_ios.svg", alt: "ios 아이콘" },
  { src: "/icon_android.svg", alt: "android 아이콘" },
  { src: "/icon_web.svg", alt: "web 아이콘" },
];

// Data Sources 리스트
const DataSources = [
  "트레이스",
  "메트릭",
  "로그",
  "사용자 행동",
  "사용자 상호작용",
  "디바이스 정보",
  "성능",
  "네트워크",
  "크래시/에러",
  "코드",
  "커스텀 데이터",
];
