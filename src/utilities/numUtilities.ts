/**
 * Returns a string representing the given number with grouped thousands (in US locale).
 *
 * @example
 * // Returns "1,000".
 * numToGroupedString(1000);
 */
export function numToGroupedString(num: number): string {
  return num.toLocaleString("en", { useGrouping: true });
}

/**
 * Returns a function that returns the number formatted as a percentage with the given number of
 * fractional digits.
 *
 * @example
 * // Returns "1.23%".
 * numToPercentFactory(2)(0.0123);
 *
 * @param fractionDigits The number of fractional digits to show in the return value of the
 *   returned function.
 */
export function numToPercentFactory(fractionDigits: number): (num: number) => string {
  return (num: number): string => `${(num * 100).toFixed(fractionDigits)}%`;
}
