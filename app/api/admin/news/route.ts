import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSupabaseServerClient } from "@/utils/supabase-server";

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, title, content, news_date } = body;

  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("news")
    .update({ title, content, news_date })
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // 업데이트 성공하면 즉시 캐시 무효화
  revalidateTag("news", "max");

  return NextResponse.json(data);
}
