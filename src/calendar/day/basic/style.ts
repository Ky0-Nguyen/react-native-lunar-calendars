import {StyleSheet, ViewStyle, TextStyle, RegisteredStyle} from 'react-native';

interface Theme {
  textColor?: string;
  textSectionTitleColor?: string;
  selectedDayBackgroundColor?: string;
  selectedDayTextColor?: string;
  todayTextColor?: string;
  dayTextColor?: string;
  textDisabledColor?: string;
  dotColor?: string;
  monthTextColor?: string;
  arrowColor?: string;
  indicatorColor?: string;
  [key: string]: any;
}

interface Styles {
  base: RegisteredStyle<ViewStyle>;
  text: RegisteredStyle<TextStyle>;
  alignedText: RegisteredStyle<TextStyle>;
  selected: RegisteredStyle<ViewStyle>;
  disabled: RegisteredStyle<TextStyle>;
  today: RegisteredStyle<ViewStyle>;
  todayText: RegisteredStyle<TextStyle>;
  disabledText: RegisteredStyle<TextStyle>;
  dot: RegisteredStyle<ViewStyle>;
  visibleDot: RegisteredStyle<ViewStyle>;
  selectedDot: RegisteredStyle<ViewStyle>;
  selectedText: RegisteredStyle<TextStyle>;
  [key: string]: RegisteredStyle<ViewStyle | TextStyle>;
}

const styleConstructor = (theme: Theme = {}): Styles => {
  const appStyle = {...theme};

  return StyleSheet.create({
    base: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      marginTop: 4,
      fontSize: 14,
      fontWeight: '300',
      color: appStyle.dayTextColor || '#2d4150',
      backgroundColor: 'rgba(0,0,0,0)'
    },
    alignedText: {
      marginTop: 0
    },
    selected: {
      backgroundColor: appStyle.selectedDayBackgroundColor || '#00adf5',
      borderRadius: 16
    },
    disabled: {
      opacity: 0.5
    },
    today: {
      backgroundColor: appStyle.todayBackgroundColor,
      borderRadius: 16
    },
    todayText: {
      color: appStyle.todayTextColor || '#00adf5'
    },
    selectedText: {
      color: appStyle.selectedDayTextColor || '#ffffff'
    },
    disabledText: {
      color: appStyle.textDisabledColor || '#d9e1e8'
    },
    dot: {
      width: 4,
      height: 4,
      marginTop: 1,
      borderRadius: 2,
      opacity: 0,
      position: 'absolute',
      backgroundColor: appStyle.dotColor || '#00adf5'
    },
    visibleDot: {
      opacity: 1,
      backgroundColor: appStyle.dotColor || '#00adf5'
    },
    selectedDot: {
      backgroundColor: appStyle.selectedDotColor || '#ffffff'
    }
  });
};

export default styleConstructor; 