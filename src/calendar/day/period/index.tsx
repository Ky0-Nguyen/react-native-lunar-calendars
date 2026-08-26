import React, {memo, useCallback, useMemo} from 'react';
import {Text, TouchableWithoutFeedback, View, type TextStyle, type ViewStyle} from 'react-native';
import * as defaultStyle from '../../../style';
import styleConstructor from './style';
import {normalizeMarking, type DayComponentProps} from '../types';

interface DrawingStyle {
  textStyle: TextStyle;
  containerStyle?: ViewStyle;
  leftFillerStyle?: string;
  rightFillerStyle?: string;
  startingDay?: {color?: string};
  endingDay?: {color?: string};
  day?: {color?: string};
}

const QUICK_ACTION_FILLER = '#c1e4fe';

const Day = ({state, theme, marking, date, onPress, onLongPress, children}: DayComponentProps) => {
  const style = styleConstructor(theme);
  const appStyle = useMemo(() => ({...defaultStyle, ...(theme ?? {})}), [theme]);
  const flags = normalizeMarking(marking);

  const handlePress = useCallback(() => onPress?.(date), [onPress, date]);
  const handleLongPress = useCallback(() => onLongPress?.(date), [onLongPress, date]);

  const drawing = useMemo<DrawingStyle>(() => {
    const result: DrawingStyle = {textStyle: {}};
    if (!marking) {
      return result;
    }
    if (flags.disabled) {
      result.textStyle = {color: appStyle.textDisabledColor};
    } else if (flags.selected) {
      result.textStyle = {color: appStyle.selectedDayTextColor};
    }

    if (flags.quickAction) {
      if (flags.first || flags.last) {
        result.containerStyle = style.firstQuickAction;
        result.textStyle = style.firstQuickActionText;
        if (flags.endSelected && flags.first && !flags.last) {
          result.rightFillerStyle = QUICK_ACTION_FILLER;
        } else if (flags.endSelected && flags.last && !flags.first) {
          result.leftFillerStyle = QUICK_ACTION_FILLER;
        }
      } else if (!flags.endSelected) {
        result.containerStyle = style.quickAction;
        result.textStyle = style.quickActionText;
      } else {
        result.leftFillerStyle = QUICK_ACTION_FILLER;
        result.rightFillerStyle = QUICK_ACTION_FILLER;
      }
      return result;
    }

    if (flags.status === 'NotAvailable') {
      result.textStyle = style.naText;
    }
    if (flags.startingDay) {
      result.startingDay = {color: flags.color};
    }
    if (flags.endingDay) {
      result.endingDay = {color: flags.color};
    }
    if (!flags.startingDay && !flags.endingDay) {
      result.day = {color: flags.color};
    }
    if (flags.textColor) {
      result.textStyle = {...result.textStyle, color: flags.textColor};
    }
    return result;
  }, [marking, flags, appStyle, style]);

  const containerStyle: ViewStyle[] = [style.base];
  const textStyle: TextStyle[] = [style.text];

  if (state === 'disabled') {
    textStyle.push(style.disabledText);
  } else if (state === 'today') {
    textStyle.push(style.todayText);
  }

  let fillers: React.ReactNode = null;

  if (marking) {
    containerStyle.push({borderRadius: 17});

    let leftFillerStyle: ViewStyle = {};
    let rightFillerStyle: ViewStyle = {};
    let fillerStyle: ViewStyle = {};

    if (drawing.textStyle) {
      textStyle.push(drawing.textStyle);
    }
    if (drawing.containerStyle) {
      containerStyle.push(drawing.containerStyle);
    }
    if (drawing.leftFillerStyle) {
      leftFillerStyle = {backgroundColor: drawing.leftFillerStyle};
    }
    if (drawing.rightFillerStyle) {
      rightFillerStyle = {backgroundColor: drawing.rightFillerStyle};
    }

    if (drawing.startingDay && !drawing.endingDay) {
      leftFillerStyle = {backgroundColor: appStyle.calendarBackground};
      rightFillerStyle = {backgroundColor: drawing.startingDay.color};
      containerStyle.push({backgroundColor: drawing.startingDay.color});
    } else if (drawing.endingDay && !drawing.startingDay) {
      rightFillerStyle = {backgroundColor: appStyle.calendarBackground};
      leftFillerStyle = {backgroundColor: drawing.endingDay.color};
      containerStyle.push({backgroundColor: drawing.endingDay.color});
    } else if (drawing.day) {
      leftFillerStyle = {backgroundColor: drawing.day.color};
      rightFillerStyle = {backgroundColor: drawing.day.color};
      fillerStyle = {backgroundColor: drawing.day.color};
    } else if (drawing.endingDay && drawing.startingDay) {
      rightFillerStyle = {backgroundColor: appStyle.calendarBackground};
      leftFillerStyle = {backgroundColor: appStyle.calendarBackground};
      containerStyle.push({backgroundColor: drawing.endingDay.color});
    }

    fillers = (
      <View style={[style.fillers, fillerStyle]}>
        <View style={[style.leftFiller, leftFillerStyle]} />
        <View style={[style.rightFiller, rightFillerStyle]} />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
      onLongPress={handleLongPress}
      accessibilityRole="button"
      accessibilityLabel={date?.dateString}
    >
      <View style={style.wrapper}>
        {fillers}
        <View style={containerStyle}>
          <Text allowFontScaling={false} style={textStyle}>
            {String(children ?? '')}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

Day.displayName = 'PeriodDay';

export default memo(Day);
