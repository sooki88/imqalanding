import { TypedSupabaseClient } from "@/utils/supabase";

export type CreateClientLogoParams = {
  name?: string | null;
  alt: string;
  imagePath: string; // Storage 경로
  sortOrder: number;
};

export async function createClientLogo(
  client: TypedSupabaseClient,
  { name, alt, imagePath, sortOrder }: CreateClientLogoParams,
) {
  const { data, error } = await client
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

  if (error) throw new Error(error.message);
  return data;
}
