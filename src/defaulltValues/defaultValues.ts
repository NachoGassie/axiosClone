import { GET } from "../constants";
import { AxiosDefReq } from "../types";

export const defaultTimeOut = -1;

export const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  'Accept': 'application/json, text/plain, */*'
};

export const AxiosDefaultRequest: AxiosDefReq = {
  method: GET,
  cache: 'default',
  credentials: 'same-origin',
  headers: defaultHeaders,
  mode: 'cors',
}