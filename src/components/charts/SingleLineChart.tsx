import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { Line, LineChart } from "recharts";
import NoData from "../common/NoData";
import ChartContainer from "./ChartContainer";
import { ChartProps } from "./ChartProps";

/**
 * A line chart that charts one data point for a single location.
 */
const SingleLineChart: FunctionComponent<ChartProps<ValuesOnDate[], keyof ValuesOnDate>> = (
  props
) => {
  const { data, dataKey, color, name } = props;

  let body = <NoData />;

  if (data.length > 0) {
    body = (
      <ChartContainer ChartComponent={LineChart} {...props}>
        <Line
          type="monotone"
          dataKey={dataKey}
          opacity={0.9}
          stroke={color}
          strokeWidth={3}
          name={name}
          dot={false}
        />
      </ChartContainer>
    );
  }

  return body;
};

export default SingleLineChart;
