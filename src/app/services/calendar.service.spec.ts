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
 * 5. All behavior is timezone-independent (uses getUTC* and Intl.DateTimeFormat)
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

  describe('Timezone Handling with Intl.DateTimeFormat (BUG 1)', () => {
    it('should get EST offset (300 min) for November dates', () => {
      const offset = (service as any).getTimezoneOffsetForWallClock(2026, 10, 17, 18, 30, 'America/New_York');
      expect(offset).toBe(300); // EST: UTC-5
    });

    it('should get EDT offset (240 min) for July dates', () => {
      const offset = (service as any).getTimezoneOffsetForWallClock(2026, 6, 15, 18, 30, 'America/New_York');
      expect(offset).toBe(240); // EDT: UTC-4
    });

    it('should convert Nov 17, 2026 18:30 EST to correct UTC', () => {
      const utcDate = (service as any).wallClockToUtc(2026, 10, 17, 18, 30, 0, 'America/New_York');
      // 18:30 EST = 23:30 UTC
      expect(utcDate.getUTCHours()).toBe(23);
      expect(utcDate.getUTCMinutes()).toBe(30);
      expect(utcDate.getUTCDate()).toBe(17);
    });

    it('should convert Apr 21, 2026 18:30 EDT to correct UTC', () => {
      const utcDate = (service as any).wallClockToUtc(2026, 3, 21, 18, 30, 0, 'America/New_York');
      // 18:30 EDT = 22:30 UTC
      expect(utcDate.getUTCHours()).toBe(22);
      expect(utcDate.getUTCMinutes()).toBe(30);
    });

    it('should format 23:30 UTC as 18:30 in America/New_York (EST)', () => {
      const utcDate = new Date(Date.UTC(2026, 10, 17, 23, 30, 0));
      const formatted = (service as any).formatTimeInTimezone(utcDate, 'America/New_York');
      expect(formatted).toBe('18:30');
    });

    it('should format 22:30 UTC as 18:30 in America/New_York (EDT)', () => {
      const utcDate = new Date(Date.UTC(2026, 6, 15, 22, 30, 0));
      const formatted = (service as any).formatTimeInTimezone(utcDate, 'America/New_York');
      expect(formatted).toBe('18:30');
    });
  });

  describe('DTSTART Parsing', () => {
    it('should parse TZID datetime for Nov 17, 2026 at 18:30 EST', () => {
      const dtstart = 'DTSTART;TZID=America/New_York:20261117T183000';
      const result = (service as any).parseIcsDateTime(dtstart);
      
      expect(result).toBeTruthy();
      expect(result.getUTCFullYear()).toBe(2026);
      expect(result.getUTCMonth()).toBe(10); // November
      expect(result.getUTCDate()).toBe(17);
      expect(result.getUTCHours()).toBe(23); // 18:30 EST = 23:30 UTC
      expect(result.getUTCMinutes()).toBe(30);
    });

    it('should parse UTC datetime correctly', () => {
      const dtstart = '20261118T233000Z';
      const result = (service as any).parseIcsDateTime(dtstart);
      
      expect(result).toBeTruthy();
      expect(result.getUTCFullYear()).toBe(2026);
      expect(result.getUTCMonth()).toBe(10);
      expect(result.getUTCDate()).toBe(18);
      expect(result.getUTCHours()).toBe(23);
      expect(result.getUTCMinutes()).toBe(30);
    });

    it('should handle floating time as America/New_York', () => {
      const dtstart = '20261117T183000';
      const result = (service as any).parseIcsDateTime(dtstart);
      
      expect(result).toBeTruthy();
      // 18:30 America/New_York (Nov = EST) = 23:30 UTC
      expect(result.getUTCHours()).toBe(23);
      expect(result.getUTCMinutes()).toBe(30);
    });
  });

  describe('Integration with Recurring Events', () => {
    it('should parse recurring Stated Communication event at correct time', () => {
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
      
      // Find the November 2026 occurrence (third Tuesday = Nov 17)
      const nov17Event = events.find((e: any) => {
        const dateStr = (service as any).formatDateInTimezone(e.date, 'America/New_York');
        return dateStr === '2026-11-17';
      });

      expect(nov17Event).toBeTruthy();
      expect(nov17Event.startTime).toBe('18:30');
      expect(nov17Event.endTime).toBe('19:30');
      expect(nov17Event.title).toBe('Stated Communication Meeting');
      expect(nov17Event.location).toBe('St Petersburg Lodge No. 139 F&AM, 3325 1st St NE, St. Petersburg, FL 33704, USA');
      expect(nov17Event.description).toBe('Dinner at 6:30\nMeeting at 7:30');
    });

    it('should handle one-off UTC event correctly (SMMA Nov 18)', () => {
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
    });

    it('should handle cigar night correctly (00:00 UTC = 19:00 EST prev day)', () => {
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

    it('should handle DST transition - recurring event in Feb 2026 (EST) and Apr 2026 (EDT)', () => {
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

      // Find February 2026 occurrence
      const febEvent = events.find((e: any) => {
        const dateStr = (service as any).formatDateInTimezone(e.date, 'America/New_York');
        return dateStr.startsWith('2026-02');
      });

      // Find April 2026 occurrence
      const aprEvent = events.find((e: any) => {
        const dateStr = (service as any).formatDateInTimezone(e.date, 'America/New_York');
        return dateStr.startsWith('2026-04');
      });

      expect(febEvent).toBeTruthy();
      expect(febEvent.startTime).toBe('18:30');
      
      expect(aprEvent).toBeTruthy();
      expect(aprEvent.startTime).toBe('18:30');

      // Verify UTC times are different due to DST
      const febUtcHour = febEvent.date.getUTCHours();
      const aprUtcHour = aprEvent.date.getUTCHours();
      
      expect(febUtcHour).toBe(23); // 18:30 EST = 23:30 UTC
      expect(aprUtcHour).toBe(22); // 18:30 EDT = 22:30 UTC
    });
  });
});
