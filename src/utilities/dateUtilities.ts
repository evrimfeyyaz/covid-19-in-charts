import { format, formatISO, isSameDay, isWithinInterval, parse } from 'date-fns';

const dataStoreDateStrFormat = 'M/d/yy';

export function MDYStringToDate(dateStr: string): Date {
  return parse(dateStr, dataStoreDateStrFormat, new Date());
}

export function prettifyDate(date: Date): string {
  return format(date, 'PP');
}

export function prettifyMDYDate(dateStr: string): string {
  return prettifyDate(MDYStringToDate(dateStr));
}

export function dateToMDYString(date: Date): string {
  return format(date, dataStoreDateStrFormat);
}

export function dateToYMDString(date: Date): string {
  return formatISO(date, { representation: 'date' });
}

export function isDateBetween(date: Date, earlierDate: Date, laterDate: Date) {
  return (
    isWithinInterval(date, { start: earlierDate, end: laterDate }) ||
    isSameDay(date, earlierDate) ||
    isSameDay(date, laterDate)
  );
}
