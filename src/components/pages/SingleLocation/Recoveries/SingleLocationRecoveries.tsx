import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleLineChart from "../../../charts/SingleLineChart";
import SingleLocationRecoveriesTooltip from "./SingleLocationRecoveriesTooltip";
import SingleLocationSection from "../SingleLocationSection";
import { SingleLocationSectionProps } from "../SingleLocationSectionProps";

/**
 * Renders a page section that shows the recoveries chart for a single location.
 */
const SingleLocationRecoveries: FunctionComponent<SingleLocationSectionProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const title = "Recoveries";
  const description = `The number of recoveries on each day, starting from ${startingFrom}.`;

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
