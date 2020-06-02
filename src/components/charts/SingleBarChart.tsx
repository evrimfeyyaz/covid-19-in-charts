import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { Bar, ComposedChart, Line } from "recharts";
import { COLORS } from "../../constants";
import { ValuesOnDateWithMovingAverage } from "../../utilities/covid19APIUtilities";
import NoData from "../common/NoData";
import ChartContainer from "./ChartContainer";
import { ChartProps } from "./ChartProps";

/**
 * A bar chart that charts one data point and its exponential moving average for a single location.
 */
const SingleBarChart: FunctionComponent<ChartProps<
  ValuesOnDateWithMovingAverage[],
  keyof ValuesOnDate
>> = (props) => {
  const { data, dataKey, color, name } = props;

  let body = <NoData />;

  if (data != null && data.length > 0) {
    body = (
      <ChartContainer ChartComponent={ComposedChart} {...props}>
        <Bar dataKey={dataKey} opacity={0.9} fill={color} name={name} />
        <Line
          dataKey="movingAverage"
          dot={false}
          opacity={0.9}
          strokeWidth={2}
          stroke={COLORS.movingAverage}
        />
      </ChartContainer>
    );
  }

  return body;
};

export default SingleBarChart;
