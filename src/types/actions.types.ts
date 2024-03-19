import { DELETE, GET, HEAD, PATCH, POST, PUT } from "../constants/http.constants";

export type ReqUpdateActions = 
  | {action: typeof POST, body: BodyInit} 
  | {action: typeof PUT, body: BodyInit} 
  | {action: typeof PATCH, body: BodyInit} 

export type ReqActions = 
  | ReqUpdateActions
  | {action: typeof HEAD} 
  | {action: typeof GET} 
  | {action: typeof DELETE};

export type Methods = 
  | typeof HEAD 
  | typeof GET 
  | typeof POST 
  | typeof PUT 
  | typeof PATCH 
  | typeof DELETE;