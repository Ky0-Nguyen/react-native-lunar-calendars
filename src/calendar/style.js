import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';
import { colors } from '../../../../src/contants/theme';

const STYLESHEET_ID = 'stylesheet.calendar.main';

export default function getStyle(theme={}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      width: '100%',
      // paddingLeft: 5,
      // paddingRight: 5,
      // backgroundColor: appStyle.calendarBackground
      backgroundColor: colors.primaryColor
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
      // justifyContent: 'space-around',
    },
    divider:{
      backgroundColor: '#E6EBF5',
      height: 1,
      width: '100%',
    },
    dayContainer: {
      width: 40,
    },
    ...(theme[STYLESHEET_ID] || {})
  });
}

