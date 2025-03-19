import React, {Component} from 'react';
import {View, ViewStyle} from 'react-native';
import XDate from 'xdate';
import * as dateutils from '../dateutils';
import {xdateToData, parseDate} from '../interface';
import styleConstructor, {CalendarStyle} from './style';
import Day from './day/basic';
import UnitDay from './day/period';
import MultiDotDay from './day/multi-dot';
import MultiPeriodDay from './day/multi-period';
import SingleDay from './day/custom';
import CalendarHeader from './header';
import shouldComponentUpdate from './updater';

const EmptyArray: any[] = [];

interface CalendarProps {
  theme?: {[key: string]: any};
  markedDates?: {[key: string]: any};
  style?: ViewStyle;
  current?: any;
  minDate?: any;
  maxDate?: any;
  firstDay?: number;
  markingType?: 'simple' | 'period' | 'multi-dot' | 'multi-period' | 'custom';
  hideArrows?: boolean;
  displayLoadingIndicator?: boolean;
  hideExtraDays?: boolean;
  onDayPress?: (date: any) => void;
  onDayLongPress?: (date: any) => void;
  onMonthChange?: (date: any) => void;
  onVisibleMonthsChange?: (dates: any[]) => void;
  renderArrow?: (direction: 'left' | 'right') => React.ReactNode;
  dayComponent?: any;
  monthFormat?: string;
  disableMonthChange?: boolean;
  hideDayNames?: boolean;
  disabledByDefault?: boolean;
  showWeekNumbers?: boolean;
  onPressArrowLeft?: (callback: () => void) => void;
  onPressArrowRight?: (callback: () => void) => void;
}

interface CalendarState {
  currentMonth: string;
}

class Calendar extends Component<CalendarProps, CalendarState> {
  private style: CalendarStyle;

  constructor(props: CalendarProps) {
    super(props);
    this.style = styleConstructor(this.props.theme);
    let currentMonth: XDate;
    if (props.current) {
      const parsed = parseDate(props.current);
      if (parsed) {
        currentMonth = parsed;
      } else {
        currentMonth = new XDate();
      }
    } else {
      currentMonth = new XDate();
    }
    this.state = {
      currentMonth: currentMonth.toString('yyyy MM')
    };
    this.updateMonth = this.updateMonth.bind(this);
    this.addMonth = this.addMonth.bind(this);
    this.pressDay = this.pressDay.bind(this);
    this.longPressDay = this.longPressDay.bind(this);
    this.shouldComponentUpdate = (nextProps: CalendarProps, nextState: CalendarState) => {
      return shouldComponentUpdate(nextProps, nextState, this.props, this.state);
    };
  }

  componentWillReceiveProps(nextProps: CalendarProps): void {
    const current = parseDate(nextProps.current);
    if (current && current.toString('yyyy MM') !== this.state.currentMonth) {
      this.setState({
        currentMonth: current.toString('yyyy MM')
      });
    }
  }

  getDayComponent(): any {
    if (this.props.dayComponent) {
      return this.props.dayComponent;
    }

    switch (this.props.markingType) {
      case 'period':
        return UnitDay;
      case 'multi-dot':
        return MultiDotDay;
      case 'multi-period':
        return MultiPeriodDay;
      case 'custom':
        return SingleDay;
      default:
        return Day;
    }
  }

  getDateMarking(day: XDate): any {
    if (!this.props.markedDates) {
      return false;
    }
    const dates = this.props.markedDates[day.toString('yyyy-MM-dd')] || EmptyArray;
    if (dates.length || dates) {
      return dates;
    } else {
      return false;
    }
  }

  updateMonth(day: XDate, doNotTriggerListeners?: boolean): void {
    if (day.toString('yyyy MM') === this.state.currentMonth) {
      return;
    }
    this.setState({
      currentMonth: day.toString('yyyy MM')
    }, () => {
      if (!doNotTriggerListeners) {
        const currMont = new XDate(this.state.currentMonth);
        if (this.props.onMonthChange) {
          this.props.onMonthChange(xdateToData(currMont));
        }
        if (this.props.onVisibleMonthsChange) {
          this.props.onVisibleMonthsChange([xdateToData(currMont)]);
        }
      }
    });
  }

