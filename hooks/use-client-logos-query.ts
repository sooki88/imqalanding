import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { getClientLogos } from "@/queries/get-client-logos";

function useClientLogosQuery() {
  const client = useSupabase();

  return useQuery({
    queryKey: ["client-logos"],
    queryFn: () => getClientLogos(client),
  });
}

export default useClientLogosQuery;
