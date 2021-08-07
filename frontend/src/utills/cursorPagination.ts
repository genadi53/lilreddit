import {} from "@urql/core";
import { Resolver } from "@urql/exchange-graphcache";
import { stringifyVariables } from "urql";

export type MergeMode = "before" | "after";

export interface PaginationParams {
  offsetArgument?: string;
  limitArgument?: string;
  mergeMode?: MergeMode;
}

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    //console.log(fieldArgs);
    //console.log(entityKey, fieldName);

    const allFields = cache.inspectFields(entityKey);
    // console.log(allFields);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    //console.log(fieldKey);
    const isItInTheCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );
    //console.log(isItInTheCache);
    const results: string[] = [];
    info.partial = !isItInTheCache;
    // console.log(info.partial);
    let hasMore = true;
    fieldInfos.forEach((fieldInfo) => {
      // cache.resolveFieldByKey
      const key = cache.resolve(entityKey, fieldInfo.fieldKey) as string;
      const data = cache.resolve(key, "posts") as string[];
      const _hasMore = cache.resolve(key, "hasMore");
      if (!_hasMore) hasMore = _hasMore as boolean;
      // console.log(key);
      // console.log(hasMore, data);
      results.push(...data);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};
