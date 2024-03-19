import { AxiosDefaultRequest } from "../defaulltValues";
import { nullableBody } from "../types";

export default class AxiosReq extends Request{
  
  constructor(
    url: string, 
    method = AxiosDefaultRequest.method, 
    body: nullableBody = null,
    headers = AxiosDefaultRequest.headers,
    mode = AxiosDefaultRequest.mode,
    cache = AxiosDefaultRequest.cache,
    credentials = AxiosDefaultRequest.credentials,
  ){
    super(url, {
      method,
      body,
      headers,
      mode,
      cache,
      credentials,
    });
  }
}