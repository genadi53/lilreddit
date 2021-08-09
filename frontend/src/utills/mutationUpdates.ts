import { Cache } from "@urql/exchange-graphcache";
import gql from "graphql-tag";
import {
  CurrentUserDocument,
  CurrentUserQuery,
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
  const allFields = cache.inspectFields("Query");
  // console.log(allFields);
  const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
  console.log(fieldInfos);
  fieldInfos.forEach((info) => {
    cache.invalidate("Query", "posts", info.arguments || {});
  });
};

export const voteUpdate = (_result: any, args, cache: Cache, info) => {
  const { postId, value } = args as VoteMutationVariables;
  const data = cache.readFragment(
    gql`
      fragment _ on Post {
        id
        points
      }
    `,
    { id: postId } as any
  );
  // console.log(data);
  if (data) {
    const newPoints = (data.points as number) + value;
    cache.writeFragment(
      gql`
        fragment _ on Post {
          id
          points
        }
      `,
      { id: postId, points: newPoints } as any
    );
  }
};
