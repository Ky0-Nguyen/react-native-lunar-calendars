import React, {Component} from 'react';
import {Text, View} from 'react-native';
import XDate from 'xdate';
import Calendar, {type CalendarProps} from '../calendar';
import styleConstructor from './style';

export interface CalendarListItemProps extends CalendarProps {
  /** Either the month to render, or its placeholder label while it is off-screen. */
  item: XDate | string;
  calendarHeight?: number;
  calendarWidth?: number;
  /** Bumped by the list to force a re-render of an already-mounted month. */
  propbump?: number;
}

class CalendarListItem extends Component<CalendarListItemProps> {
  private style: ReturnType<typeof styleConstructor>;

  constructor(props: CalendarListItemProps) {
    super(props);
    this.style = styleConstructor(props.theme);
  }

  override shouldComponentUpdate(nextProps: CalendarListItemProps): boolean {
    const current = this.props.item;
    const next = nextProps.item;

    if (typeof current === 'string' || typeof next === 'string') {
      return current !== next;
    }
    return (
      current.toString('yyyy MM') !== next.toString('yyyy MM') ||
      nextProps.propbump !== this.props.propbump ||
      nextProps.markedDates !== this.props.markedDates ||
      nextProps.theme !== this.props.theme
    );
  }

  override render(): React.ReactElement {
    const {item, calendarHeight, calendarWidth} = this.props;
    const size = {height: calendarHeight, width: calendarWidth};

    if (typeof item === 'string') {
      return (
        <View style={[size, this.style.placeholder]}>
          <Text allowFontScaling={false} style={this.style.placeholderText}>
            {item}
          </Text>
        </View>
      );
    }

    return (
      <Calendar
        theme={this.props.theme}
        style={[size, this.style.calendar]}
        current={item}
        hideArrows
        disableMonthChange
        hideExtraDays={this.props.hideExtraDays ?? true}
        markedDates={this.props.markedDates}
        markingType={this.props.markingType}
        hideDayNames={this.props.hideDayNames}
        onDayPress={this.props.onDayPress}
        onDayLongPress={this.props.onDayLongPress}
        displayLoadingIndicator={this.props.displayLoadingIndicator}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
        firstDay={this.props.firstDay}
        monthFormat={this.props.monthFormat}
        dayComponent={this.props.dayComponent}
        disabledByDefault={this.props.disabledByDefault}
        disablePastDates={this.props.disablePastDates}
        showWeekNumbers={this.props.showWeekNumbers}
      />
    );
  }
}

export default CalendarListItem;
