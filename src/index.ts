import XDate from 'xdate';

export {default as Calendar} from './calendar';
export {default as CalendarList} from './calendar-list';
export {default as Agenda} from './agenda';

export type {CalendarProps} from './calendar';
export type {CalendarListProps} from './calendar-list';
export type {AgendaProps} from './agenda';
export type {AgendaItems} from './agenda/reservation-list';
export type {
  CalendarTheme,
  DateData,
  DayMarking,
  DayState,
  DotMarking,
  MarkedDates,
  MarkingType,
  PeriodMarking
} from './theme';

export {parseDate, xdateToData} from './interface';

export {
  LUNAR_MAX_YEAR,
  LUNAR_MIN_YEAR,
  clearLunarCache,
  formatLunarDay,
  getLunarCacheStats,
  getLunarDate,
  getLunarDateFromString,
  jdn
} from './lunar';
export type {LunarDate} from './lunar';

/**
 * Locale registry. Add a locale with `LocaleConfig.locales['vi'] = {...}` and select it
 * with `LocaleConfig.defaultLocale = 'vi'`. This is the `XDate` constructor itself.
 */
export const LocaleConfig = XDate;

export {XDate};
