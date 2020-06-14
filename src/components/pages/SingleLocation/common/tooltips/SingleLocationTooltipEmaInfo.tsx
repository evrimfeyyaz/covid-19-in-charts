import React, { FunctionComponent } from "react";

interface SingleLocationTooltipEmaInfoProps {
  /**
   * The actual value, e.g. the new cases value on a certain day.
   */
  value: number;
  /**
   * The moving average for the same day as the value.
   */
  movingAverage: number;
  /**
   * The unit of the chart values. For example, the unit for the new cases chart is "cases," and
   * the unit for the new deaths chart is "deaths."
   */
  chartUnit: string;
}

/**
 * A component showing the difference between a value and the moving average on the same day. This
 * is used in tooltips, e.g. showing the difference between the new cases value on a day and the
 * moving average on that day.
 */
export const SingleLocationTooltipEmaInfo: FunctionComponent<SingleLocationTooltipEmaInfoProps> = ({
  value,
  movingAverage,
  chartUnit,
}) => {
  const movingAverageDiff = movingAverage - value;

  const message =
    movingAverageDiff > 0
      ? `${movingAverageDiff.toFixed(2)} ${chartUnit} below EMA`
      : `${Math.abs(movingAverageDiff).toFixed(2)} ${chartUnit} above EMA`;
  const className = movingAverageDiff > 0 ? "text-success" : "text-danger";

  return <p className={`mb-2 ${className}`}>{message}</p>;
};
