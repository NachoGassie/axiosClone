import { Methods, TransformResponse } from "../types";

export class AxiosConfig<T>{
  url: string;
  headers: Headers | HeadersInit;
  method: Methods;
  timeout: number;
  transformResponse?: TransformResponse<T>;

  constructor(
    url: string, 
    headers: Headers | HeadersInit, 
    method: Methods, 
    timeout: number, 
    transformResponse?: TransformResponse<T>
  ){
    this.url = url;
    this.headers = headers;
    this.method = method;
    this.timeout = timeout;
    this.transformResponse = transformResponse;
  }
}