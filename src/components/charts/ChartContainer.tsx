import React, { ReactElement } from "react";
import { CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartProps } from "./ChartProps";

interface ChartContainerProps<DataType, DataKeysType> extends ChartProps<DataType, DataKeysType> {
  /**
   * A chart component from the Recharts library, such as `LineChart` or `ComposedChart`.
   */
  ChartComponent: React.ElementType;
}

function ChartContainer<DataType, DataKeysType>({
  data,
  xAxisTitle,
  yAxisTitle,
  yAxisTickFormatter,
  ChartComponent,
  TooltipComponent,
  children,
}: React.PropsWithChildren<ChartContainerProps<DataType, DataKeysType>>): ReactElement | null {
  return (
    <ResponsiveContainer height={400} className="mb-2">
      <ChartComponent data={data} margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
        <CartesianGrid strokeDasharray="3 3" fill="rgba(255,255,255,.9)" />
        <XAxis label={{ value: xAxisTitle, position: "bottom", offset: 10 }} />
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

export default ChartContainer;
