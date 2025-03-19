import {StyleSheet, Platform, ViewStyle, TextStyle, RegisteredStyle} from 'react-native';
import * as defaultStyle from '../../style';

const STYLESHEET_ID = 'stylesheet.calendar.header';

interface Theme {
  [key: string]: any;
}

export interface HeaderStyle {
  header: RegisteredStyle<ViewStyle>;
  monthText: RegisteredStyle<TextStyle>;
  arrow: RegisteredStyle<ViewStyle>;
  arrowImage: RegisteredStyle<ViewStyle>;
  week: RegisteredStyle<ViewStyle>;
  dayHeader: RegisteredStyle<TextStyle>;
  [key: string]: RegisteredStyle<ViewStyle | TextStyle>;
}

export default function styleConstructor(theme: Theme = {}): HeaderStyle {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      alignItems: 'center',
    },
    monthText: {
      fontSize: appStyle.textMonthFontSize,
      fontFamily: appStyle.textMonthFontFamily,
      fontWeight: appStyle.textMonthFontWeight as 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900',
      color: appStyle.monthTextColor,
    },
    arrow: {
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    arrowImage: {
      width: 20,
      height: 20,
      ...Platform.select({
        ios: {
          tintColor: appStyle.arrowColor
        },
        android: {
          tintColor: appStyle.arrowColor
        }
      })
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
      color: appStyle.textSectionTitleColor,
    }
  });
}
 