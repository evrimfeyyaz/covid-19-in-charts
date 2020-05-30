import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { prettifyMDYDate } from "../../../utilities/dateUtilities";
import { numToGroupedString } from "../../../utilities/numUtilities";

const SingleLocationConfirmedCasesTooltip: FunctionComponent<TooltipProps> = ({
  payload,
  active,
}) => {
  if (!active || payload == null) {
    return null;
  }

  const { date, confirmed } = payload[0].payload as ValuesOnDate;

  return (
    <div className="shadow rounded-lg bg-white border px-4 py-3">
      <p className="h5">{numToGroupedString(confirmed)}</p>
      <p className="mb-0 text-muted">{prettifyMDYDate(date)}</p>
    </div>
  );
};

export default SingleLocationConfirmedCasesTooltip;
