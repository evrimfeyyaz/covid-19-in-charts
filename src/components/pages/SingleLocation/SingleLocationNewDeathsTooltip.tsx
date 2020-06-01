import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { ValuesOnDateWithMovingAverage } from "../../../utilities/covid19APIUtilities";
import { numToGroupedString } from "../../../utilities/numUtilities";
import SingleLocationTooltipBase from "./SingleLocationTooltipBase";
import { getEMADiffMessage } from "./utils";

/**
 * A Recharts tooltip component to show the details of a data point on the new deaths chart.
 */
const SingleLocationNewDeathsTooltip: FunctionComponent<TooltipProps> = ({ active, payload }) => {
  if (!active || payload == null) {
    return null;
  }

  const { date, newDeaths, movingAverage } = payload[0].payload as ValuesOnDateWithMovingAverage;
  const chartUnit = "deaths";

  if (newDeaths == null) {
    return null;
  }

  let movingAverageDiffMessage: string | undefined = undefined;
  let movingAverageDiffClass = "";
  if (movingAverage != null) {
    [movingAverageDiffMessage, movingAverageDiffClass] = getEMADiffMessage(
      newDeaths,
      movingAverage,
      chartUnit
    );
  }

  return (
    <SingleLocationTooltipBase
      value={numToGroupedString(newDeaths)}
      chartUnit={chartUnit}
      secondaryInfo={movingAverageDiffMessage}
      secondaryInfoClassName={movingAverageDiffClass}
      date={date}
    />
  );
};

export default SingleLocationNewDeathsTooltip;
