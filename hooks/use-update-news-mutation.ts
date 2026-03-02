import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNewsAction, UpdateNewsParams } from "@/app/actions/news";

function useUpdateNewsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateNewsParams) => updateNewsAction(params),
    onSuccess: async (updatedRow) => {
      // 즉시 UI 반영
      queryClient.setQueryData(["news"], (old: any) =>
        Array.isArray(old)
          ? old.map((n) => (n.id === updatedRow.id ? updatedRow : n))
          : old,
      );

      // 목록을 서버에서 다시 확정
      await queryClient.refetchQueries({ queryKey: ["news"], type: "all" });
    },
  });
}

export default useUpdateNewsMutation;
