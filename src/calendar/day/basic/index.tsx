import React from 'react';
import {TouchableOpacity, Text, ViewStyle, TextStyle} from 'react-native';
import styleConstructor from './style';

interface DayProps {
  state?: string;
  theme?: {[key: string]: any};
  onPress?: (date: any) => void;
  onLongPress?: (date: any) => void;
  date?: any;
  marking?: any;
  children?: React.ReactNode;
}

const Day: React.FC<DayProps> = ({
  state,
  theme,
  onPress,
  onLongPress,
  date,
  marking,
  children
}) => {
  const style = styleConstructor(theme);

  const containerStyle = [style.base];
  const textStyle = [style.text];

  if (state === 'disabled') {
    textStyle.push(style.disabledText);
  } else if (state === 'today') {
    containerStyle.push(style.today);
    textStyle.push(style.todayText);
  }

  if (marking) {
    containerStyle.push(style.marked);
    if (marking.disabled) {
      textStyle.push(style.disabledText);
    }
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={() => onPress?.(date)}
      onLongPress={() => onLongPress?.(date)}
      disabled={marking?.disableTouchEvent}
    >
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Day; 