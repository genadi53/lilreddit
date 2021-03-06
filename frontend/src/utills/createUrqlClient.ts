import { cacheExchange } from "@urql/exchange-graphcache";
import Router from "next/router";
import { dedupExchange, Exchange, fetchExchange } from "urql";
import { pipe, tap } from "wonka";
import { cursorPagination } from "./cursorPagination";
import { isServer } from "./isServer";
import {
  createPostUpdate,
  deletePostUpdate,
  loginUpdate,
  logoutUpdate,
  registerUpdate,
  voteUpdate,
} from "./mutationUpdates";

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

export const CreateUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    cookie = ctx?.req?.headers.cookie;
  }
  return {
    url: process.env.NEXT_PUBLIC_API_URL as string,
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            login: loginUpdate,
            register: registerUpdate,
            logout: logoutUpdate,
            createPost: createPostUpdate,
            vote: voteUpdate,
            deletePost: deletePostUpdate,
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
