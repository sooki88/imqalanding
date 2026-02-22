export default function Dashboard() {
  return (
    <main className="flex flex-col min-h-dvh items-center gap-8 w-full px-6 mt-16 mb-30">
      <div className="flex flex-col gap-4 py-9 w-full max-w-[1200px]">
        {/* <h2 className="font-semibold text-4xl text-white leading-[1.3]"> */}
        <h2 className="font-semibold">관리자 페이지</h2>
        <p className="text-base md:text-lg text-slate-400 leading-[1.5]">
          관리자 페이지는 등록된 관리자만 접근할 수 있는 페이지입니다.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-20 w-full max-w-[1200px]"></div>
    </main>
  );
}
