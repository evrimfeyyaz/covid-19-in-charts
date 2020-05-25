import _ from "lodash";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { getAbsoluteUrl } from "../utilities/urlUtilities";

export function useCanonicalURL(paramsToKeep?: string[]): string {
  const { pathname, search } = useLocation();

  let canonicalParams = queryString.parse(search);
  if (paramsToKeep != null) {
    canonicalParams = _.pick(canonicalParams, paramsToKeep);
  }

  const paramsString = queryString.stringify(canonicalParams);

  return getAbsoluteUrl(`${pathname}?${paramsString}`);
}
