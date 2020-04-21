import { format, parse } from 'date-fns';

const dateStrFormat = 'M/d/yy';

export function MDYStringToDate(dateStr: string): Date {
  return parse(dateStr, dateStrFormat, new Date());
}

export function prettifyDate(date: Date): string {
  return format(date, 'PP');
}

export function prettifyMDYDate(dateStr: string): string {
  return prettifyDate(MDYStringToDate(dateStr));
}

export function dateToMDYString(date: Date): string {
  return format(date, dateStrFormat);
}
