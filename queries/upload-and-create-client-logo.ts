import { TypedSupabaseClient } from "@/utils/supabase";
import {
  uploadClientLogoImage,
  UploadClientLogoImageResult,
} from "./upload-client-logo-image";
import { createClientLogo } from "./create-client-logo";

export type UploadAndCreateClientLogoParams = {
  file: File;
  name?: string | null;
  alt: string;
  sortOrder: number;
};

export type UploadAndCreateClientLogoResult = {
  logo: any;
  upload: UploadClientLogoImageResult;
};

export async function uploadAndCreateClientLogo(
  client: TypedSupabaseClient,
  { file, name, alt, sortOrder }: UploadAndCreateClientLogoParams,
): Promise<UploadAndCreateClientLogoResult> {
  const upload = await uploadClientLogoImage(client, { file });

  try {
    const logo = await createClientLogo(client, {
      name,
      alt,
      imagePath: upload.imagePath,
      sortOrder,
    });

    return { logo, upload };
  } catch (error) {
    // DB insert 실패 시 업로드된 파일 롤백
    await client.storage.from("client-logos").remove([upload.imagePath]);
    throw error;
  }
}
