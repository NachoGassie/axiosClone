import { ContTypeValue, bodyActionssArr } from "../constants";
import { AcceptedBody, ReqActions, ReqUpdateActions } from "../types";


export function hasBody(method: ReqActions): method is ReqUpdateActions{
  return bodyActionssArr.includes(method.action);
}

export function parseReqBody(tmpBody: AcceptedBody){
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