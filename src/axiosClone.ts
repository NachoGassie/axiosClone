import { ContentType, DELETE, GET, HEAD, PATCH, POST, PUT } from "./constants";
import { DEFTIMEOUT } from "./defaulltValues";
import { AxiosError, AxiosHeaders, AxiosRequest } from './lib';
import { AxiosConfig } from "./lib/AxiosConfig";
import { AcceptedBody, AxiosResponse, Create, Methods, OptionalProps, OptionalReqValues, ReqActions } from "./types";
import { parseReqBody, getFullUrl, getResHeaders, hasBody } from "./utils";

async function requestMaker<T>(
  initUrl: string, method: ReqActions, options?: OptionalProps<T>
): Promise<AxiosResponse<T>>{
  const { 
    queries, params, transformResponse, ...restOptions
  } = options ?? {};

  const url = getFullUrl(initUrl, queries, params);

  try {
    const {
      res, req: request, headers: reqHeaders, action, timeout,
    } = await handleRequest<T>(url, method, restOptions);
  
    const resHeaders = getResHeaders(res.headers);
    const contentType = res.headers.get("content-type");
  
    let data = action !== HEAD ? await parseBodyResp<T>(contentType, res) : {};
    if (transformResponse) data = transformResponse(data);

    const { status, statusText } = res;

    const config = new AxiosConfig<T>(url, reqHeaders, action, timeout, transformResponse)
  
    if (!res.ok) {
      const response = { config, data, headers: resHeaders, request, status, statusText }
  
      const message = `Request failed with a status code ${status}`;
      throw new AxiosError(message, response, request, config);
    }
  
  
    return { 
      data, status, statusText, headers: resHeaders, config, request,
    }
  } catch (err) {
    if (err instanceof Error) {
      const { headers, timeout, credentials, cache, mode } = restOptions;
      const { action } = method;

      const config = new AxiosConfig(
        url, headers ?? {}, action, timeout ?? DEFTIMEOUT, transformResponse
      );

      const axiosHeaders = new AxiosHeaders(headers);
      const body = getBodyForReq(method, axiosHeaders);
      
      const req = new AxiosRequest(url, action, body, headers, mode, cache, credentials);

      throw new AxiosError(err.message, err, req, config);
    }

    throw new Error('unknown error ocurred');
  }
}

async function handleRequest<T>(url: string, method: ReqActions, options: OptionalReqValues<T>){
  const {
    headers: initHeaders, timeout: initTimeout, credentials, cache, mode,
  } = options;

  const timeout = initTimeout ?? DEFTIMEOUT;
  const { action } = method;

  const headers = new AxiosHeaders(initHeaders);
  const body = getBodyForReq(method, headers);
  
  const req = new AxiosRequest(url, action, body, headers, mode, cache, credentials);
  const res = await handleFetch(req, timeout);

  return { res, req, headers, action, timeout, }
}

function getBodyForReq(method: ReqActions, headers: AxiosHeaders){
  if (!hasBody(method)) return null;

  const { tmpBody, contType } = parseReqBody(method.body);
  if (contType === '') headers.delete(ContentType);
  else headers.set(ContentType, contType);

  return tmpBody;
}

async function parseBodyResp<T>(contentType: string | null, res: Response){
  const parsedContentType = contentType?.split(';')[0];
  if (parsedContentType === 'text/html') return res.text();
  return res.json();
}

function handleFetch(req: Request, timeout: number){
  const controller = new AbortController();
  const signal = controller.signal;

  if (timeout > DEFTIMEOUT ) setTimeout(() => controller.abort(), timeout);

  return fetch(req, { signal });
}

function create(defOptions: Create){
  const { baseURL, headers: instanceHeaders, timeout } = defOptions;

  const makeRequest = <T>(url: string, method: ReqActions, call?: OptionalProps<T>) => {
    const { headers: callHeaders, ...options } = call ?? {};
    const fullUrl = `${baseURL}${url}`;

    const headers = new Headers({ ...instanceHeaders, ...callHeaders });

    return requestMaker(fullUrl, method, {
      headers, timeout, ...options
    });
  }
  
  const head = <T>(
    url: string, call?: OptionalProps<T>
  ) => makeRequest(url, { action: HEAD }, call);
  
  const get = <T>(
    url: string, call?: OptionalProps<T>
  ) => makeRequest(url, { action: GET }, call);
  
  const post = <T>(
    url: string, body: AcceptedBody, call?: OptionalProps<T>
  ) => makeRequest(url, { action: POST, body }, call);

  const put = <T>(
    url: string, body: AcceptedBody, call?: OptionalProps<T>
  ) => makeRequest(url, { action: PUT, body }, call);

  const patch = <T>(
    url: string, body: AcceptedBody, call?: OptionalProps<T>
  ) => makeRequest(url, { action: PATCH, body }, call);

  const remove = <T>(
    url: string, call?: OptionalProps<T>
  ) => makeRequest(url, { action: DELETE }, call);

  return { head, get, post, put, patch, remove }
}

async function head<T>(url: string, options?: OptionalProps<T>){
  const method: ReqActions = { action: HEAD };
  return await requestMaker(url, method, options);
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

export default {
  create,
  head,
  get,
  post,
  put,
  patch,
  remove,
}