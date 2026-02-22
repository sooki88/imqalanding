import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { signOut } from "@/queries/sign-out";

function useSignOutMutation() {
  const client = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => signOut(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-session"] });
    },
  });
}

export default useSignOutMutation;
