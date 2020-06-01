import React, { FunctionComponent } from "react";
import { prettifyMDYDate } from "../../../utilities/dateUtilities";

interface SingleLocationTooltipProps {
  /**
   * The main value to show, e.g. `"1,200,000"`.
   */
  value: string;
  /**
   * The unit for the chart data. For example, the unit for the new cases chart is "cases," and the
   * unit for the new deaths chart is "deaths."
   */
  chartUnit: string;
  /**
   * Secondary info to show, e.g. "100 cases below EMA".
   */
  secondaryInfo?: string;
  /**
   * The CSS class to apply to the secondary info container.
   */
  secondaryInfoClassName?: string;
  /**
   * The date of the data point, for which we are showing a tooltip.
   */
  date: string;
}

/**
 * The base component containing the way the tooltips on the single location page charts are
 * displayed.
 *
 * Not to be used on its own, but for using it in other tooltip components as a way to keep them
 * consistent.
 */
const SingleLocationTooltipBase: FunctionComponent<SingleLocationTooltipProps> = ({
  value,
  chartUnit,
  secondaryInfo,
  secondaryInfoClassName,
  date,
}) => {
  return (
    <div className="shadow rounded-lg bg-white border px-4 py-3">
      <p className="h5">
        {value} <span className="text-muted">{chartUnit}</span>
      </p>
      {secondaryInfo && <p className={`mb-2 ${secondaryInfoClassName}`}>{secondaryInfo}</p>}
      <p className="mb-0 text-muted">{prettifyMDYDate(date)}</p>
    </div>
  );
};

export default SingleLocationTooltipBase;
