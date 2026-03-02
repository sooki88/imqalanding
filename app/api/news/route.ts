import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getSupabaseServerClient } from "@/utils/supabase-server";

export const revalidate = 86400; // 24시간(60 * 60 * 24)
export const dynamic = "force-static";

const getCachedNews = unstable_cache(
  async () => {
    console.log("[api/news] HIT SUPABASE", new Date().toISOString()); // 테스트용
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("news")
      .select("id, created_at, title, news_date, content")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },
  ["news-list"], // 캐시 키
  { tags: ["news"] }, // 이 태그를 나중에 /admin에서 news 데이터 수정하면 revalidateTag로 깨버림
);

export async function GET() {
  try {
    const data = await getCachedNews();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
