import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../../style';
import {memoizeStyle, type CalendarTheme, type Stylesheet} from '../../../theme';

const STYLESHEET_ID = 'stylesheet.day.single';

const styleConstructor = memoizeStyle((theme: CalendarTheme) => {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    base: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: appStyle.textDayFontWeight ?? '300',
      color: appStyle.dayTextColor,
      backgroundColor: 'transparent'
    },
    selected: {
      backgroundColor: appStyle.selectedDayBackgroundColor,
      borderRadius: 16
    },
    todayText: {
      color: appStyle.todayTextColor
    },
    selectedText: {
      color: appStyle.selectedDayTextColor
    },
    disabledText: {
      color: appStyle.textDisabledColor
    },
    ...((theme[STYLESHEET_ID] as object) || {})
  }) as unknown as Stylesheet;
});

export default styleConstructor;
