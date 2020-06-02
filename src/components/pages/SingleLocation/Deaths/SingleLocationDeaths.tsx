import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleLineChart from "../../../charts/SingleLineChart";
import SingleLocationSection from "../SingleLocationSection";
import { SingleLocationSectionProps } from "../SingleLocationSectionProps";
import SingleLocationDeathsTooltip from "./SingleLocationDeathsTooltip";

/**
 * Renders a page section that shows the deaths chart for a single location.
 */
const SingleLocationDeaths: FunctionComponent<SingleLocationSectionProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const title = "Deaths";
  const description = `The number of deaths on each day, starting from ${startingFrom}.`;

  const chart = (
    <SingleLineChart
      data={values}
      dataKey="deaths"
      name={title}
      color={COLORS.deaths}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      yAxisTickFormatter={numToGroupedString}
      TooltipComponent={SingleLocationDeathsTooltip}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};

export default SingleLocationDeaths;
