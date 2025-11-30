# Dynamic Meeting Dates

## Overview
St. Petersburg Lodge #139 meets on the **third Tuesday of every month** at 7:30 PM. The website now automatically calculates and displays the correct meeting dates without requiring manual updates.

## How It Works

### Automatic Date Calculation
The system automatically calculates:
- **Last Meeting Date**: The most recent third Tuesday (past meeting)
- **Next Meeting Date**: The upcoming third Tuesday (future meeting)

### Algorithm
1. Finds the first Tuesday of the month
2. Adds 14 days to get the third Tuesday
3. Compares with today's date to determine if it's past or future
4. Automatically adjusts when crossing month/year boundaries

### Files Involved

#### 1. `src/app/utils/meeting-dates.util.ts`
Contains the core logic for calculating meeting dates:
- `getThirdTuesday(year, month)` - Calculates third Tuesday of any month
- `getLastMeetingDate()` - Returns the most recent third Tuesday
- `getNextMeetingDate()` - Returns the upcoming third Tuesday
- `formatMeetingDate(date)` - Formats as "Month Day, Year"
- `formatNextMeeting(date, time)` - Formats as "Tuesday, Month Day - Time"

#### 2. `src/app/services/secretary-office.service.ts`
Uses the utility functions to populate meeting dates in the fallback data:
- Dynamically generates `lastMeeting.metadata.meeting_date`
- Dynamically generates `nextMeeting.metadata.next_meeting`
- Updates month names in titles automatically

#### 3. `src/app/pages/home/home.component.html`
Displays the dates on the home page:
- Line 184: Shows "Meeting Date: [Last Meeting]"
- Line 198: Shows "Next Meeting: [Next Meeting]"

## Example Output

### Current Behavior (as of November 30, 2025)
- **Last Meeting**: October 21, 2025 (third Tuesday of October)
- **Next Meeting**: Tuesday, November 18th - 7:30 PM (third Tuesday of November)

### After November 18, 2025
The system will automatically update to:
- **Last Meeting**: November 18, 2025
- **Next Meeting**: Tuesday, December 16th - 7:30 PM

## Maintenance
**No manual updates required!** The dates will automatically rotate forever based on the third Tuesday rule.

## Testing
Run the unit tests to verify the calculations:
```bash
ng test --include='**/meeting-dates.util.spec.ts'
```

The test suite includes:
- Verification of third Tuesday calculations for various months
- Date formatting validation
- Ordinal suffix handling (1st, 2nd, 3rd, 4th, etc.)
- Relationship validation (next meeting is always after last meeting)

## Benefits
1. ✅ No manual updates needed
2. ✅ Always accurate
3. ✅ Works indefinitely into the future
4. ✅ Handles month/year boundaries automatically
5. ✅ Consistent formatting across the site
6. ✅ Easy to maintain and extend

## Future Enhancements
If needed, the system can be extended to:
- Support different meeting schedules for different lodges
- Handle special/cancelled meetings
- Integrate with a calendar API for real-time updates
- Add timezone support for different regions

