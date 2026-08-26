import React, {Component} from 'react';
import {View, type StyleProp, type ViewStyle} from 'react-native';
import XDate from 'xdate';
import * as dateutils from '../dateutils';
import {parseDate, xdateToData} from '../interface';
import styleConstructor from './style';
import Day from './day/basic';
import PeriodDay from './day/period';
import MultiDotDay from './day/multi-dot';
import MultiPeriodDay from './day/multi-period';
import CustomDay from './day/custom';
import CalendarHeader from './header';
import shouldComponentUpdate from './updater';
import type {CalendarTheme, DateData, DayMarking, DayState, MarkedDates, MarkingType} from '../theme';

export interface CalendarProps {
  /** Theme overrides for colours, fonts and `stylesheet.*` sections. */
  theme?: CalendarTheme;
  /** Style applied to the calendar container. */
  style?: StyleProp<ViewStyle>;
  /** Test identifier placed on the calendar container. */
  testID?: string;
  /** Initially visible month. Default: today. */
  current?: string | number | Date | XDate | DateData;
  /** Earliest selectable date; earlier dates are greyed out. */
  minDate?: string | number | Date | XDate | DateData;
  /** Latest selectable date; later dates are greyed out. */
  maxDate?: string | number | Date | XDate | DateData;
  /** Dates to mark, keyed by `YYYY-MM-DD`. Must be replaced (not mutated) to trigger a re-render. */
  markedDates?: MarkedDates;
  /** Marking style. Default `'simple'`. Lunar dates are rendered by `'multi-period'`. */
  markingType?: MarkingType;
  /** First day of the week: 0 = Sunday, 1 = Monday. Default `0`. */
  firstDay?: number;
  /** Month title format, see http://arshaw.com/xdate/#Formatting. Default: localized month + year. */
  monthFormat?: string;
  /** Hide the month navigation arrows. */
  hideArrows?: boolean;
  /** Hide the weekday names row. */
  hideDayNames?: boolean;
  /** Hide days that belong to the previous/next month. */
  hideExtraDays?: boolean;
  /** Show a spinner next to the month name. */
  displayLoadingIndicator?: boolean;
  /** Show ISO week numbers in a leading column. */
  showWeekNumbers?: boolean;
  /** Mark every day as disabled unless `markedDates` says otherwise. */
  disabledByDefault?: boolean;
  /** Disable every day before today. Default `false`. */
  disablePastDates?: boolean;
  /** Do not change month when a day from an adjacent month is pressed. */
  disableMonthChange?: boolean;
  /** Replace the built-in day component. */
  dayComponent?: React.ComponentType<any>;
  /** Replace the default arrows. */
  renderArrow?: (direction: 'left' | 'right') => React.ReactNode;
  onDayPress?: (date: DateData) => void;
  onDayLongPress?: (date: DateData) => void;
  onMonthChange?: (date: DateData) => void;
  onVisibleMonthsChange?: (dates: DateData[]) => void;
  onPressArrowLeft?: (subtractMonth: () => void) => void;
  onPressArrowRight?: (addMonth: () => void) => void;
}

interface CalendarState {
  currentMonth: string;
  /** Mirror of `props.current`, so `getDerivedStateFromProps` only reacts to real changes. */
  propCurrent?: string;
}

const EMPTY_MARKING: DayMarking = {};

/**
 * The visible month, as the ISO date of its first day.
 *
 * It has to round-trip through a string (it lives in state) and it has to be parseable by
 * every JavaScript engine we run on. Hermes rejects the `'yyyy MM'` form this library used
 * to store, which made every day cell come back undefined on device.
 */
