import { Methods } from "./actions.types";
import { TransformResponse, nullableString, } from "./types";

export interface AxiosHeaderRes {
  'content-length': nullableString;
  'content-type': nullableString;
  date: nullableString;
}

export interface Config {
  headers: HeadersInit;
  method: Methods;
  timeout: number;
  transformResponse?: TransformResponse<any>;
  url: string;
}

// OK
export interface AxiosResponse<T>{
  headers: AxiosHeaderRes;
  status: number;
  statusText: string;
  data: T;
  config: Config;
  request: UserRequest;
}

// ERROR
export interface AxiosErrorResponse{
  data: any;
  headers: AxiosHeaderRes;
  status: number;
  statusText: string;
  config: Config;
}

// REQUEST
export interface UserRequest{
  response: string;
  responseText: string;
  responseUrl: string;
  status: number;
  statusText: string;
  timeout: number;
}