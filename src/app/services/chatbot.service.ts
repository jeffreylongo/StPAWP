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
    // Specific phrases
    'next meeting', 'next event', 'upcoming event', 'upcoming meeting',
    'what\'s coming up', 'what is coming up', 'whats coming up',
    'when is the next', 'what events', 'any events',
    'this week', 'this month', 'schedule',
    // Common single-word/short triggers
    'meeting', 'meetings', 'calendar', 'event', 'events',
    'when is the meeting', 'when do you meet', 'when do we meet',
    'what time', 'dinner', 'stated communication', 'degree work',
    'happening', 'coming up', 'lodge night',
    // Event-specific keywords users might search for
    'installation', 'degree', 'practice', 'breakfast', 'lunch',
    'picnic', 'cookout', 'fellowship', 'education', 'open house',
    // Masonic-specific terms
    'stated', 'ea degree', 'fc degree', 'mm degree', 'entered apprentice',
    'fellowcraft', 'master mason', 'initiation', 'passing', 'raising'
  ];

  // Short keywords that should still be searched (bypass length filter)
  private readonly shortKeywordsAllowed = new Set(['ea', 'fc', 'mm', 'smma']);

  // Words to ignore when extracting search keywords from user input
  private readonly stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare',
    'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by',
    'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above',
    'below', 'between', 'under', 'again', 'further', 'then', 'once',
    'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but',
    'if', 'or', 'because', 'until', 'while', 'about', 'against', 'what',
    'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'i',
    'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your',
    'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself',
    'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them',
    'their', 'theirs', 'themselves', 'any', 'tell', 'know', 'next', 'upcoming'
  ]);

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
    // Check standard patterns
    if (this.calendarPatterns.some(pattern => input.includes(pattern))) {
      return true;
    }
    // Also check for short Masonic abbreviations as whole words
    const words = input.split(/\s+/);
    return words.some(word => this.shortKeywordsAllowed.has(word.toLowerCase()));
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
   * Extract meaningful search keywords from user input
   */
  private extractSearchKeywords(input: string): string[] {
    const words = input.toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => {
        // Allow short Masonic abbreviations (ea, fc, mm)
        if (this.shortKeywordsAllowed.has(word)) return true;
        // Otherwise filter out short words and stop words
        return word.length > 2 && !this.stopWords.has(word);
      });
    return words;
  }

  /**
   * Check if an event title matches any of the search keywords
   */
  private eventMatchesKeywords(event: CalendarEvent, keywords: string[]): boolean {
    if (keywords.length === 0) return true; // No specific keywords, show all
    const titleLower = event.title.toLowerCase();
    return keywords.some(keyword => titleLower.includes(keyword));
  }

  /**
   * Format calendar events into a chat response
   */
  private formatCalendarResponse(events: CalendarEvent[], input: string): string {
    if (!events || events.length === 0) {
      return this.getStaticCalendarResponse();
    }

    // Extract search keywords from user input
    const searchKeywords = this.extractSearchKeywords(input);
    
    // Separate Lodge events (calendarId 1) from other events
    const lodgeEvents = events.filter(e => e.calendarId === 1);
    const otherEvents = events.filter(e => e.calendarId !== 1);
    
    // Check if user is searching for something specific
    const hasSpecificSearch = searchKeywords.length > 0 && 
      !searchKeywords.every(k => ['meeting', 'event', 'events', 'calendar', 'schedule'].includes(k));
    
    let relevantEvents: CalendarEvent[];
    let searchTerm = '';
    
    if (hasSpecificSearch) {
      // User is searching for something specific - search by title
      // Prioritize Lodge events that match, then other events that match
      const matchingLodgeEvents = lodgeEvents.filter(e => this.eventMatchesKeywords(e, searchKeywords));
      const matchingOtherEvents = otherEvents.filter(e => this.eventMatchesKeywords(e, searchKeywords));
      relevantEvents = [...matchingLodgeEvents, ...matchingOtherEvents];
      searchTerm = searchKeywords.join(' ');
      
      // If no matches found, fall back to all Lodge events
      if (relevantEvents.length === 0) {
        relevantEvents = [...lodgeEvents, ...otherEvents];
      }
    } else {
      // General calendar query - prioritize Lodge events
      relevantEvents = [...lodgeEvents, ...otherEvents];
    }

    // Take next 5 events
    const upcomingEvents = relevantEvents.slice(0, 5);

    if (upcomingEvents.length === 0) {
      return this.getStaticCalendarResponse();
    }

    // Format the response
    let response = hasSpecificSearch && searchTerm
      ? `**Events matching "${searchTerm}":**\n\n`
      : '**Upcoming Events:**\n\n';

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
