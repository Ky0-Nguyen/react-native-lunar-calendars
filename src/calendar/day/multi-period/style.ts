import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../../style';
import {memoizeStyle, type CalendarTheme, type Stylesheet} from '../../../theme';

const STYLESHEET_ID = 'stylesheet.day.multiPeriod';

const styleConstructor = memoizeStyle((theme: CalendarTheme) => {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center'
    },
    base: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      lineHeight: 20,
      fontWeight: appStyle.textDayFontWeight ?? '300',
      color: appStyle.dayTextColor,
      backgroundColor: 'transparent'
    },
    lunarText: {
      fontSize: 10,
      lineHeight: 13,
      color: appStyle.lunarTextColor
    },
    lunarNewMonthText: {
      color: appStyle.lunarNewMonthTextColor
    },
    selected: {
      backgroundColor: appStyle.selectedDayBackgroundColor,
      borderRadius: 18
    },
    selectedText: {
      color: appStyle.selectedDayTextColor
    },
    todayText: {
      color: appStyle.todayTextColor
    },
    disabledText: {
      color: appStyle.textDisabledColor
    },
    periods: {
      alignSelf: 'stretch'
    },
    period: {
      height: 4,
      marginVertical: 1,
      backgroundColor: 'transparent'
    },
    ...((theme[STYLESHEET_ID] as object) || {})
  }) as unknown as Stylesheet;
});

export default styleConstructor;
