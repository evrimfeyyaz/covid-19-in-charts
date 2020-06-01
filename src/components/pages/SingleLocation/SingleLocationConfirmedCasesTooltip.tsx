import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { numToGroupedString } from "../../../utilities/numUtilities";
import SingleLocationTooltipBase from "./SingleLocationTooltipBase";

/**
 * A Recharts tooltip component to show the details of a data point on the confirmed cases chart.
 */
const SingleLocationConfirmedCasesTooltip: FunctionComponent<TooltipProps> = ({
  active,
  payload,
}) => {
  if (!active || payload == null) {
    return null;
  }

  const { date, confirmed } = payload[0].payload as ValuesOnDate;

  return (
    <SingleLocationTooltipBase value={numToGroupedString(confirmed)} unit="cases" date={date} />
  );
};

export default SingleLocationConfirmedCasesTooltip;
