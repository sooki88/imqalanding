import { TypedSupabaseClient } from "@/utils/supabase";

export async function signOut(client: TypedSupabaseClient) {
  const { error } = await client.auth.signOut();
  if (error) throw new Error(error.message);
  return true;
}
