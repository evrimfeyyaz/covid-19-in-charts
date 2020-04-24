export const ROUTE_PATHS = {
  home: '/',
  casesInLocation: '/cases-recoveries-deaths',
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
  og: 'og-image-50c88857-acd2-4184-8b6c-16f7285fb125.jpg',
  moreVisualizationsCard: 'more-visualizations-card-ebc8edc5-3a41-406d-9b71-2b7b35a4274c.jpg',
  casesInLocationOg: 'cases-recoveries-and-deaths-og-8fdad90e-16d9-4970-8c2f-93469969b3a0.jpg',
  casesInLocationCard: 'cases-recoveries-and-deaths-card-ab5f29d1-3f9e-4cb2-b79b-4cf99d4a1832.jpg',
  dailyNumbersOg: 'daily-numbers-og-308c447b-b709-409b-967d-371ed19d2584.jpg',
  dailyNumbersCard: 'daily-numbers-card-21dd3430-1b72-46ea-b946-a29abb45bbc7.jpg',
}
