"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AxiosDefaultRequest: () => AxiosDefaultRequest,
  AxiosError: () => AxiosErrorClone,
  AxiosHeaders: () => AxiosHeaders,
  AxiosRequest: () => AxiosReq,
  ContTypeValue: () => ContTypeValue,
  ContentType: () => ContentType,
  DEFTIMEOUT: () => DEFTIMEOUT,
  DELETE: () => DELETE,
  GET: () => GET,
  HEAD: () => HEAD,
  PATCH: () => PATCH,
  POST: () => POST,
  PUT: () => PUT,
  bodyActionssArr: () => bodyActionssArr,
  default: () => src_default,
  defaultHeaders: () => defaultHeaders
});
module.exports = __toCommonJS(src_exports);

// src/constants/header.constants.ts
var ContentType = "Content-Type";
var ContTypeValue = {
  AppJson: "application/json",
  textPlain: "text/plain",
  octetStream: "application/octet-stream"
};

// src/constants/http.constants.ts
var HEAD = "HEAD";
var GET = "GET";
var POST = "POST";
var PUT = "PUT";
var PATCH = "PATCH";
var DELETE = "DELETE";
var bodyActionssArr = [POST, PUT, PATCH];

// src/defaulltValues/defaultValues.ts
var DEFTIMEOUT = -1;
var defaultHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json, text/plain, */*"
};
var AxiosDefaultRequest = {
  method: GET,
  cache: "default",
  credentials: "same-origin",
  headers: defaultHeaders,
  mode: "cors"
};

// src/lib/AxiosHeaders.ts
var AxiosHeaders = class extends Headers {
  constructor(headersInit = defaultHeaders) {
    super(headersInit);
  }
};

// src/lib/AxiosRequest.ts
var AxiosReq = class extends Request {
  constructor(url, method = AxiosDefaultRequest.method, body = null, headers = AxiosDefaultRequest.headers, mode = AxiosDefaultRequest.mode, cache = AxiosDefaultRequest.cache, credentials = AxiosDefaultRequest.credentials) {
    super(url, {
      method,
      body,
      headers,
      mode,
      cache,
      credentials
    });
  }
};

// src/lib/axiosError.ts
var AxiosErrorClone = class _AxiosErrorClone extends Error {
  response;
  request;
  config;
  constructor(message, response, request, config) {
    super(message);
    Error.call(this);
    this.response = response;
    this.request = request;
    this.name = this.constructor.name;
    this.config = config;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack;
    }
    Object.setPrototypeOf(this, _AxiosErrorClone.prototype);
  }
};

// src/lib/AxiosConfig.ts
var AxiosConfig = class {
  url;
  headers;
  method;
  timeout;
  transformResponse;
  constructor(url, headers, method, timeout, transformResponse) {
    this.url = url;
    this.headers = headers;
    this.method = method;
    this.timeout = timeout;
    this.transformResponse = transformResponse;
  }
};

// src/utils/body.utils.ts
function hasBody(method) {
  return bodyActionssArr.includes(method.action);
}
function parseReqBody(tmpBody) {
  if (!(typeof tmpBody === "string") && !(tmpBody instanceof FormData) && !(tmpBody instanceof Blob) && !(tmpBody instanceof URLSearchParams)) {
    return {
      tmpBody: JSON.stringify(tmpBody),
      contType: ContTypeValue.AppJson
    };
  }
  let contType = "";
  if (!(tmpBody instanceof FormData))
    contType = getContType(tmpBody);
  return { tmpBody, contType };
}
function getContType(body) {
  if (body instanceof Blob)
    return ContTypeValue.octetStream;
  if (typeof body === "string") {
    try {
      JSON.parse(body);
      return ContTypeValue.AppJson;
    } catch (e) {
      return ContTypeValue.textPlain;
    }
  }
  return ContTypeValue.AppJson;
}

// src/utils/url.utils.ts
function getFullUrl(initUrl, queries, params) {
  const parsedParams = params ? getParamsUrl(params) : "";
  const parsedQueries = queries ? getQueriesUrl(queries) : "";
  return `${initUrl}${parsedParams}${parsedQueries}`;
}
function getParamsUrl(params) {
  const paramsArr = Object.entries(params).map(([key, value]) => `/${key}/${value}`);
  return paramsArr.join("");
}
function getQueriesUrl(queries) {
  const queriesUrl = new URLSearchParams(queries).toString();
  return `?${queriesUrl}`;
}

// src/utils/header.utils.ts
function getResHeaders(headers) {
  const tmpHeaders = {};
  const keys = headers.entries();
  let k = keys.next();
  while (!k.done) {
    const { value } = k;
    tmpHeaders[value[0]] = value[1];
    k = keys.next();
  }
  return { ...tmpHeaders, ...headers };
}

// src/axiosClone.ts
async function requestMaker(initUrl, method, options) {
  const {
    queries,
    params,
    transformResponse,
    ...restOptions
  } = options ?? {};
  const url = getFullUrl(initUrl, queries, params);
  try {
    const {
      res,
      req: request,
      headers: reqHeaders,
      action,
      timeout
    } = await handleRequest(url, method, restOptions);
    const resHeaders = getResHeaders(res.headers);
    let data = action !== HEAD ? await res.json() : {};
    const { status, statusText } = res;
    const config = new AxiosConfig(url, reqHeaders, action, timeout, transformResponse);
    if (!res.ok) {
      const response = { config, data, headers: resHeaders, request, status, statusText };
      const message = `Request failed with a status code ${status}`;
      throw new AxiosErrorClone(message, response, request, config);
    }
    if (transformResponse)
      data = transformResponse(data);
    return {
      data,
      status,
      statusText,
      headers: resHeaders,
      config,
      request
    };
  } catch (err) {
    if (err instanceof Error) {
      const { headers, timeout, credentials, cache, mode } = restOptions;
      const { action } = method;
      const config = new AxiosConfig(
        url,
        headers ?? {},
        action,
        timeout ?? DEFTIMEOUT,
        transformResponse
      );
      const axiosHeaders = new AxiosHeaders(headers);
      const body = getBodyForReq(method, axiosHeaders);
      const req = new AxiosReq(url, action, body, headers, mode, cache, credentials);
      throw new AxiosErrorClone(err.message, err, req, config);
    }
    throw new Error("unknown error ocurred");
  }
}
async function handleRequest(url, method, options) {
  const {
    headers: initHeaders,
    timeout: initTimeout,
    credentials,
    cache,
    mode
  } = options;
  const timeout = initTimeout ?? DEFTIMEOUT;
  const { action } = method;
  const headers = new AxiosHeaders(initHeaders);
  const body = getBodyForReq(method, headers);
  const req = new AxiosReq(url, action, body, headers, mode, cache, credentials);
  const res = await handleFetch(req, timeout);
  return { res, req, headers, action, timeout };
}
function getBodyForReq(method, headers) {
  if (!hasBody(method))
    return null;
  const { tmpBody, contType } = parseReqBody(method.body);
  if (contType === "")
    headers.delete(ContentType);
  else
    headers.set(ContentType, contType);
  return tmpBody;
}
function handleFetch(req, timeout) {
  const controller = new AbortController();
  const signal = controller.signal;
  if (timeout > DEFTIMEOUT)
    setTimeout(() => controller.abort(), timeout);
  return fetch(req, { signal });
}
function create(defOptions) {
  const { baseURL, headers: instanceHeaders, timeout } = defOptions;
  const makeRequest = (url, method, call) => {
    const { headers: callHeaders, ...options } = call ?? {};
    const fullUrl = `${baseURL}${url}`;
    const headers = new Headers({ ...instanceHeaders, ...callHeaders });
    return requestMaker(fullUrl, method, {
      headers,
      timeout,
      ...options
    });
  };
  const head2 = (url, call) => makeRequest(url, { action: HEAD }, call);
  const get2 = (url, call) => makeRequest(url, { action: GET }, call);
  const post2 = (url, body, call) => makeRequest(url, { action: POST, body }, call);
  const put2 = (url, body, call) => makeRequest(url, { action: PUT, body }, call);
  const patch2 = (url, body, call) => makeRequest(url, { action: PATCH, body }, call);
  const remove2 = (url, call) => makeRequest(url, { action: DELETE }, call);
  return { head: head2, get: get2, post: post2, put: put2, patch: patch2, remove: remove2 };
}
async function head(url, options) {
  const method = { action: HEAD };
  return await requestMaker(url, method, options);
}
async function get(url, options) {
  const method = { action: GET };
  return await requestMaker(url, method, options);
}
async function post(url, body, options) {
  const method = { action: POST, body };
  return await requestMaker(url, method, options);
}
async function put(url, body, options) {
  const method = { action: PUT, body };
  return await requestMaker(url, method, options);
}
async function patch(url, body, options) {
  const method = { action: PATCH, body };
  return await requestMaker(url, method, options);
}
async function remove(url, options) {
  const method = { action: DELETE };
  return await requestMaker(url, method, options);
}
var axiosClone_default = {
  create,
  head,
  get,
  post,
  put,
  patch,
  remove
};

// src/index.ts
var src_default = axiosClone_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AxiosDefaultRequest,
  AxiosError,
  AxiosHeaders,
  AxiosRequest,
  ContTypeValue,
  ContentType,
  DEFTIMEOUT,
  DELETE,
  GET,
  HEAD,
  PATCH,
  POST,
  PUT,
  bodyActionssArr,
  defaultHeaders
});
