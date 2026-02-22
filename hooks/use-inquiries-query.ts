import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { getInquiries } from "@/queries/get-inquiries";

function useInquiriesQuery() {
  const client = useSupabase();
  const queryKey = ["inquiries"];

  const queryFn = async () => {
    return getInquiries(client).then((result) => result.data);
  };

  return useQuery({ queryKey, queryFn });
}

export default useInquiriesQuery;
