import React from "react";

export interface SingleLocationChartProps<DataType, DataKeysType> {
  /**
   * The values to chart.
   */
  data: DataType[];
  /**
   * The key of `values` to chart.
   */
  dataKey: DataKeysType;
  /**
   * The color to use when charting.
   */
  color: string;
  /**
   * The human-readable name of the values that is charted.
   */
  name: string;
  /**
   * The title of the x axis.
   */
  xAxisTitle: string | null;
  /**
   * The title of the y axis.
   */
  yAxisTitle?: string;
  /**
   * A function that converts y axis values into a formatted string.
   */
  yAxisTickFormatter?: (value: number) => string;
  /**
   * A tooltip component that can be used in a Recharts chart.
   */
  TooltipComponent: React.ReactElement | React.FunctionComponent;
}
