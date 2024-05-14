import { AxiosErrorResponse, Config } from "../types";

export default class AxiosErrorClone extends Error{
  response: AxiosErrorResponse | Error;
  request: Request;
  config: Config;
  
  constructor(
    message: string, response: AxiosErrorResponse | Error, request: Request, config: Config
  ){
    super(message);
    Error.call(this);

    this.response = response;
    this.request = request;
    this.name = this.constructor.name;
    this.config = config;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error()).stack;
    }
    
    Object.setPrototypeOf(this, AxiosErrorClone.prototype);
  }  
}