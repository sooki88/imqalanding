import { TypedSupabaseClient } from "@/utils/supabase";

export type SignInAdminParams = {
  email: string;
  password: string;
};

export async function signInAdmin(
  client: TypedSupabaseClient,
  { email, password }: SignInAdminParams,
) {
  // 1) 로그인
  const { data: signInData, error: signInError } =
    await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

  if (signInError) {
    throw new Error("이메일 또는 비밀번호를 확인해주세요.");
  }

  const user = signInData.user;
  if (!user) {
    throw new Error("로그인에 실패했습니다.");
  }

  // 2) 관리자 권한 확인 (admin_users 테이블)
  const { data: adminRow, error: adminError } = await client
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    // RLS/권한 문제 포함
    await client.auth.signOut();
    throw new Error("관리자 권한 확인 중 오류가 발생했습니다.");
  }

  if (!adminRow) {
    await client.auth.signOut();
    throw new Error("등록된 관리자 계정만 접근할 수 있습니다.");
  }

  return {
    user,
    isAdmin: true,
  };
}
