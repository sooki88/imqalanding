import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClientLogoAction } from "@/app/actions/client-logos";

export default function useUploadClientLogoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      file: File;
      alt: string;
      name?: string | null;
      sortOrder: number;
    }) => {
      const form = new FormData();
      form.append("file", params.file);
      form.append("alt", params.alt);
      form.append("sortOrder", String(params.sortOrder));
      if (params.name !== undefined && params.name !== null)
        form.append("name", params.name);
      return createClientLogoAction(form);
    },
    onSuccess: async () => {
      // 서버 캐시는 action에서 updateTag로 즉시 갱신됨
      await queryClient.refetchQueries({
        queryKey: ["client-logos"],
        type: "all",
      });
    },
  });
}
