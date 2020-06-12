import React, { FunctionComponent } from "react";
import { dateKeyToDate, getReadableDate } from "../../../../../utilities/dateUtilities";

interface SingleLocationTooltipProps {
  /**
   * The main value to show, e.g. `"1,200,000"`.
   */
  value: string;
  /**
   * The unit for the chart values. For example, the unit for the new cases chart is "cases," and
   * the unit for the new deaths chart is "deaths."
   */
  chartUnit?: string;
  /**
   * A node with extra information, e.g. "100 cases below EMA".
   */
  secondaryInfo?: JSX.Element;
  /**
   * The date of the values point, for which we are showing a tooltip.
   */
  date: string;
}

/**
 * The base component containing the way the tooltips on the single location page charts are
 * displayed.
 *
 * Not to be used on its own, but for use in other tooltip components as a way to keep them
 * consistent.
 */
export const SingleLocationTooltipBase: FunctionComponent<SingleLocationTooltipProps> = ({
  value,
  chartUnit,
  secondaryInfo,
  date,
}) => {
  const readableDate = getReadableDate(dateKeyToDate(date));

  return (
    <div className="shadow rounded-lg bg-white border px-4 py-3">
      <p className="h5">
        {value} {chartUnit && <span className="text-muted">{chartUnit}</span>}
      </p>
      {secondaryInfo}
      <p className="mb-0 text-muted">{readableDate}</p>
    </div>
  );
};
