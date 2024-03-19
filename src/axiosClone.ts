import { ContentType, DELETE, GET, PATCH, POST, PUT } from "./constants";
import { defaultTimeOut } from "./defaulltValues";
import AxiosHeaders from "./lib/AxiosHeaders";
import AxiosReq from "./lib/AxiosRequest";
import AxiosErrorClone from "./lib/axiosError";
import {
  AxiosResponse, Create, InstanceCall, OptionalProps, OptionalReqValues, ReqActions
} from "./types";
import { getContType, getFullUrl, getHeaders, isBody } from "./utils/utils";

function create(defOptions: Create){
  const { baseURL, headers: instanceHeaders, timeout } = defOptions;

  const makeRequest = <T>(method: ReqActions, call?: InstanceCall<T>) => {
    const { url, headers: callHeaders, ...options } = call ?? {};
    const fullUrl = `${baseURL}${url ? url : ''}`;

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
    instance?: InstanceCall<T>
  ) => makeRequest({ action: GET }, instance);
  
  const post = <T>(
    body: BodyInit, instance?: InstanceCall<T>
  ) => makeRequest({ action: POST, body }, instance);

  const put = <T>(
    body: BodyInit, instance?: InstanceCall<T>
  ) => makeRequest({ action: PUT, body }, instance);

  const remove = <T>(
    instance?: InstanceCall<T>
  ) => makeRequest({ action: DELETE }, instance);

  return { get, post, put, remove }
}

async function get<T>(url: string, options?: OptionalProps<T>){
  const method: ReqActions = { action: GET };
  return await requestMaker(url, method, options);
}

async function post<T>(url: string, body: BodyInit, options?: OptionalProps<T>){
  const method: ReqActions = { action: POST, body }
  return await requestMaker<T>(url, method, options);
}

async function put<T>(url: string, body: BodyInit, options?: OptionalProps<T>){
  const method: ReqActions = { action: PUT, body }
  return await requestMaker<T>(url, method, options);
}
async function patch<T>(url: string, body: BodyInit, options?: OptionalProps<T>){
  const method: ReqActions = { action: PATCH, body }
  return await requestMaker<T>(url, method, options);
}

async function remove<T>(url: string, options?: OptionalProps<T>){
  const method: ReqActions = { action: DELETE };
  return await requestMaker(url, method, options);
}

async function requestMaker<T>(
  initUrl: string, method: ReqActions, options?: OptionalProps<T>
): Promise<AxiosResponse<T>>
async function requestMaker<T>(
  initUrl: string, method: ReqActions, options?: OptionalProps<T>
): Promise<unknown>{
  const { 
    queries, params, transformResponse, ...restOptions
  } = options ?? {};

  const url = getFullUrl(initUrl, queries, params);

  const {
    res, req: request, headers: reqHeaders, action, timeout,
  } = await handleRequest<T>(url, method, restOptions);

  const resHeaders = getHeaders(res.headers);

  const data = await res.json();
  const { status, statusText } = res;

  const config = { url, headers: reqHeaders, method: action, timeout, transformResponse }

  if (!res.ok) {
    const response = { config, data, headers: resHeaders, request, status, statusText }

    const message = `Request failed with a status code ${status}`;
    throw new AxiosErrorClone(message, response, request, config);
  }

  if (transformResponse) return transformResponse(data);

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

  const body = isBody(method) ? method.body : null;

  if (body) {
    if (body instanceof FormData) headers.delete(ContentType);
    else headers.set(ContentType, getContType(body));
  }

  const req = new AxiosReq(url, action, body, headers, mode, cache, credentials);

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