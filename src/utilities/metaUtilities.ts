import { SITE_INFO } from '../constants';

export function createPageTitle(title?: string) {
  const { baseTitle } = SITE_INFO;

  if (title == null) {
    return baseTitle;
  }

  return `${title} | ${baseTitle}`;
}
