import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { COLORS } from "../../../constants";
import { humanizePropertyName } from "../../../utilities/covid19APIUtilities";
import { prettifyMDYDate } from "../../../utilities/dateUtilities";
import SingleLineChart from "../../charts/SingleLineChart";
import SingleLocationConfirmedCasesTooltip from "./SingleLocationConfirmedCasesTooltip";
import SingleLocationSection from "./SingleLocationSection";

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
  values,
}) => {
  const humanizedExceedingProperty = humanizePropertyName(exceedingProperty);
  const firstDate = values[0].date;

  const title = "Confirmed Cases";
  const description = `The number of confirmed cases on each day, starting from the day 
  ${humanizedExceedingProperty} exceeded ${exceedingValue} 
  (${prettifyMDYDate(firstDate)}).`;

  const xAxisTitle = `Days since ${humanizedExceedingProperty} exceeded ${exceedingValue}`;

  const chart = (
    <SingleLineChart
      data={values}
      dataKey="confirmed"
      name="Confirmed Cases"
      color={COLORS.confirmed}
      xAxisTitle={xAxisTitle}
      yAxisTitle="Confirmed Cases"
      tooltipComponent={SingleLocationConfirmedCasesTooltip}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};

export default SingleLocationConfirmedCases;
