import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import SingleBarChart from "../../../charts/SingleBarChart";
import SingleLocationNewDeathsTooltip from "./SingleLocationNewDeathsTooltip";
import SingleLocationSection from "../SingleLocationSection";
import { SingleLocationSectionWithEMAProps } from "../SingleLocationSectionWithEMAProps";
import { useEMAInSection } from "../useEMAInSection";

/**
 * Renders a page section that shows the new deaths chart for a single location.
 */
const SingleLocationNewDeaths: FunctionComponent<SingleLocationSectionWithEMAProps> = ({
  startingFrom,
  xAxisTitle,
  values,
  emaRange,
}) => {
  const [valuesWithEMA, emaMessage] = useEMAInSection(values, "newDeaths", "deaths", emaRange);

  const title = "New Deaths";
  const description = (
    <>
      <p>The number of new deaths on each day, starting from {startingFrom}.</p>
      {emaMessage}
    </>
  );

  const chart = (
    <SingleBarChart
      data={valuesWithEMA}
      dataKey="newDeaths"
      name={title}
      color={COLORS.deaths}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      tooltipComponent={SingleLocationNewDeathsTooltip}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};

export default SingleLocationNewDeaths;
