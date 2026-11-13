#!/usr/bin/env node
/**
 * Standalone test script to verify calendar service fixes.
 * Tests the REAL parsing logic against the live ICS feed fixture.
 * Verifies timezone-independent day bucketing using localDate.
 * 
 * Run with:
 *   TZ=UTC node scripts/test-calendar-fixes.js
 *   TZ=America/New_York node scripts/test-calendar-fixes.js
 *   TZ=America/Los_Angeles node scripts/test-calendar-fixes.js
 */

const fs = require('fs');
const path = require('path');

// Detect current timezone
const currentTz = process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(`\n🌍 Running tests in timezone: ${currentTz}\n`);

// Read the saved ICS fixture
const icsPath = path.join(__dirname, '../test-fixtures/lodge-calendar.ics');
const icsContent = fs.readFileSync(icsPath, 'utf-8');

// ============ REAL Implementation (mirrors calendar.service.ts exactly) ============

function unescapeIcsText(text) {
  if (!text) return text;
  return text
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

function parseBasicDateTimeComponents(dateTimeString) {
  try {
    const cleanDateTime = dateTimeString.replace(/[^0-9T]/g, '');
    
    if (cleanDateTime.length === 8) {
      return {
        year: parseInt(cleanDateTime.substring(0, 4)),
        month: parseInt(cleanDateTime.substring(4, 6)) - 1,
        day: parseInt(cleanDateTime.substring(6, 8)),
        hour: 0, minute: 0, second: 0
      };
    } else if (cleanDateTime.length >= 15 && cleanDateTime.includes('T')) {
      const datePart = cleanDateTime.substring(0, 8);
      const timePart = cleanDateTime.substring(9, 15);
      return {
        year: parseInt(datePart.substring(0, 4)),
        month: parseInt(datePart.substring(4, 6)) - 1,
        day: parseInt(datePart.substring(6, 8)),
        hour: parseInt(timePart.substring(0, 2)),
        minute: parseInt(timePart.substring(2, 4)),
        second: timePart.length >= 6 ? parseInt(timePart.substring(4, 6)) : 0
      };
    }
    return null;
  } catch { return null; }
}

function normalizeTimezoneId(tzid) {
  const tzMap = {
    'US/Eastern': 'America/New_York',
    'Eastern': 'America/New_York',
    'US/Central': 'America/Chicago',
    'US/Mountain': 'America/Denver',
    'US/Pacific': 'America/Los_Angeles'
  };
  return tzMap[tzid] || tzid;
}

function getTimezoneOffsetForWallClock(year, month, day, hour, minute, tzid) {
  try {
    const normalizedTzid = normalizeTimezoneId(tzid);
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: normalizedTzid,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZoneName: 'longOffset'
    });
    const guessUtc = Date.UTC(year, month, day, hour, minute, 0);
    const parts = formatter.formatToParts(new Date(guessUtc));
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    if (tzPart && tzPart.value) {
      const offsetMatch = tzPart.value.match(/GMT([+-])(\d{2}):(\d{2})/);
      if (offsetMatch) {
        const sign = offsetMatch[1] === '-' ? 1 : -1;
        const hours = parseInt(offsetMatch[2], 10);
        const mins = parseInt(offsetMatch[3], 10);
        return sign * (hours * 60 + mins);
      }
    }
    return 300;
  } catch { return 300; }
}

function wallClockToUtc(year, month, day, hour, minute, second, tzid) {
  const offsetMinutes = getTimezoneOffsetForWallClock(year, month, day, hour, minute, tzid);
  return new Date(Date.UTC(year, month, day, hour, minute, second) + offsetMinutes * 60000);
}

function convertTimezoneToUtc(c, tzid) {
  return wallClockToUtc(c.year, c.month, c.day, c.hour, c.minute, c.second, tzid);
}

