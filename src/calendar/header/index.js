import React, { Component } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity } from 'react-native';
import { createIconSetFromFontello } from 'react-native-vector-icons'; // eslint-disable-line import/no-extraneous-dependencies
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import { weekDayNames, monthName } from '../../dateutils';
import fontelloConfig from '../../../../../src/assets/vexereIcons/config.json';

const Icon = createIconSetFromFontello(fontelloConfig);
class CalendarHeader extends Component {
  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.onPressLeft = this.onPressLeft.bind(this);
    this.onPressRight = this.onPressRight.bind(this);
    this.currentDate = new Date();
  }

  shouldComponentUpdate(nextProps) {
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

  onPressLeft() {
    const { onPressArrowLeft } = this.props;
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractMonth);
    }
    return this.substractMonth();
  }

  onPressRight() {
    const { onPressArrowRight } = this.props;
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonth);
    }
    return this.addMonth();
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  canViewPreviouMonth() {
    let month = this.props.month.getMonth();
    let year = this.props.month.getFullYear();
    return month > this.currentDate.getMonth() || month <= this.currentDate.getMonth() && year > this.currentDate.getFullYear();
  }

  getCalendarMonth() {
    return this.props.month.split('-')[1];
  }

  addMonth() {
    this.props.addMonth(1);
  }

  render() {
    let leftArrow = <View />;
    let rightArrow = <View />;
    let weekDaysNames = weekDayNames(this.props.firstDay);
    let date = this.props.month;
    let month = monthName(date.getMonth());
    let year = date.getFullYear();
    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity
          onPress={() => this.canViewPreviouMonth() ? this.onPressLeft() : null}
          style={this.style.arrow}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
        >
          {this.canViewPreviouMonth() && (this.props.renderArrow
            ? this.props.renderArrow('left')
            : <Icon
              name="backward"
              size={18}
              color="white"
            />)}
        </TouchableOpacity>
      );
      rightArrow = (
        <TouchableOpacity
          onPress={this.onPressRight}
          style={this.style.arrow}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
        >
          {this.props.renderArrow
            ? this.props.renderArrow('right')
            : <Icon
              name="forward"
              size={18}
              color="white"
            />}
        </TouchableOpacity>
      );
    }
    let indicator;
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator />;
    }
    return (
      <View>
        <View style={[this.style.header,this.props.headerColor]}>
          {leftArrow}
          <View style={[{ flexDirection: 'row' }, this.props.headerColor]}>
            <Text allowFontScaling={false} style={this.style.monthText} accessibilityTraits='header'>
              {month} {year}
            </Text>
            {indicator}
          </View>
          {rightArrow}
        </View>
        {
          !this.props.hideDayNames &&
          <View style={this.style.week}>
            {this.props.weekNumbers && <Text allowFontScaling={false} style={this.style.dayHeader} />}
            {weekDaysNames.map((day, idx) => (
              <Text
                allowFontScaling={false}
                key={`${date}.${idx}`} // eslint-disable-line react/no-array-index-key
                accessible={false}
                style={this.style.dayHeader}
                numberOfLines={1}
                importantForAccessibility='no'
              >
                {day}
              </Text>
            ))}
          </View>
        }
      </View>
    );
  }
}

export default CalendarHeader;
