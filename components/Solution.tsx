// 여섯번째 섹션 (IMQA로 답하세요)

"use client";

import Link from "next/link";

export default function Solution() {
  return (
    <section className="py-0">
      <div className="solution-bg absolute inset-0 -z-1"></div>
      <div className="flex flex-col items-center justify-center w-full py-25">
        <h3 className="w-full md:w-5/6 font-semibold text-center">
          서비스를 관찰하고 실제 사용자 경험을 분석해보세요 <br />
          수많은 질문에 <strong className="">IMQA</strong>로 답하세요
        </h3>
        <div className="flex flex-col md:flex-row gap-4 mt-12 pointer-events-auto">
          <Link
            href="#features"
            className="py-[10px] px-5 border-[0.7px] border-white bg-[rgba(0, 0, 0, 0.05)] rounded-sm text-white text-base font-medium leading-[1.5] backdrop-blur-xs hover:bg-white/10 duration-300 ease-in-out"
          >
            소개서 다운로드
          </Link>
          <Link
            href="/contact"
            className="py-[10px] px-5 border-[0.7px] border-white bg-white rounded-sm text-black font-medium leading-[1.5] backdrop-blur-xs hover:bg-white/90 duration-300 ease-in-out"
          >
            IMQA 문의하기
          </Link>
        </div>
      </div>
    </section>
  );
}
