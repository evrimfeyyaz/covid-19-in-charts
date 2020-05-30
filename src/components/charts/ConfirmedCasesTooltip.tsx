import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { prettifyMDYDate } from "../../utilities/dateUtilities";
import { numToGroupedString } from "../../utilities/numUtilities";

interface ConfirmedCasesTooltipProps {
  payload: { payload: ValuesOnDate }[];
  active: boolean;
}

const ConfirmedCasesTooltip: FunctionComponent<ConfirmedCasesTooltipProps> = ({
  payload,
  active,
}) => {
  if (!active) {
    return null;
  }

  const { date, confirmed } = payload[0].payload;

  return (
    <div className="shadow rounded-lg bg-white border px-4 py-3">
      <p className="h5">{numToGroupedString(confirmed)}</p>
      <p className="mb-0 text-muted">{prettifyMDYDate(date)}</p>
    </div>
  );
};

export default ConfirmedCasesTooltip;
