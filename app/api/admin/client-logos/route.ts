import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSupabaseServerClient } from "@/utils/supabase-server";

export async function POST(req: Request) {
  // 생성: 파일 업로드 + DB insert
  const form = await req.formData();

  const file = form.get("file");
  const alt = String(form.get("alt") ?? "");
  const nameRaw = form.get("name");
  const name = nameRaw === null ? null : String(nameRaw);
  const sortOrder = Number(form.get("sortOrder"));

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }
  if (!alt.trim()) {
    return NextResponse.json({ error: "alt is required" }, { status: 400 });
  }
  if (!Number.isFinite(sortOrder)) {
    return NextResponse.json(
      { error: "sortOrder is required" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseServerClient();

  // 파일명 sanitize
  const safeName = file.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
  const ext = safeName.split(".").pop() || "png";
  const base = safeName.replace(new RegExp(`\\.${ext}$`), "") || "logo";
  const fileName = `${Date.now()}-${base}.${ext}`;
  const imagePath = `logos/${fileName}`;

  // 1) Storage 업로드
  const { error: uploadError } = await supabase.storage
    .from("client-logos")
    .upload(imagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // 2) DB insert (실패 시 업로드 롤백)
  const { data: inserted, error: insertError } = await supabase
    .from("client_logos")
    .insert([
      {
        name: name?.trim() ? name.trim() : null,
        alt: alt.trim(),
        image_path: imagePath,
        sort_order: sortOrder,
      },
    ])
    .select()
    .single();

  if (insertError) {
    await supabase.storage.from("client-logos").remove([imagePath]);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // 캐시 즉시 무효화
  revalidateTag("client-logos", "max");

  return NextResponse.json({ ok: true, logo: inserted });
}

export async function DELETE(req: Request) {
  // 삭제: Storage 삭제 + DB row 삭제
  const body = await req.json().catch(() => ({}));
  const id = Number(body?.id);
  const imagePath = String(body?.imagePath ?? "");

  if (!Number.isFinite(id) || !imagePath) {
    return NextResponse.json(
      { error: "id and imagePath are required" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseServerClient();

  // 1) Storage 파일 삭제
  const { error: storageError } = await supabase.storage
    .from("client-logos")
    .remove([imagePath]);

  if (storageError) {
    return NextResponse.json(
      { error: `이미지 삭제 실패: ${storageError.message}` },
      { status: 500 },
    );
  }

  // 2) DB row 삭제
  const { error: dbError } = await supabase
    .from("client_logos")
    .delete()
    .eq("id", id);

  if (dbError) {
    return NextResponse.json(
      { error: `로고 데이터 삭제 실패: ${dbError.message}` },
      { status: 500 },
    );
  }

  // 캐시 즉시 무효화
  revalidateTag("client-logos", "max");

  return NextResponse.json({ ok: true });
}
