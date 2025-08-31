import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WordPressService } from '../../services/wordpress.service';
import { CalendarService } from '../../services/calendar.service';
import { LodgeEmblemComponent } from '../../components/lodge-emblem/lodge-emblem.component';
import { WordPressPost, CalendarEvent } from '../../interfaces';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LodgeEmblemComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  announcements: WordPressPost[] = [];
  upcomingEvents: CalendarEvent[] = [];
  isLoadingAnnouncements = true;
  isLoadingEvents = true;

  // Skeleton loading items
  skeletonItems = Array(3).fill(0);

  constructor(
    private wordpressService: WordPressService,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();
    this.loadEvents();
  }

  loadAnnouncements(): void {
    this.isLoadingAnnouncements = true;
    
    // Try to get announcements, fallback to regular posts
    this.wordpressService.getPosts({ per_page: 6 })
      .pipe(
        catchError(error => {
          console.error('Error loading announcements:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (posts) => {
          this.announcements = posts;
          this.isLoadingAnnouncements = false;
        },
        error: (error) => {
          console.error('Error loading announcements:', error);
          this.announcements = [];
          this.isLoadingAnnouncements = false;
        }
      });
  }

    loadEvents(): void {
    this.isLoadingEvents = true;

    // Load real events from the calendar service - filter for St. Pete Lodge only (calendarId = 1)
    // Use 6-month range but limit display to next 10 events for home page
    this.calendarService.getNext6MonthsEvents()
      .pipe(
        map(events => events
          .filter(event => event.calendarId === 1) // Only St. Pete Lodge events
          .slice(0, 10) // Limit to next 10 events for home page display
        ),
        catchError(error => {
          console.error('Error loading calendar events:', error);
          return of(this.generateMockEvents());
        })
      )
      .subscribe({
        next: (events) => {
          this.upcomingEvents = events;
          this.isLoadingEvents = false;
          console.log(`🏠 Home page loaded ${events.length} upcoming Lodge events from 6-month cache`);
        },
        error: (error) => {
          console.error('Error loading events:', error);
          this.upcomingEvents = this.generateMockEvents();
          this.isLoadingEvents = false;
        }
      });
  }

  private generateMockEvents(): CalendarEvent[] {
    // This would be replaced with actual calendar data from your WordPress calendar plugin
    const today = new Date();
    const events: CalendarEvent[] = [];
    
    // Generate some upcoming events for demonstration
    for (let i = 1; i <= 5; i++) {
      const eventDate = new Date(today);
      eventDate.setDate(today.getDate() + (i * 3));
      
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
    
    return events;
  }

  getExcerpt(htmlContent: string): string {
    // Strip HTML tags and limit to ~150 characters
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (textContent.length > 150) {
      return textContent.substring(0, 150) + '...';
    }
    return textContent;
  }

  // TrackBy functions for performance optimization
  trackByAnnouncementId(index: number, announcement: WordPressPost): number {
    return announcement.id;
  }

  trackByEventId(index: number, event: CalendarEvent): number {
    return event.id;
  }
}