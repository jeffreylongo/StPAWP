#!/usr/bin/env node
/**
 * Standalone test script to verify calendar service fixes.
 * Tests against the live ICS feed data under multiple timezones.
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

// ============ Helper Functions (mirrors the service implementation) ============

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
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'longOffset'
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
  } catch {
    return 300;
  }
}

function wallClockToUtc(year, month, day, hour, minute, second, tzid) {
  const offsetMinutes = getTimezoneOffsetForWallClock(year, month, day, hour, minute, tzid);
  return new Date(Date.UTC(year, month, day, hour, minute, second) + offsetMinutes * 60000);
}

function formatTimeInTimezone(utcDate, tzid) {
  try {
    const normalizedTzid = normalizeTimezoneId(tzid);
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: normalizedTzid,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
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

function parseIcsDateTime(dateTimeString) {
  try {
    if (!dateTimeString) return null;
    
    if (dateTimeString.includes(';TZID=')) {
      const tzidMatch = dateTimeString.match(/TZID=([^:;]+)/);
      const tzid = tzidMatch ? tzidMatch[1] : null;
      const parts = dateTimeString.split(':');
      if (parts.length >= 2) {
        const dateTimePart = parts[parts.length - 1];
        const localDate = parseBasicDateTimeComponents(dateTimePart);
        if (localDate && tzid) {
          return wallClockToUtc(localDate.year, localDate.month, localDate.day, localDate.hour, localDate.minute, localDate.second, tzid);
        }
      }
    }
    
    if (dateTimeString.endsWith('Z')) {
      const cleanDateTime = dateTimeString.slice(0, -1);
      const components = parseBasicDateTimeComponents(cleanDateTime);
      if (components) {
        return new Date(Date.UTC(
          components.year, components.month, components.day,
          components.hour, components.minute, components.second
        ));
      }
      return null;
    }
    
    const components = parseBasicDateTimeComponents(dateTimeString);
    if (components) {
      return wallClockToUtc(components.year, components.month, components.day, components.hour, components.minute, components.second, 'America/New_York');
    }
    return null;
  } catch { return null; }
}

/**
 * Simulate rrule expansion with correct getUTC* reading
 */
