export function numToGroupedString(num: number) {
  return num.toLocaleString('en', { useGrouping: true });
}
