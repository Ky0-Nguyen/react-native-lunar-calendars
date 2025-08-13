import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-lunar-calendars';

// Configure Vietnamese locale
LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ],
  monthNamesShort: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
  dayNames: ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
};

LocaleConfig.defaultLocale = 'vi';

export default function App() {
  const [selected, setSelected] = useState('');
  const [currentExample, setCurrentExample] = useState('basic');

  const onDayPress = (day: any) => {
    setSelected(day.dateString);
    Alert.alert('Selected Day', `You selected: ${day.dateString}`);
  };

  const markedDates = {
    [selected]: {
      selected: true,
      selectedColor: '#00adf5',
      selectedTextColor: 'white',
    },
    '2024-02-15': {
      marked: true,
      dotColor: 'red',
    },
    '2024-02-20': {
      marked: true,
      dotColor: 'blue',
    },
  };

  const periodMarkedDates = {
    '2024-02-15': {
      startingDay: true,
      color: 'green',
    },
    '2024-02-16': {
      color: 'green',
    },
    '2024-02-17': {
      endingDay: true,
      color: 'green',
    },
  };

  const multiDotMarkedDates = {
    '2024-02-15': {
      dots: [
        { key: 'vacation', color: 'red', selectedDotColor: 'blue' },
        { key: 'massage', color: 'blue', selectedDotColor: 'blue' },
        { key: 'workout', color: 'green' },
      ],
      selected: true,
      selectedColor: 'red',
    },
    '2024-02-16': {
      dots: [
        { key: 'massage', color: 'blue', selectedDotColor: 'blue' },
        { key: 'workout', color: 'green' },
      ],
      disabled: true,
    },
  };

  const multiPeriodMarkedDates = {
    '2024-02-15': {
      periods: [
        { startingDay: false, endingDay: true, color: '#5f9ea0' },
        { startingDay: false, endingDay: true, color: '#ffa500' },
        { startingDay: true, endingDay: false, color: '#f0e68c' },
      ],
    },
    '2024-02-16': {
      periods: [
        { startingDay: true, endingDay: false, color: '#ffa500' },
        { color: 'transparent' },
        { startingDay: false, endingDay: false, color: '#f0e68c' },
      ],
    },
  };

  const agendaItems = {
    '2024-02-15': [
      { text: 'Meeting with client', color: 'red' },
      { text: 'Lunch with team', color: 'blue' },
    ],
    '2024-02-16': [
      { text: 'Project review', color: 'green' },
    ],
    '2024-02-17': [],
    '2024-02-18': [
      { text: 'Team building', color: 'purple' },
      { text: 'Dinner with family', color: 'orange' },
    ],
  };

  const renderExample = () => {
    switch (currentExample) {
      case 'basic':
        return (
          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType={'simple'}
            theme={{
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: '#00adf5',
              monthTextColor: '#00adf5',
              indicatorColor: '#00adf5',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
          />
        );

      case 'lunar':
        return (
          <Calendar
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType={'multi-period'}
            theme={{
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: '#00adf5',
              monthTextColor: '#00adf5',
              indicatorColor: '#00adf5',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
          />
        );

      case 'period':
        return (
          <Calendar
            onDayPress={onDayPress}
            markedDates={periodMarkedDates}
            markingType={'period'}
            theme={{
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: '#00adf5',
              monthTextColor: '#00adf5',
              indicatorColor: '#00adf5',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
          />
        );

      case 'multi-dot':
        return (
          <Calendar
            onDayPress={onDayPress}
            markedDates={multiDotMarkedDates}
            markingType={'multi-dot'}
            theme={{
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: '#00adf5',
              monthTextColor: '#00adf5',
              indicatorColor: '#00adf5',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
          />
        );

      case 'multi-period':
        return (
          <Calendar
            onDayPress={onDayPress}
            markedDates={multiPeriodMarkedDates}
            markingType={'multi-period'}
            theme={{
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: '#00adf5',
              monthTextColor: '#00adf5',
              indicatorColor: '#00adf5',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
          />
        );

      case 'calendar-list':
        return (
          <CalendarList
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType={'simple'}
            theme={{
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: '#00adf5',
              monthTextColor: '#00adf5',
              indicatorColor: '#00adf5',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
            pastScrollRange={12}
            futureScrollRange={12}
            scrollEnabled={true}
            showScrollIndicator={true}
          />
        );

      case 'agenda':
        return (
          <Agenda
            items={agendaItems}
            onDayPress={onDayPress}
            onItemPress={(item) => Alert.alert('Item', `You selected: ${item.text}`)}
            theme={{
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: '#00adf5',
              monthTextColor: '#00adf5',
              indicatorColor: '#00adf5',
              agendaDayTextColor: '#00adf5',
              agendaDayNumColor: '#00adf5',
              agendaTodayColor: '#00adf5',
              agendaKnobColor: '#00adf5',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
            renderItem={(item) => (
              <View style={[styles.item, { backgroundColor: item.color }]}>
                <Text style={styles.itemText}>{item.text}</Text>
              </View>
            )}
            renderDay={(day) => (
              <View style={styles.dayHeader}>
                <Text style={styles.dayText}>{day?.day}</Text>
              </View>
            )}
            renderEmptyDate={() => (
              <View style={styles.emptyDate}>
                <Text style={styles.emptyDateText}>No Events</Text>
              </View>
            )}
            rowHasChanged={(r1, r2) => r1.text !== r2.text}
            showClosingKnob={true}
            hideKnob={false}
          />
        );

      default:
        return null;
    }
  };

  const examples = [
    { key: 'basic', title: 'Basic Calendar' },
    { key: 'lunar', title: 'Lunar Calendar' },
    { key: 'period', title: 'Period Marking' },
    { key: 'multi-dot', title: 'Multi-Dot Marking' },
    { key: 'multi-period', title: 'Multi-Period Marking' },
    { key: 'calendar-list', title: 'Calendar List' },
    { key: 'agenda', title: 'Agenda' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>React Native Lunar Calendars</Text>
        <Text style={styles.subtitle}>Example App</Text>
      </View>

      <ScrollView horizontal style={styles.tabContainer} showsHorizontalScrollIndicator={false}>
        {examples.map((example) => (
          <TouchableOpacity
            key={example.key}
            style={[
              styles.tab,
              currentExample === example.key && styles.activeTab,
            ]}
            onPress={() => setCurrentExample(example.key)}
          >
            <Text
              style={[
                styles.tabText,
                currentExample === example.key && styles.activeTabText,
              ]}
            >
              {example.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.calendarContainer}>
        {renderExample()}
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          Selected: {selected || 'None'}
        </Text>
        <Text style={styles.infoText}>
          Tap on days to select them
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#00adf5',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
  },
  tabContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#00adf5',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  info: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayHeader: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  emptyDateText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});
