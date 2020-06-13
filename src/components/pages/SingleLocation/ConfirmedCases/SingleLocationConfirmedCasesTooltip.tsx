import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import { SingleLocationTooltipBase } from "../common/charts/SingleLocationTooltipBase";

/**
 * A Recharts tooltip component to show the details of a values point on the confirmed cases chart.
 */
export const SingleLocationConfirmedCasesTooltip: FunctionComponent<TooltipProps> = ({
  active,
  payload,
}) => {
  if (!active || payload == null || payload.length === 0) {
    return null;
  }

  const { date, confirmed } = payload[0].payload as ValuesOnDate;

  return (
    <SingleLocationTooltipBase
      value={numToGroupedString(confirmed)}
      chartUnit="cases"
      date={date}
    />
  );
};
