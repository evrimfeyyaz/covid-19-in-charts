import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { Bar, ComposedChart, Line } from "recharts";
import { COLORS } from "../../../../../constants";
import { ValuesOnDateWithMovingAverage } from "../../../../../utilities/covid19APIUtilities";
import SingleLocationChartContainer from "./SingleLocationChartContainer";
import { SingleLocationChartProps } from "./SingleLocationChartProps";

/**
 * A bar chart that charts one values point and the exponential moving average of that values point of
 * a single location.
 */
const SingleLocationBarChartWithEMA: FunctionComponent<SingleLocationChartProps<
  ValuesOnDateWithMovingAverage,
  keyof ValuesOnDate
>> = (props) => {
  const { dataKey, name, color } = props;

  return (
    <SingleLocationChartContainer ChartComponent={ComposedChart} {...props}>
      <Bar dataKey={dataKey} opacity={0.9} fill={color} name={name} />
      <Line
        dataKey="movingAverage"
        dot={false}
        opacity={0.9}
        strokeWidth={2}
        stroke={COLORS.movingAverage}
      />
    </SingleLocationChartContainer>
  );
};

export default SingleLocationBarChartWithEMA;
