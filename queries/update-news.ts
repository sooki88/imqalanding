// import { TypedSupabaseClient } from "@/utils/supabase";

// export type UpdateNewsParams = {
//   id: number;
//   title: string;
//   content: string;
//   news_date: string; // "2025-06-25" 형식
// };

// export async function updateNews(
//   client: TypedSupabaseClient,
//   { id, title, content, news_date }: UpdateNewsParams,
// ) {
//   const { data, error } = await client
//     .from("news")
//     .update({
//       title,
//       content,
//       news_date,
//     })
//     .eq("id", id)
//     .select()
//     .single();

//   if (error) throw new Error(error.message);
//   return data;
// }

import { TypedSupabaseClient } from "@/utils/supabase";

export type UpdateNewsParams = {
  id: number;
  title: string;
  content: string;
  news_date: string; // "2025-06-25" 형식
};

export async function updateNews(
  _client: any,
  { id, title, content, news_date }: UpdateNewsParams,
) {
  const res = await fetch("/api/admin/news", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, title, content, news_date }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update news");
  }

  return res.json();
}
