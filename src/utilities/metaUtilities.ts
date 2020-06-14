/**
 * Creates a page title in a standard format.
 *
 * Returns the base title if no `pageName` is given.
 */
export function createPageTitle(baseTitle: string, pageName?: string): string {
  if (pageName == null) {
    return baseTitle;
  }

  return `${pageName} | ${baseTitle}`;
}
