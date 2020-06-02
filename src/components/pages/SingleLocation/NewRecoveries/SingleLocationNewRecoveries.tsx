import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import SingleBarChart from "../../../charts/SingleBarChart";
import SingleLocationNewRecoveriesTooltip from "./SingleLocationNewRecoveriesTooltip";
import SingleLocationSection from "../SingleLocationSection";
import { SingleLocationSectionWithEMAProps } from "../SingleLocationSectionWithEMAProps";
import { useEMAInSection } from "../useEMAInSection";

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

  const title = "New Recoveries";
  const description = (
    <>
      <p>The number of new recoveries on each day, starting from {startingFrom}.</p>
    </>
  );

  const chart = (
    <SingleBarChart
      data={valuesWithEMA}
      dataKey="newRecovered"
      name={title}
      color={COLORS.recovered}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      tooltipComponent={SingleLocationNewRecoveriesTooltip}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};

export default SingleLocationNewRecoveries;
