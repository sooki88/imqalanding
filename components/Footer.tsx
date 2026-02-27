"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden px-6 py-10 bg-slate-800">
      <div className="max-w-[1200px] m-auto">
        <span className="text-base text-white">
          © ONYCOM Inc. All rights reserved
        </span>

        {/* 회사정보 */}
        <div className="flex gap-x-6 gap-y-[2px] flex-wrap mt-3 text-slate-300 text-sm">
          {CompanyInfo.map((info, index) => (
            <span
              key={index}
              className={
                index == 0 ? "font-semibold no-underline" : "no-underline"
              }
            >
              {info}
            </span>
          ))}
        </div>

        {/* 개인정보처리방침, 이용약관 */}
        <div className="flex gap-6 mt-3">
          <Link
            href="/privacy"
            className="text-slate-300 text-sm font-semibold hover:text-white transition-colors"
          >
            개인정보처리방침
          </Link>
          <Link
            href="/term"
            className="text-slate-300 text-sm hover:text-white transition-colors"
          >
            이용약관
          </Link>
        </div>

        {/* SNS */}
        <div className="flex gap-4 mt-10">
          {SnsInfo.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm hover:bg-slate-700"
            >
              <Image
                src={item.src}
                alt="IMQA logo"
                width={36}
                height={36}
                priority
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

const CompanyInfo = [
  "어니컴 주식회사",
  "대표이사: 이석호",
  "사업자 등록번호 : 120-81-82737",
  "통신판매업신고 제2021-서울용산-0563호",
  "주소 : 서울특별시 용산구 두텁바위로 21 어니컴빌딩",
  "E-mail : support@imqa.com",
  "Tel : +82-0-540-0080",
];

const SnsInfo = [
  { src: "/blog.webp", href: "https://blog.imqa.io/" },
  { src: "/youtube.webp", href: "https://www.youtube.com/@IMQAofficial" },
  { src: "/facebook.webp", href: "https://www.facebook.com/imqa.io" },
];
