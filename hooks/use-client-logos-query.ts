// import { useQuery } from "@tanstack/react-query";
// import useSupabase from "./useSupabase";
// import { getClientLogos } from "@/queries/get-client-logos";

// function useClientLogosQuery() {
//   const client = useSupabase();

//   return useQuery({
//     queryKey: ["client-logos"],
//     queryFn: () => getClientLogos(client),
//   });
// }

// export default useClientLogosQuery;

// Supabase 직접 호출 대신 "내 api 호출"로 변경
import { useQuery } from "@tanstack/react-query";

function useClientLogosQuery() {
  return useQuery({
    queryKey: ["client-logos"],
    queryFn: async () => {
      const res = await fetch("/api/client-logos");
      if (!res.ok) throw new Error("Failed to fetch client logos");
      return res.json();
    },
  });
}

export default useClientLogosQuery;
