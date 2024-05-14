import { stringKeyValue } from "../types";

// TO VERIFY
export function getResHeaders(headers: Headers): Headers{
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