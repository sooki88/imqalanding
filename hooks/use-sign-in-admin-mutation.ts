import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { signInAdmin, SignInAdminParams } from "@/queries/sign-in-admin";

function useSignInAdminMutation() {
  const client = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SignInAdminParams) => signInAdmin(client, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-session"] });
    },
  });
}

export default useSignInAdminMutation;
