import { TypedSupabaseClient } from "@/utils/supabase";

export type DeleteClientLogoParams = {
  id: number;
  imagePath: string; // 예: "logos/1700000000000-samsung.webp"
};

export async function deleteClientLogo(
  client: TypedSupabaseClient,
  { id, imagePath }: DeleteClientLogoParams,
) {
  // 1) Storage 파일 삭제 (먼저)
  // 파일이 이미 없을 수도 있으니 에러 처리 주의
  const { error: storageError } = await client.storage
    .from("client-logos")
    .remove([imagePath]);

  if (storageError) {
    throw new Error(`이미지 삭제 실패: ${storageError.message}`);
  }

  // 2) DB row 삭제
  const { error: dbError } = await client
    .from("client_logos")
    .delete()
    .eq("id", id);

  if (dbError) {
    throw new Error(`로고 데이터 삭제 실패: ${dbError.message}`);
  }

  return { ok: true };
}
