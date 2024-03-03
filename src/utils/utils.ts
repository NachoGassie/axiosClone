import { bodyActionssArr } from "../constants";
import { AxiosHeaderRes, ReqActions, ReqUpdateActions, UserRequest } from "../types";

interface RequestedFromRes{
  url: string;
  timeout: number;
  status: number;
  statusText: string;
  stringedData: string;
}

export function getFullUrl( initUrl: string, queries?: {}, params?: {}){
  const queriesUrl = getQueriesUrl(queries);
  return `${initUrl}${queriesUrl}`
}

function getQueriesUrl(queries?: {}): string{
  if (!queries) return '';

  const queriesUrl = new URLSearchParams(queries).toString(); 
  return `?${queriesUrl}`;
}

export const getRequestObj = (
  { url, timeout, status, statusText, stringedData }: RequestedFromRes 
): UserRequest => ({
  responseUrl: url, 
  status,
  statusText, 
  timeout,
  response: stringedData, 
  responseText: stringedData
});

export const getHeaders = (headers: Headers): AxiosHeaderRes => ({
  'content-length': headers.get('Content-Length'),
  'content-type': headers.get('Content-Type'),
  'date': headers.get('Date'),
});

export const isBody = (method: ReqActions): method is ReqUpdateActions => 
  bodyActionssArr.includes(method.action);
