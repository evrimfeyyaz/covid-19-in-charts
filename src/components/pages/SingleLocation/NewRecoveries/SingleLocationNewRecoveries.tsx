import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleLocationBarChart from "../common/charts/SingleLocationBarChart";
import SingleLocationSection from "../common/section/SingleLocationSection";
import { SingleLocationSectionWithEMAProps } from "../common/section/SingleLocationSectionWithEMAProps";
import { getReadableValuesOnDate } from "../utils";
import SingleLocationNewRecoveriesTooltip from "./SingleLocationNewRecoveriesTooltip";

/**
 * Renders a page section that shows the new recoveries chart for a single location.
 */
const SingleLocationNewRecoveries: FunctionComponent<SingleLocationSectionWithEMAProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const readableValuesOnDate = getReadableValuesOnDate(values[values.length - 1]);

  const title = "New Recoveries";
  const description = (
    <>
      <p>
        The number of <span style={{ color: COLORS.recovered }}>new recoveries</span> on each day,
        starting from {startingFrom}.
      </p>
      <p>
        There were{" "}
        <span style={{ color: COLORS.recovered }}>
          {readableValuesOnDate.newRecovered} new recoveries
        </span>{" "}
        on {readableValuesOnDate.date}.
      </p>
    </>
  );

  const chart = (
    <SingleLocationBarChart
      data={values}
      dataKey="newRecovered"
      name={title}
      color={COLORS.recovered}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      yAxisTickFormatter={numToGroupedString}
      TooltipComponent={SingleLocationNewRecoveriesTooltip}
    />
  );

  return (
    <SingleLocationSection
      title={title}
      id="new-recoveries"
      description={description}
      chart={chart}
    />
  );
};

export default SingleLocationNewRecoveries;
