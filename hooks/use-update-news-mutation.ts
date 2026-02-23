import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { updateNews, UpdateNewsParams } from "@/queries/update-news";

function useUpdateNewsMutation() {
  const client = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateNewsParams) => updateNews(client, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
}

export default useUpdateNewsMutation;
