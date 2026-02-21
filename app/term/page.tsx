import TERM_DATA from "@/constants/Term_data";
import PolicyContent from "@/lib/PolicyContent";
import type { Metadata } from "next";

export default function TermPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center gap-8 w-full px-4 md:px-9 py-16 md:py-25 mb-30">
      <h2 className="py-9 w-full max-w-[1200px] font-semibold">이용약관</h2>

      <PolicyContent content={TERM_DATA} />
    </main>
  );
}

export const metadata: Metadata = {
  title: "이용약관",
  description: "IMQA 이용약관 페이지입니다.",
  alternates: {
    canonical: "https://imqa.io/term",
  },
  openGraph: {
    url: "https://imqa.io/term",
    title: "이용약관 | IMQA",
    description: "IMQA 이용약관 페이지입니다.",
  },
  twitter: {
    title: "이용약관 | IMQA",
    description: "IMQA 이용약관 페이지입니다. ",
  },
};
