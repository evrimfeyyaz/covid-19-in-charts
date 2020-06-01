import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { ValuesOnDateWithMovingAverage } from "../../../utilities/covid19APIUtilities";
import { numToGroupedString } from "../../../utilities/numUtilities";
import SingleLocationTooltipBase from "./SingleLocationTooltipBase";

/**
 * A Recharts tooltip component to show the details of a data point on the new cases chart.
 */
const SingleLocationNewCasesTooltip: FunctionComponent<TooltipProps> = ({ active, payload }) => {
  if (!active || payload == null) {
    return null;
  }

  const { date, newConfirmed, movingAverage } = payload[0].payload as ValuesOnDateWithMovingAverage;

  let movingAverageDiffMessage: string | undefined = undefined;
  let movingAverageDiffClass = "";
  if (movingAverage != null) {
    const movingAverageDiff = movingAverage - newConfirmed;

    movingAverageDiffMessage =
      movingAverageDiff > 0
        ? `${movingAverageDiff.toFixed(2)} new cases below EMA`
        : `${Math.abs(movingAverageDiff).toFixed(2)} new cases above EMA`;
    movingAverageDiffClass = movingAverageDiff > 0 ? "text-success" : "text-danger";
  }

  return (
    <SingleLocationTooltipBase
      value={numToGroupedString(newConfirmed)}
      unit="new cases"
      secondaryInfo={movingAverageDiffMessage}
      secondaryInfoClassName={movingAverageDiffClass}
      date={date}
    />
  );
};

export default SingleLocationNewCasesTooltip;
