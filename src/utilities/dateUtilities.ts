export function prettifyMDYDate(dateStr: string) {
  const dateStrSplit = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
  const dayStr = dateStrSplit?.[2];
  const monthStr = dateStrSplit?.[1];
  const yearStr = dateStrSplit?.[3];

  if (
    typeof dayStr !== 'string' ||
    typeof monthStr !== 'string' ||
    typeof yearStr !== 'string'
  ) {
    throw new Error('Invalid M/D/Y string.');
  }

  const day = parseInt(dayStr);
  const month = parseInt(monthStr) - 1;
  const year = parseInt(`20${yearStr}`);
  const dateObj = new Date(year, month, day);

  return dateObj.toDateString();
}
