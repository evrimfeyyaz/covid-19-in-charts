import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import {
  getFormattedValuesOnDate,
  ValuesOnDateWithMovingAverage,
} from "../../../../utilities/covid19ApiUtilities";

interface EmaMessageProps {
  /**
   * Values with exponential moving average data added.
   */
  values: ValuesOnDateWithMovingAverage[];
  /**
   * The property of the values object that was used for the exponential moving average calculation.
   */
  property: keyof Omit<ValuesOnDate, "date">;
  /**
   * The unit for the chart values. For example, the unit for the new cases chart is "cases," and
   * the unit for the new deaths chart is "deaths."
   */
  chartUnit: string;
  /**
   * The range that was used for the EMA calculation. For example, if this is 12, it means a 12-day
   * exponential moving average was calculated for the values.
   */
  range: number;
}

/**
 * A component that show a simple explanation of the exponential moving average values of a dataset.
 */
export const EmaMessage: FunctionComponent<EmaMessageProps> = ({
  values,
  property,
  chartUnit,
  range,
}) => {
  if (values.length === 0) {
    return null;
  }

  const lastValues = values[values.length - 1];
  const lastValueOfEma = lastValues.movingAverage;
  const lastValueOfProperty = lastValues[property] ?? 0;

  if (lastValueOfEma == null) {
    return null;
  }

  const readableLastValues = getFormattedValuesOnDate(lastValues);

  const emaDiff = lastValueOfEma - lastValueOfProperty;

  const messageStyle = emaDiff > 0 ? "text-success" : "text-danger";
  const aboveOrBelow = emaDiff > 0 ? "below" : "above";

  const lastEmaState = (
    <span>
      {readableLastValues.date} was{" "}
      <span className={messageStyle}>
        {Math.abs(emaDiff).toFixed(2)} {chartUnit} {aboveOrBelow}
      </span>{" "}
      the moving average.
    </span>
  );

  return (
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
      line below. {lastEmaState}
    </p>
  );
};
