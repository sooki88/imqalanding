import PRIVACY_DATA from "@/constants/PrivacyData";
import PolicyContent from "@/lib/PolicyContent";
import type { Metadata } from "next";

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center gap-8 w-full px-6 mt-16 mb-30">
      <div className="py-9 w-full max-w-[1200px] font-semibold text-4xl text-white leading-[1.3]">
        개인정보처리방침
      </div>

      <PolicyContent content={PRIVACY_DATA} />
    </main>
  );
}

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "IMQA 개인정보처리방침 페이지입니다.",
  alternates: {
    canonical: "https://imqa.io/privacy",
  },
  openGraph: {
    url: "https://imqa.io/privacy",
    title: "개인정보처리방침 | IMQA",
    description: "IMQA 개인정보처리방침 페이지입니다.",
  },
  twitter: {
    title: "개인정보처리방침 | IMQA",
    description: "IMQA 개인정보처리방침 페이지입니다.",
  },
};
