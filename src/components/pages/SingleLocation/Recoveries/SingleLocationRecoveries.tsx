import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleLocationLineChart from "../common/charts/SingleLocationLineChart";
import SingleLocationSection from "../common/section/SingleLocationSection";
import { SingleLocationSectionProps } from "../common/section/SingleLocationSectionProps";
import { getReadableValuesOnDate } from "../utils";
import SingleLocationRecoveriesTooltip from "./SingleLocationRecoveriesTooltip";

/**
 * Renders a page section that shows the recoveries chart for a single location.
 */
const SingleLocationRecoveries: FunctionComponent<SingleLocationSectionProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const readableLastValues = getReadableValuesOnDate(values[values.length - 1]);

  const title = "Recoveries";
  const description = (
    <>
      <p>
        The <span style={{ color: COLORS.recovered }}>cumulative number of recoveries</span> on each
        day, starting from {startingFrom}.
      </p>
      <p>
        There were{" "}
        <span style={{ color: COLORS.recovered }}>{readableLastValues.recovered} recoveries</span>{" "}
        to date on {readableLastValues.date}.
      </p>
    </>
  );

  const chart = (
    <SingleLocationLineChart
      data={values}
      dataKey="recovered"
      name={title}
      color={COLORS.recovered}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      yAxisTickFormatter={numToGroupedString}
      TooltipComponent={SingleLocationRecoveriesTooltip}
    />
  );

  return (
    <SingleLocationSection title={title} id="recoveries" description={description} chart={chart} />
  );
};

export default SingleLocationRecoveries;
