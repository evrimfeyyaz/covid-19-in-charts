import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { ValuesOnDateWithActiveCasesRate } from "../../../../utilities/covid19APIUtilities";
import { prettifyMDYDate } from "../../../../utilities/dateUtilities";
import { numToPercentFactory } from "../../../../utilities/numUtilities";

/**
 * A Recharts tooltip component to show the details of all the data points on the overall chart.
 */
const SingleLocationOverallTooltip: FunctionComponent<TooltipProps> = ({ active, payload }) => {
  if (!active || payload == null) {
    return null;
  }

  const { date, mortalityRate, recoveryRate, activeCasesRate } = payload[0]
    .payload as ValuesOnDateWithActiveCasesRate;

  if (mortalityRate == null || recoveryRate == null || activeCasesRate == null) {
    return null;
  }

  const getPercentValue = numToPercentFactory(4);

  return (
    <div className="shadow rounded-lg bg-white border px-4 py-3">
      <p className="h6">
        {getPercentValue(activeCasesRate)} <span className="text-muted">active cases</span>
      </p>
      <p className="h6">
        {getPercentValue(mortalityRate)} <span className="text-muted">deaths</span>
      </p>
      <p className="h6">
        {getPercentValue(recoveryRate)} <span className="text-muted">recoveries</span>
      </p>
      <p className="mb-0 text-muted">{prettifyMDYDate(date)}</p>
    </div>
  );
};

export default SingleLocationOverallTooltip;
