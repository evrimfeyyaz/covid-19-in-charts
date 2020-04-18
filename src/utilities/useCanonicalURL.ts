import { useLocation } from 'react-router-dom';
import { getAbsoluteUrl } from './urlUtilities';

export function useCanonicalURL() {
  const { pathname, search } = useLocation();

  return getAbsoluteUrl(`${pathname}${search}`);
}
