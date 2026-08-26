import React, {useCallback, useMemo, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {
  Agenda,
  Calendar,
  CalendarList,
  LocaleConfig,
  formatLunarDay,
  getLunarDateFromString,
  type CalendarTheme,
  type DateData,
  type MarkedDates
} from 'react-native-lunar-calendars';

LocaleConfig.locales.vi = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12'
  ],
  monthNamesShort: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
  dayNames: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
};
LocaleConfig.defaultLocale = 'vi';

const THEME: CalendarTheme = {
  calendarBackground: '#ffffff',
  monthTextColor: '#0f172a',
  textMonthFontSize: 18,
  textMonthFontWeight: '700',
  textSectionTitleColor: '#94a3b8',
  dayTextColor: '#0f172a',
  todayTextColor: '#0d9488',
  selectedDayBackgroundColor: '#0d9488',
  selectedDayTextColor: '#ffffff',
  textDisabledColor: '#cbd5e1',
  arrowColor: '#0d9488',
  dotColor: '#0d9488',
  lunarTextColor: '#64748b',
  lunarNewMonthTextColor: '#e11d48'
};

type TabKey = 'lunar' | 'marked' | 'period' | 'dots' | 'list' | 'agenda';

const TABS: {key: TabKey; label: string}[] = [
  {key: 'lunar', label: 'Lunar'},
  {key: 'marked', label: 'Marked'},
  {key: 'period', label: 'Period'},
  {key: 'dots', label: 'Multi-dot'},
  {key: 'list', label: 'Calendar list'},
  {key: 'agenda', label: 'Agenda'}
];

const TET_2026 = '2026-02-17';

interface AgendaItem {
  name: string;
  color: string;
}

const AGENDA_ITEMS: Record<string, AgendaItem[]> = {
  '2026-02-16': [{name: 'Tất niên dinner', color: '#0d9488'}],
  '2026-02-17': [
    {name: 'Tết — first day of the lunar year', color: '#e11d48'},
    {name: 'Visit grandparents', color: '#f59e0b'}
  ],
  '2026-02-18': [{name: 'Lì xì for the kids', color: '#6366f1'}],
  '2026-02-19': []
};

