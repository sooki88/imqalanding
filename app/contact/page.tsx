import CompanyMap from "@/components/CompanyMap";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="flex flex-col items-center gap-8 w-full px-6 mt-16 mb-30">
      <div className="flex flex-col gap-4 py-9 w-full max-w-[1200px]">
        <h2 className="font-semibold text-4xl text-white leading-[1.3]">
          문의하기
        </h2>
        <p className="text-lg text-slate-400 leading-[1.5]">
          IMQA 솔루션에 대해 궁금하신 점이나 도입 문의를 남겨주시면, 빠른 시일
          내에 담당 부서에서 상세히 안내해 드리겠습니다.
        </p>
      </div>

      <div className="flex gap-20 w-full max-w-[1200px]">
        <ContactForm />
        <CompanyMap />
      </div>
    </main>
  );
}
