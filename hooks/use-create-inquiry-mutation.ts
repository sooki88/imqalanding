import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormState } from "@/components/ContactForm";
import { createInquiry } from "@/queries/create-inquiry";
import useSupabase from "./useSupabase";

function userCreateInquiryMutation() {
  const client = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newInquiry: FormState) => createInquiry(client, newInquiry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}

export default userCreateInquiryMutation;
