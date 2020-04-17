export function getAliasesForLocation(location: string): string[] {
  switch (location) {
    case 'US':
      return ['United States of America', 'USA', 'United States', 'America', 'States'];
    case 'Korea, South':
      return ['South Korea'];
    case 'United Kingdom':
      return ['UK', 'Great Britain', 'Britain', 'England'];
    case 'China':
      return ['PRC', 'People\'s Republic of China'];
    case 'Czechia':
      return ['Czech Republic'];
    case 'United Arab Emirates':
      return ['UAE'];
    default:
      return [];
  }
}
