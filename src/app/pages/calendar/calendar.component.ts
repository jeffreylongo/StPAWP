import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

import { CalendarService } from '../../services/calendar.service';
import { ToastService } from '../../services/toast.service';
import { CalendarEvent, CalendarSource, CalendarSyncResult } from '../../interfaces';

/**
 * Calendar Component
 * 
 * Displays a comprehensive calendar view with multiple calendar sources:
 * - St. Petersburg Lodge #139
 * - Suncoast Master Mason Association
 * - Tampa Scottish Rite
 * - Tampa York Rite Bodies
 * 
 * Features:
 * - Monthly calendar grid view
 * - Upcoming events list (6 months)
 * - Filter by calendar source
 * - Event details modal
 * - ICS file downloads
 */
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Calendar state
  currentMonth = new Date();
  calendarDays: Date[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Events and data
  events: CalendarEvent[] = [];
  upcomingEvents: CalendarEvent[] = [];
  calendarSources: CalendarSource[] = [];
  selectedEvent: CalendarEvent | null = null;
  
  // Calendar views
  activeView = 'combined';
  calendarViews = [
    { id: 'lodge', name: 'St. Petersburg Lodge #139' },
    { id: 'smma', name: 'Suncoast Master Mason Association' },
    { id: 'aasr', name: 'Tampa Scottish Rite' },
    { id: 'yorkrite', name: 'Tampa York Rite Bodies' },
    { id: 'combined', name: 'Combined Calendar' }
  ];
  
  // Loading state
  isLoading = false;
  lastSync: Date | null = null;

  constructor(
    private calendarService: CalendarService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.generateCalendarDays();
    this.loadCalendarSources();
    this.subscribeToEvents();
    this.loadUpcomingEvents();
    
    // Service now handles progressive loading automatically
    // Shows cached data instantly, then updates as fresh data arrives
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load calendar sources from service
   */
  private loadCalendarSources(): void {
    this.calendarSources = this.calendarService.getCalendarSources();
  }

  /**
   * Subscribe to calendar events and loading state
   */
  private subscribeToEvents(): void {
    this.calendarService.events$
      .pipe(takeUntil(this.destroy$))
      .subscribe(events => {
        console.log('Calendar component received events:', events.length);
        console.log('Lodge events (calendarId=1):', events.filter(e => e.calendarId === 1).length);
        console.log('SMMA events (calendarId=2):', events.filter(e => e.calendarId === 2).length);
        console.log('AASR events (calendarId=3):', events.filter(e => e.calendarId === 3).length);
        console.log('York Rite events (calendarId=4):', events.filter(e => e.calendarId === 4).length);
        this.events = events;
        this.generateCalendarDays();
      });

    this.calendarService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    this.calendarService.lastSync$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lastSync => {
        this.lastSync = lastSync;
      });
  }

  /**
   * Load upcoming events - show all events from all calendars for the next 6 months
   */
  private loadUpcomingEvents(): void {
    this.calendarService.getNext6MonthsEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe(events => {
        console.log('📅 Calendar component - 6 months of upcoming events received:', events.length);
        console.log('🏛️ Lodge upcoming events:', events.filter(e => e.calendarId === 1).length);
        console.log('🤝 SMMA upcoming events:', events.filter(e => e.calendarId === 2).length);
        console.log('🏴󠁧󠁢󠁳󠁣󠁴󠁿 AASR upcoming events:', events.filter(e => e.calendarId === 3).length);
        console.log('⚜️ York Rite upcoming events:', events.filter(e => e.calendarId === 4).length);
        
        // Show all events in upcoming events section regardless of active view
        this.upcomingEvents = events;
        console.log('✅ Updated upcomingEvents array with', events.length, 'events for next 6 months');
      });
  }

  /**
   * Generate calendar days for the current month
   * Includes days from previous and next months to fill the grid
   */
  private generateCalendarDays(): void {
    const start = startOfMonth(this.currentMonth);
    const end = endOfMonth(this.currentMonth);
    
    // Get the first day of the week containing the first day of the month
    const calendarStart = new Date(start);
    calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());
    
    // Get the last day of the week containing the last day of the month
    const calendarEnd = new Date(end);
    calendarEnd.setDate(calendarEnd.getDate() + (6 - calendarEnd.getDay()));
    
    this.calendarDays = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd
    });
  }

  /**
   * Navigate to previous month
   */
  previousMonth(): void {
    this.currentMonth = subMonths(this.currentMonth, 1);
    this.generateCalendarDays();
    console.log(`📅 Navigated to ${format(this.currentMonth, 'MMMM yyyy')}`);
  }

  /**
   * Navigate to next month
   */
  nextMonth(): void {
    this.currentMonth = addMonths(this.currentMonth, 1);
    this.generateCalendarDays();
    console.log(`📅 Navigated to ${format(this.currentMonth, 'MMMM yyyy')}`);
  }

  /**
   * Navigate to today's month
   */
  goToToday(): void {
    this.currentMonth = new Date();
    this.generateCalendarDays();
    console.log(`📅 Navigated to current month: ${format(this.currentMonth, 'MMMM yyyy')}`);
  }

  /**
   * Navigate to specific month/year
   */
  goToMonth(year: number, month: number): void {
    this.currentMonth = new Date(year, month, 1);
    this.generateCalendarDays();
    console.log(`📅 Navigated to ${format(this.currentMonth, 'MMMM yyyy')}`);
  }

  /**
   * Get CSS classes for a calendar day
   */
  getDayClasses(day: Date): string {
    let classes = '';
    
    if (isToday(day)) {
      classes += ' today';
    }
    
    if (!isSameMonth(day, this.currentMonth)) {
      classes += ' other-month';
    }
    
    return classes;
  }

  /**
   * Get events for a specific day
   */
  getEventsForDay(day: Date): CalendarEvent[] {
    return this.getDisplayEvents().filter(event => 
      isSameDay(new Date(event.date), day)
    );
  }

  /**
   * Get color for an event based on its calendar source
   */
  getEventColor(event: CalendarEvent): string {
    const source = this.calendarSources.find(source => source.id === event.calendarId);
    return source?.color || '#1a4b8f';
  }

  /**
   * Get tooltip text for an event
   */
  getEventTooltip(event: CalendarEvent): string {
    return `${event.title}\n${event.startTime} - ${event.endTime}\n${event.location}`;
  }

  /**
   * Get CSS class for event type badge
   */
  getEventTypeClass(type: string): string {
    const typeClasses = {
      'meeting': 'bg-blue-100 text-blue-800',
      'degree': 'bg-purple-100 text-purple-800',
      'dinner': 'bg-green-100 text-green-800',
      'education': 'bg-yellow-100 text-yellow-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return typeClasses[type as keyof typeof typeClasses] || typeClasses.other;
  }

  /**
   * Select an event to display in modal
   */
  selectEvent(event: CalendarEvent): void {
    this.selectedEvent = event;
  }

  /**
   * Close event details modal
   */
  closeEventModal(): void {
    this.selectedEvent = null;
  }

  /**
   * Toggle calendar source active status
   */
  toggleCalendarSource(calendarId: number, event: any): void {
    const isActive = event.target.checked;
    this.calendarService.updateCalendarSource(calendarId, isActive);
  }

  /**
   * Set active calendar view
   * Options: 'lodge', 'smma', 'aasr', 'yorkrite', 'combined'
   * This filters both the calendar grid and upcoming events list
   */
  setActiveView(viewId: string): void {
    this.activeView = viewId;
  }

  /**
   * Get CSS class for source view button
   */
  getSourceViewButtonClass(sourceId: number): string {
    const viewId = sourceId === 1 ? 'lodge' : sourceId === 2 ? 'smma' : sourceId === 3 ? 'aasr' : 'yorkrite';
    const baseClass = 'text-xs px-2 py-1 rounded transition-colors';
    if (viewId === this.activeView) {
      return baseClass + ' bg-primary-blue text-white';
    }
    return baseClass + ' bg-gray-200 text-gray-700 hover:bg-gray-300';
  }

  /**
   * Get CSS class for combined view button
   */
  getCombinedViewButtonClass(): string {
    const baseClass = 'px-6 py-3 rounded-lg font-medium transition-colors border-2';
    if (this.activeView === 'combined') {
      return baseClass + ' bg-primary-blue text-white border-primary-blue';
    }
    return baseClass + ' bg-white text-primary-blue border-primary-blue hover:bg-primary-blue hover:text-white';
  }

  /**
   * Get events for a specific calendar source
   */
  getEventsForSource(sourceId: number): CalendarEvent[] {
    // Filter events for this source AND the current displayed month
    const monthStart = startOfMonth(this.currentMonth);
    const monthEnd = endOfMonth(this.currentMonth);
    
    return this.events.filter(event => {
      if (event.calendarId !== sourceId) return false;
      
      const eventDate = new Date(event.date);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });
  }

  /**
   * Force York Rite calendar sync
   * This is called on component initialization to ensure York Rite events are loaded
   */
  forceYorkRiteSync(): void {
    this.calendarService.forceYorkRiteSync();
  }

  /**
   * Clear cache and resync all calendars
   */
  clearCacheAndResync(): void {
    this.calendarService.clearCacheAndResync().subscribe({
      next: (result) => {
        console.log('✅ Cache cleared and resynced:', result);
        this.loadUpcomingEvents();
      },
      error: (error) => {
        console.error('❌ Cache clear failed:', error);
      }
    });
  }

  /**
   * Get active calendar sources based on current view
   */
  getActiveCalendarSources(): CalendarSource[] {
    switch (this.activeView) {
      case 'lodge':
        return this.calendarSources.filter(source => source.id === 1);
      case 'smma':
        return this.calendarSources.filter(source => source.id === 2);
      case 'aasr':
        return this.calendarSources.filter(source => source.id === 3);
      case 'yorkrite':
        return this.calendarSources.filter(source => source.id === 4);
      case 'combined':
      default:
        return this.calendarSources.filter(source => source.isActive);
    }
  }

  /**
   * Get events for display based on active view filter
   */
  getDisplayEvents(): CalendarEvent[] {
    switch (this.activeView) {
      case 'lodge':
        return this.events.filter(event => event.calendarId === 1);
      case 'smma':
        return this.events.filter(event => event.calendarId === 2);
      case 'aasr':
        return this.events.filter(event => event.calendarId === 3);
      case 'yorkrite':
        return this.events.filter(event => event.calendarId === 4);
      case 'combined':
      default:
        return this.events;
    }
  }

  /**
   * Get upcoming events filtered by active view
   */
  getFilteredUpcomingEvents(): CalendarEvent[] {
    switch (this.activeView) {
      case 'lodge':
        return this.upcomingEvents.filter(event => event.calendarId === 1);
      case 'smma':
        return this.upcomingEvents.filter(event => event.calendarId === 2);
      case 'aasr':
        return this.upcomingEvents.filter(event => event.calendarId === 3);
      case 'yorkrite':
        return this.upcomingEvents.filter(event => event.calendarId === 4);
      case 'combined':
      default:
        return this.upcomingEvents;
    }
  }

  /**
   * Download calendar ICS file for a specific calendar source
   */
  downloadCalendarICS(source: CalendarSource): void {
    this.calendarService.downloadCalendarICS(source.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.toastService.showSuccess(`Successfully downloaded ${source.name} calendar`);
          } else {
            this.toastService.showWarning(result.message || 'Failed to download calendar');
          }
        },
        error: (error) => {
          console.error('Calendar download error:', error);
          this.toastService.showError('Failed to download calendar. Please try again later.');
        }
      });
  }

  /**
   * Format utility - exposed for template usage
   */
  format = format;
  
  /**
   * Date comparison utility - exposed for template usage
   */
  isSameMonth = isSameMonth;
}
