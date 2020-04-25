export const ROUTE_PATHS = {
  home: '/',
  casesRecoveriesDeaths: '/cases-recoveries-deaths',
  countryStateComparison: '/country-state-comparison',
  dailyNumbers: '/daily-numbers',
  about: '/about',
};

export const COLORS = {
  confirmed: '#f6da63',
  newConfirmed: '#eb8242',
  deaths: '#da2d2d',
  recovered: '#18a70a',
  bgColor: '#e1e6ed',
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

export const SETTINGS = {
  defaultLocation: 'US',
};

export const IMAGES = {
  og: '/images/og-image.jpg?9f089226-8723-4464-a103-4b01b96355da',
  moreVisualizationsCard: '/images/more-visualizations-card.jpg',
  casesRecoveriesDeathsOg: '/images/cases-recoveries-and-deaths-og.jpg',
  casesRecoveriesDeathsCard: '/images/cases-recoveries-and-deaths-card.jpg',
  dailyNumbersOg: '/images/daily-numbers-og.jpg',
  dailyNumbersCard: '/images/daily-numbers-card.jpg',
};
