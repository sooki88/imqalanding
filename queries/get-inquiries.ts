// 문의하기 데이터 가져오기
import { TypedSupabaseClient } from "@/utils/supabase";

export function getInquiries(client: TypedSupabaseClient) {
  return client
    .from("inquiries")
    .select(`id, route, company, email, name, tel, content, created_at`)
    .order("created_at", { ascending: false })
    .throwOnError();
}
