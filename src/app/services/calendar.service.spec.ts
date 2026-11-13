import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CalendarService } from './calendar.service';

/**
 * Calendar Service Tests
 * 
 * These tests verify:
 * 1. Recurring events display at correct America/New_York times (BUG 1 fix)
 * 2. ICS text escapes are properly unescaped (BUG 2 fix)
 * 3. DST transitions are handled correctly
 * 4. One-off events remain correct
 */
describe('CalendarService', () => {
  let service: CalendarService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CalendarService]
    });
    service = TestBed.inject(CalendarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('ICS Text Unescaping (BUG 2)', () => {
    it('should unescape comma escapes', () => {
      const result = (service as any).unescapeIcsText('St Petersburg Lodge No. 139 F&AM\\, 3325 1st St NE\\, St. Petersburg\\, FL 33704');
      expect(result).toBe('St Petersburg Lodge No. 139 F&AM, 3325 1st St NE, St. Petersburg, FL 33704');
    });

    it('should unescape newline escapes', () => {
      const result = (service as any).unescapeIcsText('Dinner at 6:30\\nMeeting at 7:30');
      expect(result).toBe('Dinner at 6:30\nMeeting at 7:30');
    });

    it('should unescape semicolon escapes', () => {
      const result = (service as any).unescapeIcsText('Note\\; important');
      expect(result).toBe('Note; important');
    });

    it('should unescape backslash escapes', () => {
      const result = (service as any).unescapeIcsText('Path\\\\to\\\\file');
      expect(result).toBe('Path\\to\\file');
    });

    it('should handle mixed escapes', () => {
      const result = (service as any).unescapeIcsText('Line 1\\nLine 2\\, with comma\\; and semicolon\\\\done');
      expect(result).toBe('Line 1\nLine 2, with comma; and semicolon\\done');
    });

    it('should handle uppercase \\N for newline', () => {
      const result = (service as any).unescapeIcsText('Line 1\\NLine 2');
      expect(result).toBe('Line 1\nLine 2');
    });
  });

  describe('Timezone Handling (BUG 1)', () => {
    it('should calculate EST offset (UTC-5) for winter dates', () => {
      // January 15, 2026 at 18:30 should be EST (UTC-5)
      const components = { year: 2026, month: 0, day: 15, hour: 18, minute: 30, second: 0 };
      const offset = (service as any).getTimezoneOffset(components, 'America/New_York');
      expect(offset).toBe(300); // 300 minutes = 5 hours
    });

    it('should calculate EDT offset (UTC-4) for summer dates', () => {
      // July 15, 2026 at 18:30 should be EDT (UTC-4)
      const components = { year: 2026, month: 6, day: 15, hour: 18, minute: 30, second: 0 };
      const offset = (service as any).getTimezoneOffset(components, 'America/New_York');
      expect(offset).toBe(240); // 240 minutes = 4 hours
    });

    it('should correctly identify DST start (second Sunday of March)', () => {
      // March 8, 2026 is second Sunday of March - DST starts at 2:00 AM
      // At 1:59 AM it should still be EST
      const beforeDst = { year: 2026, month: 2, day: 8, hour: 1, minute: 59, second: 0 };
      expect((service as any).getTimezoneOffset(beforeDst, 'America/New_York')).toBe(300);
      
      // At 3:00 AM it should be EDT
      const afterDst = { year: 2026, month: 2, day: 8, hour: 3, minute: 0, second: 0 };
      expect((service as any).getTimezoneOffset(afterDst, 'America/New_York')).toBe(240);
    });

    it('should correctly identify DST end (first Sunday of November)', () => {
      // November 1, 2026 is first Sunday of November - DST ends at 2:00 AM
      // At 1:00 AM it should still be EDT
      const beforeEnd = { year: 2026, month: 10, day: 1, hour: 1, minute: 0, second: 0 };
      expect((service as any).getTimezoneOffset(beforeEnd, 'America/New_York')).toBe(240);
      
      // At 2:00 AM it should be EST
      const afterEnd = { year: 2026, month: 10, day: 1, hour: 2, minute: 0, second: 0 };
      expect((service as any).getTimezoneOffset(afterEnd, 'America/New_York')).toBe(300);
    });

    it('should parse TZID datetime and convert to correct UTC', () => {
      // DTSTART;TZID=America/New_York:20261117T183000 = Nov 17, 2026 at 18:30 EST
      // EST is UTC-5, so this should be 23:30 UTC on Nov 17, 2026
      const dtstart = 'DTSTART;TZID=America/New_York:20261117T183000';
      const result = (service as any).parseIcsDateTime(dtstart);
      
      expect(result).toBeTruthy();
      expect(result.getUTCFullYear()).toBe(2026);
      expect(result.getUTCMonth()).toBe(10); // November (0-indexed)
      expect(result.getUTCDate()).toBe(17);
      expect(result.getUTCHours()).toBe(23); // 18:30 EST = 23:30 UTC
      expect(result.getUTCMinutes()).toBe(30);
    });

    it('should parse UTC datetime correctly', () => {
      // DTSTART:20261118T233000Z = Nov 18, 2026 at 23:30 UTC
      const dtstart = '20261118T233000Z';
      const result = (service as any).parseIcsDateTime(dtstart);
      
      expect(result).toBeTruthy();
      expect(result.getUTCFullYear()).toBe(2026);
      expect(result.getUTCMonth()).toBe(10);
      expect(result.getUTCDate()).toBe(18);
      expect(result.getUTCHours()).toBe(23);
      expect(result.getUTCMinutes()).toBe(30);
    });

    it('should format time correctly in America/New_York timezone', () => {
      // Create a UTC date that represents 18:30 EST
      // 18:30 EST = 23:30 UTC (during EST, UTC-5)
      const utcDate = new Date(Date.UTC(2026, 10, 17, 23, 30, 0));
      const formatted = (service as any).formatTimeInTimezone(utcDate, 'America/New_York');
      expect(formatted).toBe('18:30');
    });

    it('should format time correctly during EDT', () => {
      // Create a UTC date that represents 18:30 EDT
      // 18:30 EDT = 22:30 UTC (during EDT, UTC-4)
      const utcDate = new Date(Date.UTC(2026, 6, 15, 22, 30, 0)); // July 15
      const formatted = (service as any).formatTimeInTimezone(utcDate, 'America/New_York');
      expect(formatted).toBe('18:30');
    });
  });

  describe('Integration with Live Feed Data', () => {
    it('should parse recurring Stated Communication Meeting at correct time', () => {
      // This simulates the recurring event from the live feed:
      // DTSTART;TZID=America/New_York:20250121T183000
      // RRULE:FREQ=MONTHLY;BYDAY=3TU
      // Event UID: 0vcvvhri7nnbqrjnaoshqhkpqg
      
      const icsEvent = {
        DTSTART: '20250121T183000',
        _fullDtstart: 'DTSTART;TZID=America/New_York:20250121T183000',
        DTEND: '20250121T193000',
        _full_DTEND: 'DTEND;TZID=America/New_York:20250121T193000',
        SUMMARY: 'Stated Communication Meeting',
        LOCATION: 'St Petersburg Lodge No. 139 F&AM\\, 3325 1st St NE\\, St. Petersburg\\, FL 33704\\, USA',
        DESCRIPTION: 'Dinner at 6:30\\nMeeting at 7:30',
        UID: '0vcvvhri7nnbqrjnaoshqhkpqg@google.com',
        RRULE: 'FREQ=MONTHLY;BYDAY=3TU'
      };

      const source = {
        id: 1,
        name: 'St. Petersburg Lodge No. 139',
        url: 'https://example.com/cal.ics',
        isActive: true,
        color: '#1a4b8f'
      };

      const events = (service as any).expandRecurringEvent(icsEvent, source, []);
      
      // Find the November 17, 2026 occurrence (third Tuesday of November)
      const nov17Event = events.find((e: any) => {
        const d = new Date(e.date);
        return d.getUTCFullYear() === 2026 && d.getUTCMonth() === 10 && d.getUTCDate() === 17;
      });

      expect(nov17Event).toBeTruthy();
      expect(nov17Event.startTime).toBe('18:30');
      expect(nov17Event.endTime).toBe('19:30');
      expect(nov17Event.title).toBe('Stated Communication Meeting');
      expect(nov17Event.location).toBe('St Petersburg Lodge No. 139 F&AM, 3325 1st St NE, St. Petersburg, FL 33704, USA');
      expect(nov17Event.description).toBe('Dinner at 6:30\nMeeting at 7:30');
    });

    it('should handle one-off SMMA event correctly (UTC time)', () => {
      // This is the SMMA event on Nov 18: DTSTART:20261118T233000Z
      // 23:30 UTC = 18:30 EST
      const icsEvent = {
        DTSTART: '20261118T233000Z',
        DTEND: '20261119T020000Z',
        SUMMARY: 'SMMA @ St. Petersburg Lodge No 139',
        LOCATION: 'St Petersburg Lodge No. 139 F&AM\\, 3325 1st St NE\\, St. Petersburg\\, FL 33704\\, USA',
        DESCRIPTION: '(SMMA) Wednesday\\, November 18th Dinner 6:30PM\\, Meeting 7:30PM.',
        UID: '3vrmman31hiokeen5qqoq99mui@google.com'
      };

      const source = {
        id: 1,
        name: 'St. Petersburg Lodge No. 139',
        url: 'https://example.com/cal.ics',
        isActive: true,
        color: '#1a4b8f'
      };

      const event = (service as any).convertIcsEventToCalendarEvent(icsEvent, source);
      
      expect(event).toBeTruthy();
      expect(event.startTime).toBe('18:30');
      expect(event.location).toBe('St Petersburg Lodge No. 139 F&AM, 3325 1st St NE, St. Petersburg, FL 33704, USA');
      expect(event.description).toContain('(SMMA) Wednesday, November 18th Dinner 6:30PM, Meeting 7:30PM.');
    });

    it('should handle cigar night event correctly (UTC time)', () => {
      // Cigar night on Nov 20: DTSTART:20261121T000000Z
      // 00:00 UTC on Nov 21 = 19:00 EST on Nov 20
      const icsEvent = {
        DTSTART: '20261121T000000Z',
        DTEND: '20261121T030000Z',
        SUMMARY: 'Cigar Paradise Royal Lounge',
        LOCATION: 'Cigar Paradise Royal Lounge\\, 400 Beach Dr NE #142\\, St. Petersburg\\, FL 33701',
        DESCRIPTION: 'Cigars with your Brothers.',
        UID: 'atf75d758e6lnflb88q9lvsarg@google.com'
      };

      const source = {
        id: 1,
        name: 'St. Petersburg Lodge No. 139',
        url: 'https://example.com/cal.ics',
        isActive: true,
        color: '#1a4b8f'
      };

      const event = (service as any).convertIcsEventToCalendarEvent(icsEvent, source);
      
      expect(event).toBeTruthy();
      expect(event.startTime).toBe('19:00');
      expect(event.location).toBe('Cigar Paradise Royal Lounge, 400 Beach Dr NE #142, St. Petersburg, FL 33701');
    });

    it('should handle DST transition - recurring event spanning DST change', () => {
      // A recurring event at 18:30 America/New_York should be:
      // - 23:30 UTC during EST (Nov-Mar)
      // - 22:30 UTC during EDT (Mar-Nov)
      
      const icsEvent = {
        DTSTART: '20260217T183000',
        _fullDtstart: 'DTSTART;TZID=America/New_York:20260217T183000',
        DTEND: '20260217T193000',
        SUMMARY: 'Test Recurring Event',
        UID: 'test-dst-event',
        RRULE: 'FREQ=MONTHLY;BYDAY=3TU'
      };

      const source = {
        id: 1,
        name: 'Test Calendar',
        url: 'https://example.com/cal.ics',
        isActive: true
      };

      const events = (service as any).expandRecurringEvent(icsEvent, source, []);

      // Find February 2026 occurrence (before DST - EST)
      const febEvent = events.find((e: any) => {
        const d = new Date(e.date);
        return d.getUTCFullYear() === 2026 && d.getUTCMonth() === 1; // February
      });

      // Find April 2026 occurrence (after DST - EDT)
      const aprEvent = events.find((e: any) => {
        const d = new Date(e.date);
        return d.getUTCFullYear() === 2026 && d.getUTCMonth() === 3; // April
      });

      expect(febEvent).toBeTruthy();
      expect(febEvent.startTime).toBe('18:30');
      
      expect(aprEvent).toBeTruthy();
      expect(aprEvent.startTime).toBe('18:30');

      // Verify the UTC times are different due to DST
      const febUtcHour = new Date(febEvent.date).getUTCHours();
      const aprUtcHour = new Date(aprEvent.date).getUTCHours();
      
      expect(febUtcHour).toBe(23); // 18:30 EST = 23:30 UTC
      expect(aprUtcHour).toBe(22); // 18:30 EDT = 22:30 UTC
    });
  });
});
