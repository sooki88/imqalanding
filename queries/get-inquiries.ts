import { TypedSupabaseClient } from "@/utils/supabase";

export function getInquiries(client: TypedSupabaseClient) {
  return client
    .from("inquiries")
    .select(`id, route, company, email, name, tel, content, created_at`)
    .order("created_at", { ascending: false })
    .throwOnError();
}
