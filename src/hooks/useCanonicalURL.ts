import { useLocation } from 'react-router-dom';
import { getAbsoluteUrl } from '../utilities/urlUtilities';

export function useCanonicalURL() {
  const { pathname, search } = useLocation();

  return getAbsoluteUrl(`${pathname}${search}`);
}
