import { TypedSupabaseClient } from "@/utils/supabase";

export async function getAdminSession(client: TypedSupabaseClient) {
  // 1) 세션 먼저 확인
  const {
    data: { session },
    error: sessionError,
  } = await client.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  // 로그인 안 된 상태 (정상)
  if (!session) {
    return {
      user: null,
      isAdmin: false,
    };
  }

  // 2) 세션 있으면 유저 확인
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    return {
      user: null,
      isAdmin: false,
    };
  }

  // 3) admin_users 테이블 확인
  const { data: adminRow, error: adminError } = await client
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    throw new Error("관리자 권한 확인 중 오류가 발생했습니다.");
  }

  return {
    user,
    isAdmin: !!adminRow,
  };
}
