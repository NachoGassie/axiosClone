export interface Create{
  baseURL: string;
  timeout?: number;
  headers?: HeadersInit;
}

export interface OptionalProps<T>{
  queries?: {};
  params?: {};
  headers?: HeadersInit; 
  timeout?: number;
  transformResponse?: TransformResponse<T>;
}
  
export type AcceptedBody = BodyInit; 

export interface InstanceCall<T> extends OptionalProps<T>{
  url?: string;
}

export type nullableString = string | null;
export type nullableBody = BodyInit | null;
  
export type TransformResponse<T> = (data: T) => unknown;