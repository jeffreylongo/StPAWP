import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, BehaviorSubject } from 'rxjs';
import { CalendarComponent } from './calendar.component';
import { CalendarService } from '../../services/calendar.service';
import { ToastService } from '../../services/toast.service';
import { CalendarEvent, CalendarSource } from '../../interfaces';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let calendarService: jasmine.SpyObj<CalendarService>;
  let toastService: jasmine.SpyObj<ToastService>;

  const mockCalendarSources: CalendarSource[] = [
    {
      id: 1,
      name: 'St. Petersburg Lodge #139',
      url: 'https://calendar.google.com/calendar/ical/test/basic.ics',
      isActive: true,
      color: '#1a4b8f',
      description: 'Test Lodge Calendar'
    },
    {
      id: 4,
      name: 'Tampa York Rite Bodies',
      url: 'https://tampayorkritebodies.com/events/feed/?ical=1',
      isActive: true,
      color: '#2E8B57',
      description: 'Test York Rite Calendar'
    }
  ];

  const mockEvents: CalendarEvent[] = [
    {
      id: 1,
      title: 'Stated Communication',
      date: new Date('2025-01-15T19:30:00'),
      startTime: '19:30',
      endTime: '21:30',
      location: 'St. Petersburg Lodge No. 139',
      description: 'Monthly stated communication',
      type: 'meeting',
      calendarId: 1,
      calendarName: 'St. Petersburg Lodge #139',
      uid: 'test-uid-1'
    },
    {
      id: 2,
      title: 'York Rite Meeting',
      date: new Date('2025-01-20T19:30:00'),
      startTime: '19:30',
      endTime: '21:30',
      location: 'Tampa York Rite Bodies',
      description: 'York Rite meeting',
      type: 'meeting',
      calendarId: 4,
      calendarName: 'Tampa York Rite Bodies',
      uid: 'test-uid-2'
    }
  ];

  beforeEach(async () => {
    const calendarServiceSpy = jasmine.createSpyObj('CalendarService', [
      'getCalendarSources',
      'getNext6MonthsEvents',
      'forceYorkRiteSync',
      'clearCacheAndResync',
      'updateCalendarSource',
      'downloadCalendarICS'
    ], {
      events$: new BehaviorSubject<CalendarEvent[]>(mockEvents),
      loading$: new BehaviorSubject<boolean>(false),
      lastSync$: new BehaviorSubject<Date | null>(new Date())
    });

    const toastServiceSpy = jasmine.createSpyObj('ToastService', [
      'showSuccess',
      'showWarning',
      'showError'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        CalendarComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: CalendarService, useValue: calendarServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    calendarService = TestBed.inject(CalendarService) as jasmine.SpyObj<CalendarService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;

    calendarService.getCalendarSources.and.returnValue(mockCalendarSources);
    calendarService.getNext6MonthsEvents.and.returnValue(of(mockEvents));
    calendarService.forceYorkRiteSync.and.returnValue();
    calendarService.downloadCalendarICS.and.returnValue(of({ success: true, eventsCount: 10, message: 'Success' }));

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with calendar sources', () => {
    fixture.detectChanges();
    expect(component.calendarSources.length).toBe(2);
    expect(component.calendarSources[0].name).toBe('St. Petersburg Lodge #139');
  });

  it('should load upcoming events on init', () => {
    fixture.detectChanges();
    expect(calendarService.getNext6MonthsEvents).toHaveBeenCalled();
    expect(component.upcomingEvents.length).toBe(2);
  });

  it('should subscribe to events stream', (done) => {
    fixture.detectChanges();
    expect(component.events.length).toBe(2);
    done();
  });

  it('should generate calendar days for current month', () => {
    fixture.detectChanges();
    expect(component.calendarDays.length).toBeGreaterThan(0);
    // Calendar grid should show 5-6 weeks (35-42 days)
    expect(component.calendarDays.length).toBeGreaterThanOrEqual(35);
    expect(component.calendarDays.length).toBeLessThanOrEqual(42);
  });

  it('should navigate to previous month', () => {
    const initialMonth = new Date(component.currentMonth);
    component.previousMonth();
    expect(component.currentMonth.getMonth()).toBe(initialMonth.getMonth() - 1);
  });

  it('should navigate to next month', () => {
    const initialMonth = new Date(component.currentMonth);
    component.nextMonth();
    expect(component.currentMonth.getMonth()).toBe(initialMonth.getMonth() + 1);
  });

  it('should navigate to today', () => {
    component.currentMonth = new Date('2020-01-01');
    component.goToToday();
    const today = new Date();
    expect(component.currentMonth.getMonth()).toBe(today.getMonth());
    expect(component.currentMonth.getFullYear()).toBe(today.getFullYear());
  });

  it('should navigate to specific month', () => {
    component.goToMonth(2025, 5); // June 2025
    expect(component.currentMonth.getMonth()).toBe(5);
    expect(component.currentMonth.getFullYear()).toBe(2025);
  });

  it('should get events for a specific day', () => {
    component.events = mockEvents;
    const testDate = new Date('2025-01-15');
    const eventsForDay = component.getEventsForDay(testDate);
    expect(eventsForDay.length).toBe(1);
    expect(eventsForDay[0].title).toBe('Stated Communication');
  });

  it('should get event color from calendar source', () => {
    component.calendarSources = mockCalendarSources;
    const color = component.getEventColor(mockEvents[0]);
    expect(color).toBe('#1a4b8f');
  });

  it('should return default color if source not found', () => {
    component.calendarSources = [];
    const color = component.getEventColor(mockEvents[0]);
    expect(color).toBe('#1a4b8f'); // Default color
  });

  it('should generate event tooltip', () => {
    const tooltip = component.getEventTooltip(mockEvents[0]);
    expect(tooltip).toContain('Stated Communication');
    expect(tooltip).toContain('19:30');
    expect(tooltip).toContain('21:30');
    expect(tooltip).toContain('St. Petersburg Lodge No. 139');
  });

  it('should get correct event type class', () => {
    expect(component.getEventTypeClass('meeting')).toBe('bg-blue-100 text-blue-800');
    expect(component.getEventTypeClass('degree')).toBe('bg-purple-100 text-purple-800');
    expect(component.getEventTypeClass('dinner')).toBe('bg-green-100 text-green-800');
    expect(component.getEventTypeClass('education')).toBe('bg-yellow-100 text-yellow-800');
    expect(component.getEventTypeClass('other')).toBe('bg-gray-100 text-gray-800');
  });

  it('should select and close event', () => {
    component.selectEvent(mockEvents[0]);
    expect(component.selectedEvent).toBe(mockEvents[0]);
    
    component.closeEventModal();
    expect(component.selectedEvent).toBeNull();
  });

  it('should set active view', () => {
    component.setActiveView('lodge');
    expect(component.activeView).toBe('lodge');
    
    component.setActiveView('yorkrite');
    expect(component.activeView).toBe('yorkrite');
  });

  it('should get display events based on active view', () => {
    component.events = mockEvents;
    
    component.activeView = 'lodge';
    let displayEvents = component.getDisplayEvents();
    expect(displayEvents.length).toBe(1);
    expect(displayEvents[0].calendarId).toBe(1);
    
    component.activeView = 'yorkrite';
    displayEvents = component.getDisplayEvents();
    expect(displayEvents.length).toBe(1);
    expect(displayEvents[0].calendarId).toBe(4);
    
    component.activeView = 'combined';
    displayEvents = component.getDisplayEvents();
    expect(displayEvents.length).toBe(2);
  });

  it('should get events for specific source', () => {
    component.events = mockEvents;
    const lodgeEvents = component.getEventsForSource(1);
    expect(lodgeEvents.length).toBe(1);
    expect(lodgeEvents[0].calendarId).toBe(1);
  });

  it('should get correct source view button class', () => {
    component.activeView = 'lodge';
    const activeClass = component.getSourceViewButtonClass(1);
    expect(activeClass).toContain('bg-primary-blue text-white');
    
    const inactiveClass = component.getSourceViewButtonClass(4);
    expect(inactiveClass).toContain('bg-gray-200');
  });

  it('should get correct combined view button class', () => {
    component.activeView = 'combined';
    let buttonClass = component.getCombinedViewButtonClass();
    expect(buttonClass).toContain('bg-primary-blue text-white');
    
    component.activeView = 'lodge';
    buttonClass = component.getCombinedViewButtonClass();
    expect(buttonClass).toContain('bg-white text-primary-blue');
  });

  it('should force York Rite sync', () => {
    component.forceYorkRiteSync();
    expect(calendarService.forceYorkRiteSync).toHaveBeenCalled();
  });

  it('should download calendar ICS', () => {
    component.calendarSources = mockCalendarSources;
    component.downloadCalendarICS(mockCalendarSources[0]);
    
    expect(calendarService.downloadCalendarICS).toHaveBeenCalledWith(1);
  });

  it('should show success toast on successful download', (done) => {
    component.calendarSources = mockCalendarSources;
    component.downloadCalendarICS(mockCalendarSources[0]);
    
    setTimeout(() => {
      expect(toastService.showSuccess).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should show error toast on failed download', (done) => {
    calendarService.downloadCalendarICS.and.returnValue(of({ success: false, eventsCount: 0, message: 'Failed' }));
    component.calendarSources = mockCalendarSources;
    component.downloadCalendarICS(mockCalendarSources[0]);
    
    setTimeout(() => {
      expect(toastService.showWarning).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should get day classes correctly', () => {
    const today = new Date();
    const todayClass = component.getDayClasses(today);
    expect(todayClass).toContain('today');
    
    const otherMonth = new Date();
    otherMonth.setMonth(otherMonth.getMonth() + 2);
    const otherMonthClass = component.getDayClasses(otherMonth);
    expect(otherMonthClass).toContain('other-month');
  });

  it('should update calendar source', () => {
    const event = { target: { checked: false } };
    component.toggleCalendarSource(1, event);
    expect(calendarService.updateCalendarSource).toHaveBeenCalledWith(1, false);
  });

  it('should clear cache and resync', (done) => {
    calendarService.clearCacheAndResync.and.returnValue(of({ success: true, eventsCount: 5, message: 'Success' }));
    component.clearCacheAndResync();
    
    setTimeout(() => {
      expect(calendarService.clearCacheAndResync).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should cleanup subscriptions on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    
    component.ngOnDestroy();
    
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('should have correct week days', () => {
    expect(component.weekDays).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  });

  it('should have correct calendar views', () => {
    expect(component.calendarViews.length).toBe(5);
    expect(component.calendarViews[0].id).toBe('lodge');
    expect(component.calendarViews[4].id).toBe('combined');
  });
});


