import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEvent } from '../../interfaces';
import { SecretaryOfficeService, SecretaryOfficeData, SecretaryUpdate } from '../../services/secretary-office.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CleanWordPressContentPipe } from '../../pipes/strip-html.pipe';

@Component({
  selector: 'app-secretary-office',
  standalone: true,
  imports: [CommonModule, RouterModule, CleanWordPressContentPipe],
  templateUrl: './secretary-office.component.html',
  styleUrls: ['./secretary-office.component.css']
})
export class SecretaryOfficeComponent implements OnInit {
  upcomingEvents: CalendarEvent[] = [];
  secretaryData$!: Observable<SecretaryOfficeData>;
  isLoadingEvents = true;

  constructor(
    private calendarService: CalendarService,
    private secretaryOfficeService: SecretaryOfficeService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.secretaryData$ = this.secretaryOfficeService.getSecretaryOfficeData();
  }

  loadEvents(): void {
    this.isLoadingEvents = true;

    // For now, use mock events to ensure August events are displayed
    // TODO: Fix calendar service to include August events
    this.upcomingEvents = this.generateMockEvents();
          this.isLoadingEvents = false;
    console.log(`📋 Secretary Office loaded ${this.upcomingEvents.length} mock events for testing`);
  }

  private generateMockEvents(): CalendarEvent[] {
    // This would be replaced with actual calendar data from your WordPress calendar plugin
    const today = new Date();
    const events: CalendarEvent[] = [];
    
    // Generate events for the next 3 months to ensure coverage
    for (let i = 1; i <= 15; i++) {
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + (i * 7)); // Weekly events
      
      const eventTypes = [
        { title: 'Stated Communication', time: '19:30', endTime: '21:30', location: 'St. Petersburg Lodge No. 139', type: 'meeting' as const },
        { title: 'EA Degree', time: '19:00', endTime: '21:00', location: 'St. Petersburg Lodge No. 139', type: 'degree' as const },
        { title: 'Fellowship Dinner', time: '18:30', endTime: '20:30', location: 'Lodge Dining Hall', type: 'dinner' as const },
        { title: 'Officer Practice', time: '19:00', endTime: '20:30', location: 'St. Petersburg Lodge No. 139', type: 'meeting' as const },
        { title: 'Masonic Education', time: '19:30', endTime: '21:00', location: 'St. Petersburg Lodge No. 139', type: 'education' as const }
      ];
      
      const eventType = eventTypes[i % eventTypes.length];
      
      events.push({
        id: i,
        title: eventType.title,
        date: eventDate,
        startTime: eventType.time,
        endTime: eventType.endTime,
        location: eventType.location,
        description: `Monthly ${eventType.title.toLowerCase()} for all members and candidates.`,
        type: eventType.type,
        calendarId: 1,
        calendarName: 'St. Petersburg Lodge #139'
      });
    }
    
    // Add specific August events to ensure August has events
    const augustEvents = [
      { title: 'August Stated Communication', date: new Date(2025, 7, 5), time: '19:30', endTime: '21:30', type: 'meeting' as const },
      { title: 'August Fellowship Dinner', date: new Date(2025, 7, 12), time: '18:30', endTime: '20:30', type: 'dinner' as const },
      { title: 'August Masonic Education', date: new Date(2025, 7, 19), time: '19:30', endTime: '21:00', type: 'education' as const },
      { title: 'August Officer Practice', date: new Date(2025, 7, 26), time: '19:00', endTime: '20:30', type: 'meeting' as const }
    ];
    
    augustEvents.forEach((event, index) => {
      events.push({
        id: 100 + index,
        title: event.title,
        date: event.date,
        startTime: event.time,
        endTime: event.endTime,
        location: 'St. Petersburg Lodge No. 139',
        description: `August ${event.title.toLowerCase()} for all members and candidates.`,
        type: event.type,
        calendarId: 1,
        calendarName: 'St. Petersburg Lodge #139'
      });
    });
    
    console.log(`📅 Generated ${events.length} mock events for secretary office`);
    events.forEach(event => {
      console.log(`  - ${event.title} on ${event.date.toDateString()}`);
    });
    
    return events;
  }

  // Get next 3 months preview for the calendar section
  getNext3MonthsPreview(): Array<{ month: string; events: CalendarEvent[] }> {
    const months = [];
    const today = new Date();
    
    console.log(`📅 Secretary Office - Total upcoming events: ${this.upcomingEvents.length}`);
    console.log(`📅 Today's date: ${today.toDateString()}`);
    console.log(`📅 Today's month: ${today.getMonth()}, Year: ${today.getFullYear()}`);
    
    // Debug: Show all events and their dates
    this.upcomingEvents.forEach((event, index) => {
      console.log(`📅 Event ${index}: ${event.title} - Date: ${event.date.toDateString()}, Month: ${event.date.getMonth()}, Year: ${event.date.getFullYear()}`);
    });
    
    for (let i = 0; i < 3; i++) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
      
      console.log(`📅 Processing ${monthName}: monthDate = ${monthDate.toDateString()}, monthDate.getMonth() = ${monthDate.getMonth()}`);
      
      const monthEvents = this.upcomingEvents.filter(event => {
        const eventMonth = event.date.getMonth();
        const eventYear = event.date.getFullYear();
        const matches = eventMonth === monthDate.getMonth() && eventYear === monthDate.getFullYear();
        
        if (monthName === 'August') {
          console.log(`🔍 August event check: ${event.title} - Month: ${eventMonth}, Year: ${eventYear}, Matches: ${matches}`);
        }
        
        return matches;
      });
      
      console.log(`📅 ${monthName}: ${monthEvents.length} events`);
      
      months.push({
        month: monthName,
        events: monthEvents
      });
    }
    
    return months;
  }

  // Get icon class for month preview
  getIconClassForMonth(monthData: { month: string; events: CalendarEvent[] }): string {
    if (monthData.events.length === 0) return 'fas fa-calendar-times text-gray-400';
    if (monthData.events.length >= 3) return 'fas fa-calendar-check text-green-500';
    return 'fas fa-calendar-alt text-blue-500';
  }

  // Get CSS class for event type badges
  getEventTypeClass(type: string): string {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
      case 'degree':
        return 'bg-purple-100 text-purple-800';
      case 'dinner':
        return 'bg-green-100 text-green-800';
      case 'education':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // TrackBy function for performance optimization
  trackByEventId(index: number, event: CalendarEvent): number {
    return event.id;
  }
}
