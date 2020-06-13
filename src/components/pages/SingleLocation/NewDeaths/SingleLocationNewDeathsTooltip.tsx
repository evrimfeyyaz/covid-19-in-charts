import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { ValuesOnDateWithMovingAverage } from "../../../../utilities/covid19ApiUtilities";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import { SingleLocationTooltipBase } from "../common/charts/SingleLocationTooltipBase";
import { SingleLocationTooltipEmaInfo } from "../common/charts/SingleLocationTooltipEmaInfo";

/**
 * A Recharts tooltip component to show the details of a values point on the new deaths chart.
 */
export const SingleLocationNewDeathsTooltip: FunctionComponent<TooltipProps> = ({
  active,
  payload,
}) => {
  if (!active || payload == null || payload.length === 0) {
    return null;
  }

  const { date, newDeaths, movingAverage } = payload[0].payload as ValuesOnDateWithMovingAverage;
  const chartUnit = "deaths";

  if (newDeaths == null) {
    return null;
  }

  const emaDiffInfo =
    movingAverage != null ? (
      <SingleLocationTooltipEmaInfo
        value={newDeaths}
        chartUnit={chartUnit}
        movingAverage={movingAverage}
      />
    ) : undefined;

  return (
    <SingleLocationTooltipBase
      value={numToGroupedString(newDeaths)}
      chartUnit={chartUnit}
      secondaryInfo={emaDiffInfo}
      date={date}
    />
  );
};