function toMonthKey(date?: XDate): string | undefined {
  if (!date) {
    return undefined;
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
}

function fromMonthKey(key: string): XDate {
  return parseDate(key) ?? new XDate();
}

class Calendar extends Component<CalendarProps, CalendarState> {
  private style: ReturnType<typeof styleConstructor>;

  constructor(props: CalendarProps) {
    super(props);
    this.style = styleConstructor(props.theme);
    const current = parseDate(props.current) ?? new XDate();
    this.state = {
      currentMonth: toMonthKey(current) as string,
      propCurrent: toMonthKey(parseDate(props.current))
    };
  }

  static getDerivedStateFromProps(props: CalendarProps, state: CalendarState): Partial<CalendarState> | null {
    const nextCurrent = toMonthKey(parseDate(props.current));
    if (nextCurrent && nextCurrent !== state.propCurrent) {
      return {currentMonth: nextCurrent, propCurrent: nextCurrent};
    }
    return null;
  }

  override shouldComponentUpdate(nextProps: CalendarProps, nextState: CalendarState): boolean {
    return shouldComponentUpdate(nextProps, nextState, this.props, this.state);
  }

  override componentDidUpdate(prevProps: CalendarProps): void {
    if (prevProps.theme !== this.props.theme) {
      this.style = styleConstructor(this.props.theme);
    }
  }

  private getDayComponent(): React.ComponentType<any> {
    if (this.props.dayComponent) {
      return this.props.dayComponent;
    }
    switch (this.props.markingType) {
      case 'period':
        return PeriodDay;
      case 'multi-dot':
        return MultiDotDay;
      case 'multi-period':
        return MultiPeriodDay;
      case 'custom':
        return CustomDay;
      default:
        return Day;
    }
  }

  private getDateMarking(day: XDate): DayMarking {
    const {markedDates} = this.props;
    if (!markedDates) {
      return EMPTY_MARKING;
    }
    return markedDates[day.toString('yyyy-MM-dd')] ?? EMPTY_MARKING;
  }

  updateMonth = (day: XDate, doNotTriggerListeners?: boolean): void => {
    const monthKey = toMonthKey(day) as string;
    if (monthKey === this.state.currentMonth) {
      return;
    }
    this.setState({currentMonth: monthKey}, () => {
      if (doNotTriggerListeners) {
        return;
      }
      const currentMonth = fromMonthKey(this.state.currentMonth);
      this.props.onMonthChange?.(xdateToData(currentMonth));
      this.props.onVisibleMonthsChange?.([xdateToData(currentMonth)]);
    });
  };

  addMonth = (count: number): void => {
    this.updateMonth(fromMonthKey(this.state.currentMonth).addMonths(count, true));
  };

  private handleDayInteraction(date?: DateData, interaction?: (date: DateData) => void): void {
    const day = parseDate(date);
    if (!day) {
      return;
    }
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    if ((minDate && !dateutils.isGTE(day, minDate)) || (maxDate && !dateutils.isLTE(day, maxDate))) {
      return;
    }
    if (!this.props.disableMonthChange) {
      this.updateMonth(day);
    }
    interaction?.(xdateToData(day));
  }

  pressDay = (date?: DateData): void => {
    this.handleDayInteraction(date, this.props.onDayPress);
  };

  longPressDay = (date?: DateData): void => {
    this.handleDayInteraction(date, this.props.onDayLongPress);
  };

  private getDayState(day: XDate, context: RenderContext): DayState {
    if (this.props.disabledByDefault) {
      return 'disabled';
    }
    if (context.minDate && !dateutils.isGTE(day, context.minDate)) {
      return 'disabled';
    }
    if (context.maxDate && !dateutils.isLTE(day, context.maxDate)) {
      return 'disabled';
    }
    if (context.today && !dateutils.isGTE(day, context.today)) {
      return 'disabled';
    }
    if (!dateutils.sameMonth(day, context.currentMonth)) {
      return 'disabled';
    }
    if (dateutils.sameDate(day, context.now)) {
      return 'today';
    }
    return '';
  }

  private renderDay(day: XDate, id: number, context: RenderContext): React.ReactElement {
    const isExtraDay = !dateutils.sameMonth(day, context.currentMonth);

    if (isExtraDay && this.props.hideExtraDays) {
      const isStretchedMarking = this.props.markingType === 'period' || this.props.markingType === 'multi-period';
      return <View key={id} style={isStretchedMarking ? {flex: 1} : this.style.dayContainer} />;
    }

    const DayComponent = context.DayComponent;
    return (
      <DayComponent
        key={id}
        state={this.getDayState(day, context)}
        theme={this.props.theme}
        onPress={this.pressDay}
        onLongPress={this.longPressDay}
        date={xdateToData(day)}
        marking={this.getDateMarking(day)}
      >
        {day.getDate()}
      </DayComponent>
    );
  }

  private renderWeekNumber(weekNumber: number): React.ReactElement {
    return (
      <Day key={`week-${weekNumber}`} theme={this.props.theme} marking={{disableTouchEvent: true}} state="disabled">
        {weekNumber}
      </Day>
    );
  }

  private renderWeek(days: XDate[], id: number, isLast: boolean, context: RenderContext): React.ReactElement {
    const week = days.map((day, index) => this.renderDay(day, index, context));

    if (this.props.showWeekNumbers) {
      week.unshift(this.renderWeekNumber(days[days.length - 1].getWeek()));
    }

    return (
      <View key={id}>
        <View style={this.style.week}>{week}</View>
        {isLast ? null : <View style={this.style.divider} />}
      </View>
    );
  }

  override render(): React.ReactElement {
    const currentMonth = fromMonthKey(this.state.currentMonth);
    const firstDay = this.props.firstDay ?? 0;
    const days = dateutils.page(currentMonth, firstDay);
    const now = new XDate();

    const context: RenderContext = {
      currentMonth,
      now,
      today: this.props.disablePastDates ? new XDate(now.toString('yyyy-MM-dd')) : undefined,
      minDate: parseDate(this.props.minDate),
      maxDate: parseDate(this.props.maxDate),
      DayComponent: this.getDayComponent()
    };

    const weeks: React.ReactElement[] = [];
    const weekCount = Math.ceil(days.length / 7);
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(this.renderWeek(days.slice(i, i + 7), i, weeks.length === weekCount - 1, context));
    }

    return (
      <View testID={this.props.testID} style={[this.style.container, this.props.style]}>
        <CalendarHeader
          theme={this.props.theme}
          month={currentMonth}
          addMonth={this.addMonth}
          monthFormat={this.props.monthFormat}
          hideArrows={this.props.hideArrows}
          showIndicator={this.props.displayLoadingIndicator}
          firstDay={firstDay}
          renderArrow={this.props.renderArrow}
          hideDayNames={this.props.hideDayNames}
          weekNumbers={this.props.showWeekNumbers}
          onPressArrowLeft={this.props.onPressArrowLeft}
          onPressArrowRight={this.props.onPressArrowRight}
        />
        <View style={this.style.monthView}>{weeks}</View>
      </View>
    );
  }
}

interface RenderContext {
  currentMonth: XDate;
  now: XDate;
  today?: XDate;
  minDate?: XDate;
  maxDate?: XDate;
  DayComponent: React.ComponentType<any>;
}

export default Calendar;
