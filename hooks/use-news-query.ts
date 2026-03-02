// Supabase 직접 호출 대신 "내 api 호출"로 변경
import { useQuery } from "@tanstack/react-query";

function useNewsQuery() {
  return useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
    //staleTime: 1000 * 30, // 클라이언트 캐시
  });
}

export default useNewsQuery;
