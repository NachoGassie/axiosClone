import { jsonObj } from "../types";

export function getFullUrl(initUrl: string, queries?: jsonObj, params?: jsonObj){
  const parsedParams = params ? getParamsUrl(params) : '';
  const parsedQueries = queries ? getQueriesUrl(queries) : '';

  return `${initUrl}${parsedParams}${parsedQueries}`;
}

function getParamsUrl(params: jsonObj){
  const paramsArr = Object.entries(params).map(([key, value]) => `/${key}/${value}`);
  return paramsArr.join('');
}

function getQueriesUrl(queries: jsonObj): string{
  const queriesUrl = new URLSearchParams(queries).toString(); 
  return `?${queriesUrl}`;
}