import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { getValuesWithEMA } from "../../../../utilities/covid19ApiUtilities";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import { SingleLocationBarChart } from "../common/charts/SingleLocationBarChart";
import { EmaMessage } from "../common/EmaMessage";
import { LatestValuesMessage } from "../common/LatestValuesMessage";
import { SingleLocationSection } from "../common/section/SingleLocationSection";
import { SingleLocationSectionWithEMAProps } from "../common/section/SingleLocationSectionWithEMAProps";
import { SingleLocationNewDeathsTooltip } from "./SingleLocationNewDeathsTooltip";

/**
 * Renders a page section that shows the new deaths chart for a single location.
 */
export const SingleLocationNewDeaths: FunctionComponent<SingleLocationSectionWithEMAProps> = ({
  startingFrom,
  xAxisTitle,
  values,
  emaRange,
}) => {
  const valuesWithEMA = getValuesWithEMA(values, "newDeaths", emaRange);

  const title = "New Deaths";
  const description = (
    <>
      <p>
        The number of <span style={{ color: COLORS.deaths }}>new deaths</span> on each day, starting
        from {startingFrom}.
      </p>
      <LatestValuesMessage latestValues={values[values.length - 1]} property={"newDeaths"} />
      <EmaMessage
        values={valuesWithEMA}
        property={"newDeaths"}
        chartUnit={"deaths"}
        range={emaRange}
      />
    </>
  );

  const chart = (
    <SingleLocationBarChart
      data={valuesWithEMA}
      dataKey="newDeaths"
      name={title}
      color={COLORS.deaths}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      yAxisTickFormatter={numToGroupedString}
      TooltipComponent={SingleLocationNewDeathsTooltip}
    />
  );

  return (
    <SingleLocationSection title={title} id="new-deaths" description={description} chart={chart} />
  );
};
