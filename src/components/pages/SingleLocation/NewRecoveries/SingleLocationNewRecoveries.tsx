import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import { SingleLocationBarChart } from "../common/charts/SingleLocationBarChart";
import { LatestValuesMessage } from "../common/LatestValuesMessage";
import { SingleLocationSection } from "../common/section/SingleLocationSection";
import { SingleLocationSectionWithEmaProps } from "../common/section/SingleLocationSectionWithEmaProps";
import { SingleLocationNewRecoveriesTooltip } from "./SingleLocationNewRecoveriesTooltip";

/**
 * Renders a page section that shows the new recoveries chart for a single location.
 */
export const SingleLocationNewRecoveries: FunctionComponent<SingleLocationSectionWithEmaProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const title = "New Recoveries";
  const description = (
    <>
      <p>
        The number of <span style={{ color: COLORS.recovered }}>new recoveries</span> on each day,
        starting from {startingFrom}.
      </p>
      <LatestValuesMessage latestValues={values[values.length - 1]} property={"newRecovered"} />
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
