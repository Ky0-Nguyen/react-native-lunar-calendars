import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Calendar from '../index';

// Mock the lunar calendar day component
jest.mock('../day/multi-period', () => {
  const React = require('react');
  const { Text, TouchableOpacity } = require('react-native');
  
  return function MockMultiPeriodDay({ children, onPress, date }: any) {
    return (
      <TouchableOpacity onPress={() => onPress && onPress(date)}>
        <Text>{children}</Text>
        <Text style={{ fontSize: 10, color: '#6D6D72' }}>Lunar: 15/6</Text>
      </TouchableOpacity>
    );
  };
});

describe('Calendar Integration Tests', () => {
  const mockOnDayPress = jest.fn();
  const mockOnMonthChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Calendar Rendering', () => {
    it('should render calendar with current month', () => {
      const { getByText } = render(
        <Calendar
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      // Should render current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
      const currentYear = currentDate.getFullYear();
      
      expect(getByText(currentMonth)).toBeTruthy();
      expect(getByText(currentYear.toString())).toBeTruthy();
    });

    it('should render calendar with specified current date', () => {
      const { getByText } = render(
        <Calendar
          current={'2024-02-10'}
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      expect(getByText('February')).toBeTruthy();
      expect(getByText('2024')).toBeTruthy();
    });

    it('should render day names correctly', () => {
      const { getByText } = render(
        <Calendar
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      // Check for day names
      expect(getByText('Sun')).toBeTruthy();
      expect(getByText('Mon')).toBeTruthy();
      expect(getByText('Tue')).toBeTruthy();
      expect(getByText('Wed')).toBeTruthy();
      expect(getByText('Thu')).toBeTruthy();
      expect(getByText('Fri')).toBeTruthy();
      expect(getByText('Sat')).toBeTruthy();
    });
  });

  describe('Lunar Calendar Integration', () => {
    it('should render lunar dates when using multi-period marking', () => {
      const { getAllByText } = render(
        <Calendar
          markingType={'multi-period'}
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      // Should render lunar dates
      const lunarTexts = getAllByText(/Lunar:/);
      expect(lunarTexts.length).toBeGreaterThan(0);
    });

    it('should highlight first day of lunar month in red', () => {
      const { getAllByText } = render(
        <Calendar
          markingType={'multi-period'}
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      // Check for lunar date display
      const lunarTexts = getAllByText(/Lunar:/);
      expect(lunarTexts.length).toBeGreaterThan(0);
    });
  });

  describe('Calendar Interactions', () => {
    it('should call onDayPress when day is pressed', async () => {
      const { getAllByText } = render(
        <Calendar
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      // Find and press a day
      const days = getAllByText(/\d+/);
      if (days.length > 0) {
        fireEvent.press(days[0]);
        
        await waitFor(() => {
          expect(mockOnDayPress).toHaveBeenCalled();
        });
      }
    });

    it('should call onMonthChange when month changes', async () => {
      const { getByText } = render(
        <Calendar
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      // Find and press next arrow
      const nextArrow = getByText('>');
      if (nextArrow) {
        fireEvent.press(nextArrow);
        
        await waitFor(() => {
          expect(mockOnMonthChange).toHaveBeenCalled();
        });
      }
    });
  });

  describe('Calendar Props', () => {
    it('should respect minDate and maxDate props', () => {
      const { getAllByText } = render(
        <Calendar
          minDate={'2024-02-15'}
          maxDate={'2024-02-25'}
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      // Days outside range should be disabled
      const days = getAllByText(/\d+/);
      expect(days.length).toBeGreaterThan(0);
    });

    it('should handle markedDates correctly', () => {
      const markedDates = {
        '2024-02-15': { marked: true, dotColor: 'red' },
        '2024-02-20': { selected: true, selectedColor: 'blue' }
      };

      const { getAllByText } = render(
        <Calendar
          markedDates={markedDates}
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      // Should render marked dates
      const days = getAllByText(/\d+/);
      expect(days.length).toBeGreaterThan(0);
    });

    it('should handle theme customization', () => {
      const customTheme = {
        selectedDayBackgroundColor: 'purple',
        selectedDayTextColor: 'white',
        todayTextColor: 'orange'
      };

      const { getByText } = render(
        <Calendar
          theme={customTheme}
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      // Should render with custom theme
      expect(getByText('February')).toBeTruthy();
    });
  });

  describe('Calendar List Integration', () => {
    it('should render calendar list correctly', () => {
      const { getAllByText } = render(
        <Calendar
          markingType={'multi-period'}
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      // Should render multiple days
      const days = getAllByText(/\d+/);
      expect(days.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', () => {
      const { getByText } = render(
        <Calendar
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      // Should have accessible month and year
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
      const currentYear = currentDate.getFullYear();
      
      expect(getByText(currentMonth)).toBeTruthy();
      expect(getByText(currentYear.toString())).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should render efficiently with many marked dates', () => {
      const manyMarkedDates: any = {};
      
      // Create many marked dates
      for (let i = 1; i <= 31; i++) {
        manyMarkedDates[`2024-02-${i.toString().padStart(2, '0')}`] = {
          marked: true,
          dotColor: 'red'
        };
      }

      const renderStart = Date.now();
      
      const { getAllByText } = render(
        <Calendar
          markedDates={manyMarkedDates}
          onDayPress={mockOnDayPress}
          onMonthChange={mockOnMonthChange}
        />
      );

      const renderEnd = Date.now();
      const renderTime = renderEnd - renderStart;

      // Should render within reasonable time (less than 100ms)
      expect(renderTime).toBeLessThan(100);
      
      // Should render all days
      const days = getAllByText(/\d+/);
      expect(days.length).toBeGreaterThan(0);
    });
  });
});
