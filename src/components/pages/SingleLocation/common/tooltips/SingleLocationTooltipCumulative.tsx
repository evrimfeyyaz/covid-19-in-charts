import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { readableValuesOnDateKeys } from "../../../../../utilities/covid19ApiUtilities";
import { numToGroupedString } from "../../../../../utilities/numUtilities";
import { SingleLocationTooltipBase } from "./SingleLocationTooltipBase";

interface SingleLocationTooltipCumulativeProps extends TooltipProps {
  property: keyof Omit<ValuesOnDate, "date">;
}

/**
 * A Recharts tooltip component to shows the details of a chart plotting a cumulative value, such as
 * confirmed cases.
 */
export const SingleLocationTooltipCumulative: FunctionComponent<SingleLocationTooltipCumulativeProps> = ({
  property,
  active,
  payload,
}) => {
  if (!active || payload == null || payload.length === 0) {
    return null;
  }

  const values = payload[0].payload as ValuesOnDate;
  const value = values[property];

  if (value == null) {
    return null;
  }

  const propName = readableValuesOnDateKeys[property];

  return (
    <SingleLocationTooltipBase
      value={numToGroupedString(value)}
      chartUnit={propName}
      date={values.date}
    />
  );
};
