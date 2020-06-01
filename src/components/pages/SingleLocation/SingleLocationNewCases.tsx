import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { COLORS } from "../../../constants";
import { getValuesWithEMA, humanizePropertyName } from "../../../utilities/covid19APIUtilities";
import { prettifyMDYDate } from "../../../utilities/dateUtilities";
import SingleBarChart from "../../charts/SingleBarChart";
import SingleLocationNewCasesTooltip from "./SingleLocationNewCasesTooltip";
import SingleLocationSection from "./SingleLocationSection";

interface SingleLocationNewCasesProps {
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
  /**
   * The range of the exponential moving average calculation.
   *
   * For example, settings this to 12 would mean calculating a 12-day exponential moving average.
   */
  emaRange: number;
}

/**
 * Renders a page section that shows the new cases chart for a single location.
 */
const SingleLocationNewCases: FunctionComponent<SingleLocationNewCasesProps> = ({
  exceedingProperty,
  exceedingValue,
  values,
  emaRange,
}) => {
  const valuesWithEMA = getValuesWithEMA(values, "newConfirmed", emaRange);

  const lastValues = valuesWithEMA[valuesWithEMA.length - 1];
  const lastEMAValue = lastValues.movingAverage;
  const lastNumOfNewCases = lastValues.newConfirmed;
  const lastDate = lastValues.date;

  let emaMessage: JSX.Element | null = null;
  if (lastEMAValue != null) {
    const emaDiff = lastEMAValue - lastNumOfNewCases;

    const messageStyle = emaDiff > 0 ? "text-success" : "text-danger";
    const aboveOrBelow = emaDiff > 0 ? "below" : "above";

    emaMessage = (
      <span>
        {prettifyMDYDate(lastDate)} was{" "}
        <span className={messageStyle}>
          {Math.abs(emaDiff).toFixed(2)} {humanizePropertyName("newConfirmed")} {aboveOrBelow}
        </span>{" "}
        the moving average.
      </span>
    );
  }

  const movingAverageColor = "#164fff";
  const humanizedExceedingProperty = humanizePropertyName(exceedingProperty);
  const firstDate = valuesWithEMA[0].date;

  const title = "New Cases";
  const description = (
    <>
      <p>
        The number of new confirmed cases on each day, starting from the day{" "}
        {humanizedExceedingProperty} exceeded {exceedingValue} ({prettifyMDYDate(firstDate)}).
      </p>
      {emaMessage && (
        <p>
          You can also see the{" "}
          <span
            className="more-info"
            style={{
              borderColor: movingAverageColor,
              color: movingAverageColor,
            }}
          >
            {emaRange}-day exponential moving average
          </span>{" "}
          line below. {emaMessage}
        </p>
      )}
    </>
  );

  const xAxisTitle = `Days since ${humanizedExceedingProperty} exceeded ${exceedingValue}`;

  const chart = (
    <SingleBarChart
      data={valuesWithEMA}
      dataKey="newConfirmed"
      name="New Cases"
      color={COLORS.newConfirmed}
      xAxisTitle={xAxisTitle}
      yAxisTitle="New Cases"
      movingAverageColor={movingAverageColor}
      tooltipComponent={SingleLocationNewCasesTooltip}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};

export default SingleLocationNewCases;
