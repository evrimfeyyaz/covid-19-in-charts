/**
 * Returns a message showing the difference between the actual value and the moving average. This
 * is used in tooltips, e.g. showing the difference between the new cases value on a day and the
 * moving average on that day.
 *
 * @param value The actual value, e.g. the new cases value on a certain day.
 * @param movingAverage The moving average on a certain day.
 * @param chartUnit The unit of the chart data. For example, the unit for the new cases chart is
 *   "cases," and the unit for the new deaths chart is "deaths."
 * @returns An array with two elemens, the first element is the message, the second element is the
 *   CSS class to be used when showing the message.
 */
export function getEMADiffMessage(
  value: number,
  movingAverage: number,
  chartUnit: string
): [string, string] {
  const movingAverageDiff = movingAverage - value;

  const message =
    movingAverageDiff > 0
      ? `${movingAverageDiff.toFixed(2)} ${chartUnit} below EMA`
      : `${Math.abs(movingAverageDiff).toFixed(2)} ${chartUnit} above EMA`;
  const className = movingAverageDiff > 0 ? "text-success" : "text-danger";

  return [message, className];
}
