"use client";

import { useMemo } from "react";
import useNewsQuery from "@/hooks/use-news-query";
import { formatDateTime } from "@/lib/FormatDateTime";

export default function AdminNewsTable() {
  const newsQuery = useNewsQuery();

  const news = useMemo(() => {
    if (!Array.isArray(newsQuery.data)) return [];
    return newsQuery.data;
  }, [newsQuery.data]);

  return (
    <div className="space-y-4">
      {newsQuery.isLoading ? (
        <div className="py-10 text-center text-slate-300">
          뉴스 데이터를 불러오는 중입니다.
        </div>
      ) : newsQuery.isError ? (
        <div className="py-10 text-center text-red-400">
          {newsQuery.error instanceof Error
            ? newsQuery.error.message
            : "뉴스 데이터를 불러오지 못했습니다."}
        </div>
      ) : news.length === 0 ? (
        <div className="py-10 text-center text-slate-400">
          등록된 뉴스가 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-white">
            <thead>
              <tr className="border-b border-white/10 text-slate-300">
                <th className="text-left py-3 px-2 font-normal">제목</th>
                <th className="text-left py-3 px-2 font-normal">내용</th>
                <th className="text-left py-3 px-2 font-normal">뉴스 게시일</th>
                <th className="text-left py-3 px-2 font-normal">생성일시</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item: any) => (
                <tr
                  key={item.id}
                  className="border-b border-white/5 align-top hover:bg-white/5"
                >
                  <td className="py-3 px-2 whitespace-nowrap text-left">
                    {item.title || "-"}
                  </td>
                  <td className="py-3 px-2 min-w-[320px]">
                    <p className="whitespace-pre-wrap break-words leading-6 text-slate-100 text-left">
                      {item.content || "-"}
                    </p>
                  </td>
                  <td className="py-3 px-2 whitespace-nowrap text-slate-200 text-left">
                    {formatDateTime(item.news_date, { withTime: false })}
                  </td>
                  <td className="py-3 px-2 whitespace-nowrap text-slate-200 text-left">
                    {formatDateTime(item.created_at)}
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
