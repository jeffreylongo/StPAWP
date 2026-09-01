import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalendarService } from '../../services/calendar.service';
import { SecretaryOfficeService, SecretaryOfficeData } from '../../services/secretary-office.service';
import { LodgeEmblemComponent } from '../../components/lodge-emblem/lodge-emblem.component';
import { MasonicQuoteComponent } from '../../shared/components/masonic-quote/masonic-quote.component';
import { TextAlertBannerComponent } from '../../shared/components/text-alert-banner/text-alert-banner.component';
import { CalendarEvent } from '../../interfaces';
import { Observable, of, combineLatest, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { StripHtmlPipe } from '../../pipes/strip-html.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LodgeEmblemComponent, MasonicQuoteComponent, StripHtmlPipe, TextAlertBannerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  upcomingEvents: CalendarEvent[] = [];
  secretaryData$!: Observable<SecretaryOfficeData>;
  isLoadingEvents = true;
  private destroy$ = new Subject<void>();

  constructor(
    private calendarService: CalendarService,
    private secretaryOfficeService: SecretaryOfficeService
  ) {}

  ngOnInit(): void {
    this.subscribeToLodgeEvents();
    this.secretaryData$ = this.secretaryOfficeService.getSecretaryOfficeData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvents(): void {
    this.isLoadingEvents = true;
    this.calendarService.refreshCalendars();
  }

  private subscribeToLodgeEvents(): void {
    combineLatest([
      this.calendarService.loading$,
      this.calendarService.getNext6MonthsEvents()
    ]).pipe(
      takeUntil(this.destroy$),
      map(([loading, events]) => ({
        loading,
        lodgeEvents: events
          .filter(event => event.calendarId === 1)
          .slice(0, 10)
      })),
      catchError(error => {
        console.error('Error loading calendar events:', error);
        return of({
          loading: false,
          lodgeEvents: [] as CalendarEvent[]
        });
      })
    )
      .subscribe({
        next: ({ loading, lodgeEvents }) => {
          this.upcomingEvents = lodgeEvents;
          this.isLoadingEvents = loading && lodgeEvents.length === 0;
          console.log(`🏠 Home page showing ${lodgeEvents.length} upcoming Lodge events`);
        },
        error: (error) => {
          console.error('Error loading events:', error);
          this.isLoadingEvents = false;
        }
      });
  }

  // TrackBy function for performance optimization
  trackByEventId(index: number, event: CalendarEvent): number {
    return event.id;
  }
}