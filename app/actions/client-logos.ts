"use server";

import { updateTag } from "next/cache";
import { getSupabaseServerClient } from "@/utils/supabase-server";

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

export async function createClientLogoAction(form: FormData) {
  const file = form.get("file");
  const alt = String(form.get("alt") ?? "");
  const nameRaw = form.get("name");
  const name = nameRaw === null ? null : String(nameRaw);
  const sortOrder = Number(form.get("sortOrder"));

  if (!(file instanceof File)) throw new Error("file is required");
  if (!alt.trim()) throw new Error("alt is required");
  if (!Number.isFinite(sortOrder)) throw new Error("sortOrder is required");

  const supabase = getSupabaseServerClient();

  const safeName = sanitizeFileName(file.name);
  const ext = safeName.split(".").pop() || "png";
  const base = safeName.replace(new RegExp(`\\.${ext}$`), "") || "logo";
  const fileName = `${Date.now()}-${base}.${ext}`;
  const imagePath = `logos/${fileName}`;

  // 1) storage 업로드
  const { error: uploadError } = await supabase.storage
    .from("client-logos")
    .upload(imagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) throw new Error(uploadError.message);

  // 2) db insert (실패 시 롤백)
  const { data, error: insertError } = await supabase
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
    throw new Error(insertError.message);
  }

  // next.js 16 즉시 반영 보장
  updateTag("client-logos");

  return data;
}

export async function deleteClientLogoAction(params: {
  id: number;
  imagePath: string;
}) {
  const { id, imagePath } = params;
  if (!id || !imagePath) throw new Error("id and imagePath are required");

  const supabase = getSupabaseServerClient();

  const { error: storageError } = await supabase.storage
    .from("client-logos")
    .remove([imagePath]);

  if (storageError)
    throw new Error(`이미지 삭제 실패: ${storageError.message}`);

  const { error: dbError } = await supabase
    .from("client_logos")
    .delete()
    .eq("id", id);

  if (dbError) throw new Error(`로고 데이터 삭제 실패: ${dbError.message}`);

  // 즉시 반영 보장
  updateTag("client-logos");

  return { ok: true };
}
