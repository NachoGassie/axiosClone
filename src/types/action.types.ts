import { AcceptedBody } from "./types";
import { DELETE, POST, PUT, GET } from "../constants";

export type ReqUpdateActions = 
  | {action: typeof POST, body: AcceptedBody} 
  | {action: typeof PUT, body: AcceptedBody} 

export type ReqActions = 
  | {action: typeof POST, body: AcceptedBody} 
  | {action: typeof PUT, body: AcceptedBody} 
  | {action: typeof GET} 
  | {action: typeof DELETE};