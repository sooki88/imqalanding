"use client";

import useAdminSessionQuery from "@/hooks/use-admin-session-query";
import CheckAuthForm from "@/components/CheckAuthForm";
import AdminDashboard from "./AdminDashboard";
import LoadingSpinner from "./LoadingSpinner";

export default function AdminPageClient() {
  const adminSessionQuery = useAdminSessionQuery();

  if (adminSessionQuery.isLoading) {
    return (
      <main className="flex flex-col min-h-dvh items-center justify-center gap-5">
        <LoadingSpinner />
        <p>관리자 계정을 확인 중입니다</p>
      </main>
    );
  }

  if (adminSessionQuery.isError) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="text-red-400">
          {adminSessionQuery.error instanceof Error
            ? adminSessionQuery.error.message
            : "오류가 발생했습니다."}
        </p>
      </main>
    );
  }

  const isAdmin =
    !!adminSessionQuery.data?.user && adminSessionQuery.data?.isAdmin;

  return (
    <main className="flex flex-col min-h-dvh items-center gap-8 w-full px-4 md:px-9 mt-16 mb-30">
      <div className="flex flex-col gap-4 py-9 w-full max-w-[1200px]">
        <h2 className="font-semibold">관리자 페이지</h2>
        <p className="text-base md:text-lg text-slate-400 leading-[1.5]">
          관리자 페이지는 등록된 관리자만 접근할 수 있는 페이지입니다.
        </p>
      </div>

      <section className="px-0 py-0">
        {isAdmin ? <AdminDashboard /> : <CheckAuthForm />}
      </section>
    </main>
  );
}
