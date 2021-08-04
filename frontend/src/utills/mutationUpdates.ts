import { Cache } from "@urql/exchange-graphcache";
import {
  CurrentUserDocument,
  CurrentUserQuery,
  LoginMutation,
  LogoutMutation,
  RegisterMutation,
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
