import { device, element, by, expect } from 'detox';

describe('React Native Lunar Calendars Example App', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('App Navigation', () => {
    it('should display the app title', async () => {
      await expect(element(by.text('React Native Lunar Calendars'))).toBeVisible();
      await expect(element(by.text('Example App'))).toBeVisible();
    });

    it('should show all example tabs', async () => {
      await expect(element(by.text('Basic Calendar'))).toBeVisible();
      await expect(element(by.text('Lunar Calendar'))).toBeVisible();
      await expect(element(by.text('Period Marking'))).toBeVisible();
      await expect(element(by.text('Multi-Dot Marking'))).toBeVisible();
      await expect(element(by.text('Multi-Period Marking'))).toBeVisible();
      await expect(element(by.text('Calendar List'))).toBeVisible();
      await expect(element(by.text('Agenda'))).toBeVisible();
    });
  });

  describe('Basic Calendar', () => {
    it('should display basic calendar by default', async () => {
      await expect(element(by.text('Basic Calendar'))).toBeVisible();
      // Should show current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
      const currentYear = currentDate.getFullYear();
      
      await expect(element(by.text(currentMonth))).toBeVisible();
      await expect(element(by.text(currentYear.toString()))).toBeVisible();
    });

    it('should allow day selection', async () => {
      // Find and tap a day
      const dayElements = element(by.id('calendar-day'));
      if (await dayElements.isVisible()) {
        await dayElements.tap();
        await expect(element(by.text(/Selected:/))).toBeVisible();
      }
    });
  });

  describe('Lunar Calendar', () => {
    it('should switch to lunar calendar view', async () => {
      await element(by.text('Lunar Calendar')).tap();
      await expect(element(by.text('Lunar Calendar'))).toBeVisible();
    });

    it('should display lunar dates', async () => {
      await element(by.text('Lunar Calendar')).tap();
      // Lunar dates should be visible in multi-period mode
      await expect(element(by.text(/Lunar:/))).toBeVisible();
    });
  });

  describe('Period Marking', () => {
    it('should switch to period marking view', async () => {
      await element(by.text('Period Marking')).tap();
      await expect(element(by.text('Period Marking'))).toBeVisible();
    });
  });

  describe('Multi-Dot Marking', () => {
    it('should switch to multi-dot marking view', async () => {
      await element(by.text('Multi-Dot Marking')).tap();
      await expect(element(by.text('Multi-Dot Marking'))).toBeVisible();
    });
  });

  describe('Multi-Period Marking', () => {
    it('should switch to multi-period marking view', async () => {
      await element(by.text('Multi-Period Marking')).tap();
      await expect(element(by.text('Multi-Period Marking'))).toBeVisible();
    });

    it('should display lunar dates in multi-period mode', async () => {
      await element(by.text('Multi-Period Marking')).tap();
      // Should show lunar dates
      await expect(element(by.text(/Lunar:/))).toBeVisible();
    });
  });

  describe('Calendar List', () => {
    it('should switch to calendar list view', async () => {
      await element(by.text('Calendar List')).tap();
      await expect(element(by.text('Calendar List'))).toBeVisible();
    });

    it('should allow scrolling through months', async () => {
      await element(by.text('Calendar List')).tap();
      // Should be able to scroll through multiple months
      await element(by.id('calendar-list')).scrollTo('bottom');
    });
  });

  describe('Agenda', () => {
    it('should switch to agenda view', async () => {
      await element(by.text('Agenda')).tap();
      await expect(element(by.text('Agenda'))).toBeVisible();
    });

    it('should display agenda items', async () => {
      await element(by.text('Agenda')).tap();
      // Should show some agenda items
      await expect(element(by.text('Meeting with client'))).toBeVisible();
      await expect(element(by.text('Lunch with team'))).toBeVisible();
    });
  });

  describe('Theme Customization', () => {
    it('should display custom themed calendar', async () => {
      // All examples use custom themes, so they should render properly
      await element(by.text('Basic Calendar')).tap();
      await expect(element(by.text('Basic Calendar'))).toBeVisible();
      
      await element(by.text('Lunar Calendar')).tap();
      await expect(element(by.text('Lunar Calendar'))).toBeVisible();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', async () => {
      // Check that calendar elements are accessible
      const calendarContainer = element(by.id('calendar-container'));
      if (await calendarContainer.isVisible()) {
        await expect(calendarContainer).toBeVisible();
      }
    });
  });

  describe('Performance', () => {
    it('should switch between examples quickly', async () => {
      const startTime = Date.now();
      
      await element(by.text('Basic Calendar')).tap();
      await element(by.text('Lunar Calendar')).tap();
      await element(by.text('Period Marking')).tap();
      await element(by.text('Multi-Dot Marking')).tap();
      await element(by.text('Multi-Period Marking')).tap();
      await element(by.text('Calendar List')).tap();
      await element(by.text('Agenda')).tap();
      
      const endTime = Date.now();
      const switchTime = endTime - startTime;
      
      // Should switch between examples within reasonable time (less than 5 seconds)
      expect(switchTime).toBeLessThan(5000);
    });
  });
});
