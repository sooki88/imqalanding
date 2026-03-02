// 서버 전용 클라이언트 파일 (홈에 있는 Logos와 News의 호출을 최소화 하기 위함)
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/utils/database.types";

export function getSupabaseServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // 서버에서만 사용
    {
      auth: { persistSession: false },
    },
  );
}
