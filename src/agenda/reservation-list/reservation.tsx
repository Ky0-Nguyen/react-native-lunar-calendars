import React, {Component} from 'react';
import {Text, View} from 'react-native';
import XDate from 'xdate';
import {xdateToData} from '../../interface';
import * as dateutils from '../../dateutils';
import styleConstructor from './style';
import type {CalendarTheme, DateData} from '../../theme';

/** One row of the agenda list: an item, or an empty placeholder for a day with none. */
export interface ReservationRow<T = unknown> {
  reservation?: T;
  /** The day this row belongs to; `false` when the row is not the first of its day. */
  date: XDate | false;
  day: XDate;
}

export interface ReservationProps<T = unknown> {
  item: ReservationRow<T>;
  theme?: CalendarTheme;
  rowHasChanged?: (a: T, b: T) => boolean;
  renderItem?: (reservation: T, isFirstOfDay: boolean) => React.ReactNode;
  renderDay?: (date: DateData | undefined, reservation?: T) => React.ReactNode;
  renderEmptyDate?: (date?: XDate | false) => React.ReactNode;
}

class Reservation<T = unknown> extends Component<ReservationProps<T>> {
  private styles: ReturnType<typeof styleConstructor>;

  constructor(props: ReservationProps<T>) {
    super(props);
    this.styles = styleConstructor(props.theme);
  }

  override shouldComponentUpdate(nextProps: ReservationProps<T>): boolean {
    const current = this.props.item;
    const next = nextProps.item;

    if (!current && !next) {
      return false;
    }
    if (!current || !next) {
      return true;
    }
    if (current.day.getTime() !== next.day.getTime()) {
      return true;
    }
    if (!current.reservation && !next.reservation) {
      return false;
    }
    if (current.reservation && next.reservation && !current.date === !next.date) {
      return this.props.rowHasChanged ? this.props.rowHasChanged(current.reservation, next.reservation) : true;
    }
    return true;
  }

  private renderDate(date: XDate | false, reservation?: T): React.ReactNode {
    if (this.props.renderDay) {
      return this.props.renderDay(date ? xdateToData(date) : undefined, reservation);
    }
    if (!date) {
      return <View style={this.styles.day} />;
    }

    const todayStyle = dateutils.sameDate(date, new XDate()) ? this.styles.today : undefined;
    const dayNamesShort = XDate.locales[XDate.defaultLocale]?.dayNamesShort ?? [];

    return (
      <View style={this.styles.day}>
        <Text allowFontScaling={false} style={[this.styles.dayNum, todayStyle]}>
          {date.getDate()}
        </Text>
        <Text allowFontScaling={false} style={[this.styles.dayText, todayStyle]}>
          {dayNamesShort[date.getDay()]}
        </Text>
      </View>
    );
  }

  override render(): React.ReactElement {
    const {reservation, date} = this.props.item;
    const content = reservation
      ? this.props.renderItem?.(reservation, Boolean(date))
      : this.props.renderEmptyDate?.(date);

    return (
      <View style={this.styles.container}>
        {this.renderDate(date, reservation)}
        <View style={{flex: 1}}>{content}</View>
      </View>
    );
  }
}

export default Reservation;
