import { SITE_INFO } from "../constants";

export function getAbsoluteUrl(path: string): string {
  return `${SITE_INFO.baseUrl}${path}`;
}
