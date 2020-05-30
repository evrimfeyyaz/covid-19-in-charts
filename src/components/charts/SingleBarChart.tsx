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
  data?: (ValuesOnDate & { movingAverage: number | null })[];
  xAxisTitle: string;
  yAxisTitle: string;
  dataKey: keyof ValuesOnDate;
  color: string;
  name: string;
  movingAverageColor?: string;
}

const SingleBarChart: FunctionComponent<SingleBarChartProps> = ({
  data,
  xAxisTitle,
  yAxisTitle,
  dataKey,
  color,
  name,
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
          <Tooltip />
          <Bar dataKey={dataKey} opacity={0.9} fill={color} name={name} />
          <Line dataKey="movingAverage" dot={<></>} activeDot={<></>} stroke={movingAverageColor} />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return body;
};

export default SingleBarChart;
