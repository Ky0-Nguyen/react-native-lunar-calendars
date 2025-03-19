import XDate from 'xdate';

interface DateData {
  year: number;
  month: number;
  day: number;
  timestamp: number;
  dateString: string;
}

function padNumber(n: number): string {
  if (n < 10) {
    return '0' + n;
  }
  return n.toString();
}

export function xdateToData(xdate: XDate): DateData {
  const dateString = xdate.toString('yyyy-MM-dd');
  return {
    year: xdate.getFullYear(),
    month: xdate.getMonth() + 1,
    day: xdate.getDate(),
    timestamp: new XDate(dateString, true).getTime(),
    dateString: dateString
  };
}

export function parseDate(d?: number | string | Date | XDate | DateData): XDate | undefined {
  if (!d) {
    return undefined;
  } else if (typeof d === 'object' && 'timestamp' in d && d.timestamp) { // conventional data timestamp
    return new XDate(d.timestamp, true);
  } else if (d instanceof XDate) { // xdate
    return new XDate(d.toString('yyyy-MM-dd'), true);
  } else if (d instanceof Date) { // javascript date
    const dateString = d.getFullYear() + '-' + padNumber((d.getMonth() + 1)) + '-' + padNumber(d.getDate());
    return new XDate(dateString, true);
  } else if (typeof d === 'object' && d !== null && 'year' in d && 'month' in d && 'day' in d) {
    const dateData = d as DateData;
    const dateString = dateData.year + '-' + padNumber(dateData.month) + '-' + padNumber(dateData.day);
    return new XDate(dateString, true);
  } else if (typeof d === 'string' || typeof d === 'number') { // timestamp number or date formatted as string
    return new XDate(d.toString(), true);
  }
  return undefined;
}