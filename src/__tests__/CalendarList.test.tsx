import React from 'react';
import {Text} from 'react-native';
import {fireEvent, render, screen} from '@testing-library/react-native';
import {Agenda, CalendarList, LocaleConfig} from '../index';

LocaleConfig.defaultLocale = '';

describe('<CalendarList />', () => {
  it('renders the current month eagerly and neighbours as placeholders', async () => {
    await render(<CalendarList current="2026-02-01" pastScrollRange={2} futureScrollRange={2} />);

    expect(screen.getByLabelText('2026-02-14')).toBeTruthy();
    // Months far from the initial position are cheap text placeholders until scrolled to.
    expect(screen.getByText('Apr 2026')).toBeTruthy();
  });

  it('forwards day presses', async () => {
    const onDayPress = jest.fn();
    await render(
      <CalendarList current="2026-02-01" pastScrollRange={1} futureScrollRange={1} onDayPress={onDayPress} />
    );

    await fireEvent.press(screen.getByLabelText('2026-02-14'));

    expect(onDayPress).toHaveBeenCalledWith(expect.objectContaining({dateString: '2026-02-14'}));
  });

  it('renders lunar days when asked for multi-period marking', async () => {
    await render(
      <CalendarList
        current="2026-02-01"
        markingType="multi-period"
        pastScrollRange={0}
        futureScrollRange={0}
      />
    );
    expect(screen.getAllByText('1/1').length).toBeGreaterThan(0);
  });
});

describe('<Agenda />', () => {
  const items = {
    '2026-02-14': [{name: 'Tết shopping'}],
    '2026-02-15': [],
    '2026-02-17': [{name: 'Tết'}, {name: 'Family lunch'}]
  };

  it('renders the items of the selected day', async () => {
    await render(
      <Agenda<{name: string}>
        items={items}
        selected="2026-02-17"
        pastScrollRange={1}
        futureScrollRange={1}
        renderItem={item => <Text>{item.name}</Text>}
        renderEmptyDate={() => <Text>No events</Text>}
        rowHasChanged={(a, b) => a.name !== b.name}
      />
    );

    expect(screen.getByText('Tết')).toBeTruthy();
    expect(screen.getByText('Family lunch')).toBeTruthy();
  });

  it('asks the host to load a month when it has no items yet', async () => {
    const loadItemsForMonth = jest.fn();
    await render(<Agenda selected="2026-02-17" loadItemsForMonth={loadItemsForMonth} />);

    expect(loadItemsForMonth).toHaveBeenCalledWith(expect.objectContaining({month: 2, year: 2026}));
  });
});
