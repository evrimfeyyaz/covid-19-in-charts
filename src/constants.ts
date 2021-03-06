export const ROUTE_PATHS = {
  home: "/",
  about: "/about",
};

export const COLORS = {
  confirmed: "#e07804",
  deaths: "#da2d2d",
  recovered: "#0e8203",
  bgColor: "#e1e6ed",
  movingAverage: "#2d2dda",
  // From http://there4.io/2012/05/02/google-chart-color-list/
  graphColors: [
    "#3366CC",
    "#DC3912",
    "#FF9900",
    "#109618",
    "#990099",
    "#3B3EAC",
    "#0099C6",
    "#DD4477",
    "#66AA00",
    "#B82E2E",
    "#316395",
    "#994499",
    "#22AA99",
    "#AAAA11",
    "#6633CC",
    "#E67300",
    "#8B0707",
    "#329262",
    "#5574A6",
    "#3B3EAC",
  ],
};

export const EXTERNAL_LINKS = {
  gitHubRepo: "https://github.com/evrimfeyyaz/covid-19-in-charts",
  authorWebsite: "https://evrim.io",
  feedbackEmail: "hi@evrim.io",
};

export const SITE_INFO = {
  baseUrl: process.env.PUBLIC_URL.length > 0 ? process.env.PUBLIC_URL : "https://covid19.evrim.io",
  baseTitle: "COVID-19 in Charts",
  description: "See the latest data of the COVID-19 pandemic visualized.",
};

export const IMAGES = {
  og: "/images/og-image.jpg?9f089226-8723-4464-a103-4b01b96355da",
};
