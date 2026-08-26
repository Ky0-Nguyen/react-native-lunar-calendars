import type {TextStyle, ViewStyle} from 'react-native';

/**
 * Theme object accepted by every calendar component.
 *
 * Besides the documented colour/font keys it also accepts `stylesheet.*` overrides,
 * which are merged over the generated stylesheet of the matching component.
 */
export interface CalendarTheme {
  backgroundColor?: string;
  calendarBackground?: string;
  textSectionTitleColor?: string;
  selectedDayBackgroundColor?: string;
  selectedDayTextColor?: string;
  todayBackgroundColor?: string;
  todayTextColor?: string;
  dayTextColor?: string;
  textDisabledColor?: string;
  dotColor?: string;
  selectedDotColor?: string;
  arrowColor?: string;
  monthTextColor?: string;
  indicatorColor?: string;
  agendaDayTextColor?: string;
  agendaDayNumColor?: string;
  agendaTodayColor?: string;
  agendaKnobColor?: string;
  lunarTextColor?: string;
  lunarNewMonthTextColor?: string;
  textDayFontFamily?: string;
  textMonthFontFamily?: string;
  textDayHeaderFontFamily?: string;
  textDayFontWeight?: TextStyle['fontWeight'];
  textMonthFontWeight?: TextStyle['fontWeight'];
  textDayHeaderFontWeight?: TextStyle['fontWeight'];
  textDayFontSize?: number;
  textMonthFontSize?: number;
  textDayHeaderFontSize?: number;
  [key: string]: unknown;
}

/** Data shape passed to every day-related callback. */
export interface DateData {
  year: number;
  month: number;
  day: number;
  timestamp: number;
  dateString: string;
}

/** Visual state the calendar assigns to a day cell. */
export type DayState = 'selected' | 'disabled' | 'today' | '';

/** Supported marking styles. */
export type MarkingType = 'simple' | 'period' | 'multi-dot' | 'multi-period' | 'custom';

export interface DotMarking {
  key?: string;
  color: string;
  selectedDotColor?: string;
}

export interface PeriodMarking {
  startingDay?: boolean;
  endingDay?: boolean;
  color: string;
}

export interface DayMarking {
  selected?: boolean;
  selectedColor?: string;
  marked?: boolean;
  dotColor?: string;
  disabled?: boolean;
  disableTouchEvent?: boolean;
  activeOpacity?: number;
  textColor?: string;
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
  dots?: DotMarking[];
  periods?: PeriodMarking[];
  customStyles?: {container?: ViewStyle; text?: TextStyle};
  [key: string]: unknown;
}

/** Map of `YYYY-MM-DD` to its marking. */
export type MarkedDates = Record<string, DayMarking>;

/**
 * A generated stylesheet. Entries are intersections so the same value can be used both
 * as a view style and a text style, and so emitted `.d.ts` files stay free of
 * React Native's internal module paths.
 */
export type Stylesheet = Record<string, ViewStyle & TextStyle>;

const NO_THEME: CalendarTheme = {};

/**
 * Wrap a stylesheet factory so the same theme object reuses the same stylesheet.
 *
 * Every day cell builds its stylesheet in its constructor, which means a rendered
 * month used to call `StyleSheet.create` 30-42 times with an identical theme. Themes
 * are almost always a stable object (a module constant or a `useMemo` result), so a
 * `WeakMap` keyed on that object removes the repeated work without leaking.
 */
export function memoizeStyle(
  build: (theme: CalendarTheme) => Stylesheet
): (theme?: CalendarTheme) => Stylesheet {
  const cache = new WeakMap<CalendarTheme, Stylesheet>();
  return (theme?: CalendarTheme): Stylesheet => {
    const key = theme ?? NO_THEME;
    const cached = cache.get(key);
    if (cached) {
      return cached;
    }
    const built = build(key);
    cache.set(key, built);
    return built;
  };
}
