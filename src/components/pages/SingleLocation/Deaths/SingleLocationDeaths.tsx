import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import { SingleLocationLineChart } from "../common/charts/SingleLocationLineChart";
import { SingleLocationSection } from "../common/section/SingleLocationSection";
import { SingleLocationSectionProps } from "../common/section/SingleLocationSectionProps";
import { getReadableValuesOnDate } from "../utils";
import { SingleLocationDeathsTooltip } from "./SingleLocationDeathsTooltip";

/**
 * Renders a page section that shows the deaths chart for a single location.
 */
export const SingleLocationDeaths: FunctionComponent<SingleLocationSectionProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const readableLastValues = getReadableValuesOnDate(values[values.length - 1]);

  const title = "Deaths";
  const description = (
    <>
      <p>
        The <span style={{ color: COLORS.deaths }}>cumulative number of deaths</span> on each day,
        starting from {startingFrom}.
      </p>
      <p>
        There were <span style={{ color: COLORS.deaths }}>{readableLastValues.deaths} deaths</span>{" "}
        to date on {readableLastValues.date}.
      </p>
    </>
  );

  const chart = (
    <SingleLocationLineChart
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

  return (
    <SingleLocationSection title={title} id="deaths" description={description} chart={chart} />
  );
};
