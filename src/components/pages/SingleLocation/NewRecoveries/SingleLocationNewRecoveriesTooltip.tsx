import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { ValuesOnDateWithMovingAverage } from "../../../../utilities/covid19APIUtilities";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleLocationTooltipBase from "../SingleLocationTooltipBase";
import { getEMADiffMessage } from "../utils";

/**
 * A Recharts tooltip component to show the details of a data point on the new recoveries chart.
 */
const SingleLocationNewRecoveriesTooltip: FunctionComponent<TooltipProps> = ({
  active,
  payload,
}) => {
  if (!active || payload == null) {
    return null;
  }

  const { date, newRecovered, movingAverage } = payload[0].payload as ValuesOnDateWithMovingAverage;
  const chartUnit = "recoveries";

  if (newRecovered == null) {
    return null;
  }

  let movingAverageDiffMessage: string | undefined = undefined;
  if (movingAverage != null) {
    [movingAverageDiffMessage] = getEMADiffMessage(newRecovered, movingAverage, chartUnit);
  }

  return (
    <SingleLocationTooltipBase
      value={numToGroupedString(newRecovered)}
      chartUnit={chartUnit}
      secondaryInfo={movingAverageDiffMessage}
      date={date}
    />
  );
};

export default SingleLocationNewRecoveriesTooltip;
