"use client";

import useAdminSessionQuery from "@/hooks/use-admin-session-query";
import useSignOutMutation from "@/hooks/use-sign-out-mutation";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const adminSessionQuery = useAdminSessionQuery();
  const signOutMutation = useSignOutMutation();

  const isContactPage =
    pathname === "/contact" || pathname === "/contact/thanks";

  const isAdmin =
    !!adminSessionQuery.data?.user && adminSessionQuery.data?.isAdmin;

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  return (
    <header className="flex justify-between items-center px-4 md:px-9 h-16 fixed top-0 right-0 left-0 z-50 pointer-events-auto backdrop-blur-sm">
      {/* // <header className="flex justify-between items-center px-4 md:px-9 h-16 fixed top-0 right-0 left-0 z-50 pointer-events-auto [transform:translateZ(0)] [backface-visibility:hidden] will-change-transform backdrop-blur-sm"> */}
      <Link
        href="/"
        onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
      >
        <Image
          src="/imqa_logo_wht.svg"
          alt="IMQA logo"
          width={94}
          height={23}
          priority
        />
      </Link>

      <div className="flex gap-3">
        {!isContactPage && (
          <Link
            href="/contact"
            className="py-2 px-4 border-[0.7px] border-white bg-[rgba(0, 0, 0, 0.05)] rounded-sm text-sm text-white font-medium leading-[1.5] hover:bg-white/10 duration-300 ease-in-out"
          >
            문의하기
          </Link>
        )}

        {isAdmin && (
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signOutMutation.isPending}
            className="py-2 px-4 border-[0.7px] border-white/40 bg-[rgba(0,0,0,0.2)] rounded-sm text-sm text-white font-medium leading-[1.5] hover:bg-white/10 duration-300 ease-in-out disabled:opacity-60"
          >
            {signOutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
          </button>
        )}
      </div>
    </header>
  );
}
