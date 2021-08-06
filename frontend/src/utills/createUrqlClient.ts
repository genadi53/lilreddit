import { cacheExchange } from "@urql/exchange-graphcache";
import Router from "next/router";
import { dedupExchange, Exchange, fetchExchange } from "urql";
import { pipe, tap } from "wonka";
import { loginUpdate, logoutUpdate, registerUpdate } from "./mutationUpdates";

export const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error) {
          if (error.message.includes("not authenticated")) {
            Router.replace("/login");
          }
        }
      })
    );
  };

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
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
