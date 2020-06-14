import { ValuesOnDate } from "@evrimfeyyaz/covid-19-api";

export interface SingleLocationSectionProps {
  /**
   * A `string` explaining the day that the values plotted in the chart starts. This `string`
   * continues the words "starting from".
   *
   * For example, "Mar 19, 2020" or "the day confirmed cases exceeded 100 (Mar 19, 2020)".
   */
  startingFrom: string;
  /**
   * The title of the x axis of the chart in this section.
   */
  xAxisTitle: string | null;
  /**
   * The values for the chart to display.
   */
  values: ValuesOnDate[];
}
