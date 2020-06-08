import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { getValuesWithEMA } from "../../../../utilities/covid19ApiUtilities";
import { numToGroupedString } from "../../../../utilities/numUtilities";
import SingleLocationBarChart from "../common/charts/SingleLocationBarChart";
import EMAMessage from "../common/EMAMessage";
import SingleLocationSection from "../common/section/SingleLocationSection";
import { SingleLocationSectionWithEMAProps } from "../common/section/SingleLocationSectionWithEMAProps";
import { getReadableValuesOnDate } from "../utils";
import SingleLocationNewCasesTooltip from "./SingleLocationNewCasesTooltip";

/**
 * Renders a page section that shows the new cases chart for a single location.
 */
const SingleLocationNewCases: FunctionComponent<SingleLocationSectionWithEMAProps> = ({
  startingFrom,
  xAxisTitle,
  values,
  emaRange,
}) => {
  const valuesWithEMA = getValuesWithEMA(values, "newConfirmed", emaRange);
  const readableLastValues = getReadableValuesOnDate(values[values.length - 1]);

  const title = "New Cases";
  const description = (
    <>
      <p>
        The number of <span style={{ color: COLORS.confirmed }}>new confirmed cases</span> on each
        day, starting from {startingFrom}.
      </p>
      <p>
        There were{" "}
        <span style={{ color: COLORS.confirmed }}>{readableLastValues.newConfirmed} new cases</span>{" "}
        on {readableLastValues.date}.
      </p>
      <EMAMessage
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

export default SingleLocationNewCases;
