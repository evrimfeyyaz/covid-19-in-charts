import { LocationData } from "@evrimfeyyaz/covid-19-api";

export const valuesOnDateProperties = [
  "confirmed",
  "newConfirmed",
  "deaths",
  "newDeaths",
  "mortalityRate",
  "recovered",
  "newRecovered",
  "recoveryRate",
];

export function isValuesOnDateProperty(str: string): boolean {
  return valuesOnDateProperties.includes(str);
}

export function humanizePropertyName(propertyName: string): string {
  switch (propertyName) {
    case "confirmed":
      return "confirmed cases";
    case "date":
      return "date";
    case "deaths":
      return "deaths";
    case "mortalityRate":
      return "mortality rate";
    case "newConfirmed":
      return "new cases";
    case "newDeaths":
      return "new deaths";
    case "newRecovered":
      return "new recoveries";
    case "recovered":
      return "recoveries";
    case "recoveryRate":
      return "rate of recoveries";
    default:
      return "";
  }
}

export function stripDataBeforePropertyExceedsN(
  locationData: Readonly<LocationData>,
  property: string,
  n: number
): LocationData {
  if (!isValuesOnDateProperty(property)) {
    return locationData;
  }

  return {
    ...locationData,
    values: locationData.values.filter((value) => ((value as never)[property] ?? 0) > n),
  };
}
