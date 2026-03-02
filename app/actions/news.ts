"use server";

import { updateTag } from "next/cache";
import { getSupabaseServerClient } from "@/utils/supabase-server";

export type UpdateNewsParams = {
  id: number;
  title: string;
  content: string;
  news_date: string;
};

export async function updateNewsAction(params: UpdateNewsParams) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("news")
    .update({
      title: params.title,
      content: params.content,
      news_date: params.news_date,
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  // next.js 16 즉시 캐시 갱신 보장
  updateTag("news");

  return data;
}
