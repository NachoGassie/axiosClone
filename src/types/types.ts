export interface Create{
  baseURL: string;
  // timeout?: number;
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

export interface InstanceMethods<T> {
  url?: string;
  options?: OptionalProps<T>;
}

export type nullableString = string | null;
  
export type TransformResponse<T> = (data: T) => unknown;