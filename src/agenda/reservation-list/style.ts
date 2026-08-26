import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';
import {memoizeStyle, type CalendarTheme, type Stylesheet} from '../../theme';

const STYLESHEET_ID = 'stylesheet.agenda.list';

const styleConstructor = memoizeStyle((theme: CalendarTheme) => {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      flexDirection: 'row'
    },
    content: {
      paddingBottom: 24
    },
    dayNum: {
      fontSize: 28,
      fontWeight: '200',
      color: appStyle.agendaDayNumColor
    },
    dayText: {
      fontSize: 14,
      fontWeight: '300',
      color: appStyle.agendaDayTextColor,
      marginTop: -5,
      backgroundColor: 'transparent'
    },
    day: {
      width: 63,
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 32
    },
    today: {
      color: appStyle.agendaTodayColor
    },
    ...((theme[STYLESHEET_ID] as object) || {})
  }) as unknown as Stylesheet;
});

export default styleConstructor;
