/**
 * Converts a string containing a date key to a Date object, such as "1/2/20".
 *
 * @param dateKey A string containing a date in the format "month/date/year", e.g. "1/2/20".
 */
export function dateKeyToDate(dateKey: string): Date {
  const dateKeyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/;
  const dateParts = dateKey.match(dateKeyRegex);

  if (dateParts == null || dateParts.length < 3) {
    throw new Error('Date should have format "month/date/year", e.g. "1/2/20"');
  }

  const year = parseInt(`20${dateParts[3]}`);
  const month = parseInt(dateParts[1]) - 1;
  const day = parseInt(dateParts[2]);

  return new Date(year, month, day);
}

/**
 * Returns a string with a more readable date format, e.g. "Jan 1, 2020".
 */
export function getReadableDate(date: Readonly<Date>): string {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
