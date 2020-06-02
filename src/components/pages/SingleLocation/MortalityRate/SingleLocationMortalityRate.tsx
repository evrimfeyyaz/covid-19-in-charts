import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { numToPercentageFactory } from "../../../../utilities/numUtilities";
import SingleScatterChart from "../../../charts/SingleScatterChart";
import SingleLocationSection from "../SingleLocationSection";
import { SingleLocationSectionProps } from "../SingleLocationSectionProps";
import { getReadableValuesOnDate } from "../utils";
import SingleLocationMortalityRateTooltip from "./SingleLocationMortalityRateTooltip";

/**
 * Renders a page section that shows the mortality rate chart for a single location.
 */
const SingleLocationMortalityRate: FunctionComponent<SingleLocationSectionProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const readableValuesOnDate = getReadableValuesOnDate(values[values.length - 1]);

  const title = "Mortality Rate";
  const description = (
    <>
      <p>
        The{" "}
        <span
          className="more-info"
          style={{
            borderColor: COLORS.deaths,
            color: COLORS.deaths,
          }}
        >
          mortality rate
        </span>{" "}
        on each day, starting from {startingFrom}.
      </p>
      <p>
        The mortality rate on {readableValuesOnDate.date} was {readableValuesOnDate.mortalityRate}.
      </p>
    </>
  );

  const chart = (
    <SingleScatterChart
      data={values}
      dataKey="mortalityRate"
      name={title}
      color={COLORS.deaths}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      yAxisTickFormatter={numToPercentageFactory(2)}
      TooltipComponent={SingleLocationMortalityRateTooltip}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};

export default SingleLocationMortalityRate;
