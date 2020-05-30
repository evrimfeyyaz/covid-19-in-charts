import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { numToGroupedString } from "../../utilities/numUtilities";
import NoData from "../common/NoData";

interface LineChartProps {
  data?: ValuesOnDate[];
  xAxisTitle: string;
  yAxisTitle: string;
  lines: {
    dataKey: string;
    color: string;
    name: string;
  }[];
}

const LineChart: FunctionComponent<LineChartProps> = ({ data, xAxisTitle, yAxisTitle, lines }) => {
  let body = <NoData />;

  if (data != null && data.length > 0) {
    body = (
      <ResponsiveContainer height={400} className="mb-2">
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
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
          {lines.map(({ dataKey, color, name }) => (
            <Line
              type="monotone"
              dataKey={dataKey}
              opacity={0.9}
              stroke={color}
              strokeWidth={3}
              name={name}
              dot={false}
              key={`${JSON.stringify(lines)}-${dataKey}`}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  }

  return body;
};

export default LineChart;
