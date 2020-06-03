import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleLocationBarChartWithEMA from "../common/charts/SingleLocationBarChartWithEMA";
import SingleLocationSection from "../common/section/SingleLocationSection";
import { SingleLocationSectionWithEMAProps } from "../common/section/SingleLocationSectionWithEMAProps";
import { useEMAInSection } from "../useEMAInSection";
import { getReadableValuesOnDate } from "../utils";
import SingleLocationNewRecoveriesTooltip from "./SingleLocationNewRecoveriesTooltip";

/**
 * Renders a page section that shows the new recoveries chart for a single location.
 */
const SingleLocationNewRecoveries: FunctionComponent<SingleLocationSectionWithEMAProps> = ({
  startingFrom,
  xAxisTitle,
  values,
  emaRange,
}) => {
  const [valuesWithEMA] = useEMAInSection(values, "newRecovered", "recoveries", emaRange);
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
    <SingleLocationBarChartWithEMA
      data={valuesWithEMA}
      dataKey="newRecovered"
      name={title}
      color={COLORS.recovered}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      yAxisTickFormatter={numToGroupedString}
      TooltipComponent={SingleLocationNewRecoveriesTooltip}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};

export default SingleLocationNewRecoveries;
