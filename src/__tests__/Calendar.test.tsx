import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react-native';
import {Calendar, LocaleConfig, type DateData} from '../index';

LocaleConfig.defaultLocale = '';

describe('<Calendar />', () => {
  it('renders the month it was pointed at', async () => {
    await render(<Calendar current="2026-02-01" />);
    expect(screen.getByRole('header')).toHaveTextContent('February 2026');
  });

  it('honours monthFormat', async () => {
    await render(<Calendar current="2026-02-01" monthFormat="yyyy/MM" />);
    expect(screen.getByRole('header')).toHaveTextContent('2026/02');
  });

  it('renders every day of the month', async () => {
    await render(<Calendar current="2026-02-01" hideExtraDays />);
    // February 2026 has 28 days.
    expect(screen.getByLabelText('2026-02-01')).toBeTruthy();
    expect(screen.getByLabelText('2026-02-28')).toBeTruthy();
    expect(screen.queryByLabelText('2026-03-01')).toBeNull();
  });

  it('reports the pressed day', async () => {
    const onDayPress = jest.fn();
    await render(<Calendar current="2026-02-01" onDayPress={onDayPress} />);

    await fireEvent.press(screen.getByLabelText('2026-02-14'));

    expect(onDayPress).toHaveBeenCalledTimes(1);
    expect(onDayPress.mock.calls[0][0]).toMatchObject<Partial<DateData>>({
      dateString: '2026-02-14',
      day: 14,
      month: 2,
      year: 2026
    });
  });

  it('does not report days outside minDate/maxDate', async () => {
    const onDayPress = jest.fn();
    await render(
      <Calendar current="2026-02-01" minDate="2026-02-10" maxDate="2026-02-20" onDayPress={onDayPress} />
    );

    await fireEvent.press(screen.getByLabelText('2026-02-05'));
    expect(onDayPress).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByLabelText('2026-02-15'));
    expect(onDayPress).toHaveBeenCalledTimes(1);
  });

  it('moves to the next month when the right arrow is pressed', async () => {
    const onMonthChange = jest.fn();
    await render(<Calendar current="2026-02-01" onMonthChange={onMonthChange} />);

    await fireEvent.press(screen.getByLabelText('Next month'));

    expect(screen.getByRole('header')).toHaveTextContent('March 2026');
    expect(onMonthChange).toHaveBeenCalledWith(expect.objectContaining({month: 3, year: 2026}));
  });

  it('moves to the previous month when the left arrow is pressed', async () => {
    await render(<Calendar current="2026-02-01" />);

    await fireEvent.press(screen.getByLabelText('Previous month'));

    expect(screen.getByRole('header')).toHaveTextContent('January 2026');
  });

  it('hides the arrows when asked', async () => {
    await render(<Calendar current="2026-02-01" hideArrows />);
    expect(screen.queryByLabelText('Next month')).toBeNull();
  });

  it('marks today', async () => {
    // The clock is pinned to 2026-08-25 in jest.setup.js.
    await render(<Calendar />);
    expect(screen.getByRole('header')).toHaveTextContent('August 2026');
    expect(screen.getByLabelText('2026-08-25')).toBeTruthy();
  });

  it('disables past days only when asked', async () => {
    const onDayPress = jest.fn();
    await render(<Calendar current="2026-08-01" disablePastDates onDayPress={onDayPress} />);

    await fireEvent.press(screen.getByLabelText('2026-08-24'));
    expect(onDayPress).toHaveBeenCalled();
  });
});

describe('<Calendar /> lunar dates', () => {
  it('renders the lunar day under the solar day for multi-period marking', async () => {
    await render(<Calendar current="2026-02-01" markingType="multi-period" hideExtraDays />);

    // 2026-02-17 is Tết, i.e. lunar 1/1, so the cell shows the solar 17 above "1/1".
    const tet = within(screen.getByLabelText('2026-02-17'));
    expect(tet.getByText('17')).toBeTruthy();
    expect(tet.getByText('1/1')).toBeTruthy();

    // The next day is lunar day 2, shown as a bare number.
    const afterTet = within(screen.getByLabelText('2026-02-18'));
    expect(afterTet.getByText('18')).toBeTruthy();
    expect(afterTet.getByText('2')).toBeTruthy();
  });

  it('renders period bars from markedDates', async () => {
    await render(
      <Calendar
        current="2026-02-01"
        markingType="multi-period"
        markedDates={{
          '2026-02-17': {periods: [{startingDay: true, endingDay: false, color: '#ffa500'}]}
        }}
      />
    );
    expect(screen.getByLabelText('2026-02-17')).toBeTruthy();
  });
});

describe('<Calendar /> marking types', () => {
  it.each(['simple', 'period', 'multi-dot', 'multi-period', 'custom'] as const)(
    'renders with markingType=%s',
    async markingType => {
      await render(
        <Calendar
          current="2026-02-01"
          markingType={markingType}
          markedDates={{
            '2026-02-14': {
              selected: true,
              marked: true,
              color: '#00adf5',
              startingDay: true,
              endingDay: true,
              dots: [{key: 'a', color: 'red'}],
              periods: [{startingDay: true, endingDay: true, color: 'red'}],
              customStyles: {container: {backgroundColor: 'green'}}
            }
          }}
        />
      );
      expect(screen.getByLabelText('2026-02-14')).toBeTruthy();
    }
  );
});
