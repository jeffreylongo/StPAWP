import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, from, combineLatest } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { format, parseISO, isAfter, isBefore, addDays, addMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { CalendarEvent, CalendarSource, CalendarSyncResult, ICalendarEvent } from '../interfaces';

export interface EventStorage {
  events: CalendarEvent[];
  lastSync: Date;
  expiresAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private lastSyncSubject = new BehaviorSubject<Date | null>(null);

  public events$ = this.eventsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public lastSync$ = this.lastSyncSubject.asObservable();

  // Event storage for caching - optimized for 6 months of data
  private readonly STORAGE_KEY = 'stpete_lodge_calendar_events';
  private readonly CACHE_DURATION_HOURS = 12; // Cache for 12 hours (6 months of data needs longer cache)
  private readonly EVENT_RANGE_MONTHS = 6; // Load 6 months of events

  // Calendar sources for St. Petersburg Lodge
  private calendarSources: CalendarSource[] = [
    {
      id: 1,
      name: 'St. Petersburg Lodge #139',
      url: 'https://calendar.google.com/calendar/ical/stpetersburglodge139%40gmail.com/public/basic.ics',
      isActive: true,
      color: '#1a4b8f',
      description: 'Official St. Petersburg Lodge No. 139 calendar'
    },
    {
      id: 2,
      name: 'Suncoast Master Mason Association',
      url: 'https://localendar.com/public/MastersAndWardens?style=X2',
      isActive: true,
      color: '#c6a84a',
      description: 'Suncoast Master Mason Association events'
    },
    {
      id: 3,
      name: 'Tampa Scottish Rite',
      url: 'https://tampascottishrite.org/events/{YEAR}-{MONTH}/?ical=1',
      isActive: true,
      color: '#8B4513',
      description: 'Ancient Accepted Scottish Rite - Valley of Tampa events',
      requiresMultipleMonths: true // Flag to indicate this source needs multiple month fetches
    }
  ];

  constructor(private http: HttpClient) {
    // Check for cached data first
    const cachedData = this.loadCachedEvents();
    if (cachedData && cachedData.events.length > 0) {
      console.log(`📦 Loaded ${cachedData.events.length} cached events from ${cachedData.lastSync}`);
      this.eventsSubject.next(cachedData.events);
      this.lastSyncSubject.next(cachedData.lastSync);
      
      // Check if cache is still valid
      if (new Date() > cachedData.expiresAt) {
        console.log('⏰ Cache expired, syncing fresh data...');
        this.syncCalendarEvents().subscribe();
      }
    } else {
      // No cache, try to sync fresh data
      console.log('🔄 No cache found, syncing fresh data...');
      this.syncCalendarEvents().subscribe({
        next: (result) => {
          console.log('✅ Initial calendar sync result:', result);
        },
        error: (error) => {
          console.error('❌ Initial calendar sync failed:', error);
          this.loadEnhancedMockEvents();
        }
      });
    }
  }

  /**
   * Get all calendar events
   */
  getEvents(): Observable<CalendarEvent[]> {
    return this.events$;
  }

  /**
   * Get events for a specific calendar
   */
  getEventsByCalendar(calendarId: number): Observable<CalendarEvent[]> {
    return this.events$.pipe(
      map(events => events.filter(event => event.calendarId === calendarId))
    );
  }

  /**
   * Get upcoming events (next N days)
   */
  getUpcomingEvents(days: number = 180): Observable<CalendarEvent[]> {
    // Start from beginning of today and look ahead specified days (default 6 months)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    const futureDate = addDays(today, days);
    
    console.log(`🗓️ Looking for upcoming events from ${today.toDateString()} to ${futureDate.toDateString()} (${days} days)`);
    
    return this.events$.pipe(
      map(events => {
        console.log(`📊 Total events available: ${events.length}`);
        
        const upcomingEvents = events
          .filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0); // Normalize to start of day for comparison
            return eventDate >= today && eventDate <= futureDate;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
        console.log(`📅 Upcoming events (${days} days): ${upcomingEvents.length} total`);
        console.log(`  🏛️ Lodge: ${upcomingEvents.filter(e => e.calendarId === 1).length}`);
        console.log(`  🤝 SMMA: ${upcomingEvents.filter(e => e.calendarId === 2).length}`);
        console.log(`  🏴󠁧󠁢󠁳󠁣󠁴󠁿 AASR: ${upcomingEvents.filter(e => e.calendarId === 3).length}`);
        
        return upcomingEvents;
      })
    );
  }

  /**
   * Get events for a specific month
   */
  getEventsForMonth(year: number, month: number): Observable<CalendarEvent[]> {
    const startOfMonthDate = startOfMonth(new Date(year, month, 1));
    const endOfMonthDate = endOfMonth(new Date(year, month, 1));
    
    return this.events$.pipe(
      map(events => events
        .filter(event => {
          const eventDate = new Date(event.date);
          return isWithinInterval(eventDate, {
            start: startOfMonthDate,
            end: endOfMonthDate
          });
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      )
    );
  }

  /**
   * Get events for a date range
   */
  getEventsForDateRange(startDate: Date, endDate: Date): Observable<CalendarEvent[]> {
    return this.events$.pipe(
      map(events => events
        .filter(event => {
          const eventDate = new Date(event.date);
          return isWithinInterval(eventDate, {
            start: startDate,
            end: endDate
          });
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      )
    );
  }

  /**
   * Get next 6 months of events (optimized for pagination)
   */
  getNext6MonthsEvents(): Observable<CalendarEvent[]> {
    return this.getUpcomingEvents(180); // 6 months ≈ 180 days
  }

  /**
   * Sync calendar events from ICS sources
   */
  syncCalendarEvents(): Observable<CalendarSyncResult> {
    this.loadingSubject.next(true);
    
    // Try to fetch from ICS sources using CORS proxy
    return this.fetchFromIcsSources().pipe(
      catchError(error => {
        console.error('Calendar sync failed:', error);
        // Fallback to enhanced mock data that simulates real events
        this.loadEnhancedMockEvents();
        return of({
          success: false,
          eventsCount: this.eventsSubject.value.length,
          message: 'Using sample calendar data (ICS sync requires backend proxy)',
          errors: [error.message]
        });
      })
    );
  }

  /**
   * Fetch calendar data from ICS sources
   */
  private fetchFromIcsSources(): Observable<CalendarSyncResult> {
    const activeSources = this.calendarSources.filter(source => source.isActive);
    
    console.log(`🔄 Starting sync from ${activeSources.length} active calendar sources...`);
    
    if (activeSources.length === 0) {
      this.loadingSubject.next(false);
      return of({
        success: false,
        eventsCount: 0,
        message: 'No active calendar sources configured',
        errors: ['No active calendar sources']
      });
    }

    // Create observables for each source with error handling
    const sourceObservables = activeSources.map(source => 
      this.fetchIcsFromSource(source).pipe(
        tap(events => console.log(`📥 Fetched ${events.length} events from ${source.name}`)),
        catchError(error => {
          console.error(`❌ Error fetching from ${source.name}:`, error);
          return of([]); // Return empty array on error, don't break the entire sync
        })
      )
    );

    // Use combineLatest to wait for all sources to complete
    return combineLatest(sourceObservables).pipe(
      map(results => {
        const allEvents: CalendarEvent[] = [];
        let totalEvents = 0;
        const errors: string[] = [];

        results.forEach((events, index) => {
          if (events && events.length > 0) {
            allEvents.push(...events);
            totalEvents += events.length;
            console.log(`Loaded ${events.length} events from ${activeSources[index].name}`);
          } else {
            const errorMsg = `No events loaded from ${activeSources[index].name}`;
            console.warn(errorMsg);
            errors.push(errorMsg);
          }
        });

        // Update the events subject with real data
        this.eventsSubject.next(allEvents);
        this.lastSyncSubject.next(new Date());
        this.loadingSubject.next(false);
        
        // Save to cache for future use
        if (allEvents.length > 0) {
          this.saveEventsToCache(allEvents);
        }

        const message = totalEvents > 0 ? 
          `Successfully synced ${totalEvents} events from ${activeSources.length} calendar(s)` :
          'No events found in calendar sources';
          
        console.log(`📅 Calendar sync result: ${message}`);

        return {
          success: totalEvents > 0,
          eventsCount: totalEvents,
          message,
          errors: errors.length > 0 ? errors : undefined
        };
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        throw error;
      })
    );
  }

  /**
   * Fetch ICS data from a single source using CORS proxy
   */
  private fetchIcsFromSource(source: CalendarSource): Observable<CalendarEvent[]> {
    // Handle AASR calendar which requires multiple month URLs
    if (source.requiresMultipleMonths) {
      return this.fetchMultipleMonthsFromSource(source);
    }

    // Regular single URL fetch
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    const proxiedUrl = proxyUrl + encodeURIComponent(source.url);
    
    console.log(`🌐 Fetching ICS data from ${source.name}...`);
    console.log(`📡 Proxy URL: ${proxiedUrl}`);

    return this.http.get(proxiedUrl, { 
      responseType: 'text',
      headers: {
        'Accept': 'text/calendar, text/plain, */*'
      }
    }).pipe(
      tap(icsData => {
        console.log(`📄 Received ICS data from ${source.name} (${icsData?.length || 0} characters)`);
      }),
      map(icsData => {
        const events = this.parseIcsData(icsData, source);
        console.log(`🎯 Parsed ${events.length} events from ${source.name}`);
        return events;
      }),
      catchError(error => {
        console.error(`❌ Failed to fetch calendar from ${source.name}:`, error);
        console.error(`📡 Attempted URL: ${proxiedUrl}`);
        // Return empty array on error, don't fail the entire sync
        return of([]);
      })
    );
  }

  /**
   * Load events from API (after sync)
   */
  private loadEventsFromApi(): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>('/api/calendar/events').pipe(
      map(events => {
        this.eventsSubject.next(events);
        this.lastSyncSubject.next(new Date());
        this.loadingSubject.next(false);
        return events;
      }),
      catchError(error => {
        console.error('Failed to load events from API:', error);
        this.loadingSubject.next(false);
        return of([]);
      })
    );
  }

  /**
   * Fetch multiple months from a source (used for AASR calendar)
   */
  private fetchMultipleMonthsFromSource(source: CalendarSource): Observable<CalendarEvent[]> {
    const today = new Date();
    const months: Observable<CalendarEvent[]>[] = [];
    
    // Fetch 6 months of data starting from current month
    for (let i = 0; i < 6; i++) {
      const targetDate = addMonths(today, i);
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      
      const monthUrl = source.url
        .replace('{YEAR}', year.toString())
        .replace('{MONTH}', month);
      
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const proxiedUrl = proxyUrl + encodeURIComponent(monthUrl);
      
      console.log(`🗓️ Fetching ${source.name} for ${year}-${month}...`);
      
      const monthObservable = this.http.get(proxiedUrl, { 
        responseType: 'text',
        headers: {
          'Accept': 'text/calendar, text/plain, */*'
        }
      }).pipe(
        map(icsData => {
          const events = this.parseIcsData(icsData, source);
          console.log(`📅 ${source.name} ${year}-${month}: ${events.length} events`);
          return events;
        }),
        catchError(error => {
          console.error(`❌ Error fetching ${source.name} for ${year}-${month}:`, error);
          return of([]);
        })
      );
      
      months.push(monthObservable);
    }

    // Combine all months and flatten the results
    return combineLatest(months).pipe(
      map(monthResults => {
        const allEvents = monthResults.flat();
        // Remove duplicates based on UID if present
        const uniqueEvents = allEvents.filter((event, index, self) => 
          event.uid ? 
            index === self.findIndex(e => e.uid === event.uid) :
            index === self.findIndex(e => e.title === event.title && e.date === event.date)
        );
        console.log(`🎯 ${source.name}: Combined ${uniqueEvents.length} unique events from 6 months (${allEvents.length} total before dedup)`);
        return uniqueEvents;
      })
    );
  }

  /**
   * Parse ICS data into CalendarEvent objects
   */
  private parseIcsData(icsContent: string, source: CalendarSource): CalendarEvent[] {
    try {
      console.log(`Parsing ICS data from ${source.name}...`);
      
      if (!icsContent || typeof icsContent !== 'string') {
        console.error('Invalid ICS content received');
        return [];
      }

      const events: CalendarEvent[] = [];
      const lines = icsContent.split(/\r?\n/);
      let currentEvent: any = null;
      let isInEvent = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === 'BEGIN:VEVENT') {
          isInEvent = true;
          currentEvent = {};
          continue;
        }
        
        if (line === 'END:VEVENT' && isInEvent) {
          if (currentEvent && currentEvent.DTSTART && currentEvent.SUMMARY) {
            const calendarEvent = this.convertIcsEventToCalendarEvent(currentEvent, source);
            if (calendarEvent) {
              events.push(calendarEvent);
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
          
          // Handle multi-line properties
          if (property.includes(';')) {
            const mainProperty = property.split(';')[0];
            currentEvent[mainProperty] = value;
          } else {
            currentEvent[property] = value;
          }
        }
      }

      console.log(`Parsed ${events.length} events from ${source.name}`);
      return events;
    } catch (error) {
      console.error(`Error parsing ICS content from ${source.name}:`, error);
      return [];
    }
  }

  /**
   * Convert ICS event object to CalendarEvent
   */
  private convertIcsEventToCalendarEvent(icsEvent: any, source: CalendarSource): CalendarEvent | null {
    try {
      // Parse the date/time
      const startDate = this.parseIcsDateTime(icsEvent.DTSTART);
      if (!startDate) {
        console.warn('Could not parse start date for event:', icsEvent.SUMMARY);
        return null;
      }

      const endDate = icsEvent.DTEND ? this.parseIcsDateTime(icsEvent.DTEND) : startDate;
      
      // Generate a numeric ID from the UID
      const id = icsEvent.UID ? this.hashStringToNumber(icsEvent.UID) : Math.random() * 1000000;
      
      // Determine event type based on summary
      const type = this.determineEventType(icsEvent.SUMMARY);
      
      return {
        id: Math.floor(id),
        title: icsEvent.SUMMARY || 'Untitled Event',
        date: startDate,
        startTime: format(startDate, 'HH:mm'),
        endTime: endDate ? format(endDate, 'HH:mm') : format(new Date(startDate.getTime() + 60 * 60 * 1000), 'HH:mm'),
        location: icsEvent.LOCATION || source.name,
        description: icsEvent.DESCRIPTION || '',
        type,
        calendarId: source.id,
        calendarName: source.name,
        uid: icsEvent.UID || `generated-${id}`,
        isRecurring: !!icsEvent.RRULE
      };
    } catch (error) {
      console.error('Error converting ICS event:', error, icsEvent);
      return null;
    }
  }

  /**
   * Parse ICS date/time format
   */
  private parseIcsDateTime(dateTimeString: string): Date | null {
    try {
      if (!dateTimeString) return null;
      
      console.log('Parsing date:', dateTimeString);
      
      // Handle timezone format: DTSTART;TZID=America/New_York:20080728T183000
      if (dateTimeString.includes(';TZID=')) {
        const parts = dateTimeString.split(':');
        if (parts.length >= 2) {
          const dateTimePart = parts[parts.length - 1]; // Get the actual datetime part
          return this.parseBasicDateTime(dateTimePart);
        }
      }
      
      // Handle UTC format: 20250305T003000Z
      if (dateTimeString.endsWith('Z')) {
        const cleanDateTime = dateTimeString.slice(0, -1); // Remove Z
        const utcDate = this.parseBasicDateTime(cleanDateTime);
        if (utcDate) {
          // Convert from UTC to local time
          return new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));
        }
        return utcDate;
      }
      
      // Handle basic format: 20250305T003000
      return this.parseBasicDateTime(dateTimeString);
      
    } catch (error) {
      console.error('Error parsing ICS date/time:', dateTimeString, error);
      return null;
    }
  }

  /**
   * Parse basic ICS datetime format: YYYYMMDDTHHMMSS
   */
  private parseBasicDateTime(dateTimeString: string): Date | null {
    try {
      const cleanDateTime = dateTimeString.replace(/[^0-9T]/g, '');
      
      // Handle different ICS date formats
      if (cleanDateTime.length === 8) {
        // Date only format: YYYYMMDD
        const year = parseInt(cleanDateTime.substring(0, 4));
        const month = parseInt(cleanDateTime.substring(4, 6)) - 1; // Month is 0-based
        const day = parseInt(cleanDateTime.substring(6, 8));
        return new Date(year, month, day);
      } else if (cleanDateTime.length >= 15 && cleanDateTime.includes('T')) {
        // DateTime format: YYYYMMDDTHHMMSS
        const datePart = cleanDateTime.substring(0, 8);
        const timePart = cleanDateTime.substring(9, 15);
        
        const year = parseInt(datePart.substring(0, 4));
        const month = parseInt(datePart.substring(4, 6)) - 1;
        const day = parseInt(datePart.substring(6, 8));
        const hour = parseInt(timePart.substring(0, 2));
        const minute = parseInt(timePart.substring(2, 4));
        const second = timePart.length >= 6 ? parseInt(timePart.substring(4, 6)) : 0;
        
        return new Date(year, month, day, hour, minute, second);
      }
      
      // Fallback: try to parse as ISO string
      return new Date(dateTimeString);
    } catch (error) {
      console.error('Error parsing basic date/time:', dateTimeString, error);
      return null;
    }
  }

  /**
   * Convert ICS event to CalendarEvent
   */
  private convertIcsToCalendarEvent(icsEvent: any, calendarId: number, calendarName: string): CalendarEvent {
    const startDate = new Date(icsEvent.startDate);
    const endDate = icsEvent.endDate ? new Date(icsEvent.endDate) : startDate;
    
    // Generate a numeric ID from the UID
    const id = this.hashStringToNumber(icsEvent.uid);
    
    // Determine event type based on summary
    const type = this.determineEventType(icsEvent.summary);
    
    return {
      id,
      title: icsEvent.summary,
      date: startDate,
      startTime: format(startDate, 'HH:mm'),
      endTime: format(endDate, 'HH:mm'),
      location: icsEvent.location || 'St. Petersburg Lodge No. 139',
      description: icsEvent.description || '',
      type,
      calendarId,
      calendarName,
      uid: icsEvent.uid,
      isRecurring: !!icsEvent.rrule
    };
  }

  /**
   * Determine event type from title
   */
  private determineEventType(title: string): CalendarEvent['type'] {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('dinner') || lowerTitle.includes('meal')) {
      return 'dinner';
    } else if (lowerTitle.includes('degree') || lowerTitle.includes('initiation') || lowerTitle.includes('passing') || lowerTitle.includes('raising')) {
      return 'degree';
    } else if (lowerTitle.includes('education') || lowerTitle.includes('lecture') || lowerTitle.includes('presentation')) {
      return 'education';
    } else if (lowerTitle.includes('meeting') || lowerTitle.includes('communication')) {
      return 'meeting';
    }
    
    return 'other';
  }

  /**
   * Hash string to number (for generating IDs)
   */
  private hashStringToNumber(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Load enhanced mock events (fallback with realistic data)
   */
  private loadEnhancedMockEvents(): void {
    const mockEvents = this.generateEnhancedMockEvents();
    this.eventsSubject.next(mockEvents);
    this.lastSyncSubject.next(new Date());
    this.loadingSubject.next(false);
  }

  /**
   * Load mock events (fallback)
   */
  private loadMockEvents(): void {
    const mockEvents = this.generateMockEvents();
    this.eventsSubject.next(mockEvents);
    this.loadingSubject.next(false);
  }

  /**
   * Generate enhanced mock events with realistic lodge activities
   */
  private generateEnhancedMockEvents(): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const today = new Date();

    // Generate realistic lodge events for the next 90 days
    const lodgeEvents = [
      { title: 'Stated Communication', type: 'meeting' as const, day: 21, time: '19:30', endTime: '21:30' },
      { title: 'Fellowship Dinner', type: 'dinner' as const, day: 21, time: '18:30', endTime: '19:15' },
      { title: 'EA Degree', type: 'degree' as const, day: 7, time: '19:00', endTime: '21:00' },
      { title: 'FC Degree', type: 'degree' as const, day: 14, time: '19:00', endTime: '21:00' },
      { title: 'MM Degree', type: 'degree' as const, day: 28, time: '19:00', endTime: '21:30' },
      { title: 'Masonic Education', type: 'education' as const, day: 10, time: '19:30', endTime: '21:00' },
      { title: 'Officer Practice', type: 'meeting' as const, day: 5, time: '19:00', endTime: '20:30' },
      { title: 'Lodge Cleanup Day', type: 'other' as const, day: 15, time: '09:00', endTime: '12:00' }
    ];

    const smmaEvents = [
      { title: 'SMMA Meeting', type: 'meeting' as const, day: 12, time: '19:00', endTime: '21:00' },
      { title: 'Masters & Wardens Workshop', type: 'education' as const, day: 26, time: '18:30', endTime: '21:00' },
      { title: 'SMMA Social Event', type: 'other' as const, day: 19, time: '18:00', endTime: '22:00' }
    ];

    // Generate events for the next 90 days
    for (let dayOffset = 0; dayOffset < 90; dayOffset++) {
      const currentDate = addDays(today, dayOffset);
      const dayOfMonth = currentDate.getDate();

      // Add lodge events
      lodgeEvents.forEach(eventTemplate => {
        if (dayOfMonth === eventTemplate.day) {
          events.push({
            id: this.hashStringToNumber(`lodge-${eventTemplate.title}-${currentDate.toISOString()}`),
            title: eventTemplate.title,
            date: currentDate,
            startTime: eventTemplate.time,
            endTime: eventTemplate.endTime,
            location: 'St. Petersburg Lodge No. 139',
            description: `${eventTemplate.title} - All Master Masons in good standing are welcome.`,
            type: eventTemplate.type,
            calendarId: 1,
            calendarName: 'St. Petersburg Lodge #139',
            uid: `lodge-${eventTemplate.title}-${currentDate.toISOString()}@stpetelodge139.org`
          });
        }
      });

      // Add SMMA events (less frequent)
      smmaEvents.forEach(eventTemplate => {
        if (dayOfMonth === eventTemplate.day && dayOffset % 30 === 0) { // Monthly events
          events.push({
            id: this.hashStringToNumber(`smma-${eventTemplate.title}-${currentDate.toISOString()}`),
            title: eventTemplate.title,
            date: currentDate,
            startTime: eventTemplate.time,
            endTime: eventTemplate.endTime,
            location: 'Various Locations',
            description: `${eventTemplate.title} - Suncoast Masters and Wardens Association event.`,
            type: eventTemplate.type,
            calendarId: 2,
            calendarName: 'Suncoast Masters & Wardens',
            uid: `smma-${eventTemplate.title}-${currentDate.toISOString()}@suncoastmw.org`
          });
        }
      });
    }

    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Generate mock events for testing
   */
  private generateMockEvents(): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const today = new Date();

    // St. Petersburg Lodge events
    const lodgeEvents = this.generateMockEventsForCalendar(1);
    events.push(...lodgeEvents);

    // Masters & Wardens events
    const mwEvents = this.generateMockEventsForCalendar(2);
    events.push(...mwEvents);

    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Generate mock events for a specific calendar
   */
  private generateMockEventsForCalendar(calendarId: number): CalendarEvent[] {
    const today = new Date();
    const events: CalendarEvent[] = [];
    const calendarSource = this.calendarSources.find(source => source.id === calendarId);
    
    if (!calendarSource) return events;

    // Generate events for the next 60 days
    for (let i = 1; i <= 60; i += 7) {
      const eventDate = addDays(today, i);
      
      if (calendarId === 1) {
        // St. Petersburg Lodge events
        if (i % 21 === 0) { // Every 3 weeks
          events.push({
            id: this.hashStringToNumber(`lodge-meeting-${i}`),
            title: 'Stated Communication',
            date: eventDate,
            startTime: '19:30',
            endTime: '21:30',
            location: 'St. Petersburg Lodge No. 139',
            description: 'Monthly stated communication for all Master Masons in good standing.',
            type: 'meeting',
            calendarId,
            calendarName: calendarSource.name,
            uid: `lodge-meeting-${i}@stpetelodge139.org`
          });
        }
        
        if (i % 14 === 0) { // Every 2 weeks
          events.push({
            id: this.hashStringToNumber(`lodge-dinner-${i}`),
            title: 'Fellowship Dinner',
            date: eventDate,
            startTime: '18:30',
            endTime: '20:30',
            location: 'Lodge Dining Hall',
            description: 'Monthly fellowship dinner before the stated communication.',
            type: 'dinner',
            calendarId,
            calendarName: calendarSource.name,
            uid: `lodge-dinner-${i}@stpetelodge139.org`
          });
        }
      } else if (calendarId === 2) {
        // Masters & Wardens events
        if (i % 28 === 0) { // Every 4 weeks
          events.push({
            id: this.hashStringToNumber(`mw-meeting-${i}`),
            title: 'Masters & Wardens Meeting',
            date: eventDate,
            startTime: '19:00',
            endTime: '21:00',
            location: 'Various Lodges',
            description: 'Monthly meeting of the Suncoast Masters and Wardens Association.',
            type: 'meeting',
            calendarId,
            calendarName: calendarSource.name,
            uid: `mw-meeting-${i}@suncoastmw.org`
          });
        }
      }
    }

    return events;
  }

  /**
   * Get calendar sources
   */
  getCalendarSources(): CalendarSource[] {
    return this.calendarSources;
  }

  /**
   * Update calendar source status
   */
  updateCalendarSource(calendarId: number, isActive: boolean): void {
    const source = this.calendarSources.find(source => source.id === calendarId);
    if (source) {
      source.isActive = isActive;
      // Re-sync if needed
      this.syncCalendarEvents().subscribe();
    }
  }

  /**
   * Save events to localStorage for caching
   */
  private saveEventsToCache(events: CalendarEvent[]): void {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (this.CACHE_DURATION_HOURS * 60 * 60 * 1000));
      
      const storage: EventStorage = {
        events,
        lastSync: now,
        expiresAt
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
      console.log(`Cached ${events.length} events, expires at ${expiresAt}`);
    } catch (error) {
      console.error('Failed to save events to cache:', error);
    }
  }

  /**
   * Load events from localStorage cache
   */
  private loadCachedEvents(): EventStorage | null {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY);
      if (!cached) return null;
      
      const storage: EventStorage = JSON.parse(cached);
      
      // Convert date strings back to Date objects
      storage.lastSync = new Date(storage.lastSync);
      storage.expiresAt = new Date(storage.expiresAt);
      storage.events = storage.events.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
      
      return storage;
    } catch (error) {
      console.error('Failed to load cached events:', error);
      return null;
    }
  }

  /**
   * Clear cached events
   */
  private clearCache(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('Calendar cache cleared');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Get events for current month (optimized for display)
   */
  getCurrentMonthEvents(): Observable<CalendarEvent[]> {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    return this.events$.pipe(
      map(events => events.filter(event => 
        isWithinInterval(new Date(event.date), { start: monthStart, end: monthEnd })
      ))
    );
  }

  /**
   * Get events for next N months
   */
  getNextMonthsEvents(months: number = 2): Observable<CalendarEvent[]> {
    const now = new Date();
    const futureDate = addDays(now, months * 30);
    
    return this.events$.pipe(
      map(events => events.filter(event => {
        const eventDate = new Date(event.date);
        return isAfter(eventDate, now) && isBefore(eventDate, futureDate);
      }))
    );
  }

  /**
   * Download calendar ICS file for a specific calendar source
   */
  downloadCalendarICS(calendarId: number): Observable<CalendarSyncResult> {
    const source = this.calendarSources.find(s => s.id === calendarId);
    if (!source) {
      return of({
        success: false,
        eventsCount: 0,
        message: 'Calendar source not found'
      });
    }

    try {
      // Create a download link for the ICS file
      const link = document.createElement('a');
      link.href = source.url;
      link.download = `${source.name.replace(/[^a-zA-Z0-9]/g, '_')}_calendar.ics`;
      link.target = '_blank';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return of({
        success: true,
        eventsCount: 0, // Download doesn't return event count
        message: `Downloading ${source.name} calendar...`
      });
    } catch (error) {
      console.error('Failed to download calendar:', error);
      return of({
        success: false,
        eventsCount: 0,
        message: 'Failed to download calendar file'
      });
    }
  }
}
