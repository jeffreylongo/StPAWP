import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { CalendarEvent, CalendarSource, CalendarSyncResult, ICalendarEvent } from '../interfaces';

// Import ICAL for client-side parsing
declare const ICAL: any;

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
      name: 'Suncoast Masters & Wardens',
      url: 'https://localendar.com/public/MastersAndWardens?style=X2',
      isActive: true,
      color: '#c6a84a',
      description: 'Suncoast Masters and Wardens Association events'
    }
  ];

  constructor(private http: HttpClient) {
    // Load initial mock data
    this.loadMockEvents();
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
  getUpcomingEvents(days: number = 10): Observable<CalendarEvent[]> {
    const today = new Date();
    const futureDate = addDays(today, days);
    
    return this.events$.pipe(
      map(events => events
        .filter(event => {
          const eventDate = new Date(event.date);
          return isAfter(eventDate, today) && isBefore(eventDate, futureDate);
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      )
    );
  }

  /**
   * Sync calendar events from ICS sources
   */
  syncCalendarEvents(): Observable<CalendarSyncResult> {
    this.loadingSubject.next(true);
    
    // Since we can't make direct HTTP calls to external ICS files due to CORS,
    // we'll use a proxy service or implement a fallback
    return this.syncWithProxy().pipe(
      catchError(error => {
        console.error('Calendar sync failed:', error);
        // Fallback to mock data
        this.loadMockEvents();
        return of({
          success: false,
          eventsCount: 0,
          message: 'Calendar sync failed, using cached data',
          errors: [error.message]
        });
      })
    );
  }

  /**
   * Sync with a proxy service (for production)
   */
  private syncWithProxy(): Observable<CalendarSyncResult> {
    // In a real implementation, this would call a backend API
    // that fetches and parses the ICS files server-side
    return this.http.post<CalendarSyncResult>('/api/calendar/sync', {
      sources: this.calendarSources.filter(source => source.isActive)
    }).pipe(
      switchMap(result => {
        if (result.success) {
          // Refresh events after successful sync
          return this.loadEventsFromApi().pipe(
            map(() => result)
          );
        }
        return of(result);
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
   * Parse ICS content (client-side utility)
   */
  parseIcsContent(icsContent: string, calendarId: number): CalendarEvent[] {
    try {
      // This would require loading ICAL.js library
      // For now, we'll return mock data
      console.log('Parsing ICS content for calendar:', calendarId);
      return this.generateMockEventsForCalendar(calendarId);
    } catch (error) {
      console.error('Error parsing ICS content:', error);
      return [];
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
   * Load mock events (fallback)
   */
  private loadMockEvents(): void {
    const mockEvents = this.generateMockEvents();
    this.eventsSubject.next(mockEvents);
    this.loadingSubject.next(false);
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
}
