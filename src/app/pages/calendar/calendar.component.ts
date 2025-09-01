import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

import { CalendarService } from '../../services/calendar.service';
import { ToastService } from '../../services/toast.service';
import { CalendarEvent, CalendarSource, CalendarSyncResult } from '../../interfaces';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">Calendar</span>
        </nav>
        <div class="flex flex-col md:flex-row md:items-center justify-between">
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">Event Calendar</h1>
        </div>
      </div>
    </div>
    
    <div class="container mx-auto px-4 py-12">
      <!-- Calendar Sources and Views -->
      <div class="mb-8">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div *ngFor="let source of calendarSources" 
               class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <!-- Source Header -->
            <div class="p-4 border-b border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full mr-3" [style.background-color]="source.color"></div>
                  <h3 class="font-cinzel font-bold text-base text-primary-blue">{{ source.name }}</h3>
                </div>
                <div class="flex items-center space-x-2">
                  <!-- View Button -->
                  <button 
                    (click)="setActiveView(source.id === 1 ? 'lodge' : source.id === 2 ? 'smma' : source.id === 3 ? 'aasr' : 'yorkrite')"
                    [class]="getSourceViewButtonClass(source.id)"
                    class="text-xs px-2 py-1 rounded transition-colors">
                    <i class="fas fa-eye mr-1"></i>
                    View
                  </button>
                  <!-- Download Button -->
                  <button 
                    (click)="downloadCalendarICS(source)"
                    class="bg-primary-gold hover:bg-primary-gold-light text-primary-blue-darker text-xs font-semibold px-2 py-1 rounded transition-colors">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
              </div>
              <p class="text-xs text-gray-600">{{ source.description }}</p>
            </div>
            
            <!-- Source Stats -->
            <div class="p-3 bg-gray-50">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600">Events this month:</span>
                <span class="font-semibold text-primary-blue">
                  {{ getEventsForSource(source.id).length }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Combined View Option -->
        <div class="mt-4 flex justify-center">
          <button 
            (click)="setActiveView('combined')"
            [class]="getCombinedViewButtonClass()"
            class="px-6 py-3 rounded-lg font-medium transition-colors border-2">
            <i class="fas fa-layer-group mr-2"></i>
            View All Calendars Combined
          </button>
        </div>
      </div>

      <!-- Calendar Navigation -->
      <div class="flex items-center justify-between mb-6">
        <button 
          (click)="previousMonth()"
          class="flex items-center px-4 py-2 text-primary-blue hover:text-primary-gold transition-colors">
          <i class="fas fa-chevron-left mr-2"></i>
          Previous
        </button>
        <div class="flex items-center gap-4">
          <h2 class="font-cinzel text-3xl font-bold text-primary-blue">
            {{ format(currentMonth, 'MMMM yyyy') }}
          </h2>
          <button 
            (click)="goToToday()"
            class="px-3 py-1 text-sm bg-primary-gold hover:bg-primary-gold-light text-primary-blue-darker font-semibold rounded transition-colors">
            Today
          </button>
        </div>
        <button 
          (click)="nextMonth()"
          class="flex items-center px-4 py-2 text-primary-blue hover:text-primary-gold transition-colors">
          Next
          <i class="fas fa-chevron-right ml-2"></i>
        </button>
      </div>

      <!-- Calendar Grid -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Calendar Header -->
        <div class="grid grid-cols-7 bg-primary-blue text-white">
          <div *ngFor="let day of weekDays" class="p-4 text-center font-semibold">
            {{ day }}
          </div>
        </div>

        <!-- Calendar Body -->
        <div class="grid grid-cols-7">
          <div *ngFor="let day of calendarDays" 
               [class]="getDayClasses(day)"
               class="min-h-32 p-2 border-r border-b border-gray-200">
            <div class="font-semibold mb-2" [class.text-gray-400]="!isSameMonth(day, currentMonth)">
              {{ format(day, 'd') }}
            </div>
            
            <!-- Events for this day -->
            <div class="space-y-1">
              <div *ngFor="let event of getEventsForDay(day)" 
                   class="text-xs p-1 rounded cursor-pointer transition-colors"
                   [style.background-color]="getEventColor(event)"
                   [title]="getEventTooltip(event)"
                   (click)="selectEvent(event)">
                <div class="font-medium truncate">{{ event.title }}</div>
                <div class="text-xs opacity-75">{{ event.startTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="mt-12">
        <h2 class="font-cinzel text-2xl font-bold text-primary-blue mb-6">Upcoming Events</h2>
        
        <div *ngIf="upcomingEvents.length === 0 && !isLoading" class="text-center py-8">
          <i class="fas fa-calendar text-gray-300 text-5xl mb-4"></i>
          <p class="text-gray-500 text-lg">No upcoming events scheduled.</p>
        </div>

        <div *ngIf="isLoading" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="relative inline-block">
              <!-- Masonic Square and Compasses Spinner -->
              <div class="w-16 h-16 border-4 border-primary-gold border-t-transparent rounded-full animate-spin"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <i class="fas fa-compass text-primary-blue text-xl"></i>
              </div>
            </div>
            <p class="mt-4 text-primary-blue font-cinzel text-lg">Loading Masonic Events</p>
            <p class="text-gray-500 text-sm">Gathering wisdom from the craft</p>
          </div>
        </div>

        <div class="space-y-4">
          <div *ngFor="let event of upcomingEvents" 
               class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <div class="w-3 h-3 rounded-full mr-3" [style.background-color]="getEventColor(event)"></div>
                  <h3 class="font-cinzel text-lg font-bold text-primary-blue">{{ event.title }}</h3>
                  <span class="ml-2 px-2 py-1 text-xs font-medium rounded-full" 
                        [class]="getEventTypeClass(event.type)">
                    {{ event.type | titlecase }}
                  </span>
                </div>
                
                <div class="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div class="flex items-center">
                    <i class="fas fa-calendar mr-2 text-primary-gold"></i>
                    {{ event.date | date:'fullDate' }}
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-clock mr-2 text-primary-gold"></i>
                    {{ event.startTime }} - {{ event.endTime }}
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-map-marker-alt mr-2 text-primary-gold"></i>
                    {{ event.location }}
                  </div>
                </div>
                
                <p *ngIf="event.description" class="mt-3 text-gray-700">
                  {{ event.description }}
                </p>
                
                <div class="mt-2 text-xs text-gray-500">
                  <span>{{ event.calendarName }}</span>
                  <span *ngIf="event.isRecurring" class="ml-2">
                    <i class="fas fa-redo text-primary-gold"></i> Recurring
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Details Modal (placeholder) -->
    <div *ngIf="selectedEvent" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         (click)="closeEventModal()">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-cinzel text-xl font-bold text-primary-blue">{{ selectedEvent.title }}</h3>
          <button (click)="closeEventModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="space-y-3">
          <div class="flex items-center text-sm">
            <i class="fas fa-calendar mr-3 text-primary-gold w-4"></i>
            {{ selectedEvent.date | date:'fullDate' }}
          </div>
          <div class="flex items-center text-sm">
            <i class="fas fa-clock mr-3 text-primary-gold w-4"></i>
            {{ selectedEvent.startTime }} - {{ selectedEvent.endTime }}
          </div>
          <div class="flex items-center text-sm">
            <i class="fas fa-map-marker-alt mr-3 text-primary-gold w-4"></i>
            {{ selectedEvent.location }}
          </div>
          <div *ngIf="selectedEvent.description" class="pt-3 border-t">
            <p class="text-gray-700">{{ selectedEvent.description }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .today {
      background-color: #e5d9b6;
    }
    
    .selected-day {
      background-color: #c6a84a;
      color: white;
    }
    
    .other-month {
      color: #9ca3af;
    }
    
    .event-item {
      font-size: 0.75rem;
      padding: 0.125rem 0.25rem;
      margin-bottom: 0.125rem;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .event-item:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
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
    
    // Automatically force York Rite sync after a short delay to ensure proper loading
    setTimeout(() => {
      this.forceYorkRiteSync();
    }, 2000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load calendar sources
   */
  private loadCalendarSources(): void {
    this.calendarSources = this.calendarService.getCalendarSources();
  }

  /**
   * Subscribe to calendar events
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
   * Load upcoming events - show all events from all calendars
   */
  private loadUpcomingEvents(): void {
    // Load next 6 months of events (180 days) from all 3 calendars
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
   * Get color for an event based on its calendar
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
   * Get CSS class for event type
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
   * Select an event
   */
  selectEvent(event: CalendarEvent): void {
    this.selectedEvent = event;
  }

  /**
   * Close event modal
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
   */
  setActiveView(viewId: string): void {
    this.activeView = viewId;
    // Don't reload upcoming events - they should show all calendars regardless of view
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
   * Get events for a specific source
   */
  getEventsForSource(sourceId: number): CalendarEvent[] {
    return this.events.filter(event => event.calendarId === sourceId);
  }

  /**
   * Force York Rite sync
   */
  forceYorkRiteSync(): void {
    this.calendarService.forceYorkRiteSync();
  }

  /**
   * Clear cache and resync
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
   * Get events for display based on active view
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
   * Format utility
   */
  format = format;
  isSameMonth = isSameMonth;
}