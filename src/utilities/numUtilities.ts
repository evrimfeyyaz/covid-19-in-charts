export function numToGroupedString(num: number): string {
  return num.toLocaleString('en', { useGrouping: true });
}

export function numToPercentageFactory(fractionDigits: number): (num: number) => string {
  return (num: number) => `${(num * 100).toFixed(fractionDigits)}%`;
}
