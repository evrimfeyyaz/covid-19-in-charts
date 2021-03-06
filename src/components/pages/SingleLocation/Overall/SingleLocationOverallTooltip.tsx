import { FunctionComponent } from "react";
import { TooltipProps } from "recharts";
import { ValuesOnDateWithActiveCasesRate } from "../../../../utilities/covid19ApiUtilities";
import { dateKeyToDate, getFormattedDate } from "../../../../utilities/dateUtilities";
import { numToPercentFactory } from "../../../../utilities/numUtilities";

/**
 * A Recharts tooltip component to show the details of all the values points on the overall chart.
 */
export const SingleLocationOverallTooltip: FunctionComponent<TooltipProps> = ({
  active,
  payload,
}) => {
  if (!active || payload == null || payload.length === 0) {
    return null;
  }

  const { date, caseFatalityRate, recoveryRate, activeCasesRate } = payload[0]
    .payload as ValuesOnDateWithActiveCasesRate;

  if (caseFatalityRate == null || recoveryRate == null || activeCasesRate == null) {
    return null;
  }

  const getPercentValue = numToPercentFactory(4);
  const formattedData = getFormattedDate(dateKeyToDate(date));

  return (
    <div className="shadow rounded-lg bg-white border px-4 py-3">
      <p className="h6">
        {getPercentValue(activeCasesRate)} <span className="text-muted">active cases</span>
      </p>
      <p className="h6">
        {getPercentValue(caseFatalityRate)} <span className="text-muted">deaths</span>
      </p>
      <p className="h6">
        {getPercentValue(recoveryRate)} <span className="text-muted">recoveries</span>
      </p>
      <p className="mb-0 text-muted">{formattedData}</p>
    </div>
  );
};
