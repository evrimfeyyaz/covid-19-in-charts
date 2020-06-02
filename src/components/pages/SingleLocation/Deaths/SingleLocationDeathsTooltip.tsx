import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleLocationTooltipBase from "../common/charts/SingleLocationTooltipBase";

/**
 * A Recharts tooltip component to show the details of a data point on the deaths chart.
 */
const SingleLocationDeathsTooltip: FunctionComponent<TooltipProps> = ({ active, payload }) => {
  if (!active || payload == null) {
    return null;
  }

  const { date, deaths } = payload[0].payload as ValuesOnDate;

  if (deaths == null) {
    return null;
  }

  return (
    <SingleLocationTooltipBase value={numToGroupedString(deaths)} chartUnit="deaths" date={date} />
  );
};

export default SingleLocationDeathsTooltip;
