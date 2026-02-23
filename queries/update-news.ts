import { TypedSupabaseClient } from "@/utils/supabase";

export type UpdateNewsParams = {
  id: number;
  title: string;
  content: string;
  news_date: string; // "2025-06-25" 형식
};

export async function updateNews(
  client: TypedSupabaseClient,
  { id, title, content, news_date }: UpdateNewsParams,
) {
  const { data, error } = await client
    .from("news")
    .update({
      title,
      content,
      news_date,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
