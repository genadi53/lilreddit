import { cacheExchange, QueryInput, Cache } from "@urql/exchange-graphcache";
import {
  CurrentUserDocument,
  CurrentUserQuery,
  LoginMutation,
  RegisterMutation,
} from "../generated/graphql";

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

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
