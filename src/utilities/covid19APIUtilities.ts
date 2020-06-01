import { LocationData, ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import ema from "exponential-moving-average";

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

export function getValuesWithEMA(
  values: ValuesOnDate[],
  property: keyof Omit<ValuesOnDate, "date">,
  range: number
): ValuesOnDateWithMovingAverage[] {
  const allValuesOfProperty = values.map((valuesOnDate) => valuesOnDate[property] as number);

  const movingAveragePoints = [
    ...(Array.from({ length: range }).fill(null) as null[]),
    ...ema(allValuesOfProperty, range),
  ];

  return values.map((valuesOnDate, index) => ({
    ...valuesOnDate,
    movingAverage: movingAveragePoints[index],
  }));
}

export interface ValuesOnDateWithMovingAverage extends ValuesOnDate {
  movingAverage: number | null;
}
