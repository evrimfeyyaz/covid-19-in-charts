import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { ValuesOnDateWithMovingAverage } from "../../../../utilities/covid19ApiUtilities";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleLocationTooltipBase from "../common/charts/SingleLocationTooltipBase";
import { getEMADiffMessage } from "../utils";

/**
 * A Recharts tooltip component to show the details of a values point on the new cases chart.
 */
const SingleLocationNewCasesTooltip: FunctionComponent<TooltipProps> = ({ active, payload }) => {
  if (!active || payload == null) {
    return null;
  }

  const { date, newConfirmed, movingAverage } = payload[0].payload as ValuesOnDateWithMovingAverage;
  const chartUnit = "cases";

  let movingAverageDiffMessage: string | undefined = undefined;
  let movingAverageDiffClass = "";
  if (movingAverage != null) {
    [movingAverageDiffMessage, movingAverageDiffClass] = getEMADiffMessage(
      newConfirmed,
      movingAverage,
      chartUnit
    );
  }

  return (
    <SingleLocationTooltipBase
      value={numToGroupedString(newConfirmed)}
      chartUnit={chartUnit}
      secondaryInfo={movingAverageDiffMessage}
      secondaryInfoClassName={movingAverageDiffClass}
      date={date}
    />
  );
};

export default SingleLocationNewCasesTooltip;
