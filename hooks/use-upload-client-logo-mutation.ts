import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import {
  uploadAndCreateClientLogo,
  UploadAndCreateClientLogoParams,
} from "@/queries/upload-and-create-client-logo";

function useUploadClientLogoMutation() {
  const client = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UploadAndCreateClientLogoParams) =>
      uploadAndCreateClientLogo(client, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-logos"] });
    },
  });
}

export default useUploadClientLogoMutation;
