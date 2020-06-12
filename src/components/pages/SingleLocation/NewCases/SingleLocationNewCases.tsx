import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { getValuesWithEMA } from "../../../../utilities/covid19ApiUtilities";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import { SingleLocationBarChart } from "../common/charts/SingleLocationBarChart";
import { EmaMessage } from "../common/EmaMessage";
import { LatestValuesMessage } from "../common/LatestValuesMessage";
import { SingleLocationSection } from "../common/section/SingleLocationSection";
import { SingleLocationSectionWithEMAProps } from "../common/section/SingleLocationSectionWithEMAProps";
import { SingleLocationNewCasesTooltip } from "./SingleLocationNewCasesTooltip";

/**
 * Renders a page section that shows the new cases chart for a single location.
 */
export const SingleLocationNewCases: FunctionComponent<SingleLocationSectionWithEMAProps> = ({
  startingFrom,
  xAxisTitle,
  values,
  emaRange,
}) => {
  const valuesWithEMA = getValuesWithEMA(values, "newConfirmed", emaRange);

  const title = "New Cases";
  const description = (
    <>
      <p>
        The number of <span style={{ color: COLORS.confirmed }}>new confirmed cases</span> on each
        day, starting from {startingFrom}.
      </p>
      <LatestValuesMessage latestValues={values[values.length - 1]} property={"newConfirmed"} />
      <EmaMessage
        values={valuesWithEMA}
        property={"newConfirmed"}
        chartUnit={"cases"}
        range={emaRange}
      />
    </>
  );

  const chart = (
    <SingleLocationBarChart
      data={valuesWithEMA}
      dataKey="newConfirmed"
      name={title}
      color={COLORS.confirmed}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      yAxisTickFormatter={numToGroupedString}
      TooltipComponent={SingleLocationNewCasesTooltip}
    />
  );

  return (
    <SingleLocationSection title={title} id="new-cases" description={description} chart={chart} />
  );
};
