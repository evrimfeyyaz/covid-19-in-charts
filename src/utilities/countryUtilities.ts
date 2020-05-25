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
