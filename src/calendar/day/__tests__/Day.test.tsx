import React from 'react';
import { View } from 'react-native';
import { shallow } from 'enzyme';
import Day from '../basic';
import XDate from 'xdate';

const testDate = new XDate('2019-01-01');

describe('Day component', () => {
  it('should render without issues', () => {
    const wrapper = shallow(<Day date={testDate} />);
    expect(wrapper.length).toBe(1);
  });

  it('should render with custom styles', () => {
    const wrapper = shallow(
      <Day 
        date={testDate}
        theme={{
          textDayFontFamily: 'Arial',
          textDayFontSize: 14
        }}
      />
    );
    expect(wrapper.length).toBe(1);
  });

  it('should handle onPress', () => {
    const onPress = jest.fn();
    const wrapper = shallow(
      <Day 
        date={testDate}
        onPress={onPress}
      />
    );
    wrapper.simulate('press');
    expect(onPress).toHaveBeenCalled();
  });

  it('should handle onLongPress', () => {
    const onLongPress = jest.fn();
    const wrapper = shallow(
      <Day 
        date={testDate}
        onLongPress={onLongPress}
      />
    );
    wrapper.simulate('longPress');
    expect(onLongPress).toHaveBeenCalled();
  });

  it('should render marked dates', () => {
    const wrapper = shallow(
      <Day 
        date={testDate}
        marking={{marked: true}}
      />
    );
    expect(wrapper.find(View).length).toBeGreaterThan(1);
  });

  it('should render disabled dates', () => {
    const wrapper = shallow(
      <Day 
        date={testDate}
        marking={{disabled: true}}
      />
    );
    expect(wrapper.prop('style')).toEqual(expect.arrayContaining([expect.objectContaining({opacity: 0.5})]));
  });

  it('should render selected dates', () => {
    const wrapper = shallow(
      <Day 
        date={testDate}
        marking={{selected: true}}
      />
    );
    expect(wrapper.prop('style')).toEqual(expect.arrayContaining([expect.objectContaining({backgroundColor: '#00adf5'})]));
  });

  it('should render today', () => {
    const today = new XDate();
    const wrapper = shallow(
      <Day 
        date={today}
      />
    );
    expect(wrapper.prop('style')).toEqual(expect.arrayContaining([expect.objectContaining({backgroundColor: undefined})]));
  });
});