/**
 * Standalone test script to verify calendar service fixes
 * Tests against the live ICS feed data
 * 
 * Run with: node test-calendar-fixes.js
 */

const fs = require('fs');
const path = require('path');

// Read the saved ICS fixture
const icsPath = path.join(__dirname, 'test-fixtures/lodge-calendar.ics');
const icsContent = fs.readFileSync(icsPath, 'utf-8');

// ============ Helper Functions (copied from the service) ============

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

function getNthSunday(year, month, n) {
  const firstOfMonth = new Date(year, month, 1);
  const dayOfWeek = firstOfMonth.getDay();
  const firstSunday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  return firstSunday + (n - 1) * 7;
}

function getEasternOffset(year, month, day, hour) {
  const dstStart = getNthSunday(year, 2, 2);
  const dstEnd = getNthSunday(year, 10, 1);
  
  const dateValue = month * 10000 + day * 100 + hour;
  const dstStartValue = 2 * 10000 + dstStart * 100 + 2;
  const dstEndValue = 10 * 10000 + dstEnd * 100 + 2;
  
  if (dateValue >= dstStartValue && dateValue < dstEndValue) {
    return 240; // EDT
  }
  return 300; // EST
}

function getTimezoneOffset(c, tzid) {
  if (tzid === 'America/New_York' || tzid === 'US/Eastern' || tzid === 'Eastern') {
    return getEasternOffset(c.year, c.month, c.day, c.hour);
  }
  return 300;
}

function convertTimezoneToUtc(c, tzid) {
  const offsetMinutes = getTimezoneOffset(c, tzid);
  return new Date(Date.UTC(c.year, c.month, c.day, c.hour, c.minute, c.second) + offsetMinutes * 60000);
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
          return convertTimezoneToUtc(localDate, tzid);
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
      return convertTimezoneToUtc(components, 'America/New_York');
    }
    return null;
  } catch { return null; }
}

