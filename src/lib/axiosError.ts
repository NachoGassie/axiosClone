import { AxiosErrorResponse, Config } from "../types";

export default class AxiosErrorClone extends Error{
  private response: AxiosErrorResponse;
  private request: Request;
  private config: Config;
  
  constructor(
    message: string, response: AxiosErrorResponse, request: Request, config: Config
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

  toJSON(){
    return {
      response: this.response,
      request: this.request,
      config: this.config,
      name: this.name,
      message: this.message,
      stack: this.stack,
    }
  }

  toString = () => {
    return `AxiosErrorClone: ${this.message}. Response: ${JSON.stringify(this.toJSON())}.`;
  }
}