import { ApolloClient, InMemoryCache } from "@apollo/client";
import { PaginatedPosts } from "../generated/graphql";
// import { isServer } from "./isServer";

export const apollo_client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: [],
            merge(
              existing: PaginatedPosts | undefined,
              incoming: PaginatedPosts
            ): PaginatedPosts {
              // console.log("exist ->");
              // console.log(existing);
              // console.log("inc ->");
              // console.log(incoming);
              return {
                ...incoming,
                posts: [...(existing?.posts || []), ...incoming.posts],
              };
            },
          },
        },
      },
    },
  }),
  credentials: "include",
  // headers: {
  //   cookie: (isServer() ? ctx.req?.headers.cookie : undefined) || "",
  // },
});
