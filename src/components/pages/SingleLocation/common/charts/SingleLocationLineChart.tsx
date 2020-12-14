import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import { FunctionComponent } from "react";
import { Line, LineChart } from "recharts";
import { SingleLocationChartContainer } from "./SingleLocationChartContainer";
import { SingleLocationChartProps } from "./SingleLocationChartProps";

/**
 * A line chart that charts a single data point of a single location.
 */
export const SingleLocationLineChart: FunctionComponent<
  SingleLocationChartProps<ValuesOnDate, keyof ValuesOnDate>
> = (props) => {
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
