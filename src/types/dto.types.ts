import AxiosReq from "../lib/AxiosRequest";
import { Methods } from "./actions.types";
import { TransformResponse } from "./types";

export interface Config {
  headers: HeadersInit;
  method: Methods;
  timeout: number;
  transformResponse?: TransformResponse<any>;
  url: string;
}

// OK
export interface AxiosResponse<T>{
  headers: Headers;
  status: number;
  statusText: string;
  data: T;
  config: Config;
  request: AxiosReq;
}

// ERROR
export interface AxiosErrorResponse{
  data: any;
  headers: Headers;
  status: number;
  statusText: string;
  config: Config;
}

// REQUEST
export type CorsMode = 'cors' | 'no-cors' | 'same-origin' | 'navigate';

export interface AxiosDefReq {
  cache: RequestCache;
  credentials: RequestCredentials;
  headers: HeadersInit;
  method: Methods;
  mode: CorsMode;
}