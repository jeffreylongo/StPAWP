import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { take, filter, map } from 'rxjs/operators';
import { format } from 'date-fns';
import {
  ChatbotRule,
  ChatMessage,
  CHATBOT_RULES,
  GREETING_MESSAGE,
  FALLBACK_MESSAGE,
} from '../components/chatbot/chatbot.rules';
import { CalendarService } from './calendar.service';
import { CalendarEvent } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private messages$ = new BehaviorSubject<ChatMessage[]>([]);
  private isOpen$ = new BehaviorSubject<boolean>(false);
  private hasGreeted = false;

  readonly messages = this.messages$.asObservable();
  readonly isOpen = this.isOpen$.asObservable();

  // Patterns that should trigger dynamic calendar lookup
  private readonly calendarPatterns = [
    'next meeting', 'next event', 'upcoming event', 'upcoming meeting',
    'what\'s coming up', 'what is coming up', 'whats coming up',
    'when is the next', 'what events', 'any events',
    'this week', 'this month', 'schedule'
  ];

  constructor(private calendarService: CalendarService) {}

  /**
   * Toggle the chat window open/closed
   */
  toggleChat(): void {
    const newState = !this.isOpen$.value;
    this.isOpen$.next(newState);

    // Send greeting on first open
    if (newState && !this.hasGreeted) {
      this.sendBotMessage(GREETING_MESSAGE);
      this.hasGreeted = true;
    }
  }

  /**
   * Open the chat window
   */
  openChat(): void {
    if (!this.isOpen$.value) {
      this.toggleChat();
    }
  }

  /**
   * Close the chat window
   */
  closeChat(): void {
    this.isOpen$.next(false);
  }

  /**
   * Process a user message and generate a bot response
   */
  sendUserMessage(text: string): void {
    if (!text.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: this.generateId(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    this.addMessage(userMessage);

    // Check if this is a calendar-related query
    const normalizedInput = text.toLowerCase().trim();
    if (this.isCalendarQuery(normalizedInput)) {
      this.handleCalendarQuery(normalizedInput);
    } else {
      // Process with static rules (with slight delay for natural feel)
      setTimeout(() => {
        const response = this.processMessage(text);
        this.sendBotMessage(response);
      }, 300);
    }
  }

  /**
   * Check if the input is asking about calendar/events
   */
  private isCalendarQuery(input: string): boolean {
    return this.calendarPatterns.some(pattern => input.includes(pattern));
  }

  /**
   * Handle calendar-related queries with dynamic data
   */
  private handleCalendarQuery(input: string): void {
    // Wait for calendar to finish loading, then get events
    combineLatest([
      this.calendarService.loading$,
      this.calendarService.getUpcomingEvents(90)
    ]).pipe(
      filter(([loading, _]) => !loading), // Wait until loading is complete
      take(1),
      map(([_, events]) => events)
    ).subscribe({
      next: (events) => {
        const response = this.formatCalendarResponse(events, input);
        this.sendBotMessage(response);
      },
      error: () => {
        // Fallback to static response if calendar fails
        this.sendBotMessage(this.getStaticCalendarResponse());
      }
    });
  }

  /**
   * Format calendar events into a chat response
   */
  private formatCalendarResponse(events: CalendarEvent[], input: string): string {
    if (!events || events.length === 0) {
      return this.getStaticCalendarResponse();
    }

    // Filter to Lodge events only (calendarId 1) for "next meeting" type queries
    const isAskingAboutMeeting = input.includes('meeting') || input.includes('stated');
    
    let relevantEvents: CalendarEvent[];
    if (isAskingAboutMeeting) {
      // For meeting queries, prioritize Lodge events
      relevantEvents = events.filter(e => e.calendarId === 1);
      if (relevantEvents.length === 0) {
        relevantEvents = events;
      }
    } else {
      relevantEvents = events;
    }

    // Take next 5 events
    const upcomingEvents = relevantEvents.slice(0, 5);

    if (upcomingEvents.length === 0) {
      return this.getStaticCalendarResponse();
    }

    // Format the response
    let response = '**Upcoming Events:**\n\n';

    for (const event of upcomingEvents) {
      const eventDate = new Date(event.date);
      const dayName = format(eventDate, 'EEEE');
      const dateStr = format(eventDate, 'MMMM d, yyyy');
      const timeStr = event.startTime || '';
      
      response += `📅 **${event.title}**\n`;
      response += `   ${dayName}, ${dateStr}`;
      if (timeStr && timeStr !== '00:00') {
        response += ` at ${this.formatTime(timeStr)}`;
      }
      response += '\n';
      if (event.location && event.location !== event.calendarName) {
        response += `   📍 ${event.location}\n`;
      }
      response += '\n';
    }

    response += `Visit our **Calendar** page for the full schedule.`;

    return response;
  }

  /**
   * Format time from 24h to 12h format
   */
  private formatTime(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours)) return time;
    
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }

  /**
   * Get static calendar response (fallback)
   */
  private getStaticCalendarResponse(): string {
    return `**Lodge Schedule:**

Our Stated Communications are held on the **3rd Tuesday of each month**:
• Dinner at 6:30 PM
• Meeting at 7:30 PM

📍 **Location:**
3325 1st St NE
St. Petersburg, FL 33704

Check our **Calendar** page for upcoming events and degree work.`;
  }

  /**
   * Add a bot message to the conversation
   */
  private sendBotMessage(text: string): void {
    const botMessage: ChatMessage = {
      id: this.generateId(),
      text,
      sender: 'bot',
      timestamp: new Date(),
    };
    this.addMessage(botMessage);
  }

  /**
   * Add a message to the conversation history
   */
  private addMessage(message: ChatMessage): void {
    const current = this.messages$.value;
    this.messages$.next([...current, message]);
  }

  /**
   * Process user input and find the best matching rule
   */
  private processMessage(input: string): string {
    const normalizedInput = input.toLowerCase().trim();
    
    // Sort rules by priority (highest first)
    const sortedRules = [...CHATBOT_RULES].sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
    );

    // Find matching rule
    for (const rule of sortedRules) {
      if (this.matchesRule(normalizedInput, rule)) {
        return this.getResponse(rule);
      }
    }

    // No match found, return fallback
    return FALLBACK_MESSAGE;
  }

  /**
   * Check if input matches a rule based on its matchType
   */
  private matchesRule(input: string, rule: ChatbotRule): boolean {
    const patterns = rule.patterns.map((p) => p.toLowerCase());

    switch (rule.matchType) {
      case 'keyword':
        // Extract words from input
        const words = input.split(/\s+/).map((w) => w.replace(/[^\w]/g, ''));
        return patterns.some((pattern) => words.includes(pattern));

      case 'contains':
        return patterns.some((pattern) => input.includes(pattern));

      case 'regex':
        return patterns.some((pattern) => {
          try {
            const regex = new RegExp(pattern, 'i');
            return regex.test(input);
          } catch {
            console.warn(`Invalid regex pattern: ${pattern}`);
            return false;
          }
        });

      default:
        return false;
    }
  }

  /**
   * Get response from a rule (handles single string or array of responses)
   */
  private getResponse(rule: ChatbotRule): string {
    if (Array.isArray(rule.response)) {
      // Pick a random response from the array
      const index = Math.floor(Math.random() * rule.response.length);
      return rule.response[index];
    }
    return rule.response;
  }

  /**
   * Generate a unique message ID
   */
  private generateId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.messages$.next([]);
    this.hasGreeted = false;
  }
}
