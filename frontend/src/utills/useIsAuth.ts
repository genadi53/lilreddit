import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCurrentUserQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const [{ data, fetching }] = useCurrentUserQuery();
  const router = useRouter();

  useEffect(() => {
    if (!fetching && !data?.getCurrentUser) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [fetching, data, router]);
};
