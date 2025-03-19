import React from 'react';
import { shallow } from 'enzyme';
import Agenda from '../index';
import CalendarList from '../../calendar-list';
import XDate from 'xdate';

describe('Agenda Component', () => {
  let wrapper: any;
  const onDayPress = jest.fn();
  const onDayChange = jest.fn();
  const loadItemsForMonth = jest.fn();
  const renderItem = jest.fn();
  const renderEmptyDate = jest.fn();

  const items = {
    '2024-03-19': [{ text: 'First Event' }],
    '2024-03-20': [{ text: 'Second Event' }],
    '2024-03-21': []
  };

  const defaultProps = {
    items,
    selected: '2024-03-19',
    onDayPress,
    onDayChange,
    loadItemsForMonth,
    renderItem,
    renderEmptyDate
  };

  beforeEach(() => {
    wrapper = shallow(<Agenda {...defaultProps} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toBeDefined();
  });

  it('should render CalendarList', () => {
    expect(wrapper.find(CalendarList)).toHaveLength(1);
  });

  it('should render FlatList for items', () => {
    expect(wrapper.find('FlatList')).toHaveLength(1);
  });

  it('should initialize with correct selected date', () => {
    expect(wrapper.instance().state.selectedDay).toBeDefined();
    expect(new XDate(wrapper.instance().state.selectedDay).toString('yyyy-MM-dd')).toBe('2024-03-19');
  });

  it('should call loadItemsForMonth when month changes', () => {
    const date = new XDate(2024, 2, 1);
    wrapper.instance().loadItems(date);
    expect(loadItemsForMonth).toHaveBeenCalledWith(date);
  });

  it('should call onDayPress when a day is pressed', () => {
    const day = {
      year: 2024,
      month: 3,
      day: 19,
      timestamp: new Date(2024, 2, 19).getTime(),
      dateString: '2024-03-19'
    };
    wrapper.instance().chooseDay(day);
    expect(onDayPress).toHaveBeenCalledWith(day);
  });

  it('should call onDayChange when selected day changes', () => {
    const day = {
      year: 2024,
      month: 3,
      day: 20,
      timestamp: new Date(2024, 2, 20).getTime(),
      dateString: '2024-03-20'
    };
    wrapper.instance().chooseDay(day);
    expect(onDayChange).toHaveBeenCalledWith(day.dateString);
  });

  it('should handle theme changes', () => {
    const theme = {
      agendaDayTextColor: 'red',
      agendaDayNumColor: 'green',
      agendaTodayColor: 'blue',
      agendaKnobColor: 'yellow'
    };
    wrapper.setProps({ theme });
    expect(wrapper.find(CalendarList).prop('theme')).toMatchObject(theme);
  });

  it('should handle calendar toggling', () => {
    const onCalendarToggled = jest.fn();
    wrapper.setProps({ onCalendarToggled });
    wrapper.instance().toggleCalendar();
    expect(onCalendarToggled).toHaveBeenCalled();
  });

  it('should handle knob toggling', () => {
    wrapper.instance().toggleCalendarPosition();
    expect(wrapper.state('calendarScrollable')).toBe(true);
  });

  it('should handle item rendering', () => {
    const item = { text: 'Test Event' };
    wrapper.instance().renderItem({ item });
    expect(renderItem).toHaveBeenCalledWith(item);
  });

  it('should handle empty date rendering', () => {
    wrapper.instance().renderEmptyDate();
    expect(renderEmptyDate).toHaveBeenCalled();
  });

  it('should handle row comparison', () => {
    const r1 = { text: 'Event 1' };
    const r2 = { text: 'Event 2' };
    const rowHasChanged = wrapper.instance().rowHasChanged(r1, r2);
    expect(rowHasChanged).toBe(true);
  });

  it('should handle calendar scrolling', () => {
    wrapper.setProps({ calendarScrollable: true });
    expect(wrapper.state('calendarScrollable')).toBe(true);
  });
}); 