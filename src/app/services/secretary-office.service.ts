import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WordPressPage } from '../interfaces/wordpress.interface';
import { 
  getLastMeetingDate, 
  getNextMeetingDate, 
  formatNextMeeting 
} from '../utils/meeting-dates.util';
import { environment } from '../../environments/environment';

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
  private readonly baseUrl = environment.wordpress.apiUrl;
  
  // Fallback data if WordPress is unavailable — kept in sync with the native Trestle Board
  private get fallbackData(): SecretaryOfficeData {
    const lastMeeting = getLastMeetingDate();
    const nextMeeting = getNextMeetingDate();
    const monthName = new Date().toLocaleDateString('en-US', { month: 'long' });
    
    return {
      lastMeeting: {
        id: 1,
        title: 'Stated Communication — June 21, 2026',
        content: 'We opened in Due Form with 26 members & visitors present. The Craft received news of Brothers who Passed to the Celestial Lodge above, balloted a Resolution for Honorary Membership, welcomed four first-time visitors, heard from R∴W∴ Steve Clark, and witnessed Fellow Craft Catechism proficiency. A petition from Mr. Jeffrey A. Williams was referred to investigation. The Craft voted support for community and Grand Lodge charities. Brother Craig Hull presented Masonic Education.',
        date: lastMeeting.toISOString().split('T')[0],
        type: 'meeting-summary',
        metadata: {
          meeting_date: 'June 21, 2026',
          highlights: [
            'Fellow Craft Catechism proficiency demonstrated — Master Mason Degree set for August 11',
            'Petition for the Three Degrees received from Mr. Jeffrey A. Williams',
            'Support approved for Northshore Elementary, Grand Master’s Charity, and other causes',
            'Masonic Education presented by Brother Craig Hull, Junior Warden'
          ]
        }
      },
      nextMeeting: {
        id: 2,
        title: `${nextMeeting.toLocaleDateString('en-US', { month: 'long' })} Stated Communication`,
        content: `Next Stated Communication: ${formatNextMeeting(nextMeeting)}. District Deputy Grand Master’s Official Visit (DDOV) to St. Petersburg Lodge No. 139. Dinner 6:30 PM / Stated Meeting 7:30 PM. Dress code is Suit and Tie (do not wear a tuxedo — only the DDGM wears a tuxedo to his DDOV). Mandatory for Lodge officers.`,
        date: nextMeeting.toISOString().split('T')[0],
        type: 'upcoming',
        metadata: {
          next_meeting: formatNextMeeting(nextMeeting),
          next_meeting_highlights: [
            'District Deputy Grand Master’s Official Visit (DDOV)',
            'Dinner 6:30 PM · Stated Meeting 7:30 PM',
            'Dress: Suit and Tie (officers — no tuxedo)',
            'Mandatory for Officers of St. Petersburg Lodge'
          ]
        }
      },
      birthdays: {
        id: 3,
        title: `${monthName} Birthdays`,
        content: '7 Brothers celebrating birthdays in July. We wish each and every Brother a Very Happy Birthday!',
        date: new Date().toISOString().split('T')[0],
        type: 'birthdays',
        metadata: {
          birthday_brothers: [
            { name: 'Albert Currie Hopper III, P∴M∴', date: '10th' },
            { name: 'Hardy William Bryan III, P∴M∴', date: '20th' },
            { name: 'Richard Alan Aarts, P∴M∴', date: '24th' },
            { name: 'James Calloway Stinson, Jr.', date: '26th' },
            { name: 'Rocco Nick Griesi, P∴M∴', date: '29th' },
            { name: 'Earl Clayton Ray, PDDGM', date: '30th' },
            { name: 'Alan Scott Rosenthal, PDDGM', date: '31st' }
          ]
        }
      },
      anniversaries: {
        id: 4,
        title: `${monthName} Masonic Anniversaries`,
        content: '2 Brothers celebrating July Raising anniversaries. Your Lodge congratulates you and thanks you for your continuous support!',
        date: new Date().toISOString().split('T')[0],
        type: 'anniversaries',
        metadata: {
          anniversary_brothers: [
            { name: 'Mark Steven Hanisee', date: 'July 22, 1980', years: 45 },
            { name: 'James William M. Thomas, P∴M∴', date: 'July 26, 1974', years: 51 }
          ]
        }
      },
      upcomingEvents: {
        id: 5,
        title: 'What You Can Look Forward to in the Coming Months',
        content: 'Grand Master’s Official Visit (GMOV) August 14, Master Mason Degree August 11, August Stated Communication with DDOV, Fellow Craft Degree work in September, new building progress, and Masonic Education resources for the Craft.',
        date: new Date().toISOString().split('T')[0],
        type: 'upcoming',
        metadata: {
          highlights: [
            'Grand Master’s Official Visit (GMOV) — Friday, August 14',
            'Master Mason Degree — Tuesday, August 11',
            'Stated Communication & DDOV — Tuesday, August 18',
            'Fellow Craft Degree — Tuesday, September 22',
            'New Lodge building progress updates',
            'Masonic Education resources for members'
          ]
        }
      }
    };
  }

  constructor(private http: HttpClient) {}

  // Get all secretary office data
  getSecretaryOfficeData(): Observable<SecretaryOfficeData> {
    // Native Trestle Board–aligned content (WordPress page feed was unreliable/outdated)
    return of(this.fallbackData);
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
