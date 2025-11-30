import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEvent } from '../../interfaces';
import { SecretaryOfficeService, SecretaryOfficeData, SecretaryUpdate } from '../../services/secretary-office.service';
import { Observable, of, combineLatest } from 'rxjs';
import { catchError, map, filter, take } from 'rxjs/operators';
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

    // Wait for calendar service to finish loading, then get real events
    // Filter for St. Pete Lodge events only (calendarId = 1)
    combineLatest([
      this.calendarService.loading$,
      this.calendarService.getUpcomingEvents(90) // Get next 3 months of events
    ]).pipe(
      filter(([loading, _]) => !loading), // Only proceed when loading is complete
      take(1), // Take only the first emission after loading completes
      map(([_, events]) => events.filter(event => event.calendarId === 1)), // Only St. Pete Lodge events
      catchError(error => {
        console.error('Error loading calendar events:', error);
        return of([]);
      })
    )
      .subscribe({
        next: (events) => {
          this.upcomingEvents = events;
          this.isLoadingEvents = false;
          console.log(`📋 Secretary Office loaded ${events.length} real upcoming Lodge events`);
        },
        error: (error) => {
          console.error('Error loading events:', error);
          this.upcomingEvents = [];
          this.isLoadingEvents = false;
        }
      });
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
