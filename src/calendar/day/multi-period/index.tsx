import React, {memo, useCallback} from 'react';
import {Text, TouchableOpacity, View, type TextStyle, type ViewStyle} from 'react-native';
import styleConstructor from './style';
import {normalizeMarking, type DayComponentProps} from '../types';
import {formatLunarDay, getLunarDate} from '../../../lunar';
import type {PeriodMarking} from '../../../theme';

export interface MultiPeriodDayProps extends DayComponentProps {
  /** Show the lunar day under the solar day. Default `true`. */
  showLunarDate?: boolean;
}

const Day = ({
  state,
  theme,
  marking,
  date,
  onPress,
  onLongPress,
  children,
  showLunarDate = true
}: MultiPeriodDayProps) => {
  const style = styleConstructor(theme);
  const flags = normalizeMarking(marking);

  const handlePress = useCallback(() => onPress?.(date), [onPress, date]);
  const handleLongPress = useCallback(() => onLongPress?.(date), [onLongPress, date]);

  const containerStyle: ViewStyle[] = [style.base];
  const textStyle: TextStyle[] = [style.text];
  const lunarStyle: TextStyle[] = [style.lunarText];

  const isDisabled = flags.disabled ?? state === 'disabled';

  if (flags.selected) {
    containerStyle.push(style.selected);
    textStyle.push(style.selectedText);
    // The lunar label sits on the selection colour, so it has to follow the solar day.
    lunarStyle.push(style.selectedText);
    if (flags.selectedColor) {
      containerStyle.push({backgroundColor: flags.selectedColor});
    }
  } else if (isDisabled) {
    textStyle.push(style.disabledText);
    lunarStyle.push(style.disabledText);
  } else if (state === 'today') {
    textStyle.push(style.todayText);
  }

  const lunar = showLunarDate && date ? getLunarDate(date.day, date.month, date.year) : undefined;
  if (lunar?.isValid && lunar.day === 1 && !isDisabled && !flags.selected) {
    lunarStyle.push(style.lunarNewMonthText);
  }

  const periods = (flags.periods ?? []).filter((period: PeriodMarking) => period && period.color);

  return (
    <View style={style.container}>
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
        {lunar?.isValid ? (
          <Text allowFontScaling={false} style={lunarStyle}>
            {formatLunarDay(lunar)}
          </Text>
        ) : null}
      </TouchableOpacity>
      <View style={style.periods}>
        {periods.map((period, index) => (
          <View
            key={index}
            style={[
              style.period,
              {backgroundColor: period.color},
              period.startingDay && {borderTopLeftRadius: 2, borderBottomLeftRadius: 2, marginLeft: 4},
              period.endingDay && {borderTopRightRadius: 2, borderBottomRightRadius: 2, marginRight: 4}
            ]}
          />
        ))}
      </View>
    </View>
  );
};

Day.displayName = 'MultiPeriodDay';

export default memo(Day);