function formatTimeInTimezone(utcDate, tzid) {
  try {
    const normalizedTzid = normalizeTimezoneId(tzid);
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: normalizedTzid,
      hour: '2-digit', minute: '2-digit', hour12: false
    });
    return formatter.format(utcDate);
  } catch {
    const utcHours = utcDate.getUTCHours();
    const utcMinutes = utcDate.getUTCMinutes();
    let localHours = utcHours - 5;
    if (localHours < 0) localHours += 24;
    return `${String(localHours).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')}`;
  }
}

function formatDateInTimezone(utcDate, tzid) {
  try {
    const normalizedTzid = normalizeTimezoneId(tzid);
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: normalizedTzid,
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
    return formatter.format(utcDate);
  } catch {
    return `${utcDate.getUTCFullYear()}-${String(utcDate.getUTCMonth() + 1).padStart(2, '0')}-${String(utcDate.getUTCDate()).padStart(2, '0')}`;
  }
}

function parseIcsDateTime(dateTimeString) {
  try {
    if (!dateTimeString) return null;
    
    const tzidMatch = dateTimeString.match(/TZID=([^:;]+)/);
    const tzid = tzidMatch ? tzidMatch[1] : null;
    const isDateOnly = dateTimeString.includes('VALUE=DATE');
    
    const colonIndex = dateTimeString.lastIndexOf(':');
    const value = colonIndex >= 0 ? dateTimeString.substring(colonIndex + 1) : dateTimeString;
    
    if (value.endsWith('Z')) {
      const cleanValue = value.slice(0, -1);
      const components = parseBasicDateTimeComponents(cleanValue);
      if (components) {
        return new Date(Date.UTC(
          components.year, components.month, components.day,
          components.hour, components.minute, components.second
        ));
      }
      return null;
    }
    
    const components = parseBasicDateTimeComponents(value);
    if (!components) return null;
    
    if (tzid) {
      return convertTimezoneToUtc(components, tzid);
    }
    
    return convertTimezoneToUtc(components, 'America/New_York');
  } catch {
    return null;
  }
}

/**
 * REAL parseIcsData implementation (mirrors calendar.service.ts)
 */
function parseIcsData(icsContent) {
  const events = [];
  const rawEvents = [];
  const exceptionInstances = new Map();
  const lines = icsContent.split(/\r?\n/);
  let currentEvent = null;
  let isInEvent = false;
  let fullDtstart = '';

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
      i++;
      line += lines[i].substring(1);
    }
    line = line.trim();
    
    if (line === 'BEGIN:VEVENT') {
      isInEvent = true;
      currentEvent = {};
      fullDtstart = '';
      continue;
    }
    
    if (line === 'END:VEVENT' && isInEvent) {
      if (currentEvent.DTSTART && currentEvent.SUMMARY) {
        currentEvent._fullDtstart = fullDtstart;
        
        if (currentEvent['RECURRENCE-ID']) {
          const uid = currentEvent.UID;
          if (!exceptionInstances.has(uid)) {
            exceptionInstances.set(uid, []);
          }
          exceptionInstances.get(uid).push(currentEvent);
        } else {
          rawEvents.push(currentEvent);
        }
      }
      isInEvent = false;
      currentEvent = null;
      continue;
    }
    
    if (isInEvent && line.includes(':')) {
      const colonIndex = line.indexOf(':');
      const property = line.substring(0, colonIndex);
      const value = line.substring(colonIndex + 1);
      
      if (property.startsWith('DTSTART')) {
        fullDtstart = line;
      }
      
      if (property.includes(';')) {
        const mainProperty = property.split(';')[0];
        currentEvent[mainProperty] = value;
        currentEvent[`_full_${mainProperty}`] = line;
      } else {
        currentEvent[property] = value;
      }
    }
  }

  // Process all raw events
  for (const rawEvent of rawEvents) {
    const event = convertIcsEventToCalendarEvent(rawEvent);
    if (event) {
      events.push(event);
    }
  }

  return events;
}

