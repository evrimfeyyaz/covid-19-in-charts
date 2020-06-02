import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleLineChart from "../../../charts/SingleLineChart";
import SingleLocationSection from "../SingleLocationSection";
import { SingleLocationSectionProps } from "../SingleLocationSectionProps";
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
        The number of <span style={{ color: COLORS.recovered }}>cumulative recoveries</span> on each
        day, starting from {startingFrom}.
      </p>
      <p>
        There were {readableLastValues.recovered} recoveries to date on {readableLastValues.date}.
      </p>
    </>
  );

  const chart = (
    <SingleLineChart
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

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};

export default SingleLocationRecoveries;
