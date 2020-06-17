import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { titleCase } from "title-case";
import {
  getValuesWithEma,
  readableValuesOnDateKeys,
  ValuesOnDateWithMovingAverage,
} from "../../../../../utilities/covid19ApiUtilities";
import { numToGroupedString } from "../../../../../utilities/numUtilities";
import { SingleLocationBarChart } from "../charts/SingleLocationBarChart";
import { EmaMessage } from "../EmaMessage";
import { LatestValuesMessage } from "../LatestValuesMessage";
import { SingleLocationTooltipNew } from "../tooltips/SingleLocationTooltipNew";
import { SingleLocationSection } from "./SingleLocationSection";
import { SingleLocationSectionProps } from "./SingleLocationSectionProps";

interface SingleLocationSectionNewProps extends SingleLocationSectionProps {
  /**
   * The property that is explained and charted in the section.
   */
  property: keyof Omit<ValuesOnDate, "date" | "caseFatalityRate" | "recoveryRate">;
  /**
   * The color to use for the property mentions and the plot.
   */
  color: string;
  /**
   * Whether or not this section should calculate and show the exponential moving average for the
   * data within.
   */
  showEma?: boolean;
}

/**
 * Renders a page section that charts the daily new numbers, such as new cases.
 */
export const SingleLocationSectionNew: FunctionComponent<SingleLocationSectionNewProps> = ({
  startingFrom,
  xAxisTitle,
  values,
  property,
  color,
  showEma = false,
}) => {
  const emaRange = 15;

  let valuesWithEma: ValuesOnDateWithMovingAverage[] | null = null;
  if (showEma) {
    valuesWithEma = getValuesWithEma(values, property, emaRange);
  }

  const propName = readableValuesOnDateKeys[property];
  const title = titleCase(propName);
  const description = (
    <>
      <p>
        The number of <span style={{ color }}>{propName}</span> on each day, starting from{" "}
        {startingFrom}.
      </p>
      <LatestValuesMessage latestValues={values[values.length - 1]} property={property} />
      {showEma && valuesWithEma && (
        <EmaMessage
          values={valuesWithEma}
          property={property}
          chartUnit={propName}
          range={emaRange}
        />
      )}
    </>
  );

  const chart = (
    <SingleLocationBarChart
      data={valuesWithEma ?? values}
      dataKey={property}
      name={title}
      color={color}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      yAxisTickFormatter={numToGroupedString}
      TooltipComponent={<SingleLocationTooltipNew property={property} />}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};
