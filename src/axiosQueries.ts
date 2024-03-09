import { defaultHeders } from "./defaultAxios";
import AxiosErrorClone from "./axiosError";
import { getFullUrl, getHeaders, getRequestObj, isBody } from "./utils/utils";
import { DELETE, GET, POST, PUT } from "./constants";
import {
  AcceptedBody, AxiosResponse, Create, InstanceCall, OptionalProps, ReqActions, nullableBody
} from "./types";

function create(defOptions: Create){
  const { baseURL, headers: instanceHeaders, timeout } = defOptions;

  const makeRequest = <T>(method: ReqActions, call?: InstanceCall<T>) => {
    const { url, headers: callHeaders, ...options } = call ?? {};
    const fullUrl = `${baseURL}${url ? url : ''}`;

    const headers = {...instanceHeaders, ...(callHeaders ?? {})}

    return requestMaker(fullUrl, method, {
      headers, timeout, ...options
    });
  }

  const get = <T>(
    instance?: InstanceCall<T>
  ) => makeRequest({ action: GET }, instance);
  
  const post = <T>(
    body: AcceptedBody, instance?: InstanceCall<T>
  ) => makeRequest({ action: POST, body }, instance);

  const put = <T>(
    body: AcceptedBody, instance?: InstanceCall<T>
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

async function post<T>(url: string, body: AcceptedBody, options?: OptionalProps<T>){
  const method: ReqActions = { action: POST, body }
  return await requestMaker<T>(url, method, options);
}

async function put<T>(url: string, body: AcceptedBody, options?: OptionalProps<T>){
  const method: ReqActions = { action: PUT, body }
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
    queries, params, headers: initReqHeaders, timeout: initTimeout, transformResponse
  } = options ?? {};

  const timeout = initTimeout ?? 0;
  const { action } = method;
  const url = getFullUrl(initUrl, queries, params);

  const reqHeaders = {
    ...defaultHeders,
    ...initReqHeaders,
  }

  const body = isBody(method) ? method.body : null;
  const res: Response = await fetchTimeOut(url, action, body, timeout, reqHeaders);

  const data = await res.json();
  const { status, statusText } = res;
  const stringedData = JSON.stringify(data);

  const request = getRequestObj({ url, timeout, status, statusText, stringedData });
  const resHeaders = getHeaders(res.headers);
  const config = { url, headers: reqHeaders, method: action, timeout, transformResponse }

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
  url: string, method: string, body: nullableBody, timeout: number, headers: HeadersInit
){
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