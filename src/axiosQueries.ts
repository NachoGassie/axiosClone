import { getParamsUrl, getQueriesUrl } from "./utils";
import { DELETE, GET, POST, PUT, bodyActionssArr } from "./constants";
import {
  AcceptedBody, AxiosResponse, Create, InstanceMethods, OptionalProps, ReqActions, ReqUpdateActions
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

  return {
    get, post, put, remove
  }
}

async function get<T>(
  url: string, options?: OptionalProps<T>
){
  const method: ReqActions = { 
    action: GET 
  };
  return await requestMaker(url, method, options);
}

async function post<T>(
  url: string, body: AcceptedBody, options?: OptionalProps<T>
): Promise<AxiosResponse<T> | unknown>{
  const method: ReqActions = {
    action: POST,
    body,
  }
  return await requestMaker<T>(url, method, options);
}

async function put<T>(
  url: string, body: AcceptedBody, options?: OptionalProps<T>
): Promise<AxiosResponse<T> | unknown>{
  const method: ReqActions = {
    action: PUT,
    body,
  }
  return await requestMaker<T>(url, method, options);
}

async function remove<T>(
  url: string, options?: OptionalProps<T>
): Promise<AxiosResponse<T> | unknown>{
  const method: ReqActions = {
    action: DELETE
  };
  return await requestMaker(url, method, options);
}

async function requestMaker<T>(
  url: string, method: ReqActions, options?: OptionalProps<T>
): Promise<AxiosResponse<T>>
async function requestMaker<T>(
  url: string, method: ReqActions, options?: OptionalProps<T>
): Promise<unknown>{
  const { queries, params, headers, responseFn } = options ?? {};

  const queriesUrl = getQueriesUrl(queries);
  const paramsUrl = getParamsUrl(params);
  const fullUrl = `${url}${paramsUrl}${queriesUrl}`;

  const res = await fetch(fullUrl, { 
    method: method.action,
    body: isBody(method) ? method.body : null,
    headers
  });

  if (!res.ok) throw new Error((await res.json()).error);

  const json: T = await res.json();
  
  if (responseFn) return responseFn(json);

  const { status, statusText } = res;
  return { 
    status, statusText, data: json
  }
}

function isBody(method: ReqActions): method is ReqUpdateActions{
  return bodyActionssArr.includes(method.action);
}

export default {
  create,
  get,
  post,
  put,
  remove,
}