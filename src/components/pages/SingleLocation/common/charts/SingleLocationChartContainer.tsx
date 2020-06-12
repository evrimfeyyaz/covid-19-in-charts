import React, { ReactElement } from "react";
import { CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { NoData } from "../NoData";
import { SingleLocationChartProps } from "./SingleLocationChartProps";

interface ChartContainerProps<DataType, DataKeysType>
  extends Omit<SingleLocationChartProps<DataType, DataKeysType>, "dataKey" | "color" | "name"> {
  /**
   * A chart component from the Recharts library, such as `LineChart` or `ComposedChart`.
   */
  ChartComponent: React.ElementType;
}

/**
 * The container component for all the charts on the single location page.
 */
export function SingleLocationChartContainer<DataType, DataKeysType>({
  data,
  xAxisTitle,
  yAxisTitle,
  yAxisTickFormatter,
  ChartComponent,
  TooltipComponent,
  children,
}: React.PropsWithChildren<ChartContainerProps<DataType, DataKeysType>>): ReactElement | null {
  let body = <NoData />;

  if (data.length > 0) {
    body = (
      <ResponsiveContainer height={400} className="mb-2">
        <ChartComponent data={data} margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
          <CartesianGrid strokeDasharray="3 3" fill="rgba(255,255,255,.9)" />
          <XAxis label={{ value: xAxisTitle ?? undefined, position: "bottom", offset: 10 }} />
          <YAxis
            label={{
              value: yAxisTitle,
              angle: -90,
              dx: -55,
            }}
            width={70}
            tickFormatter={yAxisTickFormatter}
          />
          <Tooltip content={TooltipComponent} />
          {children}
        </ChartComponent>
      </ResponsiveContainer>
    );
  }

  return body;
}
