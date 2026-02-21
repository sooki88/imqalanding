import Link from "next/link";

export default function ContactThanks() {
  return (
    <main className="flex flex-col min-h-dvh items-center gap-8 w-full px-6 mt-16 mb-30">
      <div className="flex flex-col gap-4 py-9 w-full max-w-[1200px]">
        {/* <h2 className="font-semibold text-4xl text-white leading-[1.3]"> */}
        <h2 className="font-semibold">문의 접수 완료</h2>
        <p className="text-base md:text-lg text-slate-400 leading-[1.5]">
          담당자가 확인 후 영업일 기준 1~2일 내에 회신드리겠습니다.
          <br />
          회신이 보이지 않으면 스팸함도 확인해 주세요.
        </p>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4">
        <Link
          href="/"
          className="w-32 py-[10px] px-5 border-[0.7px] border-white bg-[rgba(0, 0, 0, 0.05)] rounded-sm text-white text-base text-center font-medium leading-[1.5] backdrop-blur-xs hover:bg-white/10 duration-300 ease-in-out"
        >
          홈으로
        </Link>
        <Link
          href="/contact"
          className="w-32 py-[10px] px-5 border-[0.7px] border-white bg-white rounded-sm text-black font-medium leading-[1.5] backdrop-blur-xs hover:bg-white/90 duration-300 ease-in-out"
        >
          다시 문의하기
        </Link>
      </div>

      {/* <div className="flex flex-col lg:flex-row gap-20 w-full max-w-[1200px]"></div> */}
    </main>
  );
}
