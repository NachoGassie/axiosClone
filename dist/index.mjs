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
var defaultTimeOut = -1;
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
  toJSON() {
    return {
      response: this.response,
      request: this.request,
      config: this.config,
      name: this.name,
      message: this.message,
      stack: this.stack
    };
  }
  toString = () => {
    return `AxiosErrorClone: ${this.message}. Response: ${JSON.stringify(this.toJSON())}.`;
  };
};

// src/utils/utils.ts
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
function getContType(body) {
  if (body instanceof Blob)
    return ContTypeValue.octetStream;
  const bodyType = typeof body;
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
function getHeaders(headers) {
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
var isBody = (method) => bodyActionssArr.includes(method.action);

// src/axiosClone.ts
function create(defOptions) {
  const { baseURL, headers: instanceHeaders, timeout } = defOptions;
  const makeRequest = (method, call) => {
    const { url, headers: callHeaders, ...options } = call ?? {};
    const fullUrl = `${baseURL}${url ? url : ""}`;
    let headers = void 0;
    if (instanceHeaders && !callHeaders)
      headers = new Headers(instanceHeaders);
    if (callHeaders && !instanceHeaders)
      headers = new Headers(callHeaders);
    if (instanceHeaders && callHeaders) {
      headers = new Headers({ ...instanceHeaders, ...callHeaders });
    }
    return requestMaker(fullUrl, method, {
      headers,
      timeout,
      ...options
    });
  };
  const get2 = (instance) => makeRequest({ action: GET }, instance);
  const post2 = (body, instance) => makeRequest({ action: POST, body }, instance);
  const put2 = (body, instance) => makeRequest({ action: PUT, body }, instance);
  const remove2 = (instance) => makeRequest({ action: DELETE }, instance);
  return { get: get2, post: post2, put: put2, remove: remove2 };
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
async function requestMaker(initUrl, method, options) {
  const {
    queries,
    params,
    transformResponse,
    ...restOptions
  } = options ?? {};
  const url = getFullUrl(initUrl, queries, params);
  const {
    res,
    req: request,
    headers: reqHeaders,
    action,
    timeout
  } = await handleRequest(url, method, restOptions);
  const resHeaders = getHeaders(res.headers);
  const data = await res.json();
  const { status, statusText } = res;
  const config = { url, headers: reqHeaders, method: action, timeout, transformResponse };
  if (!res.ok) {
    const response = { config, data, headers: resHeaders, request, status, statusText };
    const message = `Request failed with a status code ${status}`;
    throw new AxiosErrorClone(message, response, request, config);
  }
  if (transformResponse)
    return transformResponse(data);
  return {
    data,
    status,
    statusText,
    headers: resHeaders,
    config,
    request
  };
}
async function handleRequest(url, method, options) {
  const {
    headers: initHeaders,
    timeout: initTimeout,
    credentials,
    cache,
    mode
  } = options;
  const timeout = initTimeout ?? defaultTimeOut;
  const { action } = method;
  let headers;
  if (initHeaders)
    headers = new AxiosHeaders(initHeaders);
  else
    headers = new AxiosHeaders();
  const body = isBody(method) ? method.body : null;
  if (body) {
    if (body instanceof FormData)
      headers.delete(ContentType);
    else
      headers.set(ContentType, getContType(body));
  }
  const req = new AxiosReq(url, action, body, headers, mode, cache, credentials);
  const res = await fetchTimeOut(req, timeout);
  return { res, req, headers, action, timeout };
}
function fetchTimeOut(req, timeout) {
  const controller = new AbortController();
  const signal = controller.signal;
  if (timeout > defaultTimeOut)
    setTimeout(() => controller.abort(), timeout);
  return fetch(req, { signal });
}
var axiosClone_default = {
  create,
  get,
  post,
  put,
  patch,
  remove
};

// src/index.ts
var src_default = axiosClone_default;
export {
  AxiosDefaultRequest,
  ContTypeValue,
  ContentType,
  DELETE,
  GET,
  HEAD,
  PATCH,
  POST,
  PUT,
  bodyActionssArr,
  src_default as default,
  defaultHeaders,
  defaultTimeOut
};
