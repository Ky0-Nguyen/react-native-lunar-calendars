import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';
import platformStyles from './platform-style';
import {memoizeStyle, type CalendarTheme, type Stylesheet} from '../theme';

const STYLESHEET_ID = 'stylesheet.agenda.main';

const styleConstructor = memoizeStyle((theme: CalendarTheme) => {
  const appStyle = {...defaultStyle, ...theme};
  const {knob, weekdays} = platformStyles(appStyle);
  return StyleSheet.create({
    knob,
    weekdays,
    header: {
      overflow: 'hidden',
      justifyContent: 'flex-end',
      position: 'absolute',
      height: '100%',
      width: '100%'
    },
    calendar: {
      flex: 1,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: appStyle.separatorColor
    },
    knobContainer: {
      flex: 1,
      position: 'absolute',
      left: 0,
      right: 0,
      height: 24,
      bottom: 0,
      alignItems: 'center',
      backgroundColor: appStyle.calendarBackground
    },
    weekday: {
      width: 32,
      textAlign: 'center',
      fontSize: appStyle.textDayHeaderFontSize,
      fontFamily: appStyle.textDayHeaderFontFamily,
      color: appStyle.textSectionTitleColor
    },
    reservations: {
      flex: 1,
      marginTop: 104,
      backgroundColor: appStyle.backgroundColor
    },
    ...((theme[STYLESHEET_ID] as object) || {})
  }) as unknown as Stylesheet;
});

export default styleConstructor;