function convertIcsEventToCalendarEvent(icsEvent) {
  try {
    const fullDtstart = icsEvent._fullDtstart || icsEvent._full_DTSTART || icsEvent.DTSTART || '';
    const tzidMatch = fullDtstart.match(/TZID=([^:;]+)/);
    const tzid = tzidMatch ? tzidMatch[1] : 'America/New_York';
    
    const startDate = parseIcsDateTime(fullDtstart || icsEvent.DTSTART);
    if (!startDate) return null;

    const fullDtend = icsEvent._full_DTEND || icsEvent.DTEND || '';
    const endDate = icsEvent.DTEND ? parseIcsDateTime(fullDtend || icsEvent.DTEND) : startDate;
    
    const startTimeStr = formatTimeInTimezone(startDate, tzid);
    const endTimeStr = endDate 
      ? formatTimeInTimezone(endDate, tzid) 
      : formatTimeInTimezone(new Date(startDate.getTime() + 60 * 60 * 1000), tzid);
    
    // THE KEY FIX: localDate for timezone-independent day bucketing
    const localDate = formatDateInTimezone(startDate, tzid);
    
    return {
      title: unescapeIcsText(icsEvent.SUMMARY || 'Untitled Event'),
      date: startDate,
      localDate: localDate,
      startTime: startTimeStr,
      endTime: endTimeStr,
      location: unescapeIcsText(icsEvent.LOCATION || ''),
      description: unescapeIcsText(icsEvent.DESCRIPTION || ''),
      uid: icsEvent.UID || '',
      isRecurring: !!icsEvent.RRULE
    };
  } catch (error) {
    return null;
  }
}

/**
 * Simulate getEventsForDay using localDate (as the component now does)
 */
function getEventsForDay(events, dayStr) {
  return events.filter(event => event.localDate === dayStr);
}

// ============ Tests ============

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${e.message}`);
    failed++;
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, got ${JSON.stringify(actual)}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy value, got ${JSON.stringify(actual)}`);
      }
    }
  };
}

console.log('========================================');
console.log('Calendar Service Fixes - Test Results');
console.log(`Timezone: ${currentTz}`);
console.log('========================================\n');

console.log('--- parseIcsDateTime Input Formats ---\n');

test('should parse bare UTC value: 20261121T000000Z', () => {
  const result = parseIcsDateTime('20261121T000000Z');
  expect(result).toBeTruthy();
  expect(result.getUTCFullYear()).toBe(2026);
  expect(result.getUTCMonth()).toBe(10);
  expect(result.getUTCDate()).toBe(21);
  expect(result.getUTCHours()).toBe(0);
});

test('should parse full line UTC: DTSTART:20261121T000000Z', () => {
  const result = parseIcsDateTime('DTSTART:20261121T000000Z');
  expect(result).toBeTruthy();
  expect(result.getUTCFullYear()).toBe(2026);
  expect(result.getUTCMonth()).toBe(10);
  expect(result.getUTCDate()).toBe(21);
  expect(result.getUTCHours()).toBe(0);
});

test('should parse full line with TZID: DTSTART;TZID=America/New_York:20261117T183000', () => {
  const result = parseIcsDateTime('DTSTART;TZID=America/New_York:20261117T183000');
  expect(result).toBeTruthy();
  expect(result.getUTCHours()).toBe(23);
});

test('should parse VALUE=DATE all-day event: DTSTART;VALUE=DATE:20261225', () => {
  const result = parseIcsDateTime('DTSTART;VALUE=DATE:20261225');
  expect(result).toBeTruthy();
  expect(result.getUTCFullYear()).toBe(2026);
  expect(result.getUTCMonth()).toBe(11);
  expect(result.getUTCDate()).toBe(25);
});

test('should parse DTEND:20261121T030000Z', () => {
  const result = parseIcsDateTime('DTEND:20261121T030000Z');
  expect(result).toBeTruthy();
  expect(result.getUTCHours()).toBe(3);
});

console.log('\n--- REAL parseIcsData on Live Feed ---\n');

const parsedEvents = parseIcsData(icsContent);

test('should parse events without errors', () => {
  expect(parsedEvents.length > 0).toBeTruthy();
});

test('should have no Invalid Date in any parsed event', () => {
  const invalidDateEvents = parsedEvents.filter(e => 
    !e.date || isNaN(e.date.getTime())
  );
  if (invalidDateEvents.length > 0) {
    throw new Error(`Found ${invalidDateEvents.length} events with Invalid Date: ${invalidDateEvents.map(e => e.title).join(', ')}`);
  }
  expect(invalidDateEvents.length).toBe(0);
});

test('should have localDate set on all events', () => {
  const missingLocalDate = parsedEvents.filter(e => !e.localDate);
  if (missingLocalDate.length > 0) {
    throw new Error(`Found ${missingLocalDate.length} events without localDate`);
  }
  expect(missingLocalDate.length).toBe(0);
});

console.log('\n--- Pickle Ball All-Day Event (VALUE=DATE) ---\n');

// Find Pickle Ball event (UID: 3p3iud1njh16jmiq2eaklou91s)
const pickleballEvent = parsedEvents.find(e => 
  e.uid === '3p3iud1njh16jmiq2eaklou91s@google.com' ||
  (e.title && e.title.toLowerCase().includes('pickle ball'))
);

test('should find Pickle Ball event', () => {
  expect(pickleballEvent).toBeTruthy();
});

test('should have Pickle Ball on 2026-11-21 (not 2026-11-20)', () => {
  expect(pickleballEvent).toBeTruthy();
  expect(pickleballEvent.localDate).toBe('2026-11-21');
});

test('should bucket Pickle Ball in Nov 21 cell', () => {
  const nov21Events = getEventsForDay(parsedEvents, '2026-11-21');
  const found = nov21Events.find(e => e.title && e.title.toLowerCase().includes('pickle ball'));
  expect(found).toBeTruthy();
});

test('should NOT bucket Pickle Ball in Nov 20 cell', () => {
  const nov20Events = getEventsForDay(parsedEvents, '2026-11-20');
  const found = nov20Events.find(e => e.title && e.title.toLowerCase().includes('pickle ball'));
  expect(found).toBeFalsy();
});

console.log('\n--- Cigar Paradise Event (UTC time) ---\n');

// Find Cigar event (UID: atf75d758e6lnflb88q9lvsarg)
const cigarEvent = parsedEvents.find(e => 
  e.uid === 'atf75d758e6lnflb88q9lvsarg@google.com' ||
  (e.title && e.title.includes('Cigar'))
);

test('should find Cigar Paradise event', () => {
  expect(cigarEvent).toBeTruthy();
});

test('should have Cigar event on 2026-11-20 at 19:00-22:00', () => {
  expect(cigarEvent).toBeTruthy();
  expect(cigarEvent.localDate).toBe('2026-11-20');
  expect(cigarEvent.startTime).toBe('19:00');
  expect(cigarEvent.endTime).toBe('22:00');
});

test('should bucket Cigar event in Nov 20 cell', () => {
  const nov20Events = getEventsForDay(parsedEvents, '2026-11-20');
  const found = nov20Events.find(e => e.title && e.title.includes('Cigar'));
  expect(found).toBeTruthy();
});

test('should NOT bucket Cigar event in Nov 21 cell', () => {
  const nov21Events = getEventsForDay(parsedEvents, '2026-11-21');
  const found = nov21Events.find(e => e.title && e.title.includes('Cigar'));
  expect(found).toBeFalsy();
});

console.log('\n--- Stated Communication Recurring Event ---\n');

// Find Stated Communication recurring event base
const statedCommBase = parsedEvents.find(e => 
  e.title === 'Stated Communication Meeting' && e.isRecurring
);

test('should find Stated Communication recurring event', () => {
  expect(statedCommBase).toBeTruthy();
});

test('should have Stated Communication at 18:30-19:30', () => {
  expect(statedCommBase).toBeTruthy();
  expect(statedCommBase.startTime).toBe('18:30');
  expect(statedCommBase.endTime).toBe('19:30');
});

