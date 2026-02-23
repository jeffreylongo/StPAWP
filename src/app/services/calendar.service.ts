import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, combineLatest, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { format, addDays, addMonths, startOfMonth, endOfMonth, isWithinInterval, isSameDay } from 'date-fns';
import { RRule, RRuleSet, rrulestr } from 'rrule';
import { CalendarEvent, CalendarSource, CalendarSyncResult } from '../interfaces';

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
  private initialized = false;

  public events$ = this.eventsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public lastSync$ = this.lastSyncSubject.asObservable();

  private readonly STORAGE_KEY = 'stpete_lodge_calendar_events';
  private readonly CACHE_DURATION_HOURS = 12;

  // Calendar sources
  private calendarSources: CalendarSource[] = [
    {
      id: 1,
      name: 'St. Petersburg Lodge No. 139',
      url: 'https://calendar.google.com/calendar/ical/stpetersburglodge139%40gmail.com/public/basic.ics',
      isActive: true,
      color: '#1a4b8f',
      description: 'Official St. Petersburg Lodge No. 139 calendar'
    },
    {
      id: 2,
      name: 'Suncoast Master Mason Association',
      url: 'https://localendar.com/public/MastersAndWardens.ics',
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
      requiresMultipleMonths: true
    },
    {
      id: 4,
      name: 'Tampa York Rite Bodies',
      url: 'https://tampayorkritebodies.com/events/feed/?ical=1',
      isActive: true,
      color: '#2E8B57',
      description: 'Tampa York Rite Bodies events including Chapter, Council, and Commandery'
    }
  ];

  constructor(private http: HttpClient) {}

  /**
   * Initialize calendar - called on first access
   */
  private initializeIfNeeded(): void {
    if (this.initialized) return;
    
    this.initialized = true;
    this.loadingSubject.next(true);
    
    console.log('📅 Initializing calendar - loading real events from all sources...');
    
    // Load all calendars from real sources
    this.loadAllCalendars();
  }

  /**
   * Load all calendars progressively - real events only
   */
  private loadAllCalendars(): void {
    const allEvents: CalendarEvent[] = [];
    let loadedCount = 0;
    const activeSources = this.calendarSources.filter(s => s.isActive);
    const totalSources = activeSources.length;
    
    if (totalSources === 0) {
      this.loadingSubject.next(false);
      this.lastSyncSubject.next(new Date());
      return;
    }

    // Load Lodge calendar first (id=1), then others
    const sortedSources = [...activeSources].sort((a, b) => a.id === 1 ? -1 : b.id === 1 ? 1 : 0);

    sortedSources.forEach(source => {
      this.fetchIcsFromSource(source).subscribe({
        next: (events) => {
          loadedCount++;
          
          if (events?.length > 0) {
            console.log(`✅ ${loadedCount}/${totalSources} - Loaded ${events.length} events from ${source.name}`);
            allEvents.push(...events);
            // Update UI progressively as each calendar loads
            this.eventsSubject.next([...allEvents]);
          } else {
            console.log(`⚠️ ${loadedCount}/${totalSources} - No events from ${source.name}`);
          }
          
          if (loadedCount >= totalSources) {
            this.finishLoading(allEvents);
          }
        },
        error: (err) => {
          loadedCount++;
          console.warn(`❌ ${loadedCount}/${totalSources} - Failed to load ${source.name}:`, err);
          
          if (loadedCount >= totalSources) {
            this.finishLoading(allEvents);
          }
        }
      });
    });
  }

  /**
   * Finish loading and save cache
   */
  private finishLoading(events: CalendarEvent[]): void {
    console.log(`✅ All calendars loaded. Total: ${events.length} events`);
    this.loadingSubject.next(false);
    this.lastSyncSubject.next(new Date());
    this.saveEventsToCache(events);
  }

  /**
   * Get all calendar events
   */
  getEvents(): Observable<CalendarEvent[]> {
    this.initializeIfNeeded();
    return this.events$;
  }

  /**
   * Get events for a specific calendar
   */
  getEventsByCalendar(calendarId: number): Observable<CalendarEvent[]> {
    this.initializeIfNeeded();
    return this.events$.pipe(
      map(events => events.filter(event => event.calendarId === calendarId))
    );
  }

  /**
   * Get upcoming events (next N days)
   */
  getUpcomingEvents(days: number = 180): Observable<CalendarEvent[]> {
    this.initializeIfNeeded();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = addDays(today, days);
    
    return this.events$.pipe(
      map(events => {
        const upcomingEvents = events
          .filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            return eventDate >= today && eventDate <= futureDate;
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return upcomingEvents;
      })
    );
  }

  /**
   * Get events for a specific month
   */
  getEventsForMonth(year: number, month: number): Observable<CalendarEvent[]> {
    this.initializeIfNeeded();
    
    const monthDate = new Date(year, month, 1);
    const startOfMonthDate = startOfMonth(monthDate);
    const endOfMonthDate = endOfMonth(monthDate);
    
    return this.events$.pipe(
      map(events => events
        .filter(event => {
          const eventDate = new Date(event.date);
          return isWithinInterval(eventDate, { start: startOfMonthDate, end: endOfMonthDate });
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
          return isWithinInterval(eventDate, { start: startDate, end: endDate });
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      )
    );
  }

  /**
   * Get next 6 months of events
   */
  getNext6MonthsEvents(): Observable<CalendarEvent[]> {
    return this.getUpcomingEvents(180);
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
    const source = this.calendarSources.find(s => s.id === calendarId);
    if (source) {
      source.isActive = isActive;
    }
  }

  /**
   * Fetch ICS data from a single source
   */
  private fetchIcsFromSource(source: CalendarSource): Observable<CalendarEvent[]> {
    // Handle AASR calendar (requires multiple month URLs)
    if (source.requiresMultipleMonths) {
      return this.fetchMultipleMonthsFromSource(source);
    }

    console.log(`🌐 Fetching ICS data from ${source.name}...`);

    // Try direct fetch first
    return this.http.get(source.url, { responseType: 'text' }).pipe(
      catchError(() => {
        console.log(`⚠️ Direct fetch failed for ${source.name}, trying proxies...`);
        const proxies = [
          'https://api.allorigins.win/get?url=',
          'https://corsproxy.io/?',
          'https://api.codetabs.com/v1/proxy?quest='
        ];
        return this.fetchWithProxyFallback(source.url, proxies, source);
      }),
      map(icsData => {
        const events = this.parseIcsData(icsData, source);
        console.log(`🎯 Parsed ${events.length} events from ${source.name}`);
        return events;
      }),
      catchError(error => {
        console.error(`❌ All methods failed for ${source.name}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Fetch multiple months from a source (AASR calendar)
   */
  private fetchMultipleMonthsFromSource(source: CalendarSource): Observable<CalendarEvent[]> {
    const today = new Date();
    const months: Observable<CalendarEvent[]>[] = [];
    
    // List of CORS proxies to try for multi-month calendars
    const proxies = [
      'https://api.allorigins.win/raw?url=',
      'https://thingproxy.freeboard.io/fetch/',
      'https://cors-anywhere.herokuapp.com/'
    ];
    
    // Fetch 6 months of data
    for (let i = 0; i < 6; i++) {
      const targetDate = addMonths(today, i);
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      
      const monthUrl = source.url
        .replace('{YEAR}', year.toString())
        .replace('{MONTH}', month);
      
      const monthObservable = this.fetchWithMultipleProxies(monthUrl, proxies, source, year, month);
      months.push(monthObservable);
    }

    return combineLatest(months).pipe(
      map(monthResults => {
        const allEvents = monthResults.flat();
        // Remove duplicates
        const uniqueEvents = allEvents.filter((event, index, self) => 
          event.uid ? 
            index === self.findIndex(e => e.uid === event.uid) :
            index === self.findIndex(e => e.title === event.title && e.date === event.date)
        );
        console.log(`🎯 ${source.name}: ${uniqueEvents.length} unique events from 6 months`);
        return uniqueEvents;
      })
    );
  }

  /**
   * Try multiple proxies for a single URL
   */
  private fetchWithMultipleProxies(url: string, proxies: string[], source: CalendarSource, year: number, month: string, proxyIndex: number = 0): Observable<CalendarEvent[]> {
    if (proxyIndex >= proxies.length) {
      // All proxies failed, try direct fetch as last resort
      return this.http.get(url, { 
        responseType: 'text',
        headers: { 'Accept': 'text/calendar, text/plain, */*' }
      }).pipe(
        map(icsData => {
          const events = this.parseIcsData(icsData, source);
          console.log(`📅 ${source.name} ${year}-${month}: ${events.length} events`);
          return events;
        }),
        catchError(() => {
          console.warn(`❌ Failed to load ${source.name} ${year}-${month}`);
          return of([]);
        })
      );
    }

    const proxiedUrl = proxies[proxyIndex] + encodeURIComponent(url);
    
    return this.http.get(proxiedUrl, { 
      responseType: 'text',
      headers: { 'Accept': 'text/calendar, text/plain, */*' }
    }).pipe(
      map(icsData => {
        // Check if response looks like valid ICS data
        if (!icsData || !icsData.includes('BEGIN:VCALENDAR')) {
          throw new Error('Invalid ICS response');
        }
        const events = this.parseIcsData(icsData, source);
        console.log(`📅 ${source.name} ${year}-${month}: ${events.length} events`);
        return events;
      }),
      catchError(() => {
        // Try next proxy
        return this.fetchWithMultipleProxies(url, proxies, source, year, month, proxyIndex + 1);
      })
    );
  }

  /**
   * Try multiple CORS proxies with fallback
   */
  private fetchWithProxyFallback(url: string, proxies: string[], source: CalendarSource, proxyIndex: number = 0): Observable<string> {
    if (proxyIndex >= proxies.length) {
      return throwError(() => new Error('All CORS proxies failed'));
    }

    // Handle allorigins.win /get endpoint (returns JSON with content)
    if (proxies[proxyIndex].includes('allorigins.win/get')) {
      const proxiedUrl = proxies[proxyIndex] + encodeURIComponent(url);
      
      return this.http.get<{contents: string}>(proxiedUrl).pipe(
        map(response => {
          if (response.contents?.startsWith('data:')) {
            const base64Match = response.contents.match(/base64,(.+)/);
            if (base64Match) {
              return atob(base64Match[1]);
            }
          }
          return response.contents || '';
        }),
        catchError(() => this.fetchWithProxyFallback(url, proxies, source, proxyIndex + 1))
      );
    }

    const proxiedUrl = proxies[proxyIndex] + encodeURIComponent(url);

    return this.http.get(proxiedUrl, { 
      responseType: 'text',
      headers: { 'Accept': 'text/calendar, text/plain, */*' }
    }).pipe(
      catchError(() => this.fetchWithProxyFallback(url, proxies, source, proxyIndex + 1))
    );
  }

  /**
   * Parse ICS data into CalendarEvent objects
   * Handles recurring events (RRULE) and exception instances (RECURRENCE-ID)
   */
  private parseIcsData(icsContent: string, source: CalendarSource): CalendarEvent[] {
    try {
      if (!icsContent || typeof icsContent !== 'string') {
        return [];
      }

      const events: CalendarEvent[] = [];
      const rawEvents: any[] = [];
      const exceptionInstances: Map<string, any[]> = new Map(); // UID -> exception instances
      const lines = icsContent.split(/\r?\n/);
      let currentEvent: any = null;
      let isInEvent = false;
      let fullDtstart = ''; // Store full DTSTART line with timezone info

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Handle line continuations (lines starting with space or tab)
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
          if (currentEvent?.DTSTART && currentEvent?.SUMMARY) {
            currentEvent._fullDtstart = fullDtstart;
            
            // Check if this is an exception instance (modified occurrence)
            if (currentEvent['RECURRENCE-ID']) {
              const uid = currentEvent.UID;
              if (!exceptionInstances.has(uid)) {
                exceptionInstances.set(uid, []);
              }
              exceptionInstances.get(uid)!.push(currentEvent);
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
          
          // Store full DTSTART line for RRULE parsing
          if (property.startsWith('DTSTART')) {
            fullDtstart = line;
          }
          
          if (property.includes(';')) {
            const mainProperty = property.split(';')[0];
            currentEvent[mainProperty] = value;
            // Also store the full property for timezone info
            currentEvent[`_full_${mainProperty}`] = line;
          } else {
            currentEvent[property] = value;
          }
        }
      }

      // Process all raw events
      for (const rawEvent of rawEvents) {
        if (rawEvent.RRULE) {
          // This is a recurring event - expand it
          const expandedEvents = this.expandRecurringEvent(rawEvent, source, exceptionInstances.get(rawEvent.UID) || []);
          events.push(...expandedEvents);
        } else {
          // Single event
          const calendarEvent = this.convertIcsEventToCalendarEvent(rawEvent, source);
          if (calendarEvent) {
            events.push(calendarEvent);
          }
        }
      }

      return events;
    } catch (error) {
      console.error(`Error parsing ICS content from ${source.name}:`, error);
      return [];
    }
  }

  /**
   * Expand a recurring event into individual occurrences
   */
  private expandRecurringEvent(icsEvent: any, source: CalendarSource, exceptions: any[]): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    
    try {
      const startDate = this.parseIcsDateTime(icsEvent.DTSTART);
      if (!startDate) return [];

      // Calculate event duration
      const endDate = icsEvent.DTEND ? this.parseIcsDateTime(icsEvent.DTEND) : startDate;
      const duration = endDate ? endDate.getTime() - startDate.getTime() : 60 * 60 * 1000; // Default 1 hour

      // Build RRULE string for parsing
      let rruleString = `DTSTART:${this.formatDateForRRule(startDate)}\nRRULE:${icsEvent.RRULE}`;
      
      // Parse the RRULE
      const rule = rrulestr(rruleString);
      
      // Get occurrences for the next 6 months
      const now = new Date();
      const rangeStart = new Date(now.getFullYear(), now.getMonth() - 1, 1); // Start from last month
      const rangeEnd = addMonths(now, 7); // 7 months ahead to be safe
      
      const occurrences = rule.between(rangeStart, rangeEnd, true);
      
      console.log(`📅 Expanding recurring event "${icsEvent.SUMMARY}": ${occurrences.length} occurrences found`);

      // Create exception date map for quick lookup
      const exceptionDates = new Map<string, any>();
      for (const exception of exceptions) {
        const exDate = this.parseIcsDateTime(exception['RECURRENCE-ID']);
        if (exDate) {
          const dateKey = format(exDate, 'yyyy-MM-dd');
          exceptionDates.set(dateKey, exception);
        }
      }

      for (const occurrence of occurrences) {
        const occurrenceDate = new Date(occurrence);
        const dateKey = format(occurrenceDate, 'yyyy-MM-dd');
        
        // Check if this occurrence has been modified (exception instance)
        const exceptionEvent = exceptionDates.get(dateKey);
        
        if (exceptionEvent) {
          // Use the modified version of this occurrence
          const modifiedEvent = this.convertIcsEventToCalendarEvent(exceptionEvent, source);
          if (modifiedEvent) {
            events.push(modifiedEvent);
          }
        } else {
          // Create a regular occurrence
          const occurrenceEnd = new Date(occurrenceDate.getTime() + duration);
          
          const event: CalendarEvent = {
            id: this.hashStringToNumber(`${icsEvent.UID}-${dateKey}`),
            title: icsEvent.SUMMARY || 'Untitled Event',
            date: occurrenceDate,
            startTime: format(occurrenceDate, 'HH:mm'),
            endTime: format(occurrenceEnd, 'HH:mm'),
            location: icsEvent.LOCATION || source.name,
            description: icsEvent.DESCRIPTION || '',
            type: this.determineEventType(icsEvent.SUMMARY),
            calendarId: source.id,
            calendarName: source.name,
            uid: `${icsEvent.UID}-${dateKey}`,
            isRecurring: true
          };
          
          events.push(event);
        }
      }
    } catch (error) {
      console.error(`Error expanding recurring event "${icsEvent.SUMMARY}":`, error);
      // Fall back to single instance
      const singleEvent = this.convertIcsEventToCalendarEvent(icsEvent, source);
      if (singleEvent) {
        events.push(singleEvent);
      }
    }
    
    return events;
  }

  /**
   * Format a Date for RRULE parsing (YYYYMMDDTHHMMSS format)
   */
  private formatDateForRRule(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  }

  /**
   * Convert ICS event to CalendarEvent
   */
  private convertIcsEventToCalendarEvent(icsEvent: any, source: CalendarSource): CalendarEvent | null {
    try {
      const startDate = this.parseIcsDateTime(icsEvent.DTSTART);
      if (!startDate) return null;

      const endDate = icsEvent.DTEND ? this.parseIcsDateTime(icsEvent.DTEND) : startDate;
      const id = icsEvent.UID ? this.hashStringToNumber(icsEvent.UID) : Math.random() * 1000000;
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
      return null;
    }
  }

  /**
   * Parse ICS date/time format
   */
  private parseIcsDateTime(dateTimeString: string): Date | null {
    try {
      if (!dateTimeString) return null;
      
      // Handle timezone format: DTSTART;TZID=America/New_York:20080728T183000
      if (dateTimeString.includes(';TZID=')) {
        const parts = dateTimeString.split(':');
        if (parts.length >= 2) {
          return this.parseBasicDateTime(parts[parts.length - 1]);
        }
      }
      
      // Handle UTC format: 20250305T003000Z
      if (dateTimeString.endsWith('Z')) {
        const cleanDateTime = dateTimeString.slice(0, -1);
        const utcDate = this.parseBasicDateTime(cleanDateTime);
        if (utcDate) {
          return new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));
        }
        return utcDate;
      }
      
      return this.parseBasicDateTime(dateTimeString);
    } catch {
      return null;
    }
  }

  /**
   * Parse basic ICS datetime format: YYYYMMDDTHHMMSS
   */
  private parseBasicDateTime(dateTimeString: string): Date | null {
    try {
      const cleanDateTime = dateTimeString.replace(/[^0-9T]/g, '');
      
      if (cleanDateTime.length === 8) {
        // Date only: YYYYMMDD
        const year = parseInt(cleanDateTime.substring(0, 4));
        const month = parseInt(cleanDateTime.substring(4, 6)) - 1;
        const day = parseInt(cleanDateTime.substring(6, 8));
        return new Date(year, month, day);
      } else if (cleanDateTime.length >= 15 && cleanDateTime.includes('T')) {
        // DateTime: YYYYMMDDTHHMMSS
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
      
      return new Date(dateTimeString);
    } catch {
      return null;
    }
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
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * Save events to localStorage cache
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
      console.log(`💾 Cached ${events.length} events`);
    } catch (error) {
      console.error('Failed to save events to cache:', error);
    }
  }

  /**
   * Download calendar ICS file
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
      const link = document.createElement('a');
      link.href = source.url;
      link.download = `${source.name.replace(/[^a-zA-Z0-9]/g, '_')}_calendar.ics`;
      link.target = '_blank';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return of({
        success: true,
        eventsCount: 0,
        message: `Downloading ${source.name} calendar...`
      });
    } catch (error) {
      return of({
        success: false,
        eventsCount: 0,
        message: 'Failed to download calendar file'
      });
    }
  }
}
