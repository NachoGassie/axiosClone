import { defaultHeaders } from "../defaulltValues";

export default class AxiosHeaders extends Headers{
  constructor(
    headersInit: HeadersInit = defaultHeaders,
  ){
    super(headersInit);
  }
}