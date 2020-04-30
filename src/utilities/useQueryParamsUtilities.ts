import { QueryParamConfig, encodeString, decodeString, encodeArray, decodeArray } from 'use-query-params';
import Covid19DataStore, { ValuesOnDateProperty } from '../store/Covid19DataStore';
import { filterOnlyNonNull } from './arrayUtilities';

export const ValuesOnDatePropertyParam: QueryParamConfig<ValuesOnDateProperty | null | undefined> = {
  encode: (value) => {
    return encodeString(value);
  },
  decode: (value) => {
    const decodedStr = decodeString(value);

    if (Covid19DataStore.isValuesOnDateProperty(decodedStr)) {
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
