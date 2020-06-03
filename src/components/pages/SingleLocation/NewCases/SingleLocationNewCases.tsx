import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleLocationBarChartWithEMA from "../common/charts/SingleLocationBarChartWithEMA";
import SingleLocationSection from "../common/section/SingleLocationSection";
import { SingleLocationSectionWithEMAProps } from "../common/section/SingleLocationSectionWithEMAProps";
import { useEMAInSection } from "../useEMAInSection";
import { getReadableValuesOnDate } from "../utils";
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
  const readableLastValues = getReadableValuesOnDate(values[values.length - 1]);

  const title = "New Cases";
  const description = (
    <>
      <p>
        The number of <span style={{ color: COLORS.confirmed }}>new confirmed cases</span> on each
        day, starting from {startingFrom}.
      </p>
      <p>
        There were {readableLastValues.newConfirmed} new cases on {readableLastValues.date}.
      </p>
      {emaMessage}
    </>
  );

  const chart = (
    <SingleLocationBarChartWithEMA
      data={valuesWithEMA}
      dataKey="newConfirmed"
      name={title}
      color={COLORS.confirmed}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      yAxisTickFormatter={numToGroupedString}
      TooltipComponent={SingleLocationNewCasesTooltip}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};

export default SingleLocationNewCases;
