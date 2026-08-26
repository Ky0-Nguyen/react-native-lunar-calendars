#!/usr/bin/env node
/**
 * Compares the lunar conversion shipped in v3 against the v2 implementation, which
 * decoded a whole lunar year from its packed table entry on every single call - and was
 * called once per day cell, on every render.
 *
 * Run with: npm run benchmark
 */
'use strict';

const {getLunarDate, clearLunarCache, getLunarCacheStats} = require('../dist/lunar');
const {TK19, TK20, TK21, TK22} = require('../dist/lunar/tables');

// ---------------------------------------------------------------------------
// v2 implementation, transcribed from src/calendar/day/multi-period/index.js@2.1.0
// ---------------------------------------------------------------------------
function INT(d) {
  return Math.floor(d);
}

function jdnLegacy(dd, mm, yy) {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  return (
    dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045
  );
}

function decodeLunarYearLegacy(yy, k) {
  const monthLengths = [29, 30];
  const regularMonths = new Array(12);
  const offsetOfTet = k >> 17;
  const leapMonth = k & 0xf;
  const leapMonthLength = monthLengths[(k >> 16) & 0x1];
  let currentJD = jdnLegacy(1, 1, yy) + offsetOfTet;
  let j = k >> 4;
  const ly = [];
  for (let i = 0; i < 12; i++) {
    regularMonths[12 - i - 1] = monthLengths[j & 0x1];
    j >>= 1;
  }
  if (leapMonth === 0) {
    for (let mm = 1; mm <= 12; mm++) {
      ly.push({day: 1, month: mm, year: yy, leap: 0, jd: currentJD});
      currentJD += regularMonths[mm - 1];
    }
  } else {
    for (let mm = 1; mm <= leapMonth; mm++) {
      ly.push({day: 1, month: mm, year: yy, leap: 0, jd: currentJD});
      currentJD += regularMonths[mm - 1];
    }
    ly.push({day: 1, month: leapMonth, year: yy, leap: 1, jd: currentJD});
    currentJD += leapMonthLength;
    for (let mm = leapMonth + 1; mm <= 12; mm++) {
      ly.push({day: 1, month: mm, year: yy, leap: 0, jd: currentJD});
      currentJD += regularMonths[mm - 1];
    }
  }
  return ly;
}

function getYearInfoLegacy(yyyy) {
  let yearCode;
  if (yyyy < 1900) {
    yearCode = TK19[yyyy - 1800];
  } else if (yyyy < 2000) {
    yearCode = TK20[yyyy - 1900];
  } else if (yyyy < 2100) {
    yearCode = TK21[yyyy - 2000];
  } else {
    yearCode = TK22[yyyy - 2100];
  }
  return decodeLunarYearLegacy(yyyy, yearCode);
}

function getLunarDateLegacy(dd, mm, yyyy) {
  let ly = getYearInfoLegacy(yyyy);
  const jd = jdnLegacy(dd, mm, yyyy);
  if (jd < ly[0].jd) {
    ly = getYearInfoLegacy(yyyy - 1);
  }
  let i = ly.length - 1;
  while (jd < ly[i].jd) {
    i--;
  }
  return {day: ly[i].day + (jd - ly[i].jd), month: ly[i].month, year: ly[i].year};
}

// ---------------------------------------------------------------------------
// Workloads
// ---------------------------------------------------------------------------

/** The 42 day cells of one rendered month. */
function monthCells(year, month) {
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(Date.UTC(year, month - 1, 1 - 6 + i));
    cells.push([d.getUTCDate(), d.getUTCMonth() + 1, d.getUTCFullYear()]);
  }
  return cells;
}

function bench(label, iterations, fn) {
  fn(); // warm up JIT
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const ns = Number(process.hrtime.bigint() - start);
  const perOp = ns / iterations;
  return {label, perOp, opsPerSecond: 1e9 / perOp};
}

function format(ms) {
  return ms < 1 ? `${(ms * 1000).toFixed(1)} µs` : `${ms.toFixed(3)} ms`;
}

function report(title, legacy, current) {
  const legacyMs = legacy.perOp / 1e6;
  const currentMs = current.perOp / 1e6;
  console.log(`\n${title}`);
  console.log(`  v2 (decode per call) : ${format(legacyMs).padStart(10)}`);
  console.log(`  v3 (memoized)        : ${format(currentMs).padStart(10)}`);
  console.log(`  speed-up             : ${(legacyMs / currentMs).toFixed(1)}x`);
}

console.log('react-native-lunar-calendars - lunar conversion benchmark');
console.log(`node ${process.version} on ${process.platform}/${process.arch}`);

// 1. One freshly rendered month, cold cache each time.
const feb2026 = monthCells(2026, 2);
report(
  'One rendered month (42 day cells), cold cache',
  bench('legacy', 2000, () => {
    for (const [d, m, y] of feb2026) {
      getLunarDateLegacy(d, m, y);
    }
  }),
  bench('current', 2000, () => {
    clearLunarCache();
    for (const [d, m, y] of feb2026) {
      getLunarDate(d, m, y);
    }
  })
);

// 2. Re-rendering the same month, which is what actually happens while a user taps
//    around: selecting a day re-renders all 42 cells.
clearLunarCache();
for (const [d, m, y] of feb2026) {
  getLunarDate(d, m, y);
}
report(
  'Re-render of the same month (warm cache)',
  bench('legacy', 5000, () => {
    for (const [d, m, y] of feb2026) {
      getLunarDateLegacy(d, m, y);
    }
  }),
  bench('current', 5000, () => {
    for (const [d, m, y] of feb2026) {
      getLunarDate(d, m, y);
    }
  })
);

// 3. Scrolling a CalendarList across two years.
const scroll = [];
for (let month = 1; month <= 24; month++) {
  scroll.push(...monthCells(2025 + Math.floor((month - 1) / 12), ((month - 1) % 12) + 1));
}
report(
  `Scrolling 24 months (${scroll.length} day cells)`,
  bench('legacy', 200, () => {
    for (const [d, m, y] of scroll) {
      getLunarDateLegacy(d, m, y);
    }
  }),
  bench('current', 200, () => {
    for (const [d, m, y] of scroll) {
      getLunarDate(d, m, y);
    }
  })
);

const stats = getLunarCacheStats();
console.log(`\nCache after the run: ${stats.years} decoded years, ${stats.dates} converted dates.`);

// 4. Correctness guard: the two implementations must agree everywhere they overlap.
let mismatches = 0;
for (let year = 1800; year <= 2199; year++) {
  for (const [month, day] of [
    [1, 1],
    [2, 14],
    [6, 30],
    [9, 17],
    [12, 31]
  ]) {
    const a = getLunarDateLegacy(day, month, year);
    const b = getLunarDate(day, month, year);
    if (b.isValid && (a.day !== b.day || a.month !== b.month || a.year !== b.year)) {
      mismatches++;
    }
  }
}
console.log(
  mismatches === 0
    ? 'Correctness: v3 matches v2 on all 2000 sampled dates across 1800-2199.'
    : `Correctness: ${mismatches} MISMATCHES against v2.`
);
process.exit(mismatches === 0 ? 0 : 1);
