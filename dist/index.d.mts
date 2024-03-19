declare const HEAD = "HEAD";
declare const GET = "GET";
declare const POST = "POST";
declare const PUT = "PUT";
declare const PATCH = "PATCH";
declare const DELETE = "DELETE";
declare const bodyActionssArr: string[];

type ReqUpdateActions = {
    action: typeof POST;
    body: BodyInit;
} | {
    action: typeof PUT;
    body: BodyInit;
} | {
    action: typeof PATCH;
    body: BodyInit;
};
type ReqActions = ReqUpdateActions | {
    action: typeof HEAD;
} | {
    action: typeof GET;
} | {
    action: typeof DELETE;
};
type Methods = typeof HEAD | typeof GET | typeof POST | typeof PUT | typeof PATCH | typeof DELETE;

declare class AxiosReq extends Request {
    constructor(url: string, method?: Methods, body?: nullableBody, headers?: HeadersInit, mode?: CorsMode, cache?: RequestCache, credentials?: RequestCredentials);
}

type jsonObj = Record<string, any>;
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
interface InstanceCall<T> extends OptionalProps<T> {
    url?: string;
}
type TransformResponse<T> = (data: T) => unknown;

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

declare function create(defOptions: Create): {
    get: <T>(instance?: InstanceCall<T> | undefined) => Promise<AxiosResponse<T>>;
    post: <T_1>(body: BodyInit, instance?: InstanceCall<T_1> | undefined) => Promise<AxiosResponse<T_1>>;
    put: <T_2>(body: BodyInit, instance?: InstanceCall<T_2> | undefined) => Promise<AxiosResponse<T_2>>;
    remove: <T_3>(instance?: InstanceCall<T_3> | undefined) => Promise<AxiosResponse<T_3>>;
};
declare function get<T>(url: string, options?: OptionalProps<T>): Promise<AxiosResponse<T>>;
declare function post<T>(url: string, body: BodyInit, options?: OptionalProps<T>): Promise<AxiosResponse<T>>;
declare function put<T>(url: string, body: BodyInit, options?: OptionalProps<T>): Promise<AxiosResponse<T>>;
declare function patch<T>(url: string, body: BodyInit, options?: OptionalProps<T>): Promise<AxiosResponse<T>>;
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

export { type AxiosDefReq, AxiosDefaultRequest, type AxiosErrorResponse, type AxiosResponse, type Config, ContTypeValue, ContentType, type CorsMode, type Create, DELETE, GET, HEAD, type InstanceCall, type Methods, type OptionalProps, type OptionalReqValues, PATCH, POST, PUT, type ReqActions, type ReqUpdateActions, type TransformResponse, bodyActionssArr, _default as default, defaultHeaders, defaultTimeOut, type jsonObj, type nullableBody, type nullableString, type stringKeyValue };