export default function App() {
  const [tab, setTab] = useState<TabKey>('lunar');
  const [selected, setSelected] = useState(TET_2026);

  const onDayPress = useCallback((day: DateData) => setSelected(day.dateString), []);

  const markedDates = useMemo<MarkedDates>(
    () => ({
      [selected]: {selected: true, selectedColor: '#0d9488'},
      '2026-02-17': {marked: true, dotColor: '#e11d48'},
      '2026-03-05': {marked: true, dotColor: '#0d9488'}
    }),
    [selected]
  );

  const periodMarkedDates = useMemo<MarkedDates>(
    () => ({
      '2026-02-16': {startingDay: true, color: '#0d9488', textColor: '#ffffff'},
      '2026-02-17': {color: '#14b8a6', textColor: '#ffffff'},
      '2026-02-18': {color: '#14b8a6', textColor: '#ffffff'},
      '2026-02-19': {endingDay: true, color: '#0d9488', textColor: '#ffffff'}
    }),
    []
  );

  const dotMarkedDates = useMemo<MarkedDates>(
    () => ({
      '2026-02-17': {
        dots: [
          {key: 'tet', color: '#e11d48'},
          {key: 'family', color: '#f59e0b'},
          {key: 'food', color: '#0d9488'}
        ]
      },
      '2026-02-18': {dots: [{key: 'family', color: '#f59e0b'}]},
      [selected]: {selected: true, selectedColor: '#0d9488', dots: [{key: 'sel', color: '#ffffff'}]}
    }),
    [selected]
  );

  const lunarMarkedDates = useMemo<MarkedDates>(
    () => ({
      '2026-02-17': {
        periods: [{startingDay: true, endingDay: false, color: '#e11d48'}]
      },
      '2026-02-18': {periods: [{startingDay: false, endingDay: false, color: '#e11d48'}]},
      '2026-02-19': {periods: [{startingDay: false, endingDay: true, color: '#e11d48'}]},
      [selected]: {selected: true, selectedColor: '#0d9488'}
    }),
    [selected]
  );

  const lunar = getLunarDateFromString(selected);

  const renderTab = () => {
    switch (tab) {
      case 'lunar':
        return (
          <Calendar
            testID="calendar-lunar"
            current={TET_2026}
            theme={THEME}
            markingType="multi-period"
            markedDates={lunarMarkedDates}
            onDayPress={onDayPress}
          />
        );
      case 'marked':
        return (
          <Calendar current={TET_2026} theme={THEME} markedDates={markedDates} onDayPress={onDayPress} />
        );
      case 'period':
        return (
          <Calendar
            current={TET_2026}
            theme={THEME}
            markingType="period"
            markedDates={periodMarkedDates}
            onDayPress={onDayPress}
          />
        );
      case 'dots':
        return (
          <Calendar
            current={TET_2026}
            theme={THEME}
            markingType="multi-dot"
            markedDates={dotMarkedDates}
            onDayPress={onDayPress}
          />
        );
      case 'list':
        return (
          <CalendarList
            current={TET_2026}
            theme={THEME}
            markingType="multi-period"
            markedDates={lunarMarkedDates}
            onDayPress={onDayPress}
            pastScrollRange={6}
            futureScrollRange={6}
            calendarHeight={380}
          />
        );
      case 'agenda':
        return (
          <Agenda<AgendaItem>
            items={AGENDA_ITEMS}
            selected={TET_2026}
            theme={THEME}
            pastScrollRange={2}
            futureScrollRange={2}
            onDayPress={onDayPress}
            rowHasChanged={(a, b) => a.name !== b.name}
            renderItem={item => (
              <View style={[styles.agendaItem, {borderLeftColor: item.color}]}>
                <Text style={styles.agendaItemText}>{item.name}</Text>
              </View>
            )}
            renderEmptyDate={() => (
              <View style={styles.agendaEmpty}>
                <Text style={styles.agendaEmptyText}>Nothing planned</Text>
              </View>
            )}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>react-native-lunar-calendars</Text>
        <Text style={styles.subtitle}>Vietnamese lunar calendar · Expo SDK 57</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabStrip}
        contentContainerStyle={styles.tabStripContent}
      >
        {TABS.map(item => {
          const active = item.key === tab;
          return (
            <TouchableOpacity
              key={item.key}
              testID={`tab-${item.key}`}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setTab(item.key)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.card}>{renderTab()}</View>

      <View style={styles.footer} testID="selection-summary">
        <View>
          <Text style={styles.footerLabel}>Solar</Text>
          <Text style={styles.footerValue}>{selected}</Text>
        </View>
        <View style={styles.footerDivider} />
        <View>
          <Text style={styles.footerLabel}>Lunar (Âm lịch)</Text>
          <Text style={[styles.footerValue, lunar.day === 1 && styles.footerValueAccent]}>
            {lunar.isValid ? `${formatLunarDay(lunar)} · ${lunar.month}/${lunar.year}` : 'out of range'}
            {lunar.leap ? ' (nhuận)' : ''}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#f1f5f9'},
  header: {paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: '#0f766e'},
  title: {fontSize: 20, fontWeight: '700', color: '#ffffff'},
  subtitle: {marginTop: 4, fontSize: 13, color: '#ccfbf1'},
  tabStrip: {maxHeight: 60, backgroundColor: '#ffffff'},
  tabStripContent: {paddingHorizontal: 12, paddingVertical: 12, alignItems: 'center'},
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 999,
    backgroundColor: '#e2e8f0'
  },
  tabActive: {backgroundColor: '#0d9488'},
  tabText: {fontSize: 13, color: '#475569', fontWeight: '600'},
  tabTextActive: {color: '#ffffff'},
  card: {
    flex: 1,
    margin: 12,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 2
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff'
  },
  footerDivider: {width: 1, height: 32, backgroundColor: '#e2e8f0', marginHorizontal: 20},
  footerLabel: {fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6, color: '#94a3b8'},
  footerValue: {marginTop: 2, fontSize: 16, fontWeight: '700', color: '#0f172a'},
  footerValueAccent: {color: '#e11d48'},
  agendaItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderLeftWidth: 4,
    padding: 12,
    marginRight: 12,
    marginTop: 16
  },
  agendaItemText: {fontSize: 15, color: '#0f172a', fontWeight: '600'},
  agendaEmpty: {paddingTop: 24, paddingRight: 12},
  agendaEmptyText: {color: '#94a3b8', fontSize: 14}
});
