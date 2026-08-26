import React, {memo, useCallback} from 'react';
import {Text, TouchableOpacity, type TextStyle, type ViewStyle} from 'react-native';
import styleConstructor from './style';
import {normalizeMarking, type DayComponentProps} from '../types';

const Day = ({state, theme, marking, date, onPress, onLongPress, children}: DayComponentProps) => {
  const style = styleConstructor(theme);
  const flags = normalizeMarking(marking);

  const handlePress = useCallback(() => onPress?.(date), [onPress, date]);
  const handleLongPress = useCallback(() => onLongPress?.(date), [onLongPress, date]);

  const containerStyle: ViewStyle[] = [style.base];
  const textStyle: TextStyle[] = [style.text];

  if (flags.selected) {
    containerStyle.push(style.selected);
    textStyle.push(style.selectedText);
  } else if (flags.disabled ?? state === 'disabled') {
    textStyle.push(style.disabledText);
  } else if (state === 'today') {
    textStyle.push(style.todayText);
  }

  const custom = flags.customStyles;
  if (custom?.container) {
    containerStyle.push({borderRadius: 16, ...custom.container});
  }
  if (custom?.text) {
    textStyle.push(custom.text);
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
    </TouchableOpacity>
  );
};

Day.displayName = 'CustomDay';

export default memo(Day);