function formatTimeInTimezone(utcDate, tzid) {
  const utcHours = utcDate.getUTCHours();
  const utcMinutes = utcDate.getUTCMinutes();
  
  const components = {
    year: utcDate.getUTCFullYear(),
    month: utcDate.getUTCMonth(),
    day: utcDate.getUTCDate(),
    hour: utcHours,
    minute: utcMinutes,
    second: 0
  };
  
  const offsetMinutes = getTimezoneOffset(components, tzid);
  let totalMinutes = utcHours * 60 + utcMinutes - offsetMinutes;
  
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  if (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60;
  
  const localHours = Math.floor(totalMinutes / 60);
  const localMins = totalMinutes % 60;
  
  return `${String(localHours).padStart(2, '0')}:${String(localMins).padStart(2, '0')}`;
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
console.log('========================================\n');

console.log('--- BUG 2: ICS Text Unescaping ---\n');

test('should unescape comma escapes', () => {
  const result = unescapeIcsText('St Petersburg Lodge No. 139 F&AM\\, 3325 1st St NE\\, St. Petersburg\\, FL 33704');
  expect(result).toBe('St Petersburg Lodge No. 139 F&AM, 3325 1st St NE, St. Petersburg, FL 33704');
});

test('should unescape newline escapes (\\n)', () => {
  const result = unescapeIcsText('Dinner at 6:30\\nMeeting at 7:30');
  expect(result).toBe('Dinner at 6:30\nMeeting at 7:30');
});

test('should unescape uppercase newline escapes (\\N)', () => {
  const result = unescapeIcsText('Line 1\\NLine 2');
  expect(result).toBe('Line 1\nLine 2');
});

test('should unescape semicolon escapes', () => {
  const result = unescapeIcsText('Note\\; important');
  expect(result).toBe('Note; important');
});

test('should unescape backslash escapes', () => {
  const result = unescapeIcsText('Path\\\\to\\\\file');
  expect(result).toBe('Path\\to\\file');
});

test('should handle mixed escapes', () => {
  const result = unescapeIcsText('Line 1\\nLine 2\\, with comma\\; and semicolon\\\\done');
  expect(result).toBe('Line 1\nLine 2, with comma; and semicolon\\done');
});

console.log('\n--- BUG 1: Timezone Handling ---\n');

test('should calculate EST offset (UTC-5) for January 15, 2026', () => {
  const components = { year: 2026, month: 0, day: 15, hour: 18, minute: 30, second: 0 };
  const offset = getTimezoneOffset(components, 'America/New_York');
  expect(offset).toBe(300);
});

test('should calculate EDT offset (UTC-4) for July 15, 2026', () => {
  const components = { year: 2026, month: 6, day: 15, hour: 18, minute: 30, second: 0 };
  const offset = getTimezoneOffset(components, 'America/New_York');
  expect(offset).toBe(240);
});

test('should correctly identify DST start (second Sunday of March 2026)', () => {
  const beforeDst = { year: 2026, month: 2, day: 8, hour: 1, minute: 59, second: 0 };
  expect(getTimezoneOffset(beforeDst, 'America/New_York')).toBe(300);
  
  const afterDst = { year: 2026, month: 2, day: 8, hour: 3, minute: 0, second: 0 };
  expect(getTimezoneOffset(afterDst, 'America/New_York')).toBe(240);
});

test('should correctly identify DST end (first Sunday of November 2026)', () => {
  const beforeEnd = { year: 2026, month: 10, day: 1, hour: 1, minute: 0, second: 0 };
  expect(getTimezoneOffset(beforeEnd, 'America/New_York')).toBe(240);
  
  const afterEnd = { year: 2026, month: 10, day: 1, hour: 2, minute: 0, second: 0 };
  expect(getTimezoneOffset(afterEnd, 'America/New_York')).toBe(300);
});

console.log('\n--- DTSTART Parsing ---\n');

test('should parse TZID datetime for Nov 17, 2026 at 18:30 EST', () => {
  const dtstart = 'DTSTART;TZID=America/New_York:20261117T183000';
  const result = parseIcsDateTime(dtstart);
  
  expect(result).toBeTruthy();
  expect(result.getUTCFullYear()).toBe(2026);
  expect(result.getUTCMonth()).toBe(10);
  expect(result.getUTCDate()).toBe(17);
  expect(result.getUTCHours()).toBe(23); // 18:30 EST = 23:30 UTC
  expect(result.getUTCMinutes()).toBe(30);
});

test('should parse UTC datetime correctly', () => {
  const dtstart = '20261118T233000Z';
  const result = parseIcsDateTime(dtstart);
  
  expect(result).toBeTruthy();
  expect(result.getUTCFullYear()).toBe(2026);
  expect(result.getUTCMonth()).toBe(10);
  expect(result.getUTCDate()).toBe(18);
  expect(result.getUTCHours()).toBe(23);
  expect(result.getUTCMinutes()).toBe(30);
});

console.log('\n--- Time Formatting in Timezone ---\n');

test('should format 23:30 UTC as 18:30 EST (November)', () => {
  const utcDate = new Date(Date.UTC(2026, 10, 17, 23, 30, 0));
  const formatted = formatTimeInTimezone(utcDate, 'America/New_York');
  expect(formatted).toBe('18:30');
});

test('should format 22:30 UTC as 18:30 EDT (July)', () => {
  const utcDate = new Date(Date.UTC(2026, 6, 15, 22, 30, 0));
  const formatted = formatTimeInTimezone(utcDate, 'America/New_York');
  expect(formatted).toBe('18:30');
});

console.log('\n--- Live Feed Integration ---\n');

// Parse the ICS content to find the recurring Stated Communication event
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

// Find the recurring Stated Communication event (UID: 0vcvvhri7nnbqrjnaoshqhkpqg)
const statedCommBase = events.find(e => 
  e.UID === '0vcvvhri7nnbqrjnaoshqhkpqg@google.com' && 
  e.RRULE
);

test('should find recurring Stated Communication event in live feed', () => {
  expect(statedCommBase).toBeTruthy();
  expect(statedCommBase.SUMMARY).toBe('Stated Communication Meeting');
  expect(statedCommBase.RRULE).toBe('FREQ=MONTHLY;BYDAY=3TU');
});

test('should parse recurring event DTSTART with TZID correctly', () => {
  const fullDtstart = statedCommBase._fullDtstart;
  expect(fullDtstart.includes('TZID=America/New_York')).toBe(true);
  
  const parsedDate = parseIcsDateTime(fullDtstart);
  expect(parsedDate).toBeTruthy();
  
  // Jan 21, 2025 at 18:30 EST = 23:30 UTC
  expect(parsedDate.getUTCHours()).toBe(23);
  expect(parsedDate.getUTCMinutes()).toBe(30);
});

test('should correctly unescape location from live feed', () => {
  const rawLocation = statedCommBase.LOCATION;
  const unescaped = unescapeIcsText(rawLocation);
  expect(unescaped.includes('\\,')).toBe(false);
  expect(unescaped.includes(', ')).toBe(true);
});

test('should correctly unescape description from live feed', () => {
  const rawDescription = statedCommBase.DESCRIPTION;
  const unescaped = unescapeIcsText(rawDescription);
  expect(unescaped.includes('\\n')).toBe(false);
  expect(unescaped.includes('\n')).toBe(true);
});

// Find a one-off UTC event (SMMA on Nov 18)
const smmaEvent = events.find(e => 
  e.SUMMARY && e.SUMMARY.includes('SMMA') && 
  e.DTSTART && e.DTSTART.includes('20261118T233000Z')
);

test('should find SMMA one-off event in live feed', () => {
  expect(smmaEvent).toBeTruthy();
});

test('should parse one-off SMMA event at correct UTC time', () => {
  const parsedDate = parseIcsDateTime(smmaEvent.DTSTART);
  expect(parsedDate).toBeTruthy();
  expect(parsedDate.getUTCHours()).toBe(23);
  expect(parsedDate.getUTCMinutes()).toBe(30);
  
  // 23:30 UTC = 18:30 EST
  const formattedTime = formatTimeInTimezone(parsedDate, 'America/New_York');
  expect(formattedTime).toBe('18:30');
});

// Find cigar night
const cigarEvent = events.find(e => 
  e.SUMMARY && e.SUMMARY.includes('Cigar') && 
  e.DTSTART && e.DTSTART.includes('20261121T000000Z')
);

test('should find Cigar night event in live feed', () => {
  expect(cigarEvent).toBeTruthy();
});

test('should parse Cigar night at correct time (00:00 UTC = 19:00 EST prev day)', () => {
  const parsedDate = parseIcsDateTime(cigarEvent.DTSTART);
  expect(parsedDate).toBeTruthy();
  expect(parsedDate.getUTCHours()).toBe(0);
  expect(parsedDate.getUTCMinutes()).toBe(0);
  
  // 00:00 UTC on Nov 21 = 19:00 EST on Nov 20
  const formattedTime = formatTimeInTimezone(parsedDate, 'America/New_York');
  expect(formattedTime).toBe('19:00');
});

console.log('\n--- DST Transition Tests ---\n');

test('should handle recurring event across DST change (Feb to Apr 2026)', () => {
  // Feb 17, 2026 at 18:30 EST = 23:30 UTC
  const febDateTime = parseIcsDateTime('DTSTART;TZID=America/New_York:20260217T183000');
  expect(febDateTime.getUTCHours()).toBe(23);
  expect(formatTimeInTimezone(febDateTime, 'America/New_York')).toBe('18:30');
  
  // Apr 21, 2026 at 18:30 EDT = 22:30 UTC
  const aprDateTime = parseIcsDateTime('DTSTART;TZID=America/New_York:20260421T183000');
  expect(aprDateTime.getUTCHours()).toBe(22);
  expect(formatTimeInTimezone(aprDateTime, 'America/New_York')).toBe('18:30');
});

test('should handle Nov 17, 2026 Stated Communication at 18:30 EST', () => {
  // This is the specific bug case: Nov 17, 2026 is third Tuesday of November
  // Event at 18:30 EST should parse to 23:30 UTC
  const nov17DateTime = parseIcsDateTime('DTSTART;TZID=America/New_York:20261117T183000');
  
  expect(nov17DateTime.getUTCFullYear()).toBe(2026);
  expect(nov17DateTime.getUTCMonth()).toBe(10);
  expect(nov17DateTime.getUTCDate()).toBe(17);
  expect(nov17DateTime.getUTCHours()).toBe(23);
  expect(nov17DateTime.getUTCMinutes()).toBe(30);
  
  const formattedTime = formatTimeInTimezone(nov17DateTime, 'America/New_York');
  expect(formattedTime).toBe('18:30');
});

// ============ Summary ============

console.log('\n========================================');
console.log(`Tests: ${passed + failed} total, ${passed} passed, ${failed} failed`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}
