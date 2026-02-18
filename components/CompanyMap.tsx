"use client";

import Image from "next/image";

export default function CompanyMap() {
  // 구글 맵 검색 URL (주소를 기반으로 생성)
  const mapAddress = encodeURIComponent("서울특별시 용산구 두텁바위로 21");
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${mapAddress}`;

  // 만약 API 키 없이 가장 간단하게 넣고 싶다면 아래 형식을 사용하세요 (공개용)
  const simpleMapSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.5074218844!2d126.9722381126629!3d37.54538887192621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca2eda266df41%3A0x9a05243698804d59!2z7Ja064uI7LuYIOyjvOyLne2ajOyCrA!5e0!3m2!1sko!2skr!4v1710000000000!5m2!1sko!2skr";

  return (
    <div className="relative w-1/2 mt-6">
      {/* 지도 영역 */}
      <div className="md:col-span-2 w-full h-full rounded-sm overflow-hidden border border-white/10 grayscale-[0.5] contrast-[1.2]">
        <iframe
          src={simpleMapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="회사 위치 지도"
        ></iframe>
      </div>

      {/* 교통 정보 및 연락처 */}
      <div className="absolute bottom-0 w-full text-left z-1 p-4">
        <div className="flex flex-col bg-slate-900/80 p-4 gap-1 rounded-sm">
          {CompanyInfo.map((info) => (
            <div
              key={info.text}
              className="flex items-center gap-2 text-sm leading-[1.5]"
            >
              <Image
                src={info.src}
                alt={info.text}
                width={16}
                height={16}
                priority
              />
              {info.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const CompanyInfo = [
  {
    src: "/icon_company.svg",
    text: "서울시 용산구 두텁바위로 21, 5층(갈월동, 어니컴 빌딩)",
  },
  {
    src: "/icon_email.svg",
    text: "support@imqa.io",
  },
  {
    src: "/icon_company_phone.svg",
    text: "02-6395-7730",
  },
];
