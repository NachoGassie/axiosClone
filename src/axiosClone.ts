import { ContentType, DELETE, GET, PATCH, POST, PUT } from "./constants";
import { defaultTimeOut } from "./defaulltValues";
import { AxiosHeaders, AxiosError, AxiosRequest } from './lib'

import {
  AcceptedBody,
  AxiosResponse, Create, OptionalProps, OptionalReqValues, ReqActions
} from "./types";
import { getBody, getFullUrl, getHeaders, isBody } from "./utils";

function create(defOptions: Create){
  const { baseURL, headers: instanceHeaders, timeout } = defOptions;

  const makeRequest = <T>(url: string, method: ReqActions, call?: OptionalProps<T>) => {
    const { headers: callHeaders, ...options } = call ?? {};
    const fullUrl = `${baseURL}${url}`;

    let headers = undefined;

    if (instanceHeaders && !callHeaders) headers = new Headers(instanceHeaders);
    if (callHeaders && !instanceHeaders) headers = new Headers(callHeaders);
    
    if (instanceHeaders && callHeaders) {
      headers = new Headers({ ...instanceHeaders, ...callHeaders });
    }

    return requestMaker(fullUrl, method, {
      headers, timeout, ...options
    });
  }

  const get = <T>(
    url: string, instance?: OptionalProps<T>
  ) => makeRequest(url, { action: GET }, instance);
  
  const post = <T>(
    url: string, body: AcceptedBody, instance?: OptionalProps<T>
  ) => makeRequest(url, { action: POST, body }, instance);

  const put = <T>(
    url: string, body: AcceptedBody, instance?: OptionalProps<T>
  ) => makeRequest(url, { action: PUT, body }, instance);

  const patch = <T>(
    url: string, body: AcceptedBody, instance?: OptionalProps<T>
  ) => makeRequest(url, { action: PATCH, body }, instance);

  const remove = <T>(
    url: string, instance?: OptionalProps<T>
  ) => makeRequest(url, { action: DELETE }, instance);

  return { get, post, put, patch, remove }
}

async function get<T>(url: string, options?: OptionalProps<T>){
  const method: ReqActions = { action: GET };
  return await requestMaker(url, method, options);
}

async function post<T>(url: string, body: AcceptedBody, options?: OptionalProps<T>){
  const method: ReqActions = { action: POST, body }
  return await requestMaker<T>(url, method, options);
}

async function put<T>(url: string, body: AcceptedBody, options?: OptionalProps<T>){
  const method: ReqActions = { action: PUT, body }
  return await requestMaker<T>(url, method, options);
}
async function patch<T>(url: string, body: AcceptedBody, options?: OptionalProps<T>){
  const method: ReqActions = { action: PATCH, body }
  return await requestMaker<T>(url, method, options);
}

async function remove<T>(url: string, options?: OptionalProps<T>){
  const method: ReqActions = { action: DELETE };
  return await requestMaker(url, method, options);
}

async function requestMaker<T>(
  initUrl: string, method: ReqActions, options?: OptionalProps<T>
): Promise<AxiosResponse<T>>{
  const { 
    queries, params, transformResponse, ...restOptions
  } = options ?? {};

  const url = getFullUrl(initUrl, queries, params);

  const {
    res, req: request, headers: reqHeaders, action, timeout,
  } = await handleRequest<T>(url, method, restOptions);

  const resHeaders = getHeaders(res.headers);

  let data = await res.json();
  const { status, statusText } = res;

  const config = { url, headers: reqHeaders, method: action, timeout, transformResponse }

  if (!res.ok) {
    const response = { config, data, headers: resHeaders, request, status, statusText }

    const message = `Request failed with a status code ${status}`;
    throw new AxiosError(message, response, request, config);
  }

  if (transformResponse) data = transformResponse(data);

  return { 
    data, status, statusText, headers: resHeaders, config, request,
  }
}

async function handleRequest<T>(url: string, method: ReqActions, options: OptionalReqValues<T>){
  const {
    headers: initHeaders, timeout: initTimeout, credentials, cache, mode,
  } = options;

  const timeout = initTimeout ?? defaultTimeOut;
  const { action } = method;

  let headers: AxiosHeaders;

  if (initHeaders) headers = new AxiosHeaders(initHeaders);
  else headers = new AxiosHeaders();

  let body = null;

  if (isBody(method)) {
    const { tmpBody, contType } = getBody(method.body);
    body = tmpBody;
    if (contType === '') headers.delete(ContentType);
    else headers.set(ContentType, contType);
  }
  
  const req = new AxiosRequest(url, action, body, headers, mode, cache, credentials);

  const res = await fetchTimeOut(req, timeout);

  return { res, req, headers, action, timeout, }
}

function fetchTimeOut(req: Request, timeout: number){
  const controller = new AbortController();
  const signal = controller.signal;

  if (timeout > defaultTimeOut ) setTimeout(() => controller.abort(), timeout);

  return fetch(req, { signal });
}

export default {
  create,
  get,
  post,
  put,
  patch,
  remove,
}