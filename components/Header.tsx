"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const isContactPage =
    pathname === "/contact" || pathname === "/contact/thanks";

  return (
    <header className="flex justify-between items-center px-4 md:px-9 h-16 fixed top-0 right-0 left-0 z-50 pointer-events-auto backdrop-blur-sm">
      {/* // <header className="flex justify-between items-center px-4 md:px-9 h-16 fixed top-0 right-0 left-0 z-50 pointer-events-auto [transform:translateZ(0)] [backface-visibility:hidden] will-change-transform backdrop-blur-sm"> */}
      <Link href="/">
        <Image
          src="/imqa_logo_wht.svg"
          alt="IMQA logo"
          width={94}
          height={23}
          priority
        />
      </Link>

      {!isContactPage && (
        <Link
          href="/contact"
          className="py-2 px-4 border-[0.7px] border-white bg-[rgba(0, 0, 0, 0.05)] rounded-sm text-sm text-white font-medium leading-[1.5] hover:bg-white/10 duration-300 ease-in-out"
        >
          문의하기
        </Link>
      )}
    </header>
  );
}
