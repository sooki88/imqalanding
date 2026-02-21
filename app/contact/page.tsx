import CompanyMap from "@/components/CompanyMap";
import ContactForm from "@/components/ContactForm";
import type { Metadata } from "next";

export default function ContactPage() {
  return (
    <main className="flex flex-col items-center gap-8 w-full px-6 mt-16 mb-30">
      <div className="flex flex-col gap-4 py-9 w-full max-w-[1200px]">
        {/* <h2 className="font-semibold text-4xl text-white leading-[1.3]"> */}
        <h2 className="font-semibold">문의하기</h2>
        <p className="text-base md:text-lg text-slate-400 leading-[1.5]">
          IMQA 솔루션에 대해 궁금하신 점이나 도입 문의를 남겨주시면, 빠른 시일
          내에 담당 부서에서 상세히 안내해 드리겠습니다.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-20 w-full max-w-[1200px]">
        <ContactForm />
        <CompanyMap />
      </div>
    </main>
  );
}

export const metadata: Metadata = {
  title: "문의하기",
  description:
    "IMQA 도입 및 상담 문의를 남겨주세요. 담당 부서에서 빠르게 안내드립니다.",
  alternates: {
    canonical: "https://imqa.io/contact",
  },
  openGraph: {
    url: "https://imqa.io/contact",
    title: "문의하기 | IMQA",
    description:
      "IMQA 도입 및 상담 문의를 남겨주세요. 담당 부서에서 빠르게 안내드립니다.",
  },
  twitter: {
    title: "문의하기 | IMQA",
    description:
      "IMQA 도입 및 상담 문의를 남겨주세요. 담당 부서에서 빠르게 안내드립니다.",
  },
};
