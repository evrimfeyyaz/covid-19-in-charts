import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleLineChart from "../../../charts/SingleLineChart";
import SingleLocationSection from "../SingleLocationSection";
import { SingleLocationSectionProps } from "../SingleLocationSectionProps";
import SingleLocationConfirmedCasesTooltip from "./SingleLocationConfirmedCasesTooltip";

/**
 * Renders a page section that shows the confirmed cases chart for a single location.
 */
const SingleLocationConfirmedCases: FunctionComponent<SingleLocationSectionProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const title = "Confirmed Cases";
  const description = `The number of confirmed cases on each day, starting from ${startingFrom}.`;

  const chart = (
    <SingleLineChart
      data={values}
      dataKey="confirmed"
      name={title}
      color={COLORS.confirmed}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      yAxisTickFormatter={numToGroupedString}
      TooltipComponent={SingleLocationConfirmedCasesTooltip}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};

export default SingleLocationConfirmedCases;
