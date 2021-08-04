import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { loginUpdate, logoutUpdate, registerUpdate } from "./mutationUpdates";

export const CreateUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: loginUpdate,
          register: registerUpdate,
          logout: logoutUpdate, //2555624
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
