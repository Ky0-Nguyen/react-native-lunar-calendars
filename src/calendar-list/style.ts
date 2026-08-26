import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';
import {memoizeStyle, type CalendarTheme, type Stylesheet} from '../theme';

const STYLESHEET_ID = 'stylesheet.calendar-list.main';

const styleConstructor = memoizeStyle((theme: CalendarTheme) => {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      backgroundColor: appStyle.calendarBackground
    },
    placeholder: {
      backgroundColor: appStyle.calendarBackground,
      alignItems: 'center',
      justifyContent: 'center'
    },
    placeholderText: {
      fontSize: 30,
      fontWeight: '200',
      color: appStyle.dayTextColor
    },
    calendar: {
      paddingLeft: 15,
      paddingRight: 15
    },
    ...((theme[STYLESHEET_ID] as object) || {})
  }) as unknown as Stylesheet;
});

export default styleConstructor;
