// 두번째 섹션

"use client";

import Image from "next/image";
import Tag from "./Tag";

export default function Observability() {
  return (
    <section>
      {/* <Tag>TELEMETRY</Tag> */}

      {/* 타이틀 */}
      <h2 className="text-white text-[40px] font-semibold leading-[1.3]">
        {/* <span className="text-main-gradient">Observability</span>를 */}
        Observability를 프론트엔드에서 시작하다
      </h2>
      <p className="mt-6 text-slate-400 font-normal leading-[1.6] text-lg text-center">
        사용자 이용 패턴과 성능 저하 구간을 즉시 파악하고 <br /> 문제를 해결하는
        데 필요한 핵심 데이터를 확보할 수 있습니다.
      </p>
      {/* front-end */}
      <Step number="01" title="Front-end" className="mt-14">
        <Image
          src="/icon_ios.svg"
          alt="ios 아이콘"
          width={40}
          height={40}
          priority
        />
        <Image
          src="/icon_android.svg"
          alt="android 아이콘"
          width={40}
          height={40}
          priority
        />
        <Image
          src="/icon_web.svg"
          alt="web 아이콘"
          width={40}
          height={40}
          priority
        />
      </Step>
      <Line />
      {/* 02 SDK/Agent */}
      <Step number="02" title="SDK/Agent">
        <Image
          src="/imqa_logo_wht.svg"
          alt="IMQA logo"
          width={95}
          height={22}
          priority
        />
        <Image
          src="/icon_close_wht.svg"
          alt="X 아이콘"
          width={20}
          height={20}
          priority
        />
        <Image
          src="/open_telemetry.webp"
          alt="open telemetry"
          width={133}
          height={46}
          priority
          className="-ml-1 mb-2"
        />
      </Step>
      <Line />
      {/* 03 Data Sources */}
      <Step number="03" title="Data Sources">
        <div className="flex flex-wrap gap-x-8 gap-y-1 max-w-[600px] justify-center my-2">
          {[
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
          ].map((item) => (
            <span key={item} className="text-lg text-white leading-[1.5]">
              {item}
            </span>
          ))}
        </div>
      </Step>
      <Line />
      {/* 04 IMQA Observability Solution */}
      <Step number="04" title="IMQA Observability Solution">
        <div className="flex flex-wrap gap-x-6 gap-y-4 max-w-[620px] justify-center my-2">
          {ObservabilitySolution.map((item) => (
            <div
              key={item.title}
              className="flex flex-col max-w-[130px] items-start"
            >
              <span className="text-lg text-white leading-[1.5]">
                {item.title}
                {/* <Image
                src="/icon_arrow_right_wht_sm.svg"
                alt="이동하기"
                width={40}
                height={40}
                priority
              /> */}
              </span>
              <span className="text-slate-400 text-xs leading-[1.5] font-light text-left mt-1">
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
    <div className="w-[1.5px] h-[20px] bg-slate-500 rounded-full my-2"></div>
  );
}

// 단계
interface StepProps {
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

function Step({ number, title, children, className = "" }: StepProps) {
  return (
    <div
      className={`flex flex-col items-center gap-2 max-w-[680px] pt-2 pb-3 px-10 rounded-sm text-xs font-medium text-slate-400 leading-[1.5] backdrop-blur-[4px] bg-[rgba(30,41,59,0.5)] border border-slate-800 ${className}`}
      // className={`flex flex-col items-center gap-1 pt-3 pb-4 px-10 rounded-[60px] text-xs text-slate-400 leading-[1.5] backdrop-blur-[4px] shadow-[inset_6px_2px_2px_0_rgba(75,79,251,0.50),_inset_-4px_-2px_8px_0_#ffffff] ${className}`}
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
