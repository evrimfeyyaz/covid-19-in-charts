import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";
import React, { FunctionComponent } from "react";
import { titleCase } from "title-case";
import { readableValuesOnDateKeys } from "../../../../../utilities/covid19ApiUtilities";
import { numToGroupedString } from "../../../../../utilities/numUtilities";
import { SingleLocationLineChart } from "../charts/SingleLocationLineChart";
import { LatestValuesMessage } from "../LatestValuesMessage";
import { SingleLocationTooltipCumulative } from "../tooltips/SingleLocationTooltipCumulative";
import { SingleLocationSection } from "./SingleLocationSection";
import { SingleLocationSectionProps } from "./SingleLocationSectionProps";

interface SingleLocationSectionCumulativeProps extends SingleLocationSectionProps {
  /**
   * The property that is explained and charted in the section.
   */
  property: keyof Omit<ValuesOnDate, "date" | "caseFatalityRate" | "recoveryRate">;
  /**
   * The color to use for the property mentions and the plot.
   */
  color: string;
}

/**
 * Renders a page section that shows a cumulative number, such as confirmed cases.
 */
export const SingleLocationSectionCumulative: FunctionComponent<SingleLocationSectionCumulativeProps> = ({
  startingFrom,
  xAxisTitle,
  values,
  property,
  color,
}) => {
  const propName = readableValuesOnDateKeys[property];
  const title = titleCase(propName);
  const description = (
    <>
      <p>
        The cumulative number of <span style={{ color }}>{propName}</span> on each day, starting
        from {startingFrom}.
      </p>
      <LatestValuesMessage latestValues={values[values.length - 1]} property={property} />
    </>
  );

  const chart = (
    <SingleLocationLineChart
      data={values}
      dataKey={property}
      name={title}
      color={color}
      xAxisTitle={xAxisTitle}
      yAxisTitle={title}
      yAxisTickFormatter={numToGroupedString}
      TooltipComponent={<SingleLocationTooltipCumulative property={property} />}
    />
  );

  return <SingleLocationSection title={title} description={description} chart={chart} />;
};
