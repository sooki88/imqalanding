import { TypedSupabaseClient } from "@/utils/supabase";

export type UploadClientLogoImageParams = {
  file: File;
};

export type UploadClientLogoImageResult = {
  imagePath: string; // DB에 저장할 값 (예: logos/1700000000000-logo.webp)
  publicUrl: string; // 미리보기용
};

function sanitizeFileName(fileName: string) {
  // 한글/공백/특수문자 최소화
  return fileName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "");
}

export async function uploadClientLogoImage(
  client: TypedSupabaseClient,
  { file }: UploadClientLogoImageParams,
): Promise<UploadClientLogoImageResult> {
  const safeName = sanitizeFileName(file.name);
  const ext = safeName.split(".").pop() || "png";
  const base = safeName.replace(new RegExp(`\\.${ext}$`), "") || "logo";

  // 파일명 충돌 방지
  const fileName = `${Date.now()}-${base}.${ext}`;
  const imagePath = `logos/${fileName}`;

  const { error: uploadError } = await client.storage
    .from("client-logos")
    .upload(imagePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = client.storage
    .from("client-logos")
    .getPublicUrl(imagePath);

  return {
    imagePath,
    publicUrl: publicUrlData.publicUrl,
  };
}
