import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEvent } from '../../interfaces';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-secretary-office',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-primary-blue-dark text-white py-16">
      <div class="container mx-auto px-4">
        <nav class="flex items-center gap-2 text-sm mb-4">
          <a routerLink="/" class="hover:text-primary-gold transition-colors">Home</a>
          <i class="fas fa-chevron-right"></i>
          <span class="text-primary-gold">The Secretary's Office</span>
        </nav>
        <h1 class="font-cinzel text-4xl md:text-5xl font-bold">The Secretary's Office</h1>
        <p class="text-lg mt-4 text-primary-gold-light">Communications and Updates from the Lodge Secretary</p>
      </div>
    </div>
    
    <div class="container mx-auto px-4 py-12">
      <!-- Introduction -->
      <div class="max-w-4xl mx-auto mb-12">
        <div class="bg-white border border-gray-200 rounded-lg shadow-md p-8">
          <div class="flex items-center mb-6">
            <i class="fas fa-user-tie text-primary-gold text-3xl mr-4"></i>
            <div>
              <h2 class="font-cinzel text-2xl text-primary-blue font-bold">From the Secretary's Desk</h2>
              <p class="text-gray-600">Stay informed with the latest lodge communications</p>
            </div>
          </div>
          <p class="text-gray-700 leading-relaxed">
            Welcome to the Secretary's Office. Here you'll find important updates about our lodge activities, 
            meeting summaries, upcoming events, and special announcements. We encourage all members to stay 
            connected with lodge activities and participate in our fraternal fellowship.
          </p>
        </div>
      </div>

      <!-- Secretary's Updates Sections -->
      <div class="grid lg:grid-cols-2 gap-8 mb-12">
        <!-- What You Missed -->
        <div class="bg-neutral-light border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-primary-blue text-white p-6">
            <div class="flex items-center">
              <i class="fas fa-history text-primary-gold text-2xl mr-3"></i>
              <h3 class="font-cinzel text-xl font-bold">What You Missed at the Last Meeting</h3>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="border-l-4 border-primary-gold pl-4">
                <h4 class="font-semibold text-primary-blue mb-2">December Stated Communication</h4>
                <p class="text-gray-700 text-sm mb-2">December 17, 2024</p>
                <ul class="text-gray-600 space-y-1 text-sm">
                  <li>• Approved minutes from November meeting</li>
                  <li>• Discussed upcoming charity drive</li>
                  <li>• Planned January officer installation</li>
                  <li>• Welcomed visiting brethren from Lodge 25</li>
                </ul>
              </div>
              <div class="border-l-4 border-primary-blue pl-4">
                <h4 class="font-semibold text-primary-blue mb-2">Fellowship Dinner</h4>
                <p class="text-gray-700 text-sm mb-2">December 17, 2024</p>
                <p class="text-gray-600 text-sm">
                  Excellent turnout with 45 members and guests enjoying a traditional holiday meal 
                  prepared by our kitchen committee.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- What You Will Miss -->
        <div class="bg-neutral-light border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <div class="bg-primary-gold text-primary-blue-darker p-6">
            <div class="flex items-center">
              <i class="fas fa-exclamation-triangle text-primary-blue-darker text-2xl mr-3"></i>
              <h3 class="font-cinzel text-xl font-bold">What You Will Miss if You Don't Attend the Next Meeting</h3>
            </div>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="border-l-4 border-primary-blue pl-4">
                <h4 class="font-semibold text-primary-blue mb-2">January Stated Communication</h4>
                <p class="text-gray-700 text-sm mb-2">January 21, 2025 - 7:30 PM</p>
                <ul class="text-gray-600 space-y-1 text-sm">
                  <li>• Installation of 2025 Officers</li>
                  <li>• Presentation of annual awards</li>
                  <li>• Discussion of lodge improvement projects</li>
                  <li>• Special guest speaker on Masonic history</li>
                </ul>
              </div>
              <div class="bg-primary-gold-light p-3 rounded">
                <p class="text-primary-blue-darker text-sm font-medium">
                  <i class="fas fa-star mr-2"></i>
                  Don't miss the installation ceremony - a cornerstone event of our Masonic year!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coming Months -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-md mb-12">
        <div class="bg-primary-blue-dark text-white p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <i class="fas fa-calendar-alt text-primary-gold text-2xl mr-3"></i>
              <h3 class="font-cinzel text-xl font-bold">What You Can Look Forward to in the Coming Months</h3>
            </div>
            <div *ngIf="isLoadingEvents" class="flex items-center text-primary-gold">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              <span class="text-sm">Loading events...</span>
            </div>
          </div>
        </div>
        <div class="p-6">
          <!-- Loading State -->
          <div *ngIf="isLoadingEvents" class="grid md:grid-cols-3 gap-6">
            <div *ngFor="let item of [1,2,3]" class="animate-pulse">
              <div class="bg-gray-200 rounded-full w-16 h-16 mx-auto mb-3"></div>
              <div class="bg-gray-200 h-6 w-20 mx-auto mb-2 rounded"></div>
              <div class="bg-gray-200 h-4 w-full mb-1 rounded"></div>
              <div class="bg-gray-200 h-4 w-3/4 mx-auto rounded"></div>
            </div>
          </div>

          <!-- Real Events Display -->
          <div *ngIf="!isLoadingEvents && upcomingEvents.length > 0">
            <!-- Month Preview Cards -->
            <div class="grid md:grid-cols-3 gap-6 mb-8">
              <div *ngFor="let monthData of getNext3MonthsPreview(); let i = index" class="text-center">
                <div [ngClass]="{
                  'bg-primary-gold text-primary-blue-darker': i === 0,
                  'bg-primary-blue text-white': i === 1,
                  'bg-primary-gold-light text-primary-blue': i === 2
                }" class="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <i [class]="'text-xl ' + getIconClassForMonth(monthData)"></i>
                </div>
                <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-2">{{ monthData.month }}</h4>
                <p class="text-gray-600 text-sm">
                  {{ monthData.events.length }} scheduled event{{ monthData.events.length !== 1 ? 's' : '' }}
                </p>
                <div class="mt-2 text-xs text-gray-500">
                  <div *ngFor="let event of monthData.events.slice(0, 2)" class="truncate">
                    {{ event.title }}
                  </div>
                  <div *ngIf="monthData.events.length > 2" class="text-primary-blue font-medium">
                    +{{ monthData.events.length - 2 }} more
                  </div>
                </div>
              </div>
            </div>

            <!-- Detailed Events List -->
            <div class="border-t pt-6">
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-4 flex items-center">
                <i class="fas fa-list mr-2 text-primary-gold"></i>
                Upcoming Lodge Events
              </h4>
              <div class="space-y-3">
                <div *ngFor="let event of upcomingEvents.slice(0, 8); trackBy: trackByEventId" 
                     class="flex items-start gap-4 p-4 bg-neutral-light rounded-lg hover:shadow-md transition-shadow">
                  <div class="bg-primary-blue text-white rounded-lg min-w-16 h-16 flex flex-col items-center justify-center flex-shrink-0">
                    <span class="text-lg font-bold">{{ event.date | date:'d' }}</span>
                    <span class="text-xs uppercase">{{ event.date | date:'MMM' }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h5 class="font-semibold text-primary-blue mb-1">{{ event.title }}</h5>
                    <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                      <span class="flex items-center">
                        <i class="fas fa-clock mr-1 text-primary-gold"></i>
                        {{ event.startTime }} - {{ event.endTime }}
                      </span>
                      <span class="flex items-center" *ngIf="event.location">
                        <i class="fas fa-map-marker-alt mr-1 text-primary-gold"></i>
                        {{ event.location }}
                      </span>
                    </div>
                    <p *ngIf="event.description" class="text-sm text-gray-700 line-clamp-2">
                      {{ event.description }}
                    </p>
                    <span class="inline-block mt-2 px-2 py-1 text-xs rounded-full" 
                          [class]="getEventTypeClass(event.type)">
                      {{ event.type | titlecase }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="text-center mt-6" *ngIf="upcomingEvents.length > 8">
                <a routerLink="/calendar" 
                   class="inline-flex items-center bg-primary-blue hover:bg-primary-blue-dark text-white px-6 py-3 rounded-md transition-colors">
                  <i class="fas fa-calendar mr-2"></i>
                  View Full Calendar ({{ upcomingEvents.length }} total events)
                </a>
              </div>
            </div>
          </div>

          <!-- No Events State -->
          <div *ngIf="!isLoadingEvents && upcomingEvents.length === 0" class="text-center py-12">
            <i class="fas fa-calendar text-gray-300 text-5xl mb-4"></i>
            <p class="text-gray-500 text-lg mb-2">No upcoming events scheduled</p>
            <p class="text-gray-400 text-sm">Check back soon or contact the Secretary for more information</p>
          </div>
        </div>
      </div>

      <!-- Birthdays and Anniversaries -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-md">
        <div class="bg-gradient-to-r from-primary-blue to-primary-blue-dark text-white p-6">
          <div class="flex items-center">
            <i class="fas fa-birthday-cake text-primary-gold text-2xl mr-3"></i>
            <h3 class="font-cinzel text-xl font-bold">Birthdays and Masonic Anniversaries</h3>
          </div>
        </div>
        <div class="p-6">
          <div class="grid md:grid-cols-2 gap-8">
            <!-- January Birthdays -->
            <div>
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-4 flex items-center">
                <i class="fas fa-gift text-primary-gold mr-2"></i>
                January Birthdays
              </h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-neutral-light rounded">
                  <span class="font-medium">Brother John Smith</span>
                  <span class="text-sm text-gray-600">January 5th</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-neutral-light rounded">
                  <span class="font-medium">Brother Michael Johnson</span>
                  <span class="text-sm text-gray-600">January 12th</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-neutral-light rounded">
                  <span class="font-medium">Brother David Wilson</span>
                  <span class="text-sm text-gray-600">January 28th</span>
                </div>
              </div>
            </div>

            <!-- Masonic Anniversaries -->
            <div>
              <h4 class="font-cinzel text-lg text-primary-blue font-bold mb-4 flex items-center">
                <i class="fas fa-medal text-primary-gold mr-2"></i>
                Masonic Anniversaries
              </h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-primary-gold-light rounded">
                  <div>
                    <span class="font-medium block">Brother Robert Davis</span>
                    <span class="text-xs text-gray-600">25 Years - Silver Anniversary</span>
                  </div>
                  <span class="text-sm text-primary-blue font-bold">Jan 15</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-primary-gold-light rounded">
                  <div>
                    <span class="font-medium block">Brother James Miller</span>
                    <span class="text-xs text-gray-600">10 Years</span>
                  </div>
                  <span class="text-sm text-primary-blue font-bold">Jan 22</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Secretary -->
      <div class="mt-12 text-center">
        <div class="bg-primary-blue text-white p-8 rounded-lg">
          <h3 class="font-cinzel text-2xl font-bold mb-4">Questions or Concerns?</h3>
          <p class="mb-6 text-primary-gold-light">
            The Secretary's Office is here to help. Don't hesitate to reach out with any questions about lodge activities or membership.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="mailto:secretary@stpetelodge139.org" 
               class="bg-primary-gold hover:bg-primary-gold-light text-primary-blue-darker font-semibold px-6 py-3 rounded transition inline-flex items-center">
              <i class="fas fa-envelope mr-2"></i>
              Email the Secretary
            </a>
            <a href="tel:+17274183356" 
               class="border-2 border-white hover:border-primary-gold text-white hover:text-primary-gold px-6 py-3 rounded transition inline-flex items-center">
              <i class="fas fa-phone mr-2"></i>
              (727) 418-3356
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
  `]
})
export class SecretaryOfficeComponent implements OnInit {
  upcomingEvents: CalendarEvent[] = [];
  isLoadingEvents = true;

  constructor(private calendarService: CalendarService) { }

  ngOnInit(): void {
    this.loadUpcomingEvents();
  }

  loadUpcomingEvents(): void {
    this.isLoadingEvents = true;

    // Load events from St. Pete Lodge calendar (calendarId = 1) for the next 6 months
    this.calendarService.getNext6MonthsEvents()
      .pipe(
        map(events => events
          .filter(event => event.calendarId === 1) // Only St. Pete Lodge events
          .slice(0, 12) // Limit to next 12 events for secretary office display
        ),
        catchError(error => {
          console.error('Error loading calendar events for Secretary Office:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (events) => {
          this.upcomingEvents = events;
          this.isLoadingEvents = false;
          console.log(`📋 Secretary Office loaded ${events.length} upcoming Lodge events`);
        },
        error: (error) => {
          console.error('Error loading events:', error);
          this.upcomingEvents = [];
          this.isLoadingEvents = false;
        }
      });
  }

  // Group events by month for display
  getEventsByMonth(): { [key: string]: CalendarEvent[] } {
    const eventsByMonth: { [key: string]: CalendarEvent[] } = {};
    
    this.upcomingEvents.forEach(event => {
      const monthKey = event.date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
      
      if (!eventsByMonth[monthKey]) {
        eventsByMonth[monthKey] = [];
      }
      eventsByMonth[monthKey].push(event);
    });
    
    return eventsByMonth;
  }

  // Get the next 3 months with events for the preview cards
  getNext3MonthsPreview(): { month: string; events: CalendarEvent[] }[] {
    const eventsByMonth = this.getEventsByMonth();
    const months = Object.keys(eventsByMonth).slice(0, 3);
    
    return months.map(month => ({
      month,
      events: eventsByMonth[month]
    }));
  }

  trackByEventId(index: number, event: CalendarEvent): number {
    return event.id;
  }

  // Helper methods for template
  getIconClassForMonth(monthData: { month: string; events: CalendarEvent[] }): string {
    if (monthData.events.some(e => e.type === 'meeting')) return 'fas fa-gavel';
    if (monthData.events.some(e => e.type === 'degree')) return 'fas fa-graduation-cap';
    if (monthData.events.some(e => e.type === 'dinner')) return 'fas fa-utensils';
    if (monthData.events.some(e => e.type === 'education')) return 'fas fa-book';
    return 'fas fa-calendar';
  }

  getEventTypeClass(eventType: string): string {
    const typeClasses: { [key: string]: string } = {
      'meeting': 'bg-blue-100 text-blue-800',
      'degree': 'bg-purple-100 text-purple-800',
      'dinner': 'bg-green-100 text-green-800',
      'education': 'bg-yellow-100 text-yellow-800'
    };
    return typeClasses[eventType] || 'bg-gray-100 text-gray-800';
  }

}
