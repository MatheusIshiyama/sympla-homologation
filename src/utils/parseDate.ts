import dateFns from 'date-fns';

export function parseDate(dateStr: string): Date {
  return dateFns.parse(dateStr, 'yyyy-MM-dd HH:mm:ss', new Date());
}
