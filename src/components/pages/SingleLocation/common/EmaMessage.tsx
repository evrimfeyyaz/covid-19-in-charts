import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import {
  getFormattedValuesOnDate,
  ValuesOnDateWithMovingAverage,
} from "../../../../utilities/covid19ApiUtilities";
import { MoreInfo } from "./MoreInfo";

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

  const formattedLastValues = getFormattedValuesOnDate(lastValues);

  const emaDiff = lastValueOfEma - lastValueOfProperty;

  const messageStyle = emaDiff > 0 ? "text-success" : "text-danger";
  const aboveOrBelow = emaDiff > 0 ? "below" : "above";

  const lastEmaState = (
    <span>
      {formattedLastValues.date} was{" "}
      <span className={messageStyle}>
        {Math.abs(emaDiff).toFixed(2)} {chartUnit} {aboveOrBelow}
      </span>{" "}
      the moving average.
    </span>
  );

  const emaExplanation =
    "This is a method that smooths out the day-to-day fluctuations, and shows the longer-term trend. Any point above this line pulls the trend upwards (i.e. relatively bad), and any point below pulls the trend downwards (i.e. relatively good).";
  const emaText = (
    <MoreInfo
      text={`${range}-day exponential moving average`}
      info={emaExplanation}
      color={COLORS.movingAverage}
      title="Exponential Moving Average"
    />
  );

  return (
    <p>
      You can also see the {emaText} line below. {lastEmaState}
    </p>
  );
};
