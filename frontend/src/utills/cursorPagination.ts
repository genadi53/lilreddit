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
    const isItInTheCache = cache.resolve(entityKey, fieldKey);
    //console.log(isItInTheCache);
    const results: string[] = [];
    info.partial = !isItInTheCache;
    console.log(info.partial);
    fieldInfos.forEach((fieldInfo) => {
      const data = cache.resolve(entityKey, fieldInfo.fieldKey) as string[];
      // cache.resolveFieldByKey
      //console.log(data);
      results.push(...data);
    });

    return results;
  };
};
