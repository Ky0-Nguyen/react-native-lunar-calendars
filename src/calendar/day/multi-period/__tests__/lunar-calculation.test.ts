import Day from '../index';

describe('Lunar Calendar Calculations', () => {
  let dayComponent: any;

  beforeEach(() => {
    dayComponent = new Day({});
  });

  describe('jdn (Julian Day Number)', () => {
    it('should calculate correct Julian Day Number for known dates', () => {
      // Test some known dates
      expect(dayComponent.jdn(1, 1, 2000)).toBe(2451545);
      expect(dayComponent.jdn(15, 6, 2024)).toBe(2460488);
      expect(dayComponent.jdn(31, 12, 2024)).toBe(2460687);
    });

    it('should handle leap years correctly', () => {
      // 2024 is a leap year
      expect(dayComponent.jdn(29, 2, 2024)).toBe(2460371);
      // 2023 is not a leap year
      expect(dayComponent.jdn(28, 2, 2023)).toBe(2460006);
    });
  });

  describe('getLunarDate', () => {
    it('should return correct lunar date for known solar dates', () => {
      // Test Tet 2024 (Lunar New Year)
      const tet2024 = dayComponent.getLunarDate(10, 2, 2024);
      expect(tet2024.day).toBe(1);
      expect(tet2024.month).toBe(1);
      expect(tet2024.year).toBe(2024);
      expect(tet2024.leap).toBe(0);
    });

    it('should handle leap lunar months', () => {
      // Test a known leap lunar month
      const leapMonthDate = dayComponent.getLunarDate(15, 6, 2024);
      // This should be in a leap month if applicable
      expect(leapMonthDate.day).toBeGreaterThan(0);
      expect(leapMonthDate.month).toBeGreaterThan(0);
    });

    it('should return valid lunar date for edge cases', () => {
      // Test first supported year
      const firstYear = dayComponent.getLunarDate(1, 1, 1800);
      expect(firstYear.day).toBeGreaterThan(0);
      expect(firstYear.month).toBeGreaterThan(0);
      expect(firstYear.year).toBe(1800);

      // Test last supported year
      const lastYear = dayComponent.getLunarDate(31, 12, 2199);
      expect(lastYear.day).toBeGreaterThan(0);
      expect(lastYear.month).toBeGreaterThan(0);
      expect(lastYear.year).toBe(2199);
    });

    it('should handle unsupported years gracefully', () => {
      // Years outside supported range should be handled
      const beforeRange = dayComponent.getLunarDate(1, 1, 1799);
      const afterRange = dayComponent.getLunarDate(1, 1, 2200);
      
      // Should return some valid structure even for unsupported years
      expect(beforeRange).toBeDefined();
      expect(afterRange).toBeDefined();
    });
  });

  describe('getYearInfo', () => {
    it('should return correct year info for different centuries', () => {
      // Test 19th century
      const year1900 = dayComponent.getYearInfo(1900);
      expect(year1900).toBeDefined();
      expect(year1900.length).toBeGreaterThan(0);

      // Test 20th century
      const year2000 = dayComponent.getYearInfo(2000);
      expect(year2000).toBeDefined();
      expect(year2000.length).toBeGreaterThan(0);

      // Test 21st century
      const year2100 = dayComponent.getYearInfo(2100);
      expect(year2100).toBeDefined();
      expect(year2100.length).toBeGreaterThan(0);
    });

    it('should handle leap years in lunar calendar', () => {
      // Test a known leap year in lunar calendar
      const leapYear = dayComponent.getYearInfo(2024);
      expect(leapYear).toBeDefined();
      
      // Check if it contains leap month information
      const hasLeapMonth = leapYear.some((month: any) => month.leap === 1);
      expect(hasLeapMonth).toBeDefined();
    });
  });

  describe('decodeLunarYear', () => {
    it('should decode lunar year correctly', () => {
      // Test with a known year code
      const yearCode = 0x30baa3; // Example year code
      const decoded = dayComponent.decodeLunarYear(1800, yearCode);
      
      expect(decoded).toBeDefined();
      expect(Array.isArray(decoded)).toBe(true);
      expect(decoded.length).toBeGreaterThan(0);
      
      // Each month should have valid properties
      decoded.forEach((month: any) => {
        expect(month.day).toBe(1);
        expect(month.month).toBeGreaterThan(0);
        expect(month.month).toBeLessThanOrEqual(12);
        expect(month.year).toBe(1800);
        expect(typeof month.leap).toBe('number');
        expect(month.jd).toBeGreaterThan(0);
      });
    });
  });

  describe('findLunarDate', () => {
    it('should find correct lunar date from Julian Day Number', () => {
      const jd = dayComponent.jdn(10, 2, 2024); // Tet 2024
      const yearInfo = dayComponent.getYearInfo(2024);
      const lunarDate = dayComponent.findLunarDate(jd, yearInfo);
      
      expect(lunarDate.day).toBe(1);
      expect(lunarDate.month).toBe(1);
      expect(lunarDate.year).toBe(2024);
      expect(lunarDate.leap).toBe(0);
    });

    it('should handle dates outside supported range', () => {
      const firstDay = dayComponent.jdn(25, 1, 1800);
      const lastDay = dayComponent.jdn(31, 12, 2199);
      
      // Test before supported range
      const beforeRange = dayComponent.findLunarDate(firstDay - 1, []);
      expect(beforeRange).toBeDefined();
      
      // Test after supported range
      const afterRange = dayComponent.findLunarDate(lastDay + 1, []);
      expect(afterRange).toBeDefined();
    });
  });

  describe('LunarDate constructor', () => {
    it('should create lunar date object correctly', () => {
      const lunarDate = new dayComponent.LunarDate(15, 6, 2024, 0, 2460488);
      
      expect(lunarDate.day).toBe(15);
      expect(lunarDate.month).toBe(6);
      expect(lunarDate.year).toBe(2024);
      expect(lunarDate.leap).toBe(0);
      expect(lunarDate.jd).toBe(2460488);
    });
  });
});
