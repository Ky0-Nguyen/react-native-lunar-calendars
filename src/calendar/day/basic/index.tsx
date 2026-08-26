import React, {memo, useCallback} from 'react';
import {Text, TouchableOpacity, View, type TextStyle, type ViewStyle} from 'react-native';
import styleConstructor from './style';
import {normalizeMarking, type DayComponentProps} from '../types';

const Day = ({state, theme, marking, date, onPress, onLongPress, children}: DayComponentProps) => {
  const style = styleConstructor(theme);
  const flags = normalizeMarking(marking);

  const handlePress = useCallback(() => onPress?.(date), [onPress, date]);
  const handleLongPress = useCallback(() => onLongPress?.(date), [onLongPress, date]);

  const containerStyle: ViewStyle[] = [style.base];
  const textStyle: TextStyle[] = [style.text];
  const dotStyle: ViewStyle[] = [style.dot];

  const isDisabled = flags.disabled ?? state === 'disabled';

  if (flags.selected) {
    containerStyle.push(style.selected);
    textStyle.push(style.selectedText);
    if (flags.selectedColor) {
      containerStyle.push({backgroundColor: flags.selectedColor});
    }
    if (flags.marked) {
      dotStyle.push(style.visibleDot, style.selectedDot);
    }
  } else if (isDisabled) {
    textStyle.push(style.disabledText);
    if (flags.marked) {
      dotStyle.push(style.visibleDot);
    }
  } else {
    if (state === 'today') {
      containerStyle.push(style.today);
      textStyle.push(style.todayText);
    }
    if (flags.marked) {
      dotStyle.push(style.visibleDot);
      if (flags.dotColor) {
        dotStyle.push({backgroundColor: flags.dotColor});
      }
    }
  }

  if (flags.textColor) {
    textStyle.push({color: flags.textColor});
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={flags.activeOpacity}
      disabled={flags.disableTouchEvent}
      accessibilityRole="button"
      accessibilityLabel={date?.dateString}
    >
      <Text allowFontScaling={false} style={textStyle}>
        {String(children ?? '')}
      </Text>
      {flags.marked ? <View style={dotStyle} /> : null}
    </TouchableOpacity>
  );
};

Day.displayName = 'BasicDay';

export default memo(Day);
