import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import SingleLineChart from "../../../charts/SingleLineChart";
import SingleLocationConfirmedCasesTooltip from "./SingleLocationConfirmedCasesTooltip";
import SingleLocationSection from "../SingleLocationSection";
import { SingleLocationSectionProps } from "../SingleLocationSectionProps";

/**
 * Renders a page section that shows the confirmed cases chart for a single location.
 */
const SingleLocationConfirmedCases: FunctionComponent<SingleLocationSectionProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const title = "Confirmed Cases";
  const description = `The number of confirmed cases on each day, starting from the day ${startingFrom}.`;

  const chart = (
    <SingleLineChart
      data={values}
      dataKey="confirmed"
      name={title}
      color={COLORS.confirmed}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      tooltipComponent={SingleLocationConfirmedCasesTooltip}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};

export default SingleLocationConfirmedCases;
