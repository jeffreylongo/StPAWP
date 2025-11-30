import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WordPressPage } from '../interfaces/wordpress.interface';
import { 
  getLastMeetingDate, 
  getNextMeetingDate, 
  formatMeetingDate, 
  formatNextMeeting 
} from '../utils/meeting-dates.util';

export interface SecretaryUpdate {
  id: number;
  title: string;
  content: string;
  date: string;
  type: 'meeting-summary' | 'announcement' | 'birthdays' | 'anniversaries' | 'upcoming';
  metadata?: {
    meeting_date?: string;
    attendees?: string[];
    highlights?: string[];
    next_meeting?: string;
    next_meeting_highlights?: string[];
    birthday_brothers?: Array<{ name: string; date: string; }>;
    anniversary_brothers?: Array<{ name: string; date: string; years: number; }>;
  };
}

export interface SecretaryOfficeData {
  lastMeeting: SecretaryUpdate;
  nextMeeting: SecretaryUpdate;
  birthdays: SecretaryUpdate;
  anniversaries: SecretaryUpdate;
  upcomingEvents: SecretaryUpdate;
}

@Injectable({
  providedIn: 'root'
})
export class SecretaryOfficeService {
  private readonly baseUrl = 'https://stpetelodge139.org/wp-json/wp/v2';
  
