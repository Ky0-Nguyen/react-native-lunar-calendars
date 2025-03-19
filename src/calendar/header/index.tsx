import React, {Component} from 'react';
import {ActivityIndicator, View, Text, TouchableOpacity, ViewStyle} from 'react-native';
import {createIconSetFromFontello} from 'react-native-vector-icons';
import XDate from 'xdate';
import styleConstructor, {HeaderStyle} from './style';
import {weekDayNames, monthName} from '../../dateutils';

interface CalendarHeaderProps {
  theme?: {[key: string]: any};
  hideArrows?: boolean;
  month: XDate;
  addMonth: (num: number) => void;
  showIndicator?: boolean;
  firstDay?: number;
  renderArrow?: (direction: 'left' | 'right') => React.ReactNode;
  hideDayNames?: boolean;
  weekNumbers?: boolean;
  onPressArrowLeft?: (callback: () => void) => void;
  onPressArrowRight?: (callback: () => void) => void;
  headerColor?: ViewStyle;
}

interface CalendarHeaderState {}

class CalendarHeader extends Component<CalendarHeaderProps, CalendarHeaderState> {
  private style: HeaderStyle;
  private currentDate: Date;

  constructor(props: CalendarHeaderProps) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.onPressLeft = this.onPressLeft.bind(this);
    this.onPressRight = this.onPressRight.bind(this);
    this.currentDate = new Date();
  }

  shouldComponentUpdate(nextProps: CalendarHeaderProps): boolean {
    if (
      nextProps.month.toString('yyyy MM') !==
      this.props.month.toString('yyyy MM')
    ) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true;
    }
    return false;
  }

  onPressLeft(): void {
    const {onPressArrowLeft} = this.props;
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractMonth);
    }
    return this.substractMonth();
  }

  onPressRight(): void {
    const {onPressArrowRight} = this.props;
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonth);
    }
    return this.addMonth();
  }

  substractMonth(): void {
    this.props.addMonth(-1);
  }

  canViewPreviouMonth(): boolean {
    const month = this.props.month.getMonth();
    const year = this.props.month.getFullYear();
    return month > this.currentDate.getMonth() || 
           (month <= this.currentDate.getMonth() && year > this.currentDate.getFullYear());
  }

  addMonth(): void {
    this.props.addMonth(1);
  }

  render(): JSX.Element {
    let leftArrow = <View />;
    let rightArrow = <View />;
    const weekDaysNames = weekDayNames(this.props.firstDay);
    const date = this.props.month;
    const month = monthName(date.getMonth());
    const year = date.getFullYear();

    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity
          onPress={() => this.canViewPreviouMonth() ? this.onPressLeft() : null}
          style={this.style.arrow}
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
        >
          {this.canViewPreviouMonth() && (this.props.renderArrow
            ? this.props.renderArrow('left')
            : <Text>{'<'}</Text>)}
        </TouchableOpacity>
      );
      rightArrow = (
        <TouchableOpacity
          onPress={this.onPressRight}
          style={this.style.arrow}
          hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
        >
          {this.props.renderArrow
            ? this.props.renderArrow('right')
            : <Text>{'>'}</Text>}
        </TouchableOpacity>
      );
    }

    let indicator;
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator />;
    }

    return (
      <View>
        <View style={[this.style.header, this.props.headerColor]}>
          {leftArrow}
          <View style={[{flexDirection: 'row'}, this.props.headerColor]}>
            <Text allowFontScaling={false} style={this.style.monthText}>
              {month} {year}
            </Text>
            {indicator}
          </View>
          {rightArrow}
        </View>
        {!this.props.hideDayNames && (
          <View style={this.style.week}>
            {this.props.weekNumbers && <Text allowFontScaling={false} style={this.style.dayHeader} />}
            {weekDaysNames.map((day, idx) => (
              <Text
                allowFontScaling={false}
                key={`${date}.${idx}`}
                accessible={false}
                style={this.style.dayHeader}
                numberOfLines={1}
              >
                {day}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }
}

export default CalendarHeader;