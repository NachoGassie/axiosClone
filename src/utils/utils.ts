import { Params } from "../types";

export function getQueriesUrl(queries?: {}): string{
  if (queries) {
    const queriesUrl = new URLSearchParams(queries).toString(); 
    return `?${queriesUrl}`;
  }
  return '';
}

export function getParamsUrl(params?: {}): string{
  if (params) {
    const entries = Object.entries(params);

    let url = '';
    for (const entry of entries) {
      url += `/${entry[0]}/${entry[1]}`;
    }
    return url;
  }

  return '';
}