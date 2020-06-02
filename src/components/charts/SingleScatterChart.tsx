import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { ComposedChart, Scatter, ZAxis } from "recharts";
import NoData from "../common/NoData";
import ChartContainer from "./ChartContainer";
import { ChartProps } from "./ChartProps";

/**
 * A scatter chart that charts one data point and its trend for a single location.
 */
const SingleScatterChart: FunctionComponent<ChartProps<ValuesOnDate[], keyof ValuesOnDate>> = (
  props
) => {
  const { data, dataKey, color, name } = props;

  let body = <NoData />;

  if (data != null && data.length > 0) {
    body = (
      <ChartContainer ChartComponent={ComposedChart} {...props}>
        <ZAxis range={[15, 0]} />
        <Scatter dataKey={dataKey} opacity={0.9} width={0} fill={color} name={name} />
      </ChartContainer>
    );
  }

  return body;
};

export default SingleScatterChart;
