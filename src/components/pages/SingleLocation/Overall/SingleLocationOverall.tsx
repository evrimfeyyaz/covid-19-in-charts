import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import { getFormattedValuesOnDate } from "../../../../utilities/covid19ApiUtilities";
import { MoreInfo } from "../common/MoreInfo";
import { SingleLocationSection } from "../common/sections/SingleLocationSection";
import { SingleLocationSectionProps } from "../common/sections/SingleLocationSectionProps";
import { SingleLocationOverallChart } from "./SingleLocationOverallChart";

/**
 * Renders a page section that shows the mortality rate, recovery rate and active cases on a chart.
 */
export const SingleLocationOverall: FunctionComponent<SingleLocationSectionProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const formattedValues = getFormattedValuesOnDate(values[values.length - 1]);

  const mortalityRateText = (
    <MoreInfo
      text="mortality rate"
      info={
        <img
          src={"images/mortality-rate.svg"}
          alt="(Cumulative Deaths) / (Cumulative Confirmed Cases)"
          className="img-fluid"
        />
      }
      color={COLORS.deaths}
    />
  );

  const recoveryRateText = (
    <MoreInfo
      text="recovery rate"
      info={
        <img
          src={"images/recovery-rate.svg"}
          alt="(Cumulative Recoveries) / (Cumulative Confirmed Cases)"
          className="img-fluid"
        />
      }
      color={COLORS.recovered}
    />
  );

  const title = "Overall";
  const description = (
    <>
      <p>
        The <span style={{ color: COLORS.deaths }}>deaths</span>,{" "}
        <span style={{ color: COLORS.recovered }}>recoveries</span> and{" "}
        <span style={{ color: COLORS.confirmed }}>active cases</span> as percentages of confirmed
        cases on each day, starting from {startingFrom}.
      </p>
      <p>
        On {formattedValues.date}, the{" "}
        <span style={{ color: COLORS.deaths }}>
          {mortalityRateText} was {formattedValues.mortalityRate}
        </span>{" "}
        , and the{" "}
        <span style={{ color: COLORS.recovered }}>
          {recoveryRateText} was {formattedValues.recoveryRate}
        </span>{" "}
        .
      </p>
    </>
  );

  const chart = <SingleLocationOverallChart data={values} xAxisTitle={xAxisTitle} />;

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};
