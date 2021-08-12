import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCurrentUserQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const { data, loading } = useCurrentUserQuery();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !data?.getCurrentUser) {
      router.replace("/login?next=" + router.pathname);
    }
  }, [loading, data, router]);
};
