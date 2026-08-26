import React, {Component} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View, type StyleProp, type ViewStyle} from 'react-native';
import XDate from 'xdate';
import styleConstructor from './style';
import {monthName, weekDayNames} from '../../dateutils';
import type {CalendarTheme} from '../../theme';

export interface CalendarHeaderProps {
  theme?: CalendarTheme;
  month: XDate;
  addMonth: (count: number) => void;
  monthFormat?: string;
  hideArrows?: boolean;
  showIndicator?: boolean;
  firstDay?: number;
  renderArrow?: (direction: 'left' | 'right') => React.ReactNode;
  hideDayNames?: boolean;
  weekNumbers?: boolean;
  disableArrowLeft?: boolean;
  disableArrowRight?: boolean;
  onPressArrowLeft?: (subtractMonth: () => void) => void;
  onPressArrowRight?: (addMonth: () => void) => void;
  headerStyle?: StyleProp<ViewStyle>;
}

class CalendarHeader extends Component<CalendarHeaderProps> {
  private style: ReturnType<typeof styleConstructor>;

  constructor(props: CalendarHeaderProps) {
    super(props);
    this.style = styleConstructor(props.theme);
  }

  override shouldComponentUpdate(nextProps: CalendarHeaderProps): boolean {
    return (
      nextProps.month.toString('yyyy MM') !== this.props.month.toString('yyyy MM') ||
      nextProps.showIndicator !== this.props.showIndicator ||
      nextProps.hideDayNames !== this.props.hideDayNames ||
      nextProps.hideArrows !== this.props.hideArrows ||
      nextProps.disableArrowLeft !== this.props.disableArrowLeft ||
      nextProps.disableArrowRight !== this.props.disableArrowRight ||
      nextProps.theme !== this.props.theme
    );
  }

  subtractMonth = (): void => {
    this.props.addMonth(-1);
  };

  addMonth = (): void => {
    this.props.addMonth(1);
  };

  onPressLeft = (): void => {
    const {onPressArrowLeft} = this.props;
    if (typeof onPressArrowLeft === 'function') {
      onPressArrowLeft(this.subtractMonth);
      return;
    }
    this.subtractMonth();
  };

  onPressRight = (): void => {
    const {onPressArrowRight} = this.props;
    if (typeof onPressArrowRight === 'function') {
      onPressArrowRight(this.addMonth);
      return;
    }
    this.addMonth();
  };

  private renderArrow(direction: 'left' | 'right'): React.ReactNode {
    const disabled = direction === 'left' ? this.props.disableArrowLeft : this.props.disableArrowRight;
    const onPress = direction === 'left' ? this.onPressLeft : this.onPressRight;

    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        style={this.style.arrow}
        hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
        accessibilityRole="button"
        accessibilityLabel={direction === 'left' ? 'Previous month' : 'Next month'}
      >
        {this.props.renderArrow ? (
          this.props.renderArrow(direction)
        ) : (
          <Text
            allowFontScaling={false}
            style={disabled ? [this.style.arrowText, this.style.disabledArrowText] : this.style.arrowText}
          >
            {direction === 'left' ? '‹' : '›'}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  private renderTitle(): string {
    const {month, monthFormat} = this.props;
    if (monthFormat) {
      return month.toString(monthFormat);
    }
    return `${monthName(month.getMonth())} ${month.getFullYear()}`;
  }

  override render(): React.ReactElement {
    const weekDaysNames = weekDayNames(this.props.firstDay);

    return (
      <View>
        <View style={[this.style.header, this.props.headerStyle]}>
          {this.props.hideArrows ? <View /> : this.renderArrow('left')}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text allowFontScaling={false} style={this.style.monthText} accessibilityRole="header">
              {this.renderTitle()}
            </Text>
            {this.props.showIndicator ? <ActivityIndicator style={{marginLeft: 8}} /> : null}
          </View>
          {this.props.hideArrows ? <View /> : this.renderArrow('right')}
        </View>
        {this.props.hideDayNames ? null : (
          <View style={this.style.week}>
            {this.props.weekNumbers ? <Text allowFontScaling={false} style={this.style.dayHeader} /> : null}
            {weekDaysNames.map((day, index) => (
              <Text
                allowFontScaling={false}
                key={`${day}-${index}`}
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
