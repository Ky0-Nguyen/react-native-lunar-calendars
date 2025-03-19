import React from 'react';
import { shallow } from 'enzyme';
import CalendarList from '../index';
import Calendar from '../../calendar';

describe('CalendarList Component', () => {
  let wrapper: any;
  const onDayPress = jest.fn();
  const onVisibleMonthsChange = jest.fn();

  const defaultProps = {
    current: '2024-03-19',
    pastScrollRange: 24,
    futureScrollRange: 24,
    onDayPress,
    onVisibleMonthsChange
  };

  beforeEach(() => {
    wrapper = shallow(<CalendarList {...defaultProps} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render FlatList', () => {
    expect(wrapper.find('FlatList')).toHaveLength(1);
  });

  it('should calculate correct number of months', () => {
    // Past range + future range + current month
    const totalMonths = defaultProps.pastScrollRange + defaultProps.futureScrollRange + 1;
    expect(wrapper.instance().state.rows).toHaveLength(totalMonths);
  });

  it('should handle horizontal scrolling', () => {
    wrapper.setProps({ horizontal: true });
    expect(wrapper.find('FlatList').prop('horizontal')).toBe(true);
  });

  it('should handle paging enabled', () => {
    wrapper.setProps({ pagingEnabled: true });
    expect(wrapper.find('FlatList').prop('pagingEnabled')).toBe(true);
  });

  it('should handle scroll enabled', () => {
    wrapper.setProps({ scrollEnabled: false });
    expect(wrapper.find('FlatList').prop('scrollEnabled')).toBe(false);
  });

  it('should handle show scroll indicator', () => {
    wrapper.setProps({ showScrollIndicator: true });
    expect(wrapper.find('FlatList').prop('showsVerticalScrollIndicator')).toBe(true);
  });

  it('should handle theme changes', () => {
    const theme = {
      backgroundColor: '#ffffff',
      calendarBackground: '#ffffff',
      textSectionTitleColor: '#b6c1cd',
      selectedDayBackgroundColor: '#00adf5',
      selectedDayTextColor: '#ffffff',
      todayTextColor: '#00adf5',
      dayTextColor: '#2d4150',
      textDisabledColor: '#d9e1e8',
      dotColor: '#00adf5',
      selectedDotColor: '#ffffff',
      arrowColor: 'orange',
      monthTextColor: 'blue'
    };
    wrapper.setProps({ theme });
    const calendar = wrapper.find('Calendar').first();
    expect(calendar.prop('theme')).toEqual(theme);
  });

  it('should handle marked dates', () => {
    const markedDates = {
      '2024-03-19': { selected: true, marked: true },
      '2024-03-20': { marked: true }
    };
    wrapper.setProps({ markedDates });
    const calendar = wrapper.find('Calendar').first();
    expect(calendar.prop('markedDates')).toEqual(markedDates);
  });

  it('should call onVisibleMonthsChange when months change', () => {
    const months = [
      { dateString: '2024-03-01' },
      { dateString: '2024-04-01' }
    ];
    wrapper.instance().onViewableItemsChanged({
      viewableItems: months.map(month => ({ item: month }))
    });
    expect(onVisibleMonthsChange).toHaveBeenCalledWith(months);
  });

  it('should handle calendar width in horizontal mode', () => {
    const calendarWidth = 350;
    wrapper.setProps({ horizontal: true, calendarWidth });
    const calendar = wrapper.find('Calendar').first();
    expect(calendar.prop('style').width).toBe(calendarWidth);
  });
}); 