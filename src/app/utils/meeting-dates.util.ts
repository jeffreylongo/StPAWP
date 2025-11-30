/**
 * Utility functions for calculating meeting dates
 * St. Pete Lodge #139 meets on the third Tuesday of each month
 */

/**
 * Get the third Tuesday of a given month and year
 * @param year - The year
 * @param month - The month (0-11, where 0 = January)
 * @returns Date object for the third Tuesday
 */
export function getThirdTuesday(year: number, month: number): Date {
  // Start with the first day of the month
  const firstDay = new Date(year, month, 1);
  
  // Find the first Tuesday
  // getDay() returns 0-6 where 0=Sunday, 2=Tuesday
  const firstDayOfWeek = firstDay.getDay();
  const daysUntilTuesday = (2 - firstDayOfWeek + 7) % 7;
  const firstTuesday = 1 + daysUntilTuesday;
  
  // Third Tuesday is 14 days after first Tuesday
  const thirdTuesday = firstTuesday + 14;
  
  return new Date(year, month, thirdTuesday);
}

/**
 * Get the most recent third Tuesday (last meeting date)
 * @returns Date object for the most recent third Tuesday
 */
export function getLastMeetingDate(): Date {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Get this month's third Tuesday
  const thisMonthMeeting = getThirdTuesday(currentYear, currentMonth);
  
  // If today is before this month's meeting, return last month's meeting
  if (today < thisMonthMeeting) {
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return getThirdTuesday(lastMonthYear, lastMonth);
  }
  
  // Otherwise, return this month's meeting
  return thisMonthMeeting;
}

/**
 * Get the next third Tuesday (next meeting date)
 * @returns Date object for the next third Tuesday
 */
export function getNextMeetingDate(): Date {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Get this month's third Tuesday
  const thisMonthMeeting = getThirdTuesday(currentYear, currentMonth);
  
  // If today is before this month's meeting, return this month's meeting
  if (today < thisMonthMeeting) {
    return thisMonthMeeting;
  }
  
  // Otherwise, return next month's meeting
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  return getThirdTuesday(nextMonthYear, nextMonth);
}

/**
 * Format a date as "Month Day, Year" (e.g., "May 20, 2025")
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatMeetingDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format a date as "Day of week, Month Day - Time" (e.g., "Tuesday, June 17th - 7:30 PM")
 * @param date - The date to format
 * @param time - The time string (e.g., "7:30 PM")
 * @returns Formatted date and time string
 */
export function formatNextMeeting(date: Date, time: string = '7:30 PM'): string {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const day = date.getDate();
  
  // Add ordinal suffix (st, nd, rd, th)
  const ordinal = getOrdinalSuffix(day);
  
  return `${dayOfWeek}, ${month} ${day}${ordinal} - ${time}`;
}

/**
 * Get the ordinal suffix for a day number
 * @param day - The day number (1-31)
 * @returns The ordinal suffix (st, nd, rd, or th)
 */
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

