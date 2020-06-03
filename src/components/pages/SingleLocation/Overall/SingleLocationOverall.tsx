import React, { FunctionComponent } from "react";
import { COLORS } from "../../../../constants";
import SingleLocationSection from "../common/section/SingleLocationSection";
import { SingleLocationSectionProps } from "../common/section/SingleLocationSectionProps";
import { getReadableValuesOnDate } from "../utils";
import SingleLocationOverallChart from "./SingleLocationOverallChart";

/**
 * Renders a page section that shows the mortality rate, recovery rate and active cases on a chart.
 */
const SingleLocationOverall: FunctionComponent<SingleLocationSectionProps> = ({
  startingFrom,
  xAxisTitle,
  values,
}) => {
  const readableValuesOnDate = getReadableValuesOnDate(values[values.length - 1]);

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
        On {readableValuesOnDate.date}, the{" "}
        <span
          style={{
            color: COLORS.deaths,
            borderColor: COLORS.deaths,
          }}
        >
          <span className="more-info">mortality rate</span> was {readableValuesOnDate.mortalityRate}
        </span>{" "}
        , and the{" "}
        <span
          style={{
            color: COLORS.recovered,
            borderColor: COLORS.recovered,
          }}
        >
          <span className="more-info">recovery rate</span> was {readableValuesOnDate.recoveryRate}
        </span>{" "}
        .
      </p>
    </>
  );

  const chart = <SingleLocationOverallChart data={values} xAxisTitle={xAxisTitle} />;

  return (
    <SingleLocationSection title={title} id="new-deaths" description={description} chart={chart} />
  );
};

export default SingleLocationOverall;
