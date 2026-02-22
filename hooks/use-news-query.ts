import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { getNews } from "@/queries/get-news";

function useNewsQuery() {
  const client = useSupabase();
  const queryKey = ["news"];

  const queryFn = async () => {
    return getNews(client).then((result) => result.data);
  };

  return useQuery({ queryKey, queryFn });
}

export default useNewsQuery;
