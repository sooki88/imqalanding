import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import {
  deleteClientLogo,
  DeleteClientLogoParams,
} from "@/queries/delete-client-logo";

function useDeleteClientLogoMutation() {
  const client = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteClientLogoParams) =>
      deleteClientLogo(client, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-logos"] });
    },
  });
}

export default useDeleteClientLogoMutation;
