import { TypedSupabaseClient } from "@/utils/supabase";

export type ClientLogoRow = {
  id: number;
  name: string | null;
  alt: string;
  image_path: string;
  sort_order: number;
  created_at: string;
};

export type ClientLogoItem = ClientLogoRow & {
  src: string; // next/image에 넣을 URL
};

export async function getClientLogos(
  client: TypedSupabaseClient,
): Promise<ClientLogoItem[]> {
  const { data, error } = await client
    .from("client_logos")
    .select("id, name, alt, image_path, sort_order, created_at")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as ClientLogoRow[];

  return rows.map((row) => {
    const { data: publicUrlData } = client.storage
      .from("client-logos") // 버킷명
      .getPublicUrl(row.image_path);

    return {
      ...row,
      src: publicUrlData.publicUrl,
    };
  });
}
