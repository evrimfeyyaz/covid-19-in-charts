import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import SingleBarChart from "../../../charts/SingleBarChart";
import SingleLocationNewCasesTooltip from "./SingleLocationNewCasesTooltip";
import SingleLocationSection from "../SingleLocationSection";
import { SingleLocationSectionWithEMAProps } from "../SingleLocationSectionWithEMAProps";
import { useEMAInSection } from "../useEMAInSection";

/**
 * Renders a page section that shows the new cases chart for a single location.
 */
const SingleLocationNewCases: FunctionComponent<SingleLocationSectionWithEMAProps> = ({
  startingFrom,
  xAxisTitle,
  values,
  emaRange,
}) => {
  const [valuesWithEMA, emaMessage] = useEMAInSection(values, "newConfirmed", "cases", emaRange);

  const title = "New Cases";
  const description = (
    <>
      <p>The number of new confirmed cases on each day, starting from {startingFrom}.</p>
      {emaMessage}
    </>
  );

  const chart = (
    <SingleBarChart
      data={valuesWithEMA}
      dataKey="newConfirmed"
      name={title}
      color={COLORS.newConfirmed}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      tooltipComponent={SingleLocationNewCasesTooltip}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};

export default SingleLocationNewCases;
