import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../../style';
import {memoizeStyle, type CalendarTheme, type Stylesheet} from '../../../theme';

const STYLESHEET_ID = 'stylesheet.day.period';

const FILLER_HEIGHT = 34;

const styleConstructor = memoizeStyle((theme: CalendarTheme) => {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    wrapper: {
      flex: 1,
      alignItems: 'center',
      alignSelf: 'stretch',
      marginLeft: -1
    },
    base: {
      width: 38,
      height: FILLER_HEIGHT,
      alignItems: 'center',
      justifyContent: 'center'
    },
    fillers: {
      position: 'absolute',
      height: FILLER_HEIGHT,
      flexDirection: 'row',
      left: 0,
      right: 0
    },
    leftFiller: {
      height: FILLER_HEIGHT,
      flex: 1
    },
    rightFiller: {
      height: FILLER_HEIGHT,
      flex: 1
    },
    text: {
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: appStyle.textDayFontWeight ?? '300',
      color: appStyle.dayTextColor,
      backgroundColor: 'transparent'
    },
    todayText: {
      fontWeight: '500',
      color: appStyle.todayTextColor
    },
    disabledText: {
      color: appStyle.textDisabledColor
    },
    quickAction: {
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#c1e4fe'
    },
    quickActionText: {
      color: appStyle.textColor
    },
    firstQuickAction: {
      backgroundColor: appStyle.textLinkColor
    },
    firstQuickActionText: {
      color: '#ffffff'
    },
    naText: {
      color: '#b6c1cd'
    },
    ...((theme[STYLESHEET_ID] as object) || {})
  }) as unknown as Stylesheet;
});

export default styleConstructor;
