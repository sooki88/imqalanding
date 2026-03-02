// 문의하기 생성하기
import { FormState } from "@/components/ContactForm";
import { TypedSupabaseClient } from "@/utils/supabase";

export async function createInquiry(
  client: TypedSupabaseClient,
  { route, company, email, name, tel, content }: FormState,
) {
  const { data, error } = await client.from("inquiries").insert([
    {
      created_at: new Date().toISOString(),
      route,
      company,
      email,
      name,
      tel,
      content,
    },
  ]);
  // .select() 관리자만
  // .single();

  if (error) throw new Error(error.message);
  console.log(data);

  return { ok: true };
}
