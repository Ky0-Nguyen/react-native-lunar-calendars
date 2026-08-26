import {Platform, type TextStyle, type ViewStyle} from 'react-native';
import type {CalendarTheme} from '../theme';

interface PlatformStyles {
  knob: ViewStyle;
  weekdays: ViewStyle & TextStyle;
}

export default function platformStyles(appStyle: CalendarTheme): PlatformStyles {
  return {
    knob: {
      width: 38,
      height: 7,
      marginTop: 10,
      borderRadius: 3,
      backgroundColor: appStyle.agendaKnobColor
    },
    weekdays: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      flexDirection: 'row',
      paddingTop: 15,
      paddingBottom: 7,
      backgroundColor: appStyle.calendarBackground,
      ...Platform.select({
        ios: {justifyContent: 'space-around', marginLeft: 15, marginRight: 15},
        default: {justifyContent: 'space-between', paddingLeft: 24, paddingRight: 24}
      })
    }
  };
}