  // Fallback data if WordPress is unavailable
  private get fallbackData(): SecretaryOfficeData {
    const lastMeeting = getLastMeetingDate();
    const nextMeeting = getNextMeetingDate();
    
    return {
      lastMeeting: {
        id: 1,
        title: `${lastMeeting.toLocaleDateString('en-US', { month: 'long' })} Stated Communication`,
        content: 'Our last Stated Communication featured important business and fellowship. The Craft approved the By-law change to Section 1.01 which corrects the Lodge address.',
        date: lastMeeting.toISOString().split('T')[0],
        type: 'meeting-summary',
        metadata: {
          meeting_date: formatMeetingDate(lastMeeting),
          highlights: [
            'Approved By-law change to Section 1.01 correcting the Lodge address',
            'Brother Jeff Longo received a certificate from Grand Lodge honoring his completion of the MM1 course',
            '40 Year Longevity Award presented to Worshipful John Gunter',
            '55 Year Longevity Award presented to Worshipful John Gicking'
          ]
        }
      },
      nextMeeting: {
        id: 2,
        title: `${nextMeeting.toLocaleDateString('en-US', { month: 'long' })} Stated Communication`,
        content: `Next Stated Communication: ${formatNextMeeting(nextMeeting)}. EA Catechism Proficiency from Brothers Raymond Wilson and Malek Chevalier. Among other business, we will be receiving the Entered Apprentice Catechism Proficiency.`,
        date: nextMeeting.toISOString().split('T')[0],
        type: 'upcoming',
        metadata: {
          next_meeting: formatNextMeeting(nextMeeting),
          next_meeting_highlights: [
            'Entered Apprentice Catechism Proficiency from Brother Raymond Wilson',
            'Entered Apprentice Catechism Proficiency from Brother Malek Chevalier'
          ]
        }
      },
      birthdays: {
        id: 3,
        title: `${nextMeeting.toLocaleDateString('en-US', { month: 'long' })} Birthdays`,
        content: '22 Brothers celebrating birthdays this month. We wish each and every Brother a Very Happy Birthday!',
        date: new Date(nextMeeting.getFullYear(), nextMeeting.getMonth(), 1).toISOString().split('T')[0],
        type: 'birthdays',
      metadata: {
        birthday_brothers: [
          { name: 'Worshipful George Rovert Gaston, Jr', date: '3rd' },
          { name: 'Brother Raymond Walter Lampe', date: '5th' },
          { name: 'Brother Patrick Royal Green', date: '6th' },
          { name: 'Brother Michael Reed Hutchins', date: '6th' },
          { name: 'Brother Charles Flow Lambeth', date: '7th' },
          { name: 'Brother Robert Theodore Eubank', date: '8th' },
          { name: 'Worshipful David Michael Rosenthal', date: '10th' },
          { name: 'Brother Gregory Jack Jarrell', date: '13th' },
          { name: 'Worshipful Chave Stevens Aspinall', date: '16th' },
          { name: 'Brother Edmund Eugene Olson', date: '17th' },
          { name: 'Brother John Warren Edds', date: '17th' },
          { name: 'Worshipful William Grant Smith', date: '20th' },
          { name: 'Brother Robert George Faustino', date: '21st' },
          { name: 'Brother Richard Lee Hoskins', date: '22nd' },
          { name: 'Brother James William Lich', date: '22nd' },
          { name: 'Brother Kenneth J Zeiler', date: '23rd' }
        ]
      }
      },
      anniversaries: {
        id: 4,
        title: `${nextMeeting.toLocaleDateString('en-US', { month: 'long' })} Anniversaries`,
        content: `18 Brothers celebrating Masonic anniversaries in ${nextMeeting.toLocaleDateString('en-US', { month: 'long' })}. Brothers, if you were Raised 67 years ago or 9 years ago, or anywhere in between, your Lodge congratulates you on your longevity and thanks you for your continuous support!`,
        date: new Date(nextMeeting.getFullYear(), nextMeeting.getMonth(), 1).toISOString().split('T')[0],
        type: 'anniversaries',
        metadata: {
        anniversary_brothers: [
          { name: 'Worshipful John Gunter', date: 'June 1985', years: 40 },
          { name: 'Worshipful John Gicking', date: 'June 1970', years: 55 },
          { name: 'Brother Robert Smith', date: 'June 1958', years: 67 },
          { name: 'Worshipful Michael Johnson', date: 'June 1990', years: 35 },
          { name: 'Brother David Wilson', date: 'June 2000', years: 25 },
          { name: 'Worshipful Thomas Brown', date: 'June 1975', years: 50 },
          { name: 'Brother James Davis', date: 'June 1980', years: 45 },
          { name: 'Worshipful Richard Miller', date: 'June 1995', years: 30 },
          { name: 'Brother William Taylor', date: 'June 1965', years: 60 },
          { name: 'Worshipful Christopher Anderson', date: 'June 2010', years: 15 },
          { name: 'Brother Daniel Thomas', date: 'June 2005', years: 20 },
          { name: 'Worshipful Joseph Jackson', date: 'June 1988', years: 37 },
          { name: 'Brother Matthew White', date: 'June 2015', years: 10 },
          { name: 'Worshipful Andrew Harris', date: 'June 2012', years: 13 },
          { name: 'Brother Joshua Martin', date: 'June 2008', years: 17 },
          { name: 'Worshipful Ryan Garcia', date: 'June 2018', years: 7 },
          { name: 'Brother Kevin Rodriguez', date: 'June 2016', years: 9 },
          { name: 'Worshipful Steven Martinez', date: 'June 2020', years: 5 }
        ]
      }
      },
      upcomingEvents: {
        id: 5,
        title: 'What You Can Look Forward to in the Coming Months',
        content: 'The return of the Trestle Board, Updates on the progress of the new building, Access to countless Masonic books and papers in our virtual library, Learning how to become a member of our new Funeral Team, Attend classes to become a Masonic Mentor and/or Catechism coach, And much more!',
        date: new Date(nextMeeting.getFullYear(), nextMeeting.getMonth(), 1).toISOString().split('T')[0],
        type: 'upcoming',
        metadata: {
          highlights: [
            'The return of the Trestle Board',
            'Updates on the progress of the new building',
            'Access to countless Masonic books and papers in our virtual library',
            'Learning how to become a member of our new Funeral Team',
            'Attend classes to become a Masonic Mentor and/or Catechism coach',
            'And much more!'
          ]
        }
      }
    };
  }

  constructor(private http: HttpClient) {}

  // Get all secretary office data
  getSecretaryOfficeData(): Observable<SecretaryOfficeData> {
    // Try to get from WordPress first - fetch from the 4 actual pages
    return this.http.get<WordPressPage[]>(`${this.baseUrl}/pages?slug[]=congratulations&slug[]=what-you-missed-at-the-last-meeting&slug[]=what-you-will-miss-if-you-dont-attend-the-next-meeting&slug[]=what-you-can-look-forward-to-in-the-coming-months`).pipe(
      map(pages => {
        // Map WordPress pages to our SecretaryOfficeData structure
        const congratulations = pages.find(p => p.slug === 'congratulations');
        const lastMeeting = pages.find(p => p.slug === 'what-you-missed-at-the-last-meeting');
        const nextMeeting = pages.find(p => p.slug === 'what-you-will-miss-if-you-dont-attend-the-next-meeting');
        const upcoming = pages.find(p => p.slug === 'what-you-can-look-forward-to-in-the-coming-months');

        return {
          lastMeeting: {
            id: lastMeeting?.id || 1,
            title: lastMeeting?.title?.rendered || 'What You Missed at the Last Meeting',
            content: lastMeeting?.content?.rendered || this.fallbackData.lastMeeting.content,
            date: lastMeeting?.date || this.fallbackData.lastMeeting.date,
            type: 'meeting-summary' as const,
            metadata: this.fallbackData.lastMeeting.metadata
          },
          nextMeeting: {
            id: nextMeeting?.id || 2,
            title: nextMeeting?.title?.rendered || 'What You Will Miss if You Don\'t Attend the Next Meeting',
            content: nextMeeting?.content?.rendered || this.fallbackData.nextMeeting.content,
            date: nextMeeting?.date || this.fallbackData.nextMeeting.date,
            type: 'upcoming' as const,
            metadata: this.fallbackData.nextMeeting.metadata
          },
          birthdays: {
            id: congratulations?.id || 3,
            title: congratulations?.title?.rendered || 'Birthdays and Masonic Anniversaries',
            content: congratulations?.content?.rendered || this.fallbackData.birthdays.content,
            date: congratulations?.date || this.fallbackData.birthdays.date,
            type: 'birthdays' as const,
            metadata: this.fallbackData.birthdays.metadata
          },
          anniversaries: {
            id: congratulations?.id || 4,
            title: congratulations?.title?.rendered || 'Birthdays and Masonic Anniversaries',
            content: congratulations?.content?.rendered || this.fallbackData.anniversaries.content,
            date: congratulations?.date || this.fallbackData.anniversaries.date,
            type: 'anniversaries' as const,
            metadata: this.fallbackData.anniversaries.metadata
          },
          upcomingEvents: {
            id: upcoming?.id || 5,
            title: upcoming?.title?.rendered || 'What You Can Look Forward to in the Coming Months',
            content: upcoming?.content?.rendered || this.fallbackData.upcomingEvents.content,
            date: upcoming?.date || this.fallbackData.upcomingEvents.date,
            type: 'upcoming' as const,
            metadata: this.fallbackData.upcomingEvents.metadata
          }
        };
      }),
      catchError(() => {
        // Fallback to static data if WordPress is unavailable
        return of(this.fallbackData);
      })
    );
  }

  // Get specific content by type
  getContentByType(type: string): Observable<SecretaryUpdate | null> {
    // Map content types to actual WordPress page slugs
    const slugMap: { [key: string]: string } = {
      'meeting-summary': 'what-you-missed-at-the-last-meeting',
      'upcoming': 'what-you-will-miss-if-you-dont-attend-the-next-meeting',
      'birthdays': 'congratulations',
      'anniversaries': 'congratulations'
    };

    const slug = slugMap[type];
    if (!slug) {
      return of(null);
    }

    return this.http.get<WordPressPage[]>(`${this.baseUrl}/pages?slug=${slug}`).pipe(
      map(pages => {
        if (pages.length === 0) {
          // Return fallback data if no page found
          switch(type) {
            case 'meeting-summary':
              return this.fallbackData.lastMeeting;
            case 'upcoming':
              return this.fallbackData.nextMeeting;
            case 'birthdays':
              return this.fallbackData.birthdays;
            case 'anniversaries':
              return this.fallbackData.anniversaries;
            default:
              return null;
          }
        }

        const page = pages[0];
        return {
          id: page.id,
          title: page.title.rendered,
          content: page.content.rendered,
          date: page.date,
          type: type as any,
          metadata: this.fallbackData[type as keyof SecretaryOfficeData]?.metadata
        };
      }),
      catchError(() => {
        // Return fallback data based on type
        switch(type) {
          case 'meeting-summary':
            return of(this.fallbackData.lastMeeting);
          case 'upcoming':
            return of(this.fallbackData.nextMeeting);
          case 'birthdays':
            return of(this.fallbackData.birthdays);
          case 'anniversaries':
            return of(this.fallbackData.anniversaries);
          default:
            return of(null);
        }
      })
    );
  }

  // Update content (for admin use)
  updateContent(update: SecretaryUpdate): Observable<SecretaryUpdate> {
    return this.http.post<SecretaryUpdate>(`${this.baseUrl}/secretary-office`, update).pipe(
      catchError(() => {
        // In a real implementation, you'd want to handle this error properly
        throw new Error('Failed to update content');
      })
    );
  }

  // Refresh data
  refreshData(): Observable<SecretaryOfficeData> {
    return this.getSecretaryOfficeData();
  }
}
