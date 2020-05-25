import {
  QueryParamConfig,
  encodeString,
  decodeString,
  encodeArray,
  decodeArray
} from "use-query-params";
import { filterOnlyNonNull } from "./arrayUtilities";
import { isValuesOnDateProperty } from "./covid19APIUtilities";

export const ValuesOnDatePropertyParam: QueryParamConfig<string | null | undefined> = {
  encode: (value) => {
    return encodeString(value);
  },
  decode: (value) => {
    const decodedStr = decodeString(value);

    if (decodedStr != null && isValuesOnDateProperty(decodedStr)) {
      return decodedStr;
    }

    return null;
  },
};

export const NonNullElementArrayParam: QueryParamConfig<string[] | null | undefined> = {
  encode: (value) => {
    return encodeArray(value);
  },
  decode: (value) => {
    const decodedArray = decodeArray(value);

    if (decodedArray == null) {
      return decodedArray;
    }

    return filterOnlyNonNull(decodedArray);
  },
};
