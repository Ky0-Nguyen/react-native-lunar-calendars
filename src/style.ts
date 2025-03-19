import {Platform} from 'react-native';

export const foregroundColor: string = '#ffffff';
export const backgroundColor: string = '#f4f4f4';
export const separatorColor: string = '#e8e9ec';

export const processedColor: string = '#a7e0a3';
export const processingColor: string = '#ffce5c';
export const failedColor: string = 'rgba(246, 126, 126,1)';

// export const textDefaultColor = '#2d4150';
export const textDefaultColor: string = 'white';
export const textColor: string = '#43515c';
// export const textLinkColor = '#00adf5';
export const textLinkColor: string = 'white';
export const textSecondaryColor: string = '#7a92a5';

export const textDayFontFamily: string = 'System';
export const textMonthFontFamily: string = 'System';
export const textDayHeaderFontFamily: string = 'System';

export const textMonthFontWeight: string = '300';

export const textDayFontSize: number = 17;
export const textMonthFontSize: number = 17;
export const textDayHeaderFontSize: number = 13;

export const calendarBackground: string = foregroundColor;
// export const textSectionTitleColor = '#b6c1cd';
export const textSectionTitleColor: string = 'white';
export const selectedDayBackgroundColor: string = textLinkColor;
export const selectedDayTextColor: string = foregroundColor;
export const todayTextColor: string = textLinkColor;
export const dayTextColor: string = textDefaultColor;
export const textDisabledColor: string = '#d9e1e8';
export const dotColor: string = textLinkColor;
export const selectedDotColor: string = foregroundColor;
export const arrowColor: string = textLinkColor;
export const monthTextColor: string = textDefaultColor;
export const agendaDayTextColor: string = '#7a92a5';
export const agendaDayNumColor: string = '#7a92a5';
export const agendaTodayColor: string = textLinkColor;
export const agendaKnobColor: string = Platform.OS === 'ios' ? '#f2F4f5' : '#4ac4f7'; 