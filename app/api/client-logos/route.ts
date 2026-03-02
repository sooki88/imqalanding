import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getSupabaseServerClient } from "@/utils/supabase-server";

export const revalidate = 60;
export const dynamic = "force-static";

const getCachedClientLogos = unstable_cache(
  async () => {
    console.log("로고 힛 슈파베이스");
    const supabase = getSupabaseServerClient();

    // 1) DB에서 로고 목록 조회
    const { data, error } = await supabase
      .from("client_logos")
      .select("id, name, alt, image_path, sort_order, created_at")
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (error) throw new Error(error.message);

    const rows = data ?? [];

    // 2) public URL 만들기(서버에서도 가능)
    return rows.map((row: any) => {
      const { data: publicUrlData } = supabase.storage
        .from("client-logos")
        .getPublicUrl(row.image_path);

      return { ...row, src: publicUrlData.publicUrl };
    });
  },
  ["client-logos-list"],
  { tags: ["client-logos"] },
);

export async function GET() {
  try {
    const data = await getCachedClientLogos();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
