import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React from "react";
import { COLORS } from "../../../constants";
import {
  getValuesWithEMA,
  ValuesOnDateWithMovingAverage,
} from "../../../utilities/covid19APIUtilities";
import { prettifyMDYDate } from "../../../utilities/dateUtilities";

type UseEMAInSectionReturnValue = [ValuesOnDateWithMovingAverage[], JSX.Element | null];

/**
 * A React hook for getting a given dataset with exponential moving average data added, and getting
 * a message related to the EMA to use within the section.
 *
 * @param values The data to add EMA to.
 * @param property The property to use within the data for the EMA calculation, e.g.
 *   "newConfirmed".
 * @param chartUnit The unit for the chart data. For example, the unit for the new cases chart is
 *   "cases," and the unit for the new deaths chart is "deaths."
 * @param range The range for the EMA calculation. For example, if this is set to 12 then a 12-day
 *   exponential moving average is calculated for the data.
 * @returns An array containing the following values: Data with EMA, the JSX element containing the
 *   EMA info message (or null if EMA couldn't be calculated).
 */
export function useEMAInSection(
  values: ValuesOnDate[],
  property: keyof Omit<ValuesOnDate, "date">,
  chartUnit: string,
  range: number
): UseEMAInSectionReturnValue {
  const valuesWithEMA = getValuesWithEMA(values, property, range);

  const lastValues = valuesWithEMA[valuesWithEMA.length - 1];
  const lastValueOfEMA = lastValues.movingAverage;
  const lastValueOfProperty = lastValues[property] ?? 0;
  const lastDate = lastValues.date;

  let lastEMAState: JSX.Element | null = null;
  if (lastValueOfEMA != null) {
    const emaDiff = lastValueOfEMA - lastValueOfProperty;

    const messageStyle = emaDiff > 0 ? "text-success" : "text-danger";
    const aboveOrBelow = emaDiff > 0 ? "below" : "above";

    lastEMAState = (
      <span>
        {prettifyMDYDate(lastDate)} was{" "}
        <span className={messageStyle}>
          {Math.abs(emaDiff).toFixed(2)} {chartUnit} {aboveOrBelow}
        </span>{" "}
        the moving average.
      </span>
    );
  }

  const emaMessage =
    lastEMAState != null ? (
      <p>
        You can also see the{" "}
        <span
          className="more-info"
          style={{
            borderColor: COLORS.movingAverage,
            color: COLORS.movingAverage,
          }}
        >
          {range}-day exponential moving average
        </span>{" "}
        line below. {lastEMAState}
      </p>
    ) : null;

  return [valuesWithEMA, emaMessage];
}
