import XDate from 'xdate';

export function sameMonth(a: XDate, b: XDate): boolean {
  return a instanceof XDate && b instanceof XDate &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth();
}

export function sameDate(a: XDate, b: XDate): boolean {
  return a instanceof XDate && b instanceof XDate &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export function monthName(month: number): string {
  const locales = XDate.locales[XDate.defaultLocale];
  return locales?.monthNames?.[month] || '';
}

export function isGTE(a: XDate, b: XDate): boolean {
  return b.diffDays(a) > -1;
}

export function isLTE(a: XDate, b: XDate): boolean {
  return a.diffDays(b) > -1;
}

export function fromTo(a: XDate, b: XDate): XDate[] {
  const days: XDate[] = [];
  let from = +a, to = +b;
  for (; from <= to; from = new XDate(from, true).addDays(1).getTime()) {
    days.push(new XDate(from, true));
  }
  return days;
}

export function month(xd: XDate): XDate[] {
  const year = xd.getFullYear(), month = xd.getMonth();
  const days = new Date(year, month + 1, 0).getDate();

  const firstDay = new XDate(year, month, 1, 0, 0, 0);
  const lastDay = new XDate(year, month, days, 0, 0, 0);

  return fromTo(firstDay, lastDay);
}

export function weekDayNames(firstDayOfWeek: number = 0): string[] {
  const locales = XDate.locales[XDate.defaultLocale];
  let weekDaysNames = locales?.dayNamesShort;
  if (!weekDaysNames) {
    return [];
  }
  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    weekDaysNames = [...weekDaysNames.slice(dayShift), ...weekDaysNames.slice(0, dayShift)];
  }
  return weekDaysNames;
}

export function page(xd: XDate, firstDayOfWeek: number): XDate[] {
  const days = month(xd);
  let before: XDate[] = [], after: XDate[] = [];

  const fdow = ((7 + firstDayOfWeek) % 7) || 7;
  const ldow = (fdow + 6) % 7;

  firstDayOfWeek = firstDayOfWeek || 0;

  const from = days[0].clone();
  if (from.getDay() !== fdow) {
    from.addDays(-(from.getDay() + 7 - fdow) % 7);
  }

  const to = days[days.length - 1].clone();
  const day = to.getDay();
  if (day !== ldow) {
    to.addDays((ldow + 7 - day) % 7);
  }

  if (isLTE(from, days[0])) {
    before = fromTo(from, days[0]);
  }

  if (isGTE(to, days[days.length - 1])) {
    after = fromTo(days[days.length - 1], to);
  }

  return before.concat(days.slice(1, days.length - 1), after);
}