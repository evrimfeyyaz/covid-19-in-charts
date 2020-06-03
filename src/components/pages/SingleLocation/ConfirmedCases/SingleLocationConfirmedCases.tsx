import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleLocationLineChart from "../common/charts/SingleLocationLineChart";
import SingleLocationSection from "../common/section/SingleLocationSection";
import { SingleLocationSectionProps } from "../common/section/SingleLocationSectionProps";
import { getReadableValuesOnDate } from "../utils";
import SingleLocationConfirmedCasesTooltip from "./SingleLocationConfirmedCasesTooltip";

/**
 * Renders a page section that shows the confirmed cases chart for a single location.
 */
const SingleLocationConfirmedCases: FunctionComponent<SingleLocationSectionProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const readableLastValues = getReadableValuesOnDate(values[values.length - 1]);

  const title = "Confirmed Cases";
  const description = (
    <>
      <p>
        The cumulative number of <span style={{ color: COLORS.confirmed }}>confirmed cases</span> on
        each day, starting from {startingFrom}.
      </p>
      <p>
        There were{" "}
        <span style={{ color: COLORS.confirmed }}>
          {readableLastValues.confirmed} confirmed cases
        </span>{" "}
        to date on {readableLastValues.date}.
      </p>
    </>
  );

  const chart = (
    <SingleLocationLineChart
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
