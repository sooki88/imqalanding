import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClientLogoAction } from "@/app/actions/client-logos";

export default function useDeleteClientLogoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; imagePath: string }) =>
      deleteClientLogoAction(params),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["client-logos"],
        type: "all",
      });
    },
  });
}
