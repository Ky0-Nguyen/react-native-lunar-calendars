# Expo example app

A small Expo (SDK 57) app that exercises every part of `react-native-lunar-calendars`:
lunar dates, all five marking styles, `CalendarList` and `Agenda`.

It is also what the README demo is recorded from — see
[`.maestro/demo.yaml`](../.maestro/demo.yaml) and [`scripts/record-demo.sh`](../scripts/record-demo.sh).

## Running it

From the repository root:

```bash
npm install
npm run build          # the example consumes dist/, so build first
npm --prefix example install
npm --prefix example run ios      # or: run android / run web
```

The app runs in Expo Go — there is no prebuild step, because the library has no native code.

## Local-development wiring

The example depends on the library as `"react-native-lunar-calendars": "file:.."`, which npm
installs as a symlink to the repository root. Two consequences, both handled in
[`metro.config.js`](metro.config.js):

1. Metro has to **watch the repository root**, or edits to the library never reach the bundle.
2. Metro must resolve `react` and `react-native` to the **example's** copies. The library keeps
   its own copies as dev dependencies, and bundling two Reacts produces
   "Invalid hook call" at runtime.

Apps installing the library from npm need none of this.

After changing library source, re-run `npm run build` at the root — the example imports the
compiled `dist/` output, which is what npm consumers get.

## Driving it with Maestro

```bash
maestro test ../.maestro/smoke.yaml     # quick pass/fail over every screen
maestro test ../.maestro/demo.yaml      # the full walkthrough
```

Tabs expose stable ids (`tab-lunar`, `tab-marked`, `tab-period`, `tab-dots`, `tab-list`,
`tab-agenda`), and each day cell is labelled with its `YYYY-MM-DD`, so flows can tap a
specific date.
