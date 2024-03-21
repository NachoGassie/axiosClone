declare const HEAD = "HEAD";
declare const GET = "GET";
declare const POST = "POST";
declare const PUT = "PUT";
declare const PATCH = "PATCH";
declare const DELETE = "DELETE";
declare const bodyActionssArr: string[];

declare class AxiosReq extends Request {
    constructor(url: string, method?: Methods, body?: nullableBody, headers?: HeadersInit, mode?: CorsMode, cache?: RequestCache, credentials?: RequestCredentials);
}

interface Config {
    headers: HeadersInit;
    method: Methods;
    timeout: number;
    transformResponse?: TransformResponse<any>;
    url: string;
}
interface AxiosResponse<T> {
    headers: Headers;
    status: number;
    statusText: string;
    data: T;
    config: Config;
    request: AxiosReq;
}
interface AxiosErrorResponse {
    data: any;
    headers: Headers;
    status: number;
    statusText: string;
    config: Config;
}
type CorsMode = 'cors' | 'no-cors' | 'same-origin' | 'navigate';
interface AxiosDefReq {
    cache: RequestCache;
    credentials: RequestCredentials;
    headers: HeadersInit;
    method: Methods;
    mode: CorsMode;
}

type jsonObj = Record<string, any>;
type AcceptedBody = BodyInit | jsonObj;
type nullableString = string | null;
type nullableBody = BodyInit | null;
type stringKeyValue = {
    [key: string]: string;
};
interface Create {
    baseURL: string;
    timeout?: number;
    headers?: HeadersInit;
}
interface OptionalProps<T> extends OptionalReqValues<T> {
    queries?: jsonObj;
    params?: jsonObj;
    transformResponse?: TransformResponse<T>;
}
interface OptionalReqValues<T> {
    headers?: HeadersInit;
    timeout?: number;
    cache?: RequestCache;
    credentials?: RequestCredentials;
    mode?: CorsMode;
}
type TransformResponse<T> = (data: T) => unknown;

type ReqUpdateActions = {
    action: typeof POST;
    body: AcceptedBody;
} | {
    action: typeof PUT;
    body: AcceptedBody;
} | {
    action: typeof PATCH;
    body: AcceptedBody;
};
type ReqActions = ReqUpdateActions | {
    action: typeof HEAD;
} | {
    action: typeof GET;
} | {
    action: typeof DELETE;
};
type Methods = typeof HEAD | typeof GET | typeof POST | typeof PUT | typeof PATCH | typeof DELETE;

declare function create(defOptions: Create): {
    get: <T>(url: string, instance?: OptionalProps<T> | undefined) => Promise<AxiosResponse<T>>;
    post: <T_1>(url: string, body: AcceptedBody, instance?: OptionalProps<T_1> | undefined) => Promise<AxiosResponse<T_1>>;
    put: <T_2>(url: string, body: AcceptedBody, instance?: OptionalProps<T_2> | undefined) => Promise<AxiosResponse<T_2>>;
    patch: <T_3>(url: string, body: AcceptedBody, instance?: OptionalProps<T_3> | undefined) => Promise<AxiosResponse<T_3>>;
    remove: <T_4>(url: string, instance?: OptionalProps<T_4> | undefined) => Promise<AxiosResponse<T_4>>;
};
declare function get<T>(url: string, options?: OptionalProps<T>): Promise<AxiosResponse<T>>;
declare function post<T>(url: string, body: AcceptedBody, options?: OptionalProps<T>): Promise<AxiosResponse<T>>;
declare function put<T>(url: string, body: AcceptedBody, options?: OptionalProps<T>): Promise<AxiosResponse<T>>;
declare function patch<T>(url: string, body: AcceptedBody, options?: OptionalProps<T>): Promise<AxiosResponse<T>>;
declare function remove<T>(url: string, options?: OptionalProps<T>): Promise<AxiosResponse<T>>;
declare const _default: {
    create: typeof create;
    get: typeof get;
    post: typeof post;
    put: typeof put;
    patch: typeof patch;
    remove: typeof remove;
};

declare const ContentType = "Content-Type";
declare const ContTypeValue: {
    readonly AppJson: "application/json";
    readonly textPlain: "text/plain";
    readonly octetStream: "application/octet-stream";
};

declare const defaultTimeOut = -1;
declare const defaultHeaders: HeadersInit;
declare const AxiosDefaultRequest: AxiosDefReq;

declare class AxiosHeaders extends Headers {
    constructor(headersInit?: HeadersInit);
}

declare class AxiosErrorClone extends Error {
    response: AxiosErrorResponse;
    request: Request;
    config: Config;
    constructor(message: string, response: AxiosErrorResponse, request: Request, config: Config);
}

export { type AcceptedBody, type AxiosDefReq, AxiosDefaultRequest, AxiosErrorClone as AxiosError, type AxiosErrorResponse, AxiosHeaders, AxiosReq as AxiosRequest, type AxiosResponse, type Config, ContTypeValue, ContentType, type CorsMode, type Create, DELETE, GET, HEAD, type Methods, type OptionalProps, type OptionalReqValues, PATCH, POST, PUT, type ReqActions, type ReqUpdateActions, type TransformResponse, bodyActionssArr, _default as default, defaultHeaders, defaultTimeOut, type jsonObj, type nullableBody, type nullableString, type stringKeyValue };
