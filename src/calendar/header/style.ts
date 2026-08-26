import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';
import {memoizeStyle, type CalendarTheme, type Stylesheet} from '../../theme';

const STYLESHEET_ID = 'stylesheet.calendar.header';

const styleConstructor = memoizeStyle((theme: CalendarTheme) => {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      paddingVertical: 6,
      alignItems: 'center'
    },
    monthText: {
      fontSize: appStyle.textMonthFontSize,
      fontFamily: appStyle.textMonthFontFamily,
      fontWeight: appStyle.textMonthFontWeight,
      color: appStyle.monthTextColor
    },
    arrow: {
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    arrowText: {
      fontSize: 20,
      color: appStyle.arrowColor
    },
    disabledArrowText: {
      color: appStyle.textDisabledColor
    },
    week: {
      marginTop: 7,
      flexDirection: 'row',
      justifyContent: 'space-around'
    },
    dayHeader: {
      marginTop: 2,
      marginBottom: 7,
      width: 32,
      textAlign: 'center',
      fontSize: appStyle.textDayHeaderFontSize,
      fontFamily: appStyle.textDayHeaderFontFamily,
      fontWeight: appStyle.textDayHeaderFontWeight,
      color: appStyle.textSectionTitleColor
    },
    ...((theme[STYLESHEET_ID] as object) || {})
  }) as unknown as Stylesheet;
});

export default styleConstructor;
