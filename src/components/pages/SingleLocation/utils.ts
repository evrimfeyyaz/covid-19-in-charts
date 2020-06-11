import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import { dateKeyToDate, getReadableDate } from "../../../utilities/dateUtilities";
import { numToGroupedString, numToPercentFactory } from "../../../utilities/numUtilities";

/**
 * Returns a message showing the difference between the actual value and the moving average. This
 * is used in tooltips, e.g. showing the difference between the new cases value on a day and the
 * moving average on that day.
 *
 * @param value The actual value, e.g. the new cases value on a certain day.
 * @param movingAverage The moving average on a certain day.
 * @param chartUnit The unit of the chart values. For example, the unit for the new cases chart is
 *   "cases," and the unit for the new deaths chart is "deaths."
 * @returns An array with two elements, the first element is the message, the second element is the
 *   CSS class to be used when showing the message.
 */
export function getEMADiffMessage(
  value: number,
  movingAverage: number,
  chartUnit: string
): [string, string] {
  const movingAverageDiff = movingAverage - value;

  const message =
    movingAverageDiff > 0
      ? `${movingAverageDiff.toFixed(2)} ${chartUnit} below EMA`
      : `${Math.abs(movingAverageDiff).toFixed(2)} ${chartUnit} above EMA`;
  const className = movingAverageDiff > 0 ? "text-success" : "text-danger";

  return [message, className];
}

export interface FormattedValuesOnDate {
  date: string;
  confirmed: string;
  deaths?: string;
  recovered?: string;
  newConfirmed: string;
  newDeaths?: string;
  mortalityRate?: string;
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
    date: getReadableDate(dateKeyToDate(values.date)),
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

  if (values.mortalityRate != null) {
    formattedValues.mortalityRate = numToPercentFactory(2)(values.mortalityRate);
  }

  if (values.recoveryRate != null) {
    formattedValues.recoveryRate = numToPercentFactory(2)(values.recoveryRate);
  }

  if (values.activeCases != null) {
    formattedValues.activeCases = numToGroupedString(values.activeCases);
  }

  return formattedValues;
}
