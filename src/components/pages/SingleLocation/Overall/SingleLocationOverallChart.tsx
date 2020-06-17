import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { Area, AreaChart } from "recharts";
import { COLORS } from "../../../../constants";
import { getValuesWithActiveCasesRate } from "../../../../utilities/covid19ApiUtilities";
import { numToPercentFactory } from "../../../../utilities/numUtilities";
import { SingleLocationChartContainer } from "../common/charts/SingleLocationChartContainer";
import { SingleLocationOverallTooltip } from "./SingleLocationOverallTooltip";

interface SingleLocationOverallChartProps {
  /**
   * Data to chart.
   */
  data: ValuesOnDate[];
  /**
   * The title of the x axis of the chart in this section.
   */
  xAxisTitle: string | null;
}

/**
 * A percent area chart that charts multiple values points for a single location.
 */
export const SingleLocationOverallChart: FunctionComponent<SingleLocationOverallChartProps> = ({
  data,
  xAxisTitle,
}) => {
  const dataWithActiveCasesRate = getValuesWithActiveCasesRate(data);

  return (
    <SingleLocationChartContainer
      ChartComponent={AreaChart}
      data={dataWithActiveCasesRate}
      xAxisTitle={xAxisTitle}
      TooltipComponent={SingleLocationOverallTooltip}
      yAxisTickFormatter={numToPercentFactory(0)}
    >
      <Area
        dataKey="activeCasesRate"
        stackId={1}
        opacity={0.9}
        fill={COLORS.confirmed}
        name={"Active Cases"}
      />
      <Area
        dataKey="caseFatalityRate"
        stackId={1}
        opacity={0.9}
        fill={COLORS.deaths}
        name={"Deaths"}
      />
      <Area
        dataKey="recoveryRate"
        stackId={1}
        opacity={0.9}
        fill={COLORS.recovered}
        name={"Recoveries"}
      />
    </SingleLocationChartContainer>
  );
};
