import { LocationData, ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import ema from "exponential-moving-average";
import { dateKeyToDate, getFormattedDate } from "./dateUtilities";
import { numToGroupedString, numToPercentFactory } from "./numUtilities";

/**
 * Contains the names of `ValuesOnDate` keys that can be used in texts.
 */
export const readableValuesOnDateKeys: { [key in keyof Omit<ValuesOnDate, "date">]: string } = {
  confirmed: "confirmed cases",
  newConfirmed: "new cases",
  caseFatalityRate: "case fatality rate",
  recovered: "recoveries",
  recoveryRate: "recovery rate",
  newRecovered: "new recoveries",
  newDeaths: "new deaths",
  deaths: "deaths",
  activeCases: "active cases",
};

/**
 * Given an object implementing the `LocationData` interface (which is the data returned by the
 * "covid-19-api" library), filters out all the data before the confirmed cases exceeded a certain
 * number.
 *
 * Useful for calculating things such as "only show the values after the confirmed cases exceeded
 * 100."
 *
 * @param locationData
 * @param n The value that the confirmed cases should exceed to be included in the filtered data.
 */
export function filterDatesWithMinConfirmedCases(
  locationData: Readonly<LocationData>,
  n: number
): LocationData {
  return {
    ...locationData,
    values: locationData.values.filter((value) => value.confirmed > n),
  };
}

export interface ValuesOnDateWithMovingAverage extends ValuesOnDate {
  movingAverage?: number | null;
}

/**
 * Adds exponential moving average to the given values object array.
 *
 * @param values
 * @param property The property on which the exponential moving average calculation is based.
 * @param range The range of the exponential moving average calculation, e.g. 12 yields a 12-day
 *   exponential moving average.
 * @returns An object that implements {@link ValuesOnDateWithMovingAverage}, or `null` if the
 *   length of `values` is smaller than `range`.
 */
export function getValuesWithEma(
  values: readonly ValuesOnDate[],
  property: keyof Omit<ValuesOnDate, "date">,
  range: number
): ValuesOnDateWithMovingAverage[] | null {
  if (values.length < range) {
    return null;
  }

  const allValuesOfProperty = values.map((valuesOnDate) => valuesOnDate[property] as number);

  const movingAveragePoints = [
    ...(Array.from({ length: range }).fill(null) as null[]),
    ...ema(allValuesOfProperty, { range, format: (num) => num }),
  ];

  return values.map((valuesOnDate, index) => ({
    ...valuesOnDate,
    movingAverage: movingAveragePoints[index],
  }));
}

export interface ValuesOnDateWithActiveCasesRate extends ValuesOnDate {
  /**
   * The rate of active cases, e.g. this would be 0.1 if 10% of the confirmed cases were active.
   */
  activeCasesRate: number | null;
}

/**
 * Adds active cases rate to the given values object array. For example, if the percentage of active
 * cases on a given date is 10%, this adds a property containing `0.1` to the object.
 *
 * @param values
 */
export function getValuesWithActiveCasesRate(
  values: readonly ValuesOnDate[]
): ValuesOnDateWithActiveCasesRate[] {
  return values.map((valuesOnDate) => ({
    ...valuesOnDate,
    activeCasesRate:
      valuesOnDate.caseFatalityRate != null && valuesOnDate.recoveryRate != null
        ? 1 - (valuesOnDate.caseFatalityRate + valuesOnDate.recoveryRate)
        : null,
  }));
}

/**
 * Returns the singular or plural version of a property name depending on the given amount.
 *
 * @param property The name of the property.
 * @param value The value of the property.
 */
export function pluralizeProperty(
  property: keyof Omit<ValuesOnDate, "date" | "caseFatalityRate" | "recoveryRate">,
  value: number
): string {
  const propertyNames: (keyof ValuesOnDate)[] = [
    "confirmed",
    "deaths",
    "recovered",
    "newConfirmed",
    "newDeaths",
    "newRecovered",
    "activeCases",
  ];

  const pluralWords = [
    "confirmed cases",
    "deaths",
    "recoveries",
    "new cases",
    "new deaths",
    "new recoveries",
    "active cases",
  ];

  const singularWords = [
    "confirmed case",
    "death",
    "recovery",
    "new case",
    "new death",
    "new recovery",
    "active case",
  ];

  const wordIndex = propertyNames.indexOf(property);

  return value === 1 ? singularWords[wordIndex] : pluralWords[wordIndex];
}

export interface FormattedValuesOnDate {
  date: string;
  confirmed: string;
  deaths?: string;
  recovered?: string;
  newConfirmed: string;
  newDeaths?: string;
  caseFatalityRate?: string;
  newRecovered?: string;
  recoveryRate?: string;
  activeCases?: string;
}

/**
 * Returns a formatted version of all values in a `ValuesOnDate` object.
 *
 * For example, `"1/23/20"` is converted to `"Jan 23, 2020"`, and `10000` is converted to
 * `"10,000"`.
 */
export function getFormattedValuesOnDate(values: ValuesOnDate): FormattedValuesOnDate {
  const formattedValues: FormattedValuesOnDate = {
    date: getFormattedDate(dateKeyToDate(values.date)),
    confirmed: numToGroupedString(values.confirmed),
    newConfirmed: numToGroupedString(values.newConfirmed),
  };

  if (values.deaths != null) {
    formattedValues.deaths = numToGroupedString(values.deaths);
  }

  if (values.recovered != null) {
    formattedValues.recovered = numToGroupedString(values.recovered);
  }

  if (values.newDeaths != null) {
    formattedValues.newDeaths = numToGroupedString(values.newDeaths);
  }

  if (values.newRecovered != null) {
    formattedValues.newRecovered = numToGroupedString(values.newRecovered);
  }

  if (values.caseFatalityRate != null) {
    formattedValues.caseFatalityRate = numToPercentFactory(2)(values.caseFatalityRate);
  }

  if (values.recoveryRate != null) {
    formattedValues.recoveryRate = numToPercentFactory(2)(values.recoveryRate);
  }

  if (values.activeCases != null) {
    formattedValues.activeCases = numToGroupedString(values.activeCases);
  }

  return formattedValues;
}