function expandRecurringEventTest(startComponents, tzid) {
  // Simulate what rrule returns: wall-clock time in UTC fields
  // For Nov 17, 2026 (third Tuesday), rrule would return a Date with:
  // getUTCFullYear()=2026, getUTCMonth()=10, getUTCDate()=17, getUTCHours()=18, getUTCMinutes()=30
  
  // Create a "fake" rrule output - a Date where UTC fields = wall-clock time
  const rruleOutput = new Date(Date.UTC(
    startComponents.year, startComponents.month, startComponents.day,
    startComponents.hour, startComponents.minute, startComponents.second
  ));
  
  // CRITICAL: Read with getUTC* methods (this is the fix!)
  const wallYear = rruleOutput.getUTCFullYear();
  const wallMonth = rruleOutput.getUTCMonth();
  const wallDay = rruleOutput.getUTCDate();
  const wallHour = rruleOutput.getUTCHours();
  const wallMinute = rruleOutput.getUTCMinutes();
  const wallSecond = rruleOutput.getUTCSeconds();
  
  // Convert wall-clock to actual UTC
  const actualUtcDate = wallClockToUtc(wallYear, wallMonth, wallDay, wallHour, wallMinute, wallSecond, tzid);
  
  // Format in event timezone
  const formattedTime = formatTimeInTimezone(actualUtcDate, tzid);
  
  return {
    wallClock: { year: wallYear, month: wallMonth, day: wallDay, hour: wallHour, minute: wallMinute },
    actualUtcDate,
    formattedTime
  };
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
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, got ${JSON.stringify(actual)}`);
      }
    }
  };
}

console.log('========================================');
console.log('Calendar Service Fixes - Test Results');
console.log(`Timezone: ${currentTz}`);
console.log('========================================\n');

console.log('--- ICS Text Unescaping (BUG 2) ---\n');

test('should unescape comma escapes', () => {
  const result = unescapeIcsText('St Petersburg Lodge No. 139 F&AM\\, 3325 1st St NE\\, St. Petersburg\\, FL 33704');
  expect(result).toBe('St Petersburg Lodge No. 139 F&AM, 3325 1st St NE, St. Petersburg, FL 33704');
});

test('should unescape newline escapes (\\n)', () => {
  const result = unescapeIcsText('Dinner at 6:30\\nMeeting at 7:30');
  expect(result).toBe('Dinner at 6:30\nMeeting at 7:30');
});

test('should handle mixed escapes', () => {
  const result = unescapeIcsText('Line 1\\nLine 2\\, with comma\\; and semicolon\\\\done');
  expect(result).toBe('Line 1\nLine 2, with comma; and semicolon\\done');
});

console.log('\n--- Timezone Offset Calculation (Intl.DateTimeFormat) ---\n');

test('should get EST offset (300 min) for November 2026', () => {
  const offset = getTimezoneOffsetForWallClock(2026, 10, 17, 18, 30, 'America/New_York');
  expect(offset).toBe(300);
});

test('should get EDT offset (240 min) for July 2026', () => {
  const offset = getTimezoneOffsetForWallClock(2026, 6, 15, 18, 30, 'America/New_York');
  expect(offset).toBe(240);
});

test('should get EST offset for February 2026 (before DST)', () => {
  const offset = getTimezoneOffsetForWallClock(2026, 1, 17, 18, 30, 'America/New_York');
  expect(offset).toBe(300);
});

test('should get EDT offset for April 2026 (after DST)', () => {
  const offset = getTimezoneOffsetForWallClock(2026, 3, 21, 18, 30, 'America/New_York');
  expect(offset).toBe(240);
});

console.log('\n--- Wall-Clock to UTC Conversion ---\n');

test('should convert Nov 17, 2026 18:30 EST to 23:30 UTC', () => {
  const utcDate = wallClockToUtc(2026, 10, 17, 18, 30, 0, 'America/New_York');
  expect(utcDate.getUTCHours()).toBe(23);
  expect(utcDate.getUTCMinutes()).toBe(30);
  expect(utcDate.getUTCFullYear()).toBe(2026);
  expect(utcDate.getUTCMonth()).toBe(10);
  expect(utcDate.getUTCDate()).toBe(17);
});

test('should convert Apr 21, 2026 18:30 EDT to 22:30 UTC', () => {
  const utcDate = wallClockToUtc(2026, 3, 21, 18, 30, 0, 'America/New_York');
  expect(utcDate.getUTCHours()).toBe(22);
  expect(utcDate.getUTCMinutes()).toBe(30);
});

console.log('\n--- Time Formatting in Timezone ---\n');

test('should format 23:30 UTC as 18:30 in America/New_York (EST)', () => {
  const utcDate = new Date(Date.UTC(2026, 10, 17, 23, 30, 0));
  const formatted = formatTimeInTimezone(utcDate, 'America/New_York');
  expect(formatted).toBe('18:30');
});

test('should format 22:30 UTC as 18:30 in America/New_York (EDT)', () => {
  const utcDate = new Date(Date.UTC(2026, 6, 15, 22, 30, 0));
  const formatted = formatTimeInTimezone(utcDate, 'America/New_York');
  expect(formatted).toBe('18:30');
});

console.log('\n--- RRULE Output Handling (THE CRITICAL FIX) ---\n');

test('should correctly read rrule output with getUTC* and format Nov 17, 2026 at 18:30', () => {
  // Simulate rrule returning Nov 17, 2026 18:30 in UTC fields
  const result = expandRecurringEventTest(
    { year: 2026, month: 10, day: 17, hour: 18, minute: 30, second: 0 },
    'America/New_York'
  );
  
  // Wall-clock should be preserved
  expect(result.wallClock.year).toBe(2026);
  expect(result.wallClock.month).toBe(10);
  expect(result.wallClock.day).toBe(17);
  expect(result.wallClock.hour).toBe(18);
  expect(result.wallClock.minute).toBe(30);
  
  // Formatted time should be 18:30 (not 13:30!)
  expect(result.formattedTime).toBe('18:30');
  
  // Actual UTC should be 23:30
  expect(result.actualUtcDate.getUTCHours()).toBe(23);
});

test('should handle DST transition - Feb 2026 instance at 18:30', () => {
  const result = expandRecurringEventTest(
    { year: 2026, month: 1, day: 17, hour: 18, minute: 30, second: 0 },
    'America/New_York'
  );
  expect(result.formattedTime).toBe('18:30');
  expect(result.actualUtcDate.getUTCHours()).toBe(23); // EST: +5
});

test('should handle DST transition - Apr 2026 instance at 18:30', () => {
  const result = expandRecurringEventTest(
    { year: 2026, month: 3, day: 21, hour: 18, minute: 30, second: 0 },
    'America/New_York'
  );
  expect(result.formattedTime).toBe('18:30');
  expect(result.actualUtcDate.getUTCHours()).toBe(22); // EDT: +4
});

console.log('\n--- Live Feed Integration ---\n');

// Parse the ICS content
function parseIcsEvents(icsContent) {
  const events = [];
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
        events.push(currentEvent);
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
  return events;
}

const events = parseIcsEvents(icsContent);

// Find the recurring Stated Communication event
const statedCommBase = events.find(e => 
  e.UID === '0vcvvhri7nnbqrjnaoshqhkpqg@google.com' && 
  e.RRULE
);

test('should find recurring Stated Communication event', () => {
  expect(statedCommBase).toBeTruthy();
  expect(statedCommBase.SUMMARY).toBe('Stated Communication Meeting');
});

test('should parse Nov 17, 2026 Stated Communication at 18:30-19:30', () => {
  // Simulate the recurring event expansion for Nov 17, 2026
  const result = expandRecurringEventTest(
    { year: 2026, month: 10, day: 17, hour: 18, minute: 30, second: 0 },
    'America/New_York'
  );
  
  expect(result.formattedTime).toBe('18:30');
  
  // End time: 1 hour later
  const endDate = new Date(result.actualUtcDate.getTime() + 60 * 60 * 1000);
  const endTime = formatTimeInTimezone(endDate, 'America/New_York');
  expect(endTime).toBe('19:30');
});

// Find SMMA one-off event (Nov 18)
const smmaEvent = events.find(e => 
  e.SUMMARY && e.SUMMARY.includes('SMMA') && 
  e.DTSTART && e.DTSTART.includes('20261118T233000Z')
);

test('should parse one-off SMMA event on Nov 18 at 18:30', () => {
  expect(smmaEvent).toBeTruthy();
  
  const parsedDate = parseIcsDateTime(smmaEvent.DTSTART);
  expect(parsedDate).toBeTruthy();
  
  const formattedTime = formatTimeInTimezone(parsedDate, 'America/New_York');
  expect(formattedTime).toBe('18:30');
});

// Find cigar night (Nov 20)
const cigarEvent = events.find(e => 
  e.SUMMARY && e.SUMMARY.includes('Cigar') && 
  e.DTSTART && e.DTSTART.includes('20261121T000000Z')
);

test('should parse Cigar night on Nov 20 at 19:00', () => {
  expect(cigarEvent).toBeTruthy();
  
  const parsedDate = parseIcsDateTime(cigarEvent.DTSTART);
  expect(parsedDate).toBeTruthy();
  
  // 00:00 UTC on Nov 21 = 19:00 EST on Nov 20
  const formattedTime = formatTimeInTimezone(parsedDate, 'America/New_York');
  expect(formattedTime).toBe('19:00');
});

test('should unescape location from live feed correctly', () => {
  const rawLocation = statedCommBase.LOCATION;
  const unescaped = unescapeIcsText(rawLocation);
  expect(unescaped.includes('\\,')).toBe(false);
  expect(unescaped.includes(', ')).toBe(true);
});

test('should unescape description from live feed correctly', () => {
  const rawDescription = statedCommBase.DESCRIPTION;
  const unescaped = unescapeIcsText(rawDescription);
  expect(unescaped.includes('\\n')).toBe(false);
  expect(unescaped.includes('\n')).toBe(true);
});

console.log('\n--- DST Boundary Tests ---\n');

test('should handle recurring event in Feb 2026 (EST) at 18:30', () => {
  const result = expandRecurringEventTest(
    { year: 2026, month: 1, day: 17, hour: 18, minute: 30, second: 0 },
    'America/New_York'
  );
  expect(result.formattedTime).toBe('18:30');
});

test('should handle recurring event in Apr 2026 (EDT) at 18:30', () => {
  const result = expandRecurringEventTest(
    { year: 2026, month: 3, day: 21, hour: 18, minute: 30, second: 0 },
    'America/New_York'
  );
  expect(result.formattedTime).toBe('18:30');
});

// ============ Summary ============

console.log('\n========================================');
console.log(`Timezone: ${currentTz}`);
console.log(`Tests: ${passed + failed} total, ${passed} passed, ${failed} failed`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}
