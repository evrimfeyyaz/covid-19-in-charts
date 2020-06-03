import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { Line, LineChart } from "recharts";
import SingleLocationChartContainer from "./SingleLocationChartContainer";
import { SingleLocationChartProps } from "./SingleLocationChartProps";

/**
 * A line chart that charts one values point for a single location.
 */
const SingleLocationLineChart: FunctionComponent<SingleLocationChartProps<
  ValuesOnDate,
  keyof ValuesOnDate
>> = (props) => {
  const { dataKey, name, color } = props;

  return (
    <SingleLocationChartContainer ChartComponent={LineChart} {...props}>
      <Line
        dataKey={dataKey}
        opacity={0.9}
        stroke={color}
        strokeWidth={3}
        name={name}
        dot={false}
      />
    </SingleLocationChartContainer>
  );
};

export default SingleLocationLineChart;