  _handleDayInteraction(date: any, interaction?: (date: any) => void): void {
    const day = parseDate(date);
    if (!day) return;
    
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    if (!(minDate && !dateutils.isGTE(day, minDate)) && !(maxDate && !dateutils.isLTE(day, maxDate))) {
      const shouldUpdateMonth = this.props.disableMonthChange === undefined || !this.props.disableMonthChange;
      if (shouldUpdateMonth) {
        this.updateMonth(day);
      }
      if (interaction) {
        interaction(xdateToData(day));
      }
    }
  }

  pressDay(date: any): void {
    this._handleDayInteraction(date, this.props.onDayPress);
  }

  longPressDay(date: any): void {
    this._handleDayInteraction(date, this.props.onDayLongPress);
  }

  addMonth(count: number): void {
    const currMonth = new XDate(this.state.currentMonth);
    this.updateMonth(currMonth.addMonths(count, true));
  }

  renderDay(day: XDate, id: number): JSX.Element {
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    let state = '';
  
    if (this.props.disabledByDefault) {
      state = 'disabled';
    } else if ((minDate && !dateutils.isGTE(day, minDate)) || (maxDate && !dateutils.isLTE(day, maxDate))) {
      state = 'disabled';
    } else if (!dateutils.sameMonth(day, new XDate(this.state.currentMonth))) {
      state = 'disabled';
    } else if (dateutils.sameDate(day, new XDate())) {
      state = 'today';
    }
    state = 'disabled';
    let dayComp;
  
    if (!dateutils.sameMonth(day, new XDate(this.state.currentMonth)) && this.props.hideExtraDays) {
      if (this.props.markingType && ['period', 'multi-period'].indexOf(this.props.markingType) !== -1) {
        dayComp = <View key={id} style={{flex: 1}} />;
      } else {
        dayComp = <View key={id} style={this.style.dayContainer} />;
      }
    } else {
      const DayComp = this.getDayComponent();
      const date = day.getDate();
      dayComp = (
        <DayComp
          key={id}
          state={state}
          theme={this.props.theme}
          onPress={this.pressDay}
          onLongPress={this.longPressDay}
          date={xdateToData(day)}
          marking={this.getDateMarking(day)}
        >
          {date}
        </DayComp>
      );
    }
    return dayComp;
  }

  renderWeekNumber(weekNumber: number): JSX.Element {
    return <Day key={`week-${weekNumber}`} theme={this.props.theme} marking={{disableTouchEvent: true}} state="disabled">{weekNumber}</Day>;
  }

  renderWeek(days: XDate[], id: number, count: number): JSX.Element {
    const week: JSX.Element[] = [];
    days.forEach((day, id2) => {
      week.push(this.renderDay(day, id2));
    }, this);

    if (this.props.showWeekNumbers) {
      week.unshift(this.renderWeekNumber(days[days.length - 1].getWeek()));
    }

    return (
      <View key={id}>
        <View style={this.style.week}>{week}</View>
        {count !== 0 && <View style={this.style.divider} />}
      </View>
    );
  }

  render(): JSX.Element {
    const days = dateutils.page(new XDate(this.state.currentMonth), this.props.firstDay || 1);
    const weeks: JSX.Element[] = [];
    let week: XDate[] = [];

    days.forEach((day, id) => {
      week.push(day);
      if (week.length === 7) {
        weeks.push(this.renderWeek(week, id, weeks.length));
        week = [];
      }
    });

    if (week.length > 0) {
      weeks.push(this.renderWeek(week, days.length, weeks.length));
    }

    return (
      <View style={[this.style.container, this.props.style]}>
        <CalendarHeader
          theme={this.props.theme}
          hideArrows={this.props.hideArrows}
          month={new XDate(this.state.currentMonth)}
          addMonth={this.addMonth}
          showIndicator={this.props.displayLoadingIndicator}
          firstDay={this.props.firstDay}
          renderArrow={this.props.renderArrow}
          hideDayNames={this.props.hideDayNames}
          weekNumbers={this.props.showWeekNumbers}
          onPressArrowLeft={this.props.onPressArrowLeft}
          onPressArrowRight={this.props.onPressArrowRight}
        />
        <View style={this.style.monthView}>
          {weeks}
        </View>
      </View>
    );
  }
}

export default Calendar;