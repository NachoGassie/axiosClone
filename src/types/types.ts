import { CorsMode } from "./dto.types";

export type jsonObj = Record<string, any>;

export type nullableString = string | null;
export type nullableBody = BodyInit | null;

export type stringKeyValue = { [key: string]: string }

export interface Create{
  baseURL: string;
  timeout?: number;
  headers?: HeadersInit;
}

export interface OptionalProps<T> extends OptionalReqValues<T>{
  queries?: jsonObj
  params?: jsonObj
  transformResponse?: TransformResponse<T>;
}

export interface OptionalReqValues<T>{
  headers?: HeadersInit; 
  timeout?: number;
  cache?: RequestCache; 
  credentials?: RequestCredentials;
  mode?: CorsMode;
}

export interface InstanceCall<T> extends OptionalProps<T>{
  url?: string;
}

export type TransformResponse<T> = (data: T) => unknown;