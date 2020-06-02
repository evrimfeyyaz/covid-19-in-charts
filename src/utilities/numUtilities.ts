export function numToGroupedString(num: number): string {
  return num.toLocaleString("en", { useGrouping: true });
}

export function numToPercentFactory(fractionDigits: number): (num: number) => string {
  return (num: number): string => `${(num * 100).toFixed(fractionDigits)}%`;
}
