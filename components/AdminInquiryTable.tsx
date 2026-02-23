"use client";

import { useMemo } from "react";
import useInquiriesQuery from "@/hooks/use-inquiries-query";
import { formatDateTime } from "@/lib/FormatDateTime";
import LoadingSpinner from "./LoadingSpinner";

const ROUTE_LABEL_MAP: Record<string, string> = {
  blog: "블로그",
  portal: "포탈 검색",
  facebook: "페이스북",
  seminar: "전시/세미나",
  press: "언론/보도자료",
  etc: "기타",
};

export default function AdminInquiryTable() {
  const inquiriesQuery = useInquiriesQuery();

  const inquiries = useMemo(() => {
    if (!Array.isArray(inquiriesQuery.data)) return [];
    return inquiriesQuery.data;
  }, [inquiriesQuery.data]);

  return (
    <div className="space-y-4">
      {inquiriesQuery.isLoading ? (
        <div className="flex items-center justify-center w-full py-10">
          <LoadingSpinner />
        </div>
      ) : inquiriesQuery.isError ? (
        <div className="py-10 text-center text-red-400">
          {inquiriesQuery.error instanceof Error
            ? inquiriesQuery.error.message
            : "문의 데이터를 불러오지 못했습니다."}
        </div>
      ) : inquiries.length === 0 ? (
        <div className="py-10 text-center text-slate-400">
          등록된 문의가 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-white">
            <thead>
              <tr className="border-b border-white/10 text-slate-300">
                <th className="text-left py-3 px-2 font-normal">접수일시</th>
                <th className="text-left py-3 px-2 font-normal">유입경로</th>
                <th className="text-left py-3 px-2 font-normal">회사명</th>
                <th className="text-left py-3 px-2 font-normal">이메일</th>
                <th className="text-left py-3 px-2 font-normal">성함</th>
                <th className="text-left py-3 px-2 font-normal">연락처</th>
                <th className="text-left py-3 px-2 font-normal">문의내용</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((item: any) => (
                <tr
                  key={item.id}
                  className="border-b border-white/5 align-top hover:bg-white/5"
                >
                  <td className="py-3 px-2 whitespace-nowrap text-slate-200 text-left">
                    {formatDateTime(item.created_at)}
                  </td>
                  <td className="py-3 px-2 whitespace-nowrap text-left">
                    {ROUTE_LABEL_MAP[item.route] ?? item.route ?? "-"}
                  </td>
                  <td className="py-3 px-2 whitespace-nowrap text-left">
                    {item.company || "-"}
                  </td>
                  <td className="py-3 px-2 whitespace-nowrap text-left">
                    {item.email || "-"}
                  </td>
                  <td className="py-3 px-2 whitespace-nowrap text-left">
                    {item.name || "-"}
                  </td>
                  <td className="py-3 px-2 whitespace-nowrap text-left">
                    {item.tel || "-"}
                  </td>
                  <td className="py-3 px-2 min-w-[320px]">
                    <p className="whitespace-pre-wrap break-words leading-6 text-slate-100 text-left">
                      {item.content || "-"}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
