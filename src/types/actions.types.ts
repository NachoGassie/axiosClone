import { DELETE, GET, HEAD, PATCH, POST, PUT } from "../constants/http.constants";
import { AcceptedBody } from "./types";

export type ReqUpdateActions = { body: AcceptedBody } & (
  | {action: typeof POST} 
  | {action: typeof PUT} 
  | {action: typeof PATCH} 
);

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