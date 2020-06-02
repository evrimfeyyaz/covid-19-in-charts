import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { prettifyMDYDate } from "../../../../utilities/dateUtilities";
import { numToPercentageFactory } from "../../../../utilities/numUtilities";
import SingleScatterChart from "../../../charts/SingleScatterChart";
import SingleLocationSection from "../SingleLocationSection";
import { SingleLocationSectionProps } from "../SingleLocationSectionProps";
import SingleLocationMortalityRateTooltip from "./SingleLocationMortalityRateTooltip";

/**
 * Renders a page section that shows the mortality rate chart for a single location.
 */
const SingleLocationMortalityRate: FunctionComponent<SingleLocationSectionProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const lastValues = values[values.length - 1];
  const lastDate = prettifyMDYDate(lastValues.date);

  let lastMortalityRate: string | undefined = undefined;
  if (lastValues.mortalityRate != null) {
    lastMortalityRate = numToPercentageFactory(4)(lastValues.mortalityRate);
  }

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
        The mortality rate on {lastDate} was {lastMortalityRate}.
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
