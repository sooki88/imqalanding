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
      <div className="rounded-md border border-white/10 bg-black/20 px-4 md:px-5 py-2 md:py-3">
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
