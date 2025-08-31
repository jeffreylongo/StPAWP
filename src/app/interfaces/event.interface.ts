export interface Event {
  id: number;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  description?: string;
}

export interface CalendarEvent extends Event {
  type: 'meeting' | 'degree' | 'dinner' | 'education' | 'other';
  isRecurring?: boolean;
  recurringPattern?: string;
  attendees?: number;
  requiresRsvp?: boolean;
  calendarId?: number;
  calendarName?: string;
  uid?: string;
}

// ICS Calendar specific interfaces
export interface ICalendarEvent {
  uid: string;
  summary: string;
  description?: string;
  dtstart: Date;
  dtend?: Date;
  location?: string;
  categories?: string[];
  rrule?: string;
  created?: Date;
  lastModified?: Date;
}

export interface CalendarSource {
  id: number;
  name: string;
  url: string;
  isActive: boolean;
  color?: string;
  description?: string;
}

export interface CalendarSyncResult {
  success: boolean;
  eventsCount: number;
  message: string;
  errors?: string[];
}
