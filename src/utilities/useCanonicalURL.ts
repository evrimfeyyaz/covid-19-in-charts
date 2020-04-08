import { useLocation } from 'react-router-dom';
import { SITE_INFO } from '../constants';

export function useCanonicalURL() {
  const { pathname, search } = useLocation();

  return `${SITE_INFO.baseUrl}${pathname}${search}`;
}
