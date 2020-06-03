import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { Bar, ComposedChart, Line } from "recharts";
import { COLORS } from "../../../../../constants";
import { ValuesOnDateWithMovingAverage } from "../../../../../utilities/covid19APIUtilities";
import SingleLocationChartContainer from "./SingleLocationChartContainer";
import { SingleLocationChartProps } from "./SingleLocationChartProps";

/**
 * A bar chart that charts a single data point, and optionally its exponential moving average, of a
 * single location.
 */
const SingleLocationBarChart: FunctionComponent<SingleLocationChartProps<
  ValuesOnDateWithMovingAverage | ValuesOnDate,
  keyof ValuesOnDate
>> = (props) => {
  const { dataKey, name, color, data } = props;

  const hasMovingAverage =
    (data as ValuesOnDateWithMovingAverage[])[data.length - 1]["movingAverage"] != null;

  return (
    <SingleLocationChartContainer ChartComponent={ComposedChart} {...props}>
      <Bar dataKey={dataKey} opacity={0.9} fill={color} name={name} />
      {hasMovingAverage && (
        <Line
          dataKey="movingAverage"
          dot={false}
          opacity={0.9}
          strokeWidth={2}
          stroke={COLORS.movingAverage}
        />
      )}
    </SingleLocationChartContainer>
  );
};

export default SingleLocationBarChart;
