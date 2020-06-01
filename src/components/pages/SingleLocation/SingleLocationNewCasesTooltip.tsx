import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { ValuesOnDateWithMovingAverage } from "../../../utilities/covid19APIUtilities";
import { prettifyMDYDate } from "../../../utilities/dateUtilities";
import { numToGroupedString } from "../../../utilities/numUtilities";

const SingleLocationNewCasesTooltip: FunctionComponent<TooltipProps> = ({ payload, active }) => {
  if (!active || payload == null) {
    return null;
  }

  const { date, newConfirmed, movingAverage } = payload[0].payload as ValuesOnDateWithMovingAverage;

  let movingAverageDiffMessage: string | null = null;
  let movingAverageDiffClass = "";
  if (movingAverage != null) {
    const movingAverageDiff = movingAverage - newConfirmed;

    movingAverageDiffMessage =
      movingAverageDiff > 0
        ? `${movingAverageDiff.toFixed(2)} below EMA`
        : `${Math.abs(movingAverageDiff).toFixed(2)} above EMA`;
    movingAverageDiffClass = movingAverageDiff > 0 ? "text-success" : "text-danger";
  }

  return (
    <div className="shadow rounded-lg bg-white border px-4 py-3">
      <p className="h5">
        {numToGroupedString(newConfirmed)} <span className="text-muted">new cases</span>
      </p>
      {movingAverageDiffMessage && (
        <p className={`mb-2 ${movingAverageDiffClass}`}>{movingAverageDiffMessage}</p>
      )}
      <p className="mb-0 text-muted">{prettifyMDYDate(date)}</p>
    </div>
  );
};

export default SingleLocationNewCasesTooltip;
