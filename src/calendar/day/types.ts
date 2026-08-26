import type {CalendarTheme, DateData, DayMarking, DayState} from '../../theme';

/** Props every built-in day component receives from `<Calendar />`. */
export interface DayComponentProps {
  state?: DayState;
  theme?: CalendarTheme;
  marking?: DayMarking | false;
  date?: DateData;
  onPress?: (date?: DateData) => void;
  onLongPress?: (date?: DateData) => void;
  children?: React.ReactNode;
}

/** Normalize the `marking` prop, which the calendar may hand over as `false` or an array. */
export function normalizeMarking(marking?: DayMarking | false | unknown[]): DayMarking {
  if (!marking) {
    return {};
  }
  if (Array.isArray(marking)) {
    return marking.length ? {marked: true} : {};
  }
  return marking as DayMarking;
}
