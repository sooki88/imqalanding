// "use client";

// import { useMemo } from "react";
// import useNewsQuery from "@/hooks/use-news-query";
// import { formatDateTime } from "@/lib/FormatDateTime";
// import LoadingSpinner from "./LoadingSpinner";

// export default function AdminNewsTable() {
//   const newsQuery = useNewsQuery();

//   const news = useMemo(() => {
//     if (!Array.isArray(newsQuery.data)) return [];
//     return newsQuery.data;
//   }, [newsQuery.data]);

//   return (
//     <div className="space-y-4">
//       {newsQuery.isLoading ? (
//         <div className="flex items-center justify-center w-full py-10">
//           <LoadingSpinner />
//         </div>
//       ) : newsQuery.isError ? (
//         <div className="py-10 text-center text-red-400">
//           {newsQuery.error instanceof Error
//             ? newsQuery.error.message
//             : "뉴스 데이터를 불러오지 못했습니다."}
//         </div>
//       ) : news.length === 0 ? (
//         <div className="py-10 text-center text-slate-400">
//           등록된 뉴스가 없습니다.
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-sm text-white">
//             <thead>
//               <tr className="border-b border-white/10 text-slate-300">
//                 <th className="text-left py-3 px-2 font-normal">제목</th>
//                 <th className="text-left py-3 px-2 font-normal">내용</th>
//                 <th className="text-left py-3 px-2 font-normal">뉴스 게시일</th>
//                 <th className="text-left py-3 px-2 font-normal">생성일시</th>
//               </tr>
//             </thead>
//             <tbody>
//               {news.map((item: any) => (
//                 <tr
//                   key={item.id}
//                   className="border-b border-white/5 align-top hover:bg-white/5"
//                 >
//                   <td className="py-3 px-2 whitespace-nowrap text-left">
//                     {item.title || "-"}
//                   </td>
//                   <td className="py-3 px-2 min-w-[320px]">
//                     <p className="whitespace-pre-wrap break-words leading-6 text-slate-100 text-left">
//                       {item.content || "-"}
//                     </p>
//                   </td>
//                   <td className="py-3 px-2 whitespace-nowrap text-slate-200 text-left">
//                     {formatDateTime(item.news_date, { withTime: false })}
//                   </td>
//                   <td className="py-3 px-2 whitespace-nowrap text-slate-200 text-left">
//                     {formatDateTime(item.created_at)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import useNewsQuery from "@/hooks/use-news-query";
import { formatDateTime } from "@/lib/FormatDateTime";
import LoadingSpinner from "./LoadingSpinner";
import useUpdateNewsMutation from "@/hooks/use-update-news-mutation";

type EditingState = {
  id: number;
  title: string;
  content: string;
  news_date: string; // input type="date" 용
} | null;

function toDateInputValue(value?: string | null) {
  if (!value) return "";
  // 이미 YYYY-MM-DD면 그대로
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AdminNewsTable() {
  const newsQuery = useNewsQuery();
  const updateNewsMutation = useUpdateNewsMutation();

  const [editing, setEditing] = useState<EditingState>(null);

  const news = useMemo(() => {
    if (!Array.isArray(newsQuery.data)) return [];
    return newsQuery.data;
  }, [newsQuery.data]);

  const startEdit = (item: any) => {
    setEditing({
      id: item.id,
      title: item.title ?? "",
      content: item.content ?? "",
      news_date: toDateInputValue(item.news_date),
    });
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const saveEdit = async () => {
    if (!editing) return;

    const title = editing.title.trim();
    const content = editing.content.trim();
    const news_date = editing.news_date.trim();

    if (!title || !content || !news_date) {
      alert("제목, 내용, 뉴스 게시일을 모두 입력해주세요.");
      return;
    }

    try {
      await updateNewsMutation.mutateAsync({
        id: editing.id,
        title,
        content,
        news_date,
      });

      setEditing(null);
    } catch (error) {
      console.error(error);
      alert("뉴스 수정에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-4">
      {newsQuery.isLoading ? (
        <div className="flex items-center justify-center w-full py-10">
          <LoadingSpinner />
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
                <th className="text-left py-3 px-2 font-normal">관리</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item: any) => {
                const editingRow =
                  editing && editing.id === item.id ? editing : null;
                const isEditing = !!editingRow;

                return (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 align-top hover:bg-white/5"
                  >
                    {/* 제목 */}
                    <td className="py-3 px-2 text-left min-w-[220px]">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingRow.title}
                          onChange={(e) =>
                            setEditing((prev) =>
                              prev ? { ...prev, title: e.target.value } : prev,
                            )
                          }
                          className="w-full h-9 rounded-sm border border-white/20 bg-black/30 px-2 text-white"
                        />
                      ) : (
                        <span className="whitespace-nowrap">
                          {item.title || "-"}
                        </span>
                      )}
                    </td>

                    {/* 내용 */}
                    <td className="py-3 px-2 min-w-[320px]">
                      {isEditing ? (
                        <textarea
                          rows={4}
                          value={editingRow.content}
                          onChange={(e) =>
                            setEditing((prev) =>
                              prev
                                ? { ...prev, content: e.target.value }
                                : prev,
                            )
                          }
                          className="w-full rounded-sm border border-white/20 bg-black/30 p-2 text-white resize-y"
                        />
                      ) : (
                        <p className="whitespace-pre-wrap break-words leading-6 text-slate-100 text-left">
                          {item.content || "-"}
                        </p>
                      )}
                    </td>
                    {/* 뉴스 게시일 */}
                    <td className="py-3 px-2 whitespace-nowrap text-slate-200 text-left min-w-[150px]">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editingRow.news_date}
                          onChange={(e) =>
                            setEditing((prev) =>
                              prev
                                ? { ...prev, news_date: e.target.value }
                                : prev,
                            )
                          }
                          className="h-9 rounded-sm border border-white/20 bg-black/30 px-2 text-white"
                        />
                      ) : (
                        formatDateTime(item.news_date, { withTime: false })
                      )}
                    </td>

                    {/* 생성일시 */}
                    <td className="py-3 px-2 whitespace-nowrap text-slate-200 text-left min-w-[170px]">
                      {formatDateTime(item.created_at)}
                    </td>

                    {/* 관리 버튼 */}
                    <td className="py-3 px-2 text-left whitespace-nowrap min-w-[150px]">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={saveEdit}
                            disabled={updateNewsMutation.isPending}
                            className="h-9 px-3 rounded-sm bg-[#0077ff] text-white disabled:opacity-60"
                          >
                            {updateNewsMutation.isPending
                              ? "저장 중..."
                              : "저장"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={updateNewsMutation.isPending}
                            className="h-9 px-3 rounded-sm border border-white/20 text-white"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="h-9 px-3 rounded-sm border border-white/20 text-white hover:bg-white/5"
                        >
                          수정
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
