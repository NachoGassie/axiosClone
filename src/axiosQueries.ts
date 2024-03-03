import { defaultHeders } from "./defaultAxios";
import AxiosErrorClone from "./axiosError";
import { getFullUrl, getHeaders, getRequestObj, isBody } from "./utils/utils";
import { DELETE, GET, POST, PUT } from "./constants";
import {
  AcceptedBody, AxiosResponse,
  Create, InstanceMethods, OptionalProps, ReqActions
} from "./types";

function create(defOptions: Create){
  const { baseURL, headers } = defOptions;

  const getFullUrl = (url?: string) => `${baseURL}${url ? url : ''}`;

  const get = <T>(url?: string, options?: OptionalProps<T>) => 
    requestMaker(getFullUrl(url), {action: GET}, {
      ...headers, ...options
    });

  const post = <T>(body: AcceptedBody, {url, options}: InstanceMethods<T>) => 
    requestMaker(getFullUrl(url), {action: POST, body}, {
      ...headers, ...options
    });

  const put = <T>(body: AcceptedBody, {url, options}: InstanceMethods<T>) => 
    requestMaker(getFullUrl(url), {action:PUT, body}, {
      ...headers, ...options
    });

  const remove = <T>({url, options}: InstanceMethods<T>) => 
    requestMaker(getFullUrl(url), {action: DELETE}, {
      ...headers, ...options
    });

  return { get, post, put, remove }
}

async function get<T>(url: string, options?: OptionalProps<T>){
  const method: ReqActions = { 
    action: GET 
  };
  return await requestMaker(url, method, options);
}

async function post<T>(url: string, body: AcceptedBody, options?: OptionalProps<T>){
  const method: ReqActions = {
    action: POST,
    body,
  }
  return await requestMaker<T>(url, method, options);
}

async function put<T>(url: string, body: AcceptedBody, options?: OptionalProps<T>){
  const method: ReqActions = {
    action: PUT,
    body,
  }
  return await requestMaker<T>(url, method, options);
}

async function remove<T>(url: string, options?: OptionalProps<T>){
  const method: ReqActions = {
    action: DELETE
  };
  return await requestMaker(url, method, options);
}

async function requestMaker<T>(
  initUrl: string, method: ReqActions, options?: OptionalProps<T>
): Promise<AxiosResponse<T>>
async function requestMaker<T>(
  initUrl: string, method: ReqActions, options?: OptionalProps<T>
): Promise<unknown>{
  const { 
    queries, params, headers: initReqHeaders, timeout: initTimeout, transformResponse
  } = options ?? {};

  const timeout = initTimeout ?? -1;
  const { action } = method;
  const url = getFullUrl(initUrl, queries, params);

  const reqHeaders = {
    ...defaultHeders,
    ...initReqHeaders,
  }

  const config = { 
    url, headers: reqHeaders, method: action, timeout, transformResponse,
  }

  const body = isBody(method) ? method.body : null;
  const res = await fetchTimeOut(url, action, body, timeout, reqHeaders);

  const data = await res.json();
  const { status, statusText } = res;
  const stringedData = JSON.stringify(data);

  const request = getRequestObj({ url, timeout, status, statusText, stringedData });
  const resHeaders = getHeaders(res.headers);

  if (!res.ok) {
    const response = { config, data, headers: resHeaders, request, status, statusText }

    const message = `Request failed with a status code ${status}`;
    throw new AxiosErrorClone(message, response, request, config);
  }

  if (transformResponse) return transformResponse(data);

  return { 
    data, status, statusText, headers: resHeaders,  config, request,
  }
}

function fetchTimeOut(
  url: string, method: string, body: BodyInit | null, timeout: number, headers: HeadersInit
): Promise<Response>{
  const controller = new AbortController();
  const signal = controller.signal;

  if (timeout > 0 ) setTimeout(() => controller.abort(), timeout);

  return fetch(url, { 
    method,
    body,
    headers,
    signal,
  });
}

export default {
  create,
  get,
  post,
  put,
  remove,
}