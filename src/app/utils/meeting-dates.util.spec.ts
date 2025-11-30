import { 
  getThirdTuesday, 
  getLastMeetingDate, 
  getNextMeetingDate, 
  formatMeetingDate, 
  formatNextMeeting 
} from './meeting-dates.util';

describe('Meeting Dates Utility', () => {
  describe('getThirdTuesday', () => {
    it('should return the third Tuesday of January 2025', () => {
      const result = getThirdTuesday(2025, 0); // 0 = January
      expect(result.getDate()).toBe(21);
      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getDay()).toBe(2); // Tuesday
    });

    it('should return the third Tuesday of May 2025', () => {
      const result = getThirdTuesday(2025, 4); // 4 = May
      expect(result.getDate()).toBe(20);
      expect(result.getMonth()).toBe(4);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getDay()).toBe(2); // Tuesday
    });

    it('should return the third Tuesday of June 2025', () => {
      const result = getThirdTuesday(2025, 5); // 5 = June
      expect(result.getDate()).toBe(17);
      expect(result.getMonth()).toBe(5);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getDay()).toBe(2); // Tuesday
    });

    it('should return the third Tuesday of December 2025', () => {
      const result = getThirdTuesday(2025, 11); // 11 = December
      expect(result.getDate()).toBe(16);
      expect(result.getMonth()).toBe(11);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getDay()).toBe(2); // Tuesday
    });
  });

  describe('formatMeetingDate', () => {
    it('should format date as "Month Day, Year"', () => {
      const date = new Date(2025, 4, 20); // May 20, 2025
      const result = formatMeetingDate(date);
      expect(result).toBe('May 20, 2025');
    });
  });

  describe('formatNextMeeting', () => {
    it('should format date with ordinal suffix and time', () => {
      const date = new Date(2025, 5, 17); // June 17, 2025 (Tuesday)
      const result = formatNextMeeting(date);
      expect(result).toBe('Tuesday, June 17th - 7:30 PM');
    });

    it('should handle 1st correctly', () => {
      const date = new Date(2025, 6, 1); // July 1, 2025
      const result = formatNextMeeting(date);
      expect(result).toContain('1st');
    });

    it('should handle 2nd correctly', () => {
      const date = new Date(2025, 6, 2); // July 2, 2025
      const result = formatNextMeeting(date);
      expect(result).toContain('2nd');
    });

    it('should handle 3rd correctly', () => {
      const date = new Date(2025, 6, 3); // July 3, 2025
      const result = formatNextMeeting(date);
      expect(result).toContain('3rd');
    });

    it('should handle 21st correctly', () => {
      const date = new Date(2025, 0, 21); // January 21, 2025
      const result = formatNextMeeting(date);
      expect(result).toContain('21st');
    });
  });

  describe('getLastMeetingDate and getNextMeetingDate', () => {
    // Note: These tests will vary based on the current date
    // They're mainly to verify the functions run without errors
    
    it('should return a valid last meeting date', () => {
      const result = getLastMeetingDate();
      expect(result).toBeInstanceOf(Date);
      expect(result.getDay()).toBe(2); // Should be a Tuesday
    });

    it('should return a valid next meeting date', () => {
      const result = getNextMeetingDate();
      expect(result).toBeInstanceOf(Date);
      expect(result.getDay()).toBe(2); // Should be a Tuesday
    });

    it('should ensure next meeting is after last meeting', () => {
      const lastMeeting = getLastMeetingDate();
      const nextMeeting = getNextMeetingDate();
      expect(nextMeeting.getTime()).toBeGreaterThan(lastMeeting.getTime());
    });
  });
});

