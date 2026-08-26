# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.1] — 2026-08-26

3.0.0 never reached npm, so 3.0.1 is the first published 3.x release. It contains
everything listed under 3.0.0 below, plus:

### Changed

- The README now embeds the demo recording through an absolute URL, so it renders on
  npmjs.com as well as on GitHub, and links through to the full-resolution video.
- Trimmed the credits list.

## [3.0.0] — 2026-08-25

A full modernization of the library. The component API is unchanged, but several
fork-specific behaviours that used to be hard-coded are now opt-in, so this is a major
release. See [Migrating](README.md#from-react-native-lunar-calendars-v2).

### Added

- **Lunar calendar API.** `getLunarDate`, `getLunarDateFromString`, `formatLunarDay`, `jdn`,
  `LUNAR_MIN_YEAR`, `LUNAR_MAX_YEAR`, `clearLunarCache` and `getLunarCacheStats` are exported
  from the package root, so lunar dates can be rendered outside the calendar.
- **Expo support**, documented and exercised: the example app in `example/` is now an Expo
  SDK 57 app that runs in Expo Go with no prebuild step.
- **`disablePastDates`** prop on `Calendar`, `CalendarList` and `Agenda`, replacing the
  behaviour that v2 applied unconditionally.
- **`testID`** prop on `Calendar`, `CalendarList` and `Agenda`, plus accessibility roles and
  labels on day cells and month arrows — day cells are labelled with their `YYYY-MM-DD`.
- **`monthFormat`** is now honoured by the calendar header.
- **`disableArrowLeft` / `disableArrowRight`** on the header.
- **`lunarTextColor` and `lunarNewMonthTextColor`** theme keys.
- **Benchmark** (`npm run benchmark`) that compares the v3 conversion against the v2
  algorithm and asserts they agree on 2000 sampled dates across 1800–2199.
- **Maestro flows** (`.maestro/demo.yaml`, `.maestro/smoke.yaml`) and
  `scripts/record-demo.sh`, which records the README demo locally.

### Changed

- **Performance.** Lunar years and converted dates are memoized, stylesheets are memoized per
  theme object instead of rebuilt per day cell, day components are `React.memo`-wrapped, and
  `Calendar` hoists per-render work out of the per-day loop. Measured against v2: 4.7× faster
  on a re-render of the same month, 3.8× faster when scrolling 24 months.
- **The whole source tree is TypeScript.** Duplicate `.js` copies of already-converted modules
  were removed; `prop-types` is gone in favour of exported types.
- **Modern React.** `componentWillMount` / `componentWillReceiveProps` were replaced with
  `getDerivedStateFromProps` and `componentDidUpdate`, so the components work under React 18
  and 19 without legacy-lifecycle warnings.
- **Modern React Native.** `ViewPropTypes` (removed from React Native 0.72) is no longer used.
  Tested against React Native 0.87 and React 19.
- Default theme colours were restored to the upstream palette — v2 shipped white text
  defaults that rendered invisibly for the `period`, `multi-dot` and `custom` marking types.
- `firstDay` now defaults to `0` (Sunday) consistently. v2 laid out the grid Monday-first
  while the header rendered Sunday-first.
- `dist/` and `coverage/` are no longer committed; `dist/` is built by `prepare` on publish.
- Test suite migrated from Enzyme to `@testing-library/react-native`, and the mock-everything
  jest setup (which stubbed `XDate` itself, making the date tests vacuous) was replaced with
  the standard React Native preset.
- ESLint migrated to flat config with `typescript-eslint`.

### Fixed

- **Every day was rendered in the `disabled` state.** `Calendar.renderDay` overwrote the
  computed day state with `'disabled'` unconditionally, so `today` was never highlighted and
  `minDate`/`maxDate`/`disabledByDefault` had no visible effect.
- **The "previous month" arrow was hidden for any month at or before the current one**,
  making past months unreachable. Navigation is unrestricted again; use `minDate` to limit it.
- **`CalendarList` and `Agenda` crashed on load** — both did `import dateutils from '../dateutils'`,
  but that module has no default export.
- **The calendar header imported `react-native-vector-icons`**, an undeclared dependency, which
  broke any install that did not happen to have it.
- `stylesheet.calendar.header` theme overrides were ignored.
- `Calendar` did not re-render when `markingType`, `theme` or most chrome props changed.
- `CalendarList` passed invalid props to `FlatList` (`initialListSize`, `pageSize`,
  `scrollsToTop`, `initialScrollIndex={false}`) and never cleaned up its layout state.
- `Agenda` leaked its `Animated.Value` listener and a pending timeout on unmount.
- Lunar conversion no longer produces `NaN` for dates outside 1800–2199; it returns
  `{isValid: false}` instead.

### Removed

- `prop-types`, `enzyme` and the hand-written React Native mocks under `spec/`.
- Committed `dist/` and `coverage/` output, `pom.xml`, `.travis.yml`, and the ad-hoc
  `test-lunar.js` / `test-simple.js` scripts.

## [2.1.0]

- Partial TypeScript conversion.
- Vietnamese lunar calendar rendering under the `multi-period` marking type.

## [2.0.x]

- Initial fork of [wix/react-native-calendars](https://github.com/wix/react-native-calendars) v1
  with Vietnamese lunar calendar support.
