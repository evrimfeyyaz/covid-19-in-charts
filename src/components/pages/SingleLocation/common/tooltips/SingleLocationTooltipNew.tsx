import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import {
  readableValuesOnDateKeys,
  ValuesOnDateWithMovingAverage,
} from "../../../../../utilities/covid19ApiUtilities";
import { numToGroupedString } from "../../../../../utilities/numUtilities";
import { SingleLocationTooltipBase } from "./SingleLocationTooltipBase";
import { SingleLocationTooltipEmaInfo } from "./SingleLocationTooltipEmaInfo";

interface SingleLocationTooltipNewProps extends TooltipProps {
  property: keyof Omit<ValuesOnDate, "date">;
}

/**
 * A Recharts tooltip component to shows the details of a chart plotting a daily new value, such as
 * new  cases.
 */
export const SingleLocationTooltipNew: FunctionComponent<SingleLocationTooltipNewProps> = ({
  property,
  active,
  payload,
}) => {
  if (!active || payload == null || payload.length === 0) {
    return null;
  }

  const values = payload[0].payload as ValuesOnDateWithMovingAverage;
  const value = values[property];
  const movingAverage = values.movingAverage;

  if (value == null) {
    return null;
  }

  const propName = readableValuesOnDateKeys[property];

  const emaDiffInfo =
    movingAverage != null ? (
      <SingleLocationTooltipEmaInfo
        value={value}
        chartUnit={propName}
        movingAverage={movingAverage}
      />
    ) : undefined;

  return (
    <SingleLocationTooltipBase
      value={numToGroupedString(value)}
      chartUnit={propName}
      secondaryInfo={emaDiffInfo}
      date={values.date}
    />
  );
};
