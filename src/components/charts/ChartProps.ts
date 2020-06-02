import React from "react";

export interface ChartProps<DataType, DataKeysType> {
  /**
   * The data to chart.
   */
  data: DataType;
  /**
   * The key in the `data` object to use for charting.
   */
  dataKey: DataKeysType;
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
   * A function that converts y axis values into a formatted string.
   */
  yAxisTickFormatter: (value: number) => string;
  /**
   * A tooltip component that can be used in a Recharts chart.
   */
  TooltipComponent: React.ReactElement | React.FunctionComponent;
}
