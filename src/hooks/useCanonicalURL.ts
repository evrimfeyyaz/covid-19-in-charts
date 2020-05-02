import { useLocation } from 'react-router-dom';
import { getAbsoluteUrl } from '../utilities/urlUtilities';
import queryString from 'query-string';
import _ from 'lodash';

export function useCanonicalURL(paramsToKeep?: string[]) {
  const { pathname, search } = useLocation();

  let canonicalParams = queryString.parse(search);
  if (paramsToKeep != null) {
    canonicalParams = _.pick(canonicalParams, paramsToKeep);
  }

  const paramsString = queryString.stringify(canonicalParams);

  return getAbsoluteUrl(`${pathname}?${paramsString}`);
}
