import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';
import {memoizeStyle, type CalendarTheme, type Stylesheet} from '../theme';

const STYLESHEET_ID = 'stylesheet.calendar.main';

const styleConstructor = memoizeStyle((theme: CalendarTheme) => {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      width: '100%',
      paddingBottom: 4,
      backgroundColor: appStyle.calendarBackground
    },
    monthView: {
      backgroundColor: appStyle.calendarBackground
    },
    week: {
      marginTop: 4,
      marginBottom: 4,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-start'
    },
    divider: {
      backgroundColor: appStyle.separatorColor,
      height: StyleSheet.hairlineWidth,
      width: '100%'
    },
    dayContainer: {
      width: 32,
      height: 32
    },
    ...((theme[STYLESHEET_ID] as object) || {})
  }) as unknown as Stylesheet;
});

export default styleConstructor;
