import React, {memo, useCallback} from 'react';
import {Text, TouchableOpacity, View, type TextStyle, type ViewStyle} from 'react-native';
import styleConstructor from './style';
import {normalizeMarking, type DayComponentProps} from '../types';
import type {DotMarking} from '../../../theme';

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
    if (flags.selectedColor) {
      containerStyle.push({backgroundColor: flags.selectedColor});
    }
  } else if (flags.disabled ?? state === 'disabled') {
    textStyle.push(style.disabledText);
  } else if (state === 'today') {
    textStyle.push(style.todayText);
  }

  const dots = (flags.dots ?? []).filter((dot: DotMarking) => dot && dot.color);

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
      <View style={style.dotRow}>
        {dots.map((dot, index) => (
          <View
            key={dot.key ?? index}
            style={[
              style.dot,
              {backgroundColor: flags.selected && dot.selectedDotColor ? dot.selectedDotColor : dot.color}
            ]}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

Day.displayName = 'MultiDotDay';

export default memo(Day);
