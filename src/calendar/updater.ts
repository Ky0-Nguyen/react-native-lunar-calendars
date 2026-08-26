import {parseDate} from '../interface';

type UpdaterProps = Record<string, unknown>;

interface UpdaterState {
  currentMonth: string;
}

/** Props whose identity change alone is enough to warrant a re-render. */
const IDENTITY_PROPS = [
  'markedDates',
  'markingType',
  'theme',
  'style',
  'hideExtraDays',
  'hideArrows',
  'hideDayNames',
  'showWeekNumbers',
  'displayLoadingIndicator',
  'disabledByDefault',
  'disablePastDates',
  'firstDay',
  'monthFormat',
  'dayComponent',
  'renderArrow'
] as const;

/** Props holding a date that has to be compared by value, not by identity. */
const DATE_PROPS = ['minDate', 'maxDate', 'current'] as const;

/**
 * Decide whether `<Calendar />` has to re-render.
 *
 * A month is 30-42 day components, so skipping a render here skips a lot of work.
 * Callers that mutate `markedDates` in place instead of replacing it will not
 * trigger an update - that is intentional and matches the upstream library.
 */
export default function shouldComponentUpdate(
  rawNextProps: object,
  nextState: UpdaterState,
  rawCurrentProps: object,
  currentState: UpdaterState
): boolean {
  const nextProps = rawNextProps as UpdaterProps;
  const currentProps = rawCurrentProps as UpdaterProps;

  if (nextState.currentMonth !== currentState.currentMonth) {
    return true;
  }

  const nextSelected = (nextProps.selected as unknown[]) ?? [];
  const currentSelected = (currentProps.selected as unknown[]) ?? [];
  if (nextSelected.length !== currentSelected.length) {
    return true;
  }
  for (let i = 0; i < nextSelected.length; i++) {
    const next = parseDate(nextSelected[i] as never);
    const current = parseDate(currentSelected[i] as never);
    if (next?.getTime() !== current?.getTime()) {
      return true;
    }
  }

  for (const prop of IDENTITY_PROPS) {
    if (nextProps[prop] !== currentProps[prop]) {
      return true;
    }
  }

  for (const prop of DATE_PROPS) {
    const next = parseDate(nextProps[prop] as never);
    const current = parseDate(currentProps[prop] as never);
    if (next?.getTime() !== current?.getTime()) {
      return true;
    }
  }

  return false;
}
