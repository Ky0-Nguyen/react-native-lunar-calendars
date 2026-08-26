import {
  LUNAR_MAX_YEAR,
  LUNAR_MIN_YEAR,
  clearLunarCache,
  formatLunarDay,
  getLunarCacheStats,
  getLunarDate,
  getLunarDateFromString,
  jdn
} from '../index';

describe('getLunarDate', () => {
  beforeEach(() => {
    clearLunarCache();
  });

  // Tết (lunar new year) dates are the strongest published reference points for the
  // Vietnamese calendar, so they double as the correctness fixture for the tables.
  it.each([
    ['2026-02-17', 'Bính Ngọ'],
    ['2025-01-29', 'Ất Tỵ'],
    ['2024-02-10', 'Giáp Thìn'],
    ['2023-01-22', 'Quý Mão'],
    ['2016-02-08', 'Bính Thân'],
    ['2015-02-19', 'Ất Mùi'],
    ['2000-02-05', 'Canh Thìn'],
    ['1975-02-11', 'Ất Mão']
  ])('maps %s (Tết %s) to 1/1', dateString => {
    const lunar = getLunarDateFromString(dateString);
    expect(lunar.isValid).toBe(true);
    expect(lunar.day).toBe(1);
    expect(lunar.month).toBe(1);
    expect(lunar.year).toBe(Number(dateString.slice(0, 4)));
  });

  it('maps the 2024 mid-autumn festival to 15/8', () => {
    expect(getLunarDate(17, 9, 2024)).toMatchObject({day: 15, month: 8, year: 2024});
  });

  it('keeps the lunar year behind when the solar year has already turned', () => {
    expect(getLunarDate(1, 1, 2026)).toMatchObject({day: 13, month: 11, year: 2025});
  });

  it('covers the whole documented range', () => {
    expect(getLunarDate(25, 1, LUNAR_MIN_YEAR)).toMatchObject({day: 1, month: 1, isValid: true});
    expect(getLunarDate(31, 12, LUNAR_MAX_YEAR).isValid).toBe(true);
  });

  it('reports dates outside the range as invalid instead of throwing', () => {
    expect(getLunarDate(1, 1, LUNAR_MIN_YEAR - 1)).toMatchObject({day: 0, month: 0, isValid: false});
    expect(getLunarDate(1, 1, LUNAR_MAX_YEAR + 1)).toMatchObject({day: 0, month: 0, isValid: false});
  });

  it('advances one lunar day per solar day across a month boundary', () => {
    // 2024-02-09 is the last day of the 12th lunar month of 2023; the next day is Tết.
    expect(getLunarDate(9, 2, 2024)).toMatchObject({day: 30, month: 12, year: 2023});
    expect(getLunarDate(10, 2, 2024)).toMatchObject({day: 1, month: 1, year: 2024});
  });

  it('flags leap months', () => {
    // 2025 has a leap 6th month running from 2025-07-25.
    expect(getLunarDate(25, 7, 2025)).toMatchObject({day: 1, month: 6, leap: true});
    expect(getLunarDate(24, 7, 2025)).toMatchObject({month: 6, leap: false});
  });

  it('never produces a day outside 1-30 over a full decade', () => {
    for (let year = 2020; year <= 2030; year++) {
      for (let month = 1; month <= 12; month++) {
        const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
        for (let day = 1; day <= daysInMonth; day++) {
          const lunar = getLunarDate(day, month, year);
          expect(lunar.isValid).toBe(true);
          expect(lunar.day).toBeGreaterThanOrEqual(1);
          expect(lunar.day).toBeLessThanOrEqual(30);
          expect(lunar.month).toBeGreaterThanOrEqual(1);
          expect(lunar.month).toBeLessThanOrEqual(12);
        }
      }
    }
  });
});

describe('jdn', () => {
  it('matches known Julian day numbers', () => {
    expect(jdn(1, 1, 2000)).toBe(2451545);
    expect(jdn(10, 2, 2024) - jdn(9, 2, 2024)).toBe(1);
  });
});

describe('caching', () => {
  beforeEach(() => {
    clearLunarCache();
  });

  it('decodes each lunar year at most once', () => {
    getLunarDate(1, 3, 2026);
    getLunarDate(2, 3, 2026);
    getLunarDate(31, 3, 2026);
    // Only 2026 is needed: every date is after Tết 2026.
    expect(getLunarCacheStats().years).toBe(1);
    expect(getLunarCacheStats().dates).toBe(3);
  });

  it('returns the identical object for a repeated lookup', () => {
    expect(getLunarDate(10, 2, 2024)).toBe(getLunarDate(10, 2, 2024));
  });

  it('stays bounded when many distinct dates are converted', () => {
    for (let year = 1900; year < 1930; year++) {
      for (let month = 1; month <= 12; month++) {
        for (let day = 1; day <= 28; day++) {
          getLunarDate(day, month, year);
        }
      }
    }
    expect(getLunarCacheStats().dates).toBeLessThanOrEqual(8192);
  });
});

describe('formatLunarDay', () => {
  it('shows day/month on the first day of a lunar month', () => {
    expect(formatLunarDay(getLunarDate(10, 2, 2024))).toBe('1/1');
  });

  it('shows the bare day otherwise', () => {
    expect(formatLunarDay(getLunarDate(17, 9, 2024))).toBe('15');
  });

  it('renders nothing for an unsupported date', () => {
    expect(formatLunarDay(getLunarDate(1, 1, 1700))).toBe('');
  });
});
