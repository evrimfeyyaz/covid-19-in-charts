import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleBarChart from "../../../charts/SingleBarChart";
import SingleLocationSection from "../SingleLocationSection";
import { SingleLocationSectionWithEMAProps } from "../SingleLocationSectionWithEMAProps";
import { useEMAInSection } from "../useEMAInSection";
import SingleLocationNewCasesTooltip from "./SingleLocationNewCasesTooltip";

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
      yAxisTickFormatter={numToGroupedString}
      TooltipComponent={SingleLocationNewCasesTooltip}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};

export default SingleLocationNewCases;
