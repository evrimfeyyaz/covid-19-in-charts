import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import ema from "exponential-moving-average";
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

interface BarChartProps {
  data?: ValuesOnDate[];
  xAxisTitle: string;
  yAxisTitle: string;
  bars: {
    dataKey: keyof ValuesOnDate;
    color: string;
    name: string;
  }[];
  movingAverageDataKey?: keyof ValuesOnDate;
}

const BarChart: FunctionComponent<BarChartProps> = ({
  data,
  xAxisTitle,
  yAxisTitle,
  bars,
  movingAverageDataKey,
}) => {
  let body = <NoData />;

  if (data != null && data.length > 0) {
    type DataWithEMA = (ValuesOnDate & { movingAverage?: number | null })[];
    let dataWithTrendline: DataWithEMA = data;

    if (movingAverageDataKey != null) {
      const values = data.map((valuesOnDate) => valuesOnDate[movingAverageDataKey] as number);
      let movingAveragePoints: (number | null)[] = ema(values, 7);
      const dataLengthDifference = data.length - movingAveragePoints.length;
      movingAveragePoints = [
        ...(Array.from({ length: dataLengthDifference }).fill(null) as null[]),
        ...movingAveragePoints,
      ];

      dataWithTrendline = data.map((valuesOnDate, index) => ({
        ...valuesOnDate,
        movingAverage: movingAveragePoints[index],
      }));
    }

    body = (
      <ResponsiveContainer height={400} className="mb-2">
        <ComposedChart
          data={dataWithTrendline}
          margin={{ top: 20, right: 30, bottom: 40, left: 30 }}
        >
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
          {bars.map(({ dataKey, color, name }) => (
            <Bar
              dataKey={dataKey}
              opacity={0.9}
              fill={color}
              name={name}
              key={`${JSON.stringify(bars)}-${dataKey}`}
            />
          ))}
          {dataWithTrendline && <Line dataKey="movingAverage" dot={<></>} activeDot={<></>} />}
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return body;
};

export default BarChart;
