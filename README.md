# react-native-lunar-calendars 🗓️ 🌙

Calendar components for React Native with **Vietnamese lunar calendar (Âm Lịch)** support.
A maintained fork of [wix/react-native-calendars](https://github.com/wix/react-native-calendars) v1
that keeps the original API and adds lunar dates, in TypeScript, with no native modules.

Works with **bare React Native** and **Expo** (Expo Go included — nothing to prebuild).

[Tiếng Việt](README.vi.md) · [Changelog](CHANGELOG.md)

---

## Demo

<p align="center">
  <a href="https://github.com/Ky0-Nguyen/react-native-lunar-calendars/blob/master/docs/media/demo.mp4">
    <img src="https://raw.githubusercontent.com/Ky0-Nguyen/react-native-lunar-calendars/master/docs/media/demo.gif" width="300" alt="Lunar dates under every solar day, five marking styles, a scrollable month list and the agenda, running in the Expo example app">
  </a>
</p>

<p align="center">
  <sub>
    Lunar dates under every solar day · Tết highlighted in red · five marking styles ·
    scrollable month list · agenda —
    <a href="https://github.com/Ky0-Nguyen/react-native-lunar-calendars/blob/master/docs/media/demo.mp4">click for the full-resolution video</a>
  </sub>
</p>

Recorded on an iPhone running the Expo example app in [`example/`](example), driven end to end by
the [Maestro](https://maestro.dev) flow in [`.maestro/demo.yaml`](.maestro/demo.yaml) — so the demo
doubles as an integration test: if the flow passes, every screen above really works. Reproduce it
yourself with [Running the demo](#running-the-demo).

## Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Expo](#expo)
- [Lunar calendar](#lunar-calendar)
- [Components](#components)
  - [Calendar](#calendar)
  - [CalendarList](#calendarlist)
  - [Agenda](#agenda)
- [Marking types](#marking-types)
- [Theming](#theming)
- [Localization](#localization)
- [Performance](#performance)
- [Migrating](#migrating)
- [Running the demo](#running-the-demo)
- [Contributing](#contributing)

## Installation

```bash
npm install react-native-lunar-calendars
```

```bash
yarn add react-native-lunar-calendars
```

The library is pure JavaScript — there is no native module and nothing to link.

| Peer dependency | Supported |
| --- | --- |
| `react` | 17 → 19 |
| `react-native` | 0.64 → 0.87 |
| Expo SDK | 49 → 57 |
| TypeScript | 5.0+ (types are bundled) |

## Quick start

```tsx
import React, {useState} from 'react';
import {Calendar, type DateData} from 'react-native-lunar-calendars';

export default function Screen() {
  const [selected, setSelected] = useState('2026-02-17');

  return (
    <Calendar
      current="2026-02-17"
      markingType="multi-period"
      markedDates={{[selected]: {selected: true, selectedColor: '#0d9488'}}}
      onDayPress={(day: DateData) => setSelected(day.dateString)}
    />
  );
}
```

Every callback receives a `DateData`:

```ts
{
  day: 17,                  // day of month, 1-31
  month: 2,                 // month, 1-12
  year: 2026,
  timestamp: 1771286400000, // UTC timestamp of 00:00 on that day
  dateString: '2026-02-17'
}
```

Props that take a date accept a `YYYY-MM-DD` string, a JavaScript `Date`, an `XDate`, a
UTC timestamp, or a `DateData` object.

## Expo

No config plugin, no prebuild, no `expo-dev-client` — the library is plain JavaScript, so it
runs in Expo Go as-is:

```bash
npx expo install react-native-lunar-calendars
```

```tsx
// app/index.tsx
import {Calendar} from 'react-native-lunar-calendars';

export default function Home() {
  return <Calendar markingType="multi-period" />;
}
```

A complete Expo app lives in [`example/`](example) (Expo SDK 57, TypeScript, Expo Router-free
so it stays minimal):

```bash
npm run build                 # build the library into dist/
npm --prefix example install
npm --prefix example run ios  # or: run android / run web
```

Because the example consumes the library from the repository root, its
[`metro.config.js`](example/metro.config.js) pins `react` and `react-native` to the example's own
copies. Copy that pattern if you develop against a local checkout; app users installing from npm
need none of it.

## Lunar calendar

Lunar dates are rendered under the solar day by the `multi-period` marking type:

```tsx
<Calendar markingType="multi-period" />
```

- The first day of a lunar month shows as `day/month` in red — so month boundaries are
  visible at a glance.
- Every other day shows the bare lunar day in grey.
- The colours are themable via `lunarNewMonthTextColor` and `lunarTextColor`.

### Using the conversion directly

The conversion is also exported, so you can render lunar dates anywhere — a header, a list
row, a custom `dayComponent`:

```ts
import {
  getLunarDate,
  getLunarDateFromString,
  formatLunarDay,
  LUNAR_MIN_YEAR,
  LUNAR_MAX_YEAR
} from 'react-native-lunar-calendars';

getLunarDate(17, 2, 2026);
// { day: 1, month: 1, year: 2026, leap: false, jd: 2461454, isValid: true }  ← Tết

getLunarDateFromString('2024-09-17');
// { day: 15, month: 8, year: 2024, leap: false, ... }  ← Mid-Autumn Festival

formatLunarDay(getLunarDate(17, 2, 2026)); // '1/1'
formatLunarDay(getLunarDate(18, 2, 2026)); // '2'
```

| Export | Description |
| --- | --- |
| `getLunarDate(day, month, year)` | Convert a solar date. Returns a `LunarDate`. |
| `getLunarDateFromString('YYYY-MM-DD')` | Same, from a date string. |
| `formatLunarDay(lunar)` | `'day/month'` on the first of a lunar month, otherwise `'day'`. |
| `jdn(day, month, year)` | Julian day number of a solar date. |
| `LUNAR_MIN_YEAR` / `LUNAR_MAX_YEAR` | `1800` / `2199` — the range the tables cover. |
| `clearLunarCache()` / `getLunarCacheStats()` | Cache control, for tests and benchmarks. |

Dates outside 1800–2199 return `{isValid: false}` rather than throwing, so a stray date can
never crash a render.

```ts
interface LunarDate {
  day: number;     // 1-30 (0 when invalid)
  month: number;   // 1-12 (0 when invalid)
  year: number;
  leap: boolean;   // true for a leap month (tháng nhuận)
  jd: number;      // Julian day number of the source solar date
  isValid: boolean;
}
```

Accuracy is checked against published Tết dates (2026, 2025, 2024, 2023, 2016, 2015, 2000,
1975), the 2024 Mid-Autumn Festival and the 2025 leap 6th month — see
[`src/lunar/__tests__`](src/lunar/__tests__/lunar.test.ts).

## Components

### Calendar

```tsx
<Calendar
  // Initially visible month. Default: today.
  current="2026-02-01"
  // Earliest / latest selectable day; anything outside is greyed out.
  minDate="2026-01-01"
  maxDate="2026-12-31"
  // Day interaction.
  onDayPress={day => console.log('pressed', day)}
  onDayLongPress={day => console.log('long pressed', day)}
  // Month title format, see http://arshaw.com/xdate/#Formatting.
  // Default: the localized month name plus the year.
  monthFormat="yyyy MM"
  onMonthChange={month => console.log('month changed', month)}
  // Chrome.
  hideArrows={false}
  hideDayNames={false}
  hideExtraDays={true}
  showWeekNumbers={false}
  displayLoadingIndicator={false}
  // 0 = week starts on Sunday (default), 1 = Monday.
  firstDay={1}
  // Replace the default '‹' / '›' arrows.
  renderArrow={direction => <MyArrow direction={direction} />}
  // Take over month navigation.
  onPressArrowLeft={subtractMonth => subtractMonth()}
  onPressArrowRight={addMonth => addMonth()}
  // Disable every day unless markedDates says otherwise.
  disabledByDefault={false}
  // Disable every day before today.
  disablePastDates={false}
  // Do not switch month when a greyed-out adjacent day is pressed.
  disableMonthChange={false}
/>
```

### CalendarList

A scrollable list of months. It accepts every `Calendar` prop plus:

```tsx
<CalendarList
  pastScrollRange={50}       // months available before `current`
  futureScrollRange={50}     // months available after `current`
  calendarHeight={360}
  scrollEnabled={true}
  showScrollIndicator={false}
  onVisibleMonthsChange={months => console.log('visible', months)}
  // Horizontal, one month per page:
  horizontal={true}
  pagingEnabled={true}
  calendarWidth={320}
/>
```

Only the months near the viewport render a real calendar; the rest are cheap text
placeholders, which is what keeps a ±50 month range affordable.

Imperative methods (via `ref`): `scrollToMonth(date)` and `scrollToDay(date, offset?, animated?)`.

### Agenda

A calendar that collapses into a header above a list of items for the selected day.

```tsx
<Agenda<MyItem>
  // Items keyed by date. `[]` means "loaded, nothing on this day";
  // a missing key means "not loaded yet".
  items={{
    '2026-02-17': [{name: 'Tết'}],
    '2026-02-18': []
  }}
  selected="2026-02-17"
  loadItemsForMonth={month => fetchItems(month)}
  onCalendarToggled={opened => console.log('calendar opened:', opened)}
  onDayPress={day => console.log('day pressed', day)}
  onDayChange={day => console.log('scrolled to', day)}
  renderItem={(item, isFirstOfDay) => <Row item={item} first={isFirstOfDay} />}
  renderDay={(date, item) => <DayColumn date={date} />}
  renderEmptyDate={() => <Text>Nothing planned</Text>}
  renderEmptyData={() => <Spinner />}
  renderKnob={() => <Knob />}
  rowHasChanged={(a, b) => a.name !== b.name}
  hideKnob={false}
/>
```

`Agenda` is generic over your item type, so `renderItem` and `rowHasChanged` are fully typed.

## Marking types

`markedDates` maps `YYYY-MM-DD` to a marking. **Replace the object rather than mutating it** —
the calendar compares by identity, so an in-place edit will not re-render.

| `markingType` | Marking keys | Lunar dates |
| --- | --- | --- |
| `'simple'` (default) | `selected`, `selectedColor`, `marked`, `dotColor`, `disabled`, `textColor` | — |
| `'period'` | `startingDay`, `endingDay`, `color`, `textColor` | — |
| `'multi-dot'` | `dots: [{key, color, selectedDotColor}]` | — |
| `'multi-period'` | `periods: [{startingDay, endingDay, color}]` | ✅ |
| `'custom'` | `customStyles: {container, text}` | — |

```tsx
// Simple
<Calendar markedDates={{'2026-02-17': {selected: true, marked: true, selectedColor: '#0d9488'}}} />

// Period
<Calendar
  markingType="period"
  markedDates={{
    '2026-02-16': {startingDay: true, color: '#0d9488', textColor: '#fff'},
    '2026-02-17': {color: '#14b8a6', textColor: '#fff'},
    '2026-02-18': {endingDay: true, color: '#0d9488', textColor: '#fff'}
  }}
/>

// Multi-dot
<Calendar
  markingType="multi-dot"
  markedDates={{
    '2026-02-17': {
      dots: [
        {key: 'tet', color: '#e11d48'},
        {key: 'family', color: '#f59e0b'}
      ]
    }
  }}
/>

// Multi-period — the one that also renders lunar dates
<Calendar
  markingType="multi-period"
  markedDates={{
    '2026-02-17': {periods: [{startingDay: true, endingDay: false, color: '#e11d48'}]}
  }}
/>

// Custom
<Calendar
  markingType="custom"
  markedDates={{
    '2026-02-17': {
      customStyles: {
        container: {backgroundColor: '#0d9488'},
        text: {color: '#ffffff', fontWeight: 'bold'}
      }
    }
  }}
/>
```

Marking types cannot be mixed — one calendar uses one style.

### Custom day component

```tsx
<Calendar
  dayComponent={({date, state, marking, onPress}) => (
    <TouchableOpacity onPress={() => onPress?.(date)}>
      <Text style={{color: state === 'disabled' ? '#cbd5e1' : '#0f172a'}}>{date?.day}</Text>
    </TouchableOpacity>
  )}
/>
```

Your component receives `date`, `state` (`'disabled' | 'today' | ''`), `marking`, `theme`,
`onPress` and `onLongPress`. Wrap it in `React.memo` — it is rendered up to 42 times per month.

## Theming

```tsx
<Calendar
  style={{borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12}}
  theme={{
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#94a3b8',
    selectedDayBackgroundColor: '#0d9488',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#0d9488',
    dayTextColor: '#0f172a',
    textDisabledColor: '#cbd5e1',
    dotColor: '#0d9488',
    selectedDotColor: '#ffffff',
    arrowColor: '#0d9488',
    monthTextColor: '#0f172a',
    indicatorColor: '#0d9488',
    // Lunar-specific:
    lunarTextColor: '#64748b',
    lunarNewMonthTextColor: '#e11d48',
    // Typography:
    textDayFontFamily: 'System',
    textMonthFontFamily: 'System',
    textDayHeaderFontFamily: 'System',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 13
  }}
/>
```

Keep the theme object stable (a module constant or a `useMemo` result). Stylesheets are
memoized per theme object, so a fresh object on every render throws that work away.

### Stylesheet overrides

For full control, override a generated stylesheet by id:

```tsx
theme={{
  'stylesheet.calendar.header': {
    week: {marginTop: 5, flexDirection: 'row', justifyContent: 'space-between'}
  }
}}
```

Available ids: `stylesheet.calendar.main`, `stylesheet.calendar.header`,
`stylesheet.calendar-list.main`, `stylesheet.day.basic`, `stylesheet.day.period`,
`stylesheet.day.multiDot`, `stylesheet.day.multiPeriod`, `stylesheet.day.single`,
`stylesheet.agenda.main`, `stylesheet.agenda.list`.

> Overriding internal stylesheets is unsupported: they can change in any release.

## Localization

```ts
import {LocaleConfig} from 'react-native-lunar-calendars';

LocaleConfig.locales.vi = {
  monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
               'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
  monthNamesShort: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
  dayNames: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
};

LocaleConfig.defaultLocale = 'vi';
```

`dayNames` always start at Sunday, regardless of `firstDay`.

## Performance

Rendering a month means building 30–42 day cells, and with lunar dates each of those cells
needs a calendar conversion. v3 removes the repeated work:

- **Lunar conversion is memoized twice** — decoded lunar years are cached (400 possible
  entries), and converted dates are cached in a bounded map. v2 decoded a full lunar year
  from its packed table entry on *every* cell of *every* render.
- **Stylesheets are memoized per theme object**, instead of calling `StyleSheet.create` once
  per day cell.
- **Day components are `React.memo`-wrapped**, so unaffected cells skip re-rendering when a
  selection changes.
- **`Calendar` hoists per-render work** (parsing `minDate`/`maxDate`, building the current
  month) out of the per-day loop.

Measured on an M-series Mac with `npm run benchmark`, comparing against the v2 algorithm:

| Workload | v2 | v3 | |
| --- | --- | --- | --- |
| One month (42 cells), cold cache | 13.0 µs | 9.7 µs | **1.3×** |
| Re-render of the same month | 5.5 µs | 1.2 µs | **4.7×** |
| Scrolling 24 months (1008 cells) | 92.5 µs | 24.6 µs | **3.8×** |

The benchmark also verifies that v3 returns identical results to v2 on 2000 sampled dates
across the full 1800–2199 range, so the speed-up costs no accuracy.

```bash
npm run benchmark
```

## Migrating

### From `react-native-calendars`

Change the import — the component API is unchanged:

```diff
-import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
+import {Calendar, CalendarList, Agenda} from 'react-native-lunar-calendars';
```

### From `react-native-lunar-calendars` v2

v3 is a rewrite of the internals. The component API is the same, but four fork-specific
behaviours that used to be hard-coded are now opt-in or fixed:

| v2 behaviour | v3 |
| --- | --- |
| Every day was rendered in the `disabled` state (a bug — `today` never highlighted) | Day state is computed correctly again |
| All past days were disabled | Opt in with `disablePastDates` |
| The "previous month" arrow was hidden for past months | The arrow always works; use `minDate` to limit navigation |
| `firstDay` defaulted to Monday in the grid but Sunday in the header | Both default to Sunday (`firstDay={0}`); pass `firstDay={1}` for Monday |
| Default theme colours were white-on-white for some marking types | Restored to the upstream palette |

Also: `prop-types` is no longer a dependency (types come from TypeScript), and lunar helpers
are exported from the package root. See the [changelog](CHANGELOG.md) for the full list.

## Running the demo

The demo GIF is generated locally — nothing is uploaded anywhere.

```bash
# 1. Build the library and install the example app
npm install
npm run build
npm --prefix example install

# 2. Launch the example in Expo Go on a booted iOS Simulator
npm --prefix example run ios

# 3. Drive it with Maestro while simctl records the screen
./scripts/record-demo.sh
```

That writes `docs/media/demo.mp4` and `docs/media/demo.gif`. Requires
[Maestro](https://maestro.dev), `ffmpeg` and Xcode's simulator tools.

For a quick pass/fail check of the same screens without recording:

```bash
maestro test .maestro/smoke.yaml
```

## Contributing

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm test            # jest
npm run build       # tsc -> dist/
```

Please run all four before opening a pull request. Bug reports that are not lunar-specific
are often better filed upstream at
[wix/react-native-calendars](https://github.com/wix/react-native-calendars).

## Credits

- Calendar components: [wix/react-native-calendars](https://github.com/wix/react-native-calendars)
- Fork maintained by [Tuan Nguyen](https://github.com/Ky0-Nguyen)

MIT licensed — see [LICENSE](LICENSE).
