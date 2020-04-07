export function createPageTitle(title?: string) {
  const baseTitle = 'COVID-19 in Charts';

  if (title == null) {
    return baseTitle;
  }

  return `${title} | ${baseTitle}`;
}
