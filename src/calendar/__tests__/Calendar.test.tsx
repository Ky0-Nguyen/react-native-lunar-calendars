import React from 'react';
import { shallow } from 'enzyme';
import Calendar from '../index';
import XDate from 'xdate';

describe('Calendar Component', () => {
  let wrapper: ReturnType<typeof shallow>;
  const onDayPress = jest.fn();
  const onDayLongPress = jest.fn();
  const onMonthChange = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <Calendar
        current={'2024-03-19'}
        onDayPress={onDayPress}
        onDayLongPress={onDayLongPress}
        onMonthChange={onMonthChange}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toBeDefined();
  });

  it('should initialize with correct current date', () => {
    const instance = wrapper.instance() as Calendar;
    expect(instance.state.currentMonth).toBeDefined();
    expect(new XDate(instance.state.currentMonth).toString('yyyy-MM-dd')).toBe('2024-03-01');
  });

  it('should call onDayPress when a day is pressed', () => {
    const day = {
      year: 2024,
      month: 3,
      day: 19,
      timestamp: new Date(2024, 2, 19).getTime(),
      dateString: '2024-03-19'
    };
    const instance = wrapper.instance() as Calendar;
    instance.pressDay(day);
    expect(onDayPress).toHaveBeenCalledWith(day);
  });

  it('should call onDayLongPress when a day is long pressed', () => {
    const day = {
      year: 2024,
      month: 3,
      day: 19,
      timestamp: new Date(2024, 2, 19).getTime(),
      dateString: '2024-03-19'
    };
    const instance = wrapper.instance() as Calendar;
    instance.longPressDay(day);
    expect(onDayLongPress).toHaveBeenCalledWith(day);
  });

  it('should call onMonthChange when month changes', () => {
    const newMonth = new XDate(2024, 3, 1);
    const instance = wrapper.instance() as Calendar;
    instance.updateMonth(newMonth);
    expect(onMonthChange).toHaveBeenCalledWith({
      year: 2024,
      month: 4,
      timestamp: newMonth.getTime(),
      dateString: newMonth.toString('yyyy-MM-dd')
    });
  });

  it('should update currentMonth when receiving new current prop', () => {
    wrapper.setProps({ current: '2024-04-01' });
    const instance = wrapper.instance() as Calendar;
    expect(new XDate(instance.state.currentMonth).toString('yyyy-MM-dd')).toBe('2024-04-01');
  });

  it('should render days correctly', () => {
    const days = wrapper.find('Day');
    expect(days.length).toBeGreaterThan(0);
  });

  it('should handle marking dates correctly', () => {
    const markedDates = {
      '2024-03-19': { selected: true, marked: true },
      '2024-03-20': { marked: true },
      '2024-03-21': { disabled: true }
    };
    wrapper.setProps({ markedDates });
    const days = wrapper.find('Day');
    expect(days.findWhere((day) => day.prop('marking')?.selected).length).toBe(1);
  });

  it('should handle theme changes correctly', () => {
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
    expect(wrapper.prop('theme')).toEqual(theme);
  });
}); 