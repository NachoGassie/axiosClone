export interface Create{
  baseURL: string;
  // timeout?: number;
  headers?: HeadersInit;
}

export interface OptionalProps<T>{
  queries?: {};
  params?: {};
  headers?: HeadersInit; 
  responseFn?: ResponseFn<T>;
}
  
export type AcceptedBody = BodyInit; 

export interface AxiosResponse<T>{
  status: number;
  statusText: string;
  data: T
}

export interface InstanceMethods<T> {
  url?: string;
  options?: OptionalProps<T>;
}

export interface Params {
  key?: string; 
  value: unknown;
}
  
type ResponseFn<T> = (data: T) => unknown;