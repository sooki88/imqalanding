import { TypedSupabaseClient } from "@/utils/supabase";

export function getNews(client: TypedSupabaseClient) {
  return client
    .from("news")
    .select(`id, created_at, title, news_date, content`)
    .order("created_at", { ascending: false })
    .throwOnError();
}