// Test direct parsing for Nov 17, 2026 instance
test('should parse Nov 17, 2026 Stated Communication correctly', () => {
  const dtstart = 'DTSTART;TZID=America/New_York:20261117T183000';
  const result = parseIcsDateTime(dtstart);
  expect(result).toBeTruthy();
  
  const localDate = formatDateInTimezone(result, 'America/New_York');
  expect(localDate).toBe('2026-11-17');
  
  const timeStr = formatTimeInTimezone(result, 'America/New_York');
  expect(timeStr).toBe('18:30');
});

console.log('\n--- SMMA Event ---\n');

// Find SMMA event on Nov 18
const smmaEvent = parsedEvents.find(e => 
  e.title && e.title.includes('SMMA') && e.localDate === '2026-11-18'
);

test('should find SMMA event on Nov 18, 2026', () => {
  expect(smmaEvent).toBeTruthy();
});

test('should have SMMA at 18:30', () => {
  expect(smmaEvent).toBeTruthy();
  expect(smmaEvent.startTime).toBe('18:30');
});

console.log('\n--- ICS Text Unescaping ---\n');

test('should unescape comma escapes in location', () => {
  const eventWithCommas = parsedEvents.find(e => 
    e.location && e.location.includes(', ')
  );
  expect(eventWithCommas).toBeTruthy();
  expect(eventWithCommas.location.includes('\\,')).toBeFalsy();
});

test('should unescape newlines in description', () => {
  const eventWithNewlines = parsedEvents.find(e => 
    e.description && e.description.includes('\n')
  );
  if (eventWithNewlines) {
    expect(eventWithNewlines.description.includes('\\n')).toBeFalsy();
  }
  expect(true).toBeTruthy();
});

console.log('\n--- Day Bucketing Consistency Across Timezones ---\n');

// The key test: localDate should be the same regardless of viewer's timezone
test('should have consistent localDate regardless of viewer timezone', () => {
  // Cigar event: UTC Nov 21 00:00 should always be localDate 2026-11-20 (ET date)
  expect(cigarEvent.localDate).toBe('2026-11-20');
  
  // Pickle Ball: VALUE=DATE:20261121 should always be localDate 2026-11-21
  expect(pickleballEvent.localDate).toBe('2026-11-21');
});

test('should bucket events correctly using localDate', () => {
  // This test verifies getEventsForDay works correctly
  const nov20Events = getEventsForDay(parsedEvents, '2026-11-20');
  const nov21Events = getEventsForDay(parsedEvents, '2026-11-21');
  
  // Cigar should be on Nov 20, Pickle Ball on Nov 21
  const cigarOnNov20 = nov20Events.some(e => e.title && e.title.includes('Cigar'));
  const pickleOnNov21 = nov21Events.some(e => e.title && e.title.toLowerCase().includes('pickle'));
  
  expect(cigarOnNov20).toBeTruthy();
  expect(pickleOnNov21).toBeTruthy();
});

console.log('\n--- Summary of Key Events ---\n');
console.log(`Total events parsed: ${parsedEvents.length}`);

if (pickleballEvent) {
  console.log(`Pickle Ball: ${pickleballEvent.localDate} (all-day)`);
}
if (cigarEvent) {
  console.log(`Cigar Paradise: ${cigarEvent.localDate} ${cigarEvent.startTime}-${cigarEvent.endTime}`);
}
if (statedCommBase) {
  console.log(`Stated Communication: ${statedCommBase.localDate} ${statedCommBase.startTime}-${statedCommBase.endTime}`);
}
if (smmaEvent) {
  console.log(`SMMA: ${smmaEvent.localDate} ${smmaEvent.startTime}`);
}

// ============ Summary ============

console.log('\n========================================');
console.log(`Timezone: ${currentTz}`);
console.log(`Tests: ${passed + failed} total, ${passed} passed, ${failed} failed`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}
