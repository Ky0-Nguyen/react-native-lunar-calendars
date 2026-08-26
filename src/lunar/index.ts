import {TK19, TK20, TK21, TK22} from './tables';

/** First solar year covered by the bundled lunar tables. */
export const LUNAR_MIN_YEAR = 1800;
/** Last solar year covered by the bundled lunar tables. */
export const LUNAR_MAX_YEAR = 2199;

/** A date on the Vietnamese lunar calendar. */
export interface LunarDate {
  /** Lunar day of month, 1-30. `0` when the date is outside the supported range. */
  day: number;
  /** Lunar month, 1-12. `0` when the date is outside the supported range. */
  month: number;
  /** Lunar year. `0` when the date is outside the supported range. */
  year: number;
  /** `true` when the month is a leap month (tháng nhuận). */
  leap: boolean;
  /** Julian day number of the solar date this was converted from. */
  jd: number;
  /** `false` when the solar date falls outside {@link LUNAR_MIN_YEAR}-{@link LUNAR_MAX_YEAR}. */
  isValid: boolean;
}

/** Start-of-month marker produced when a packed year descriptor is decoded. */
interface LunarMonthStart {
  day: number;
  month: number;
  year: number;
  leap: boolean;
  jd: number;
}

const MONTH_LENGTHS = [29, 30];

/** Decoded year descriptors, keyed by solar year. At most 400 entries ever. */
const yearCache = new Map<number, LunarMonthStart[]>();

/**
 * Converted dates, keyed by `year * 10000 + month * 100 + day`.
 * Bounded so long-lived apps that scroll through many years cannot grow it forever.
 */
const dateCache = new Map<number, LunarDate>();
const DATE_CACHE_LIMIT = 8192;

const INVALID: LunarDate = Object.freeze({
  day: 0,
  month: 0,
  year: 0,
  leap: false,
  jd: 0,
  isValid: false
});

/**
 * Julian day number for a solar (Gregorian) date.
 */
export function jdn(day: number, month: number, year: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** Julian day number of Tết 1800 - the first date the tables can describe. */
const FIRST_DAY = jdn(25, 1, LUNAR_MIN_YEAR);
/** Julian day number of the last date the tables can describe. */
const LAST_DAY = jdn(31, 12, LUNAR_MAX_YEAR);

function packedYear(year: number): number | undefined {
  if (year < LUNAR_MIN_YEAR || year > LUNAR_MAX_YEAR) {
    return undefined;
  }
  if (year < 1900) {
    return TK19[year - 1800];
  }
  if (year < 2000) {
    return TK20[year - 1900];
  }
  if (year < 2100) {
    return TK21[year - 2000];
  }
  return TK22[year - 2100];
}

function decodeLunarYear(year: number, packed: number): LunarMonthStart[] {
  const months: LunarMonthStart[] = [];
  const regularMonths: number[] = new Array(12);
  const offsetOfTet = packed >> 17;
  const leapMonth = packed & 0xf;
  const leapMonthLength = MONTH_LENGTHS[(packed >> 16) & 0x1];

  let currentJD = jdn(1, 1, year) + offsetOfTet;
  let bits = packed >> 4;
  for (let i = 0; i < 12; i++) {
    regularMonths[12 - i - 1] = MONTH_LENGTHS[bits & 0x1];
    bits >>= 1;
  }

  if (leapMonth === 0) {
    for (let mm = 1; mm <= 12; mm++) {
      months.push({day: 1, month: mm, year, leap: false, jd: currentJD});
      currentJD += regularMonths[mm - 1];
    }
    return months;
  }

  for (let mm = 1; mm <= leapMonth; mm++) {
    months.push({day: 1, month: mm, year, leap: false, jd: currentJD});
    currentJD += regularMonths[mm - 1];
  }
  months.push({day: 1, month: leapMonth, year, leap: true, jd: currentJD});
  currentJD += leapMonthLength;
  for (let mm = leapMonth + 1; mm <= 12; mm++) {
    months.push({day: 1, month: mm, year, leap: false, jd: currentJD});
    currentJD += regularMonths[mm - 1];
  }
  return months;
}

/**
 * Decoded month starts for a lunar year, memoized.
 *
 * Decoding is the expensive part of the conversion, and a rendered month asks for
 * the same year 30-42 times in a row, so this cache does most of the work.
 */
function getYearInfo(year: number): LunarMonthStart[] | undefined {
  const cached = yearCache.get(year);
  if (cached) {
    return cached;
  }
  const packed = packedYear(year);
  if (packed === undefined) {
    return undefined;
  }
  const decoded = decodeLunarYear(year, packed);
  yearCache.set(year, decoded);
  return decoded;
}

function findLunarDate(jd: number, months: LunarMonthStart[]): LunarDate {
  if (jd > LAST_DAY || jd < FIRST_DAY || months[0].jd > jd) {
    return INVALID;
  }
  let i = months.length - 1;
  while (jd < months[i].jd) {
    i--;
  }
  const start = months[i];
  return {
    day: start.day + (jd - start.jd),
    month: start.month,
    year: start.year,
    leap: start.leap,
    jd,
    isValid: true
  };
}

/**
 * Convert a solar (Gregorian) date to the Vietnamese lunar calendar.
 *
 * Results are memoized, so calling this once per day cell on every render is cheap.
 * Dates outside {@link LUNAR_MIN_YEAR}-{@link LUNAR_MAX_YEAR} return `isValid: false`.
 *
 * @param day   Solar day of month, 1-31.
 * @param month Solar month, 1-12.
 * @param year  Solar year.
 */
export function getLunarDate(day: number, month: number, year: number): LunarDate {
  const key = year * 10000 + month * 100 + day;
  const cached = dateCache.get(key);
  if (cached) {
    return cached;
  }

  let result = INVALID;
  let months = getYearInfo(year);
  if (months) {
    const jd = jdn(day, month, year);
    if (jd < months[0].jd) {
      months = getYearInfo(year - 1);
    }
    result = months ? findLunarDate(jd, months) : INVALID;
  }

  if (dateCache.size >= DATE_CACHE_LIMIT) {
    // Drop the oldest quarter in one pass rather than evicting on every insert.
    let toDrop = DATE_CACHE_LIMIT >> 2;
    for (const oldKey of dateCache.keys()) {
      dateCache.delete(oldKey);
      if (--toDrop <= 0) {
        break;
      }
    }
  }
  dateCache.set(key, result);
  return result;
}

/**
 * Convert a `YYYY-MM-DD` string to the Vietnamese lunar calendar.
 */
export function getLunarDateFromString(dateString: string): LunarDate {
  const year = Number(dateString.slice(0, 4));
  const month = Number(dateString.slice(5, 7));
  const day = Number(dateString.slice(8, 10));
  if (!year || !month || !day) {
    return INVALID;
  }
  return getLunarDate(day, month, year);
}

/**
 * Label shown under the solar day in the calendar: `"day/month"` on the first day of a
 * lunar month (so the reader knows which month they are in), the bare day otherwise.
 */
export function formatLunarDay(lunar: LunarDate): string {
  if (!lunar.isValid) {
    return '';
  }
  return lunar.day === 1 ? `${lunar.day}/${lunar.month}` : String(lunar.day);
}

/** Empty both memoization caches. Only useful in tests and benchmarks. */
export function clearLunarCache(): void {
  yearCache.clear();
  dateCache.clear();
}

/** Current cache occupancy. Only useful in tests and benchmarks. */
export function getLunarCacheStats(): {years: number; dates: number} {
  return {years: yearCache.size, dates: dateCache.size};
}
