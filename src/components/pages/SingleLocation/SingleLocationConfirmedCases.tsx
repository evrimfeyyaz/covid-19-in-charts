import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { COLORS } from "../../../constants";
import { humanizePropertyName } from "../../../utilities/covid19APIUtilities";
import { prettifyDate } from "../../../utilities/dateUtilities";
import SingleLineChart from "../../charts/SingleLineChart";
import SingleLocationConfirmedCasesTooltip from "./SingleLocationConfirmedCasesTooltip";
import SingleLocationLineChartSection from "./SingleLocationLineChartSection";

interface SingleLocationConfirmedCasesProps {
  /**
   * The selected ValuesOnDate property to filter the data shown on the {@link SingleLocation} page.
   *
   * For example, if the user selects "start from the first day that exceeds 100 confirmed cases",
   * this is equal to "confirmedCases".
   */
  exceedingProperty: string;
  /**
   * The value that the selected exceeding property should exceed to be included in the data.
   *
   * For example, if the user selects "start from the first day that exceeds 100 confirmed cases",
   * this is equal to 100.
   */
  exceedingValue: number;
  /**
   * The first date of the dataset.
   *
   * For example, if the user picked "start from the first day that exceeds 100 confirmed cases"
   * option on the {@link SingleLocation} page, and the first day that has more than 100 cases is
   * March 1, 2020, this is set to that date.
   */
  firstDate: Date;
  /**
   * The data for the chart to display.
   */
  values: ValuesOnDate[];
}

/**
 * Renders a page section that shows the confirmed cases chart for a single location.
 */
const SingleLocationConfirmedCases: FunctionComponent<SingleLocationConfirmedCasesProps> = ({
  exceedingProperty,
  exceedingValue,
  firstDate,
  values,
}) => {
  const title = "Confirmed Cases";
  const description = `The number of confirmed cases on each day, starting from the day 
  ${humanizePropertyName(exceedingProperty)} exceeded ${exceedingValue} 
  (${prettifyDate(firstDate)}).`;

  const chart = (
    <SingleLineChart
      data={values}
      dataKey="confirmed"
      name="Confirmed Cases"
      color={COLORS.confirmed}
      xAxisTitle={`Days since ${exceedingProperty} exceeded ${exceedingValue}`}
      yAxisTitle="Confirmed cases"
      tooltipComponent={SingleLocationConfirmedCasesTooltip}
    />
  );

  return <SingleLocationLineChartSection title={title} description={description} chart={chart} />;
};

export default SingleLocationConfirmedCases;
