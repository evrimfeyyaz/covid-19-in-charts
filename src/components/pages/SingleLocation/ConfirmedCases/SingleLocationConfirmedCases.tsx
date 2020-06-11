import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import { SingleLocationLineChart } from "../common/charts/SingleLocationLineChart";
import { LatestValuesMessage } from "../common/LatestValuesMessage";
import { SingleLocationSection } from "../common/section/SingleLocationSection";
import { SingleLocationSectionProps } from "../common/section/SingleLocationSectionProps";
import { SingleLocationConfirmedCasesTooltip } from "./SingleLocationConfirmedCasesTooltip";

/**
 * Renders a page section that shows the confirmed cases chart for a single location.
 */
export const SingleLocationConfirmedCases: FunctionComponent<SingleLocationSectionProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const title = "Confirmed Cases";
  const description = (
    <>
      <p>
        The cumulative number of <span style={{ color: COLORS.confirmed }}>confirmed cases</span> on
        each day, starting from {startingFrom}.
      </p>
      <LatestValuesMessage latestValues={values[values.length - 1]} property={"confirmed"} />
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

  return (
    <SingleLocationSection
      title={title}
      id="confirmed-cases"
      description={description}
      chart={chart}
    />
  );
};
