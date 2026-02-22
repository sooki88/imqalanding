// "use client";

// import { useMemo, useState } from "react";
// import useInquiriesQuery from "@/hooks/use-inquiries-query";

// type TabKey = "inquiries" | "news" | "logo";

// const TAB_LIST: { key: TabKey; label: string }[] = [
//   { key: "inquiries", label: "문의" },
//   { key: "news", label: "뉴스" },
//   { key: "logo", label: "로고" },
// ];

// const ROUTE_LABEL_MAP: Record<string, string> = {
//   blog: "블로그",
//   portal: "포탈 검색",
//   facebook: "페이스북",
//   seminar: "전시/세미나",
//   press: "언론/보도자료",
//   etc: "기타",
// };

// function formatDateTime(value?: string | null) {
//   if (!value) return "-";

//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return value;

//   return d.toLocaleString("ko-KR", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState<TabKey>("inquiries");
//   const inquiriesQuery = useInquiriesQuery();

//   const inquiries = useMemo(() => {
//     if (!Array.isArray(inquiriesQuery.data)) return [];
//     return inquiriesQuery.data;
//   }, [inquiriesQuery.data]);

//   return (
//     <div className="w-full max-w-[1200px]">
//       {/* 탭 */}
//       <div className="flex flex-wrap gap-4 mb-6 border-b border-slate-500">
//         {TAB_LIST.map((tab) => {
//           const isActive = activeTab === tab.key;

//           return (
//             <button
//               key={tab.key}
//               type="button"
//               onClick={() => setActiveTab(tab.key)}
//               className={[
//                 "h-10 px-2 text-base border-b-[3px] transition hover:bg-white/5",
//                 isActive
//                   ? "border-[#0077ff] text-white font-semibold"
//                   : "border-transparent text-slate-300 hover:bg-white/5",
//               ].join(" ")}
//             >
//               {tab.label}
//             </button>
//           );
//         })}
//       </div>

//       {/* 탭 내용 */}
//       <div className="rounded-md border border-white/10 bg-black/20 p-4 md:p-5">
//         {activeTab === "inquiries" && (
//           <div className="space-y-4">
//             {inquiriesQuery.isLoading ? (
//               <div className="py-10 text-center text-slate-300">
//                 문의 데이터를 불러오는 중입니다.
//               </div>
//             ) : inquiriesQuery.isError ? (
//               <div className="py-10 text-center text-red-400">
//                 {inquiriesQuery.error instanceof Error
//                   ? inquiriesQuery.error.message
//                   : "문의 데이터를 불러오지 못했습니다."}
//               </div>
//             ) : inquiries.length === 0 ? (
//               <div className="py-10 text-center text-slate-400">
//                 등록된 문의가 없습니다.
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse text-sm text-white">
//                   <thead>
//                     <tr className="border-b border-white/10 text-slate-300">
//                       <th className="text-left py-3 px-2 font-normal">
//                         접수일시
//                       </th>
//                       <th className="text-left py-3 px-2 font-normal">
//                         유입경로
//                       </th>
//                       <th className="text-left py-3 px-2 font-normal">
//                         회사명
//                       </th>
//                       <th className="text-left py-3 px-2 font-normal">
//                         이메일
//                       </th>
//                       <th className="text-left py-3 px-2 font-normal">성함</th>
//                       <th className="text-left py-3 px-2 font-normal">
//                         연락처
//                       </th>
//                       <th className="text-left py-3 px-2 font-normal">
//                         문의내용
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {inquiries.map((item: any) => (
//                       <tr
//                         key={item.id}
//                         className="border-b border-white/5 align-top hover:bg-white/5"
//                       >
//                         <td className="py-3 px-2 whitespace-nowrap text-slate-200 text-left">
//                           {formatDateTime(item.created_at)}
//                         </td>
//                         <td className="py-3 px-2 whitespace-nowrap text-left">
//                           {ROUTE_LABEL_MAP[item.route] ?? item.route ?? "-"}
//                         </td>
//                         <td className="py-3 px-2 whitespace-nowrap text-left">
//                           {item.company || "-"}
//                         </td>
//                         <td className="py-3 px-2 whitespace-nowrap text-left">
//                           {item.email || "-"}
//                         </td>
//                         <td className="py-3 px-2 whitespace-nowrap text-left">
//                           {item.name || "-"}
//                         </td>
//                         <td className="py-3 px-2 whitespace-nowrap text-left">
//                           {item.tel || "-"}
//                         </td>
//                         <td className="py-3 px-2 min-w-[320px]">
//                           <p className="whitespace-pre-wrap break-words leading-6 text-slate-100 text-left">
//                             {item.content || "-"}
//                           </p>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === "news" && (
//           <div className="py-10 text-center text-slate-400">
//             뉴스 관리 탭 (추가 예정)
//           </div>
//         )}

//         {activeTab === "logo" && (
//           <div className="py-10 text-center text-slate-400">
//             로고 관리 탭 (추가 예정)
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";

import AdminInquiryTable from "./AdminInquiryTable";
import AdminNewsTable from "./AdminNewsTable";

type TabKey = "inquiries" | "news" | "logo";

const TAB_LIST: { key: TabKey; label: string }[] = [
  { key: "inquiries", label: "문의" },
  { key: "news", label: "뉴스" },
  { key: "logo", label: "로고" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("inquiries");

  return (
    <div className="w-full max-w-[1200px]">
      {/* 탭 */}
      <div className="flex flex-wrap gap-4 mb-6 border-b border-slate-500">
        {TAB_LIST.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={[
                "h-10 px-2 text-base border-b-[3px] transition hover:bg-white/5",
                isActive
                  ? "border-[#0077ff] text-white font-semibold"
                  : "border-transparent text-slate-300 hover:bg-white/5",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
        {/* {activeTab !== "inquiries" && (
          <button
            type="button"
            onClick={() => console.log("클릭")}
            className=""
          >
            등록
          </button>
        )} */}
      </div>

      {/* 탭 내용 */}
      <div className="rounded-md border border-white/10 bg-black/20 p-4 md:p-5">
        {activeTab === "inquiries" && <AdminInquiryTable />}

        {activeTab === "news" && <AdminNewsTable />}

        {activeTab === "logo" && (
          <div className="py-10 text-center text-slate-400">
            로고 관리 탭 (추가 예정)
          </div>
        )}
      </div>
    </div>
  );
}
