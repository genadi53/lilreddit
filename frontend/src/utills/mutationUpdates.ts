import { Cache } from "@urql/exchange-graphcache";
import gql from "graphql-tag";
import {
  CurrentUserDocument,
  CurrentUserQuery,
  DeletePostMutationVariables,
  LoginMutation,
  LogoutMutation,
  RegisterMutation,
  VoteMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
export const loginUpdate = (_result: any, args, cache: Cache, info) => {
  betterUpdateQuery<LoginMutation, CurrentUserQuery>(
    cache,
    { query: CurrentUserDocument },
    _result,
    (result, query) => {
      if (result.login.errors) {
        return query;
      } else {
        return {
          getCurrentUser: result.login.user,
        };
      }
    }
  );
  invalidateAllPosts(cache);
};

export const registerUpdate = (_result: any, args, cache: Cache, info) => {
  betterUpdateQuery<RegisterMutation, CurrentUserQuery>(
    cache,
    { query: CurrentUserDocument },
    _result,
    (result, query) => {
      if (result.register.errors) {
        return query;
      } else {
        return {
          getCurrentUser: result.register.user,
        };
      }
    }
  );
};

export const logoutUpdate = (_result: any, args, cache: Cache, info) => {
  betterUpdateQuery<LogoutMutation, CurrentUserQuery>(
    cache,
    { query: CurrentUserDocument },
    _result,
    () => ({ getCurrentUser: null })
  );
};

export const createPostUpdate = (_result: any, args, cache: Cache, info) => {
  invalidateAllPosts(cache);
};

export const voteUpdate = (_result: any, args, cache: Cache, info) => {
  const { postId, value } = args as VoteMutationVariables;
  const data = cache.readFragment(
    gql`
      fragment _ on Post {
        id
        points
        voteStatus
      }
    `,
    { id: postId } as any
  );
  // console.log(data);
  if (data) {
    if (data.voteStatus === value) return;
    const newPoints =
      (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
    cache.writeFragment(
      gql`
        fragment _ on Post {
          id
          points
          voteStatus
        }
      `,
      { id: postId, points: newPoints, voteStatus: value } as any
    );
  }
};

export const deletePostUpdate = (_result: any, args, cache: Cache, info) => {
  cache.invalidate({
    __typename: "Post",
    id: (args as DeletePostMutationVariables).id,
  });
};

export const invalidateAllPosts = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
  // console.log(allFields);
  const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
  // console.log(fieldInfos);
  fieldInfos.forEach((info) => {
    cache.invalidate("Query", "posts", info.arguments || {});
  });
};
