/**
 * Returns aliases for a given location name, mainly to help make locations easier to find when
 * searching.
 *
 * @example
 * // Returns ["United States of America", "USA", "United States", "America", "States"]
 * getAliasesForLocation("US");
 *
 * @param location A location name from the "covid-19-api" library.
 */
export function getAliasesForLocation(location: string): string[] {
  if (location.includes("US")) {
    return ["United States of America", "USA", "United States", "America", "States"];
  } else if (location.includes("Korea, South")) {
    return ["South Korea"];
  } else if (location.includes("United Kingdom")) {
    return ["UK", "Great Britain", "Britain", "England"];
  } else if (location.includes("China")) {
    return ["PRC", "People's Republic of China"];
  } else if (location.includes("Czechia")) {
    return ["Czech Republic"];
  } else if (location.includes("United Arab Emirates")) {
    return ["UAE"];
  } else {
    return [];
  }
}

/**
 * Returns `true` if the given location should be preceded with the definite article.
 */
export function hasDefiniteArticle(location: string): boolean {
  const countriesWithDefiniteArticle = [
    "US",
    "United Kingdom",
    "United Arab Emirates",
    "Central African Republic",
    "Dominican Republic",
    "Holy See",
    "Maldives",
    "Philippines",
    "Netherlands",
    "Bahamas",
    "Gambia",
  ];

  return countriesWithDefiniteArticle.some((country) => location.includes(country));
}
