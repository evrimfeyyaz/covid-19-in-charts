import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import { SingleLocationTooltipBase } from "../common/charts/SingleLocationTooltipBase";

/**
 * A Recharts tooltip component to show the details of a values point on the recoveries chart.
 */
export const SingleLocationRecoveriesTooltip: FunctionComponent<TooltipProps> = ({
  active,
  payload,
}) => {
  if (!active || payload == null) {
    return null;
  }

  const { date, recovered } = payload[0].payload as ValuesOnDate;

  if (recovered == null) {
    return null;
  }

  return (
    <SingleLocationTooltipBase
      value={numToGroupedString(recovered)}
      chartUnit="recoveries"
      date={date}
    />
  );
};
