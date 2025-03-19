import {StyleSheet, ViewStyle, RegisteredStyle} from 'react-native';
import * as defaultStyle from '../style';

const STYLESHEET_ID = 'stylesheet.calendar.main';

interface Theme {
  [key: string]: any;
}

export interface CalendarStyle {
  container: RegisteredStyle<ViewStyle>;
  monthView: RegisteredStyle<ViewStyle>;
  week: RegisteredStyle<ViewStyle>;
  divider: RegisteredStyle<ViewStyle>;
  dayContainer: RegisteredStyle<ViewStyle>;
  [key: string]: RegisteredStyle<ViewStyle>;
}

export default function getStyle(theme: Theme = {}): CalendarStyle {
  const appStyle = {...defaultStyle, ...theme};
  const styleObject = {
    container: {
      width: '100%',
      backgroundColor: '#fff'
    },
    monthView: {
      borderBottomLeftRadius: 8,
      borderBottomRightRadius: 8,
      backgroundColor: appStyle.calendarBackground
    },
    week: {
      marginTop: 4,
      marginBottom: 4,
      flexDirection: 'row',
      alignItems: 'center'
    },
    divider: {
      backgroundColor: '#E6EBF5',
      height: 1,
      width: '100%',
    },
    dayContainer: {
      width: 40,
    },
    ...(theme[STYLESHEET_ID] || {})
  };

  return StyleSheet.create(styleObject) as unknown as CalendarStyle;
}