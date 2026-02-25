"use client";

import { useEffect, useState } from "react";
import useAdminSessionQuery from "@/hooks/use-admin-session-query";
import useSignOutMutation from "@/hooks/use-sign-out-mutation";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const adminSessionQuery = useAdminSessionQuery();
  const signOutMutation = useSignOutMutation();

  const [isScrolled, setIsScrolled] = useState(false);

  const isContactPage =
    pathname === "/contact" || pathname === "/contact/thanks";

  const isAdmin =
    !!adminSessionQuery.data?.user && adminSessionQuery.data?.isAdmin;

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  useEffect(() => {
    const onScroll = () => {
      // 1px만 내려도 적용 (원하면 10, 20으로 바꿔도 됨)
      const next = window.scrollY > 0;
      // 불필요한 리렌더 방지
      setIsScrolled((prev) => (prev === next ? prev : next));
    };

    onScroll(); // 첫 렌더 시점에도 반영
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={[
        "fixed top-0 right-0 left-0 z-50 h-16 pointer-events-auto",
        "flex items-center justify-between px-4 md:px-9",
        "transition-[background-color,backdrop-filter] duration-300 ease-in-out",
        isScrolled ? "backdrop-blur-sm" : "backdrop-blur-0",
      ].join(" ")}
    >
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
            className="py-2 px-4 border-[0.7px] border-white bg-[rgba(0,0,0,0.05)] rounded-sm text-sm text-white font-medium leading-[1.5] hover:bg-white/10 duration-300 ease-in-out"
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
