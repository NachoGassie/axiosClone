import { ContTypeValue, bodyActionssArr } from "../constants";
import { AcceptedBody, ReqActions, ReqUpdateActions, jsonObj, stringKeyValue } from "../types";

export function getFullUrl(initUrl: string, queries?: jsonObj, params?: jsonObj){
  const parsedParams = params ? getParamsUrl(params) : '';
  const parsedQueries = queries ? getQueriesUrl(queries) : '';

  return `${initUrl}${parsedParams}${parsedQueries}`;
}

function getParamsUrl(params: jsonObj){
  const paramsArr = Object.entries(params).map(([key, value]) => `/${key}/${value}`);
  return paramsArr.join('');
}

function getQueriesUrl(queries: jsonObj): string{
  const queriesUrl = new URLSearchParams(queries).toString(); 
  return `?${queriesUrl}`;
}

export function getBody(tmpBody: AcceptedBody){
  if (
    !(typeof tmpBody === 'string') && !(tmpBody instanceof FormData) 
    && !(tmpBody instanceof Blob) && !(tmpBody instanceof URLSearchParams)
  ){
    return {
      tmpBody: JSON.stringify(tmpBody),
      contType: ContTypeValue.AppJson
    }
  }

  let contType = '';
  if (!(tmpBody instanceof FormData)) contType = getContType(tmpBody);

  return { tmpBody, contType }
}

function getContType(body: BodyInit){
  if(body instanceof Blob) return ContTypeValue.octetStream;
  const bodyType = typeof body;
  
  if (typeof body === 'string') {
    try {
      JSON.parse(body);
      return ContTypeValue.AppJson;
    } catch (e) { 
      return ContTypeValue.textPlain;
    }
  } 

  return ContTypeValue.AppJson;
}

export function getHeaders(headers: Headers): Headers{
  const tmpHeaders: stringKeyValue = {};

  const keys = headers.entries();
  let k = keys.next();

  while (!k.done) {
    const {value} = k;
    tmpHeaders[value[0]] = value[1];
    k = keys.next();
  }

  return { ...tmpHeaders, ...headers, }
};

export const isBody = (method: ReqActions): method is ReqUpdateActions => 
  bodyActionssArr.includes(method.action);
