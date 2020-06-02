import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { numToPercentageFactory } from "../../../../utilities/numUtilities";
import SingleLocationTooltipBase from "../SingleLocationTooltipBase";

/**
 * A Recharts tooltip component to show the details of a data point on the mortality rate chart.
 */
const SingleLocationMortalityRateTooltip: FunctionComponent<TooltipProps> = ({
  active,
  payload,
}) => {
  if (!active || payload == null) {
    return null;
  }

  const { date, mortalityRate } = payload[0].payload as ValuesOnDate;

  if (mortalityRate == null) {
    return null;
  }

  return <SingleLocationTooltipBase value={numToPercentageFactory(4)(mortalityRate)} date={date} />;
};

export default SingleLocationMortalityRateTooltip;
