import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { numToGroupedString } from "../../utilities/numUtilities";
import NoData from "../common/NoData";

interface SingleBarChartProps {
  /**
   * The data to chart.
   */
  data: (ValuesOnDate & { movingAverage: number | null })[];
  /**
   * The key in the `data` object to use for charting.
   */
  dataKey: string;
  /**
   * The color of the line.
   */
  color: string;
  /**
   * The human-readable name of the data that is charted.
   */
  name: string;
  /**
   * The title of the x axis.
   */
  xAxisTitle: string;
  /**
   * The title of the y axis.
   */
  yAxisTitle: string;
  /**
   * A tooltip component that can be used in a Recharts chart.
   */
  tooltipComponent: React.ReactElement | React.FunctionComponent;
  /**
   * The color of the moving average line in the chart.
   */
  movingAverageColor?: string;
}

/**
 * A bar chart that charts one data point and its exponential moving average for a single location.
 */
const SingleBarChart: FunctionComponent<SingleBarChartProps> = ({
  data,
  xAxisTitle,
  yAxisTitle,
  dataKey,
  color,
  name,
  tooltipComponent,
  movingAverageColor,
}) => {
  let body = <NoData />;

  if (data != null && data.length > 0) {
    body = (
      <ResponsiveContainer height={400} className="mb-2">
        <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" fill="rgba(255,255,255,.9)" />
          <XAxis label={{ value: xAxisTitle, position: "bottom", offset: 10 }} />
          <YAxis
            label={{
              value: yAxisTitle,
              angle: -90,
              dx: -55,
            }}
            width={70}
            tickFormatter={numToGroupedString}
          />
          <Tooltip content={tooltipComponent} />
          <Bar dataKey={dataKey} opacity={0.9} fill={color} name={name} />
          <Line dataKey="movingAverage" dot={<></>} activeDot={<></>} stroke={movingAverageColor} />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return body;
};

export default SingleBarChart;
