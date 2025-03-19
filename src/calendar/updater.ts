import {parseDate} from '../interface';
import XDate from 'xdate';

interface UpdateResult {
  update: boolean;
  field?: string;
}

interface CalendarProps {
  selected?: string[];
  markedDates?: any;
  hideExtraDays?: boolean;
  minDate?: string;
  maxDate?: string;
  current?: string;
  [key: string]: any;
}

interface CalendarState {
  currentMonth: string;
}

export default function shouldComponentUpdate(
  nextProps: CalendarProps,
  nextState: CalendarState,
  currentProps: CalendarProps,
  currentState: CalendarState
): boolean {
  let shouldUpdate: UpdateResult = {update: false};

  // Check selected dates
  const nextSelected = nextProps.selected || [];
  const currentSelected = currentProps.selected || [];
  
  for (let i = 0; i < nextSelected.length; i++) {
    const next = nextSelected[i];
    const current = currentSelected[i];
    
    if (!current || !next || parseDate(current)?.getTime() !== parseDate(next)?.getTime()) {
      shouldUpdate = {
        update: true,
        field: 'selected'
      };
      break;
    }
  }

  // Check markedDates and hideExtraDays
  ['markedDates', 'hideExtraDays'].forEach(prop => {
    if (!shouldUpdate.update && nextProps[prop] !== currentProps[prop]) {
      shouldUpdate = {
        update: true,
        field: prop
      };
    }
  });

  // Check date-related props
  ['minDate', 'maxDate', 'current'].forEach(prop => {
    if (shouldUpdate.update) return;

    const prevDate = currentProps[prop] ? parseDate(currentProps[prop]) : null;
    const nextDate = nextProps[prop] ? parseDate(nextProps[prop]) : null;

    if (prevDate !== nextDate) {
      if (prevDate && nextDate && prevDate.getTime() === nextDate.getTime()) {
        return;
      }
      shouldUpdate = {
        update: true,
        field: prop
      };
    }
  });

  // Check current month
  if (nextState.currentMonth !== currentState.currentMonth) {
    shouldUpdate = {
      update: true,
      field: 'current'
    };
  }

  return shouldUpdate.update;
}