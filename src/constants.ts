export const ROUTE_PATHS = {
  home: '/',
  casesRecoveriesDeaths: '/cases-recoveries-deaths',
  dailyNumbers: '/daily-numbers',
  locationComparison: '/location-comparison',
  about: '/about',
};

export const ROUTE_TITLES = {
  casesRecoveriesDeaths: 'Cases, Recoveries & Deaths',
  dailyNumbers: 'Daily Numbers',
  locationComparison: 'Compare Locations',
};

export const COLORS = {
  confirmed: '#f6da63',
  newConfirmed: '#eb8242',
  deaths: '#da2d2d',
  recovered: '#18a70a',
  bgColor: '#e1e6ed',
  // From http://there4.io/2012/05/02/google-chart-color-list/
  graphColors: [
    '#3366CC',
    '#DC3912',
    '#FF9900',
    '#109618',
    '#990099',
    '#3B3EAC',
    '#0099C6',
    '#DD4477',
    '#66AA00',
    '#B82E2E',
    '#316395',
    '#994499',
    '#22AA99',
    '#AAAA11',
    '#6633CC',
    '#E67300',
    '#8B0707',
    '#329262',
    '#5574A6',
    '#3B3EAC',
  ],
};

export const EXTERNAL_LINKS = {
  gitHubRepo: 'https://github.com/evrimfeyyaz/covid-19-in-charts',
  authorTwitter: 'https://twitter.com/evrimfeyyaz',
  authorWebsite: 'https://evrim.io',
  feedbackEmail: 'feedback@covid19incharts.com',
};

export const SITE_INFO = {
  baseUrl: process.env.PUBLIC_URL.length > 0 ? process.env.PUBLIC_URL : 'https://covid19incharts.com',
  baseTitle: 'COVID-19 in Charts',
  description: 'Various data related to COVID-19 visualized.',
};

export const IMAGES = {
  og: '/images/og-image.jpg?9f089226-8723-4464-a103-4b01b96355da',
  casesRecoveriesDeathsOg: '/images/cases-recoveries-and-deaths-og.jpg',
  casesRecoveriesDeathsCard: '/images/cases-recoveries-and-deaths-card.jpg',
  dailyNumbersOg: '/images/daily-numbers-og.jpg',
  dailyNumbersCard: '/images/daily-numbers-card.jpg',
};
