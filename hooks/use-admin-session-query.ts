import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { getAdminSession } from "@/queries/get-admin-session";

function useAdminSessionQuery() {
  const client = useSupabase();

  return useQuery({
    queryKey: ["admin-session"],
    queryFn: () => getAdminSession(client),
    staleTime: 1000 * 30, // 30초
  });
}

export default useAdminSessionQuery;
