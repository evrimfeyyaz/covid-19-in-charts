import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { ValuesOnDateWithMovingAverage } from "../../../../utilities/covid19ApiUtilities";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import { SingleLocationTooltipBase } from "../common/charts/SingleLocationTooltipBase";

/**
 * A Recharts tooltip component to show the details of a values point on the new recoveries chart.
 */
export const SingleLocationNewRecoveriesTooltip: FunctionComponent<TooltipProps> = ({
  active,
  payload,
}) => {
  if (!active || payload == null) {
    return null;
  }

  const { date, newRecovered } = payload[0].payload as ValuesOnDateWithMovingAverage;
  const chartUnit = "recoveries";

  if (newRecovered == null) {
    return null;
  }

  return (
    <SingleLocationTooltipBase
      value={numToGroupedString(newRecovered)}
      chartUnit={chartUnit}
      date={date}
    />
  );
};
