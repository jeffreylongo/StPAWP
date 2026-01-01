import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { take, filter, map } from 'rxjs/operators';
import { format, isToday, getDay } from 'date-fns';
import {
  ChatbotRule,
  ChatMessage,
  CHATBOT_RULES,
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
  private messageCount = 0; // Track conversation length
  private lastTopic = ''; // Remember last topic for context

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

  // Mysterious/Masonic interjections to sprinkle into responses
  private readonly interjections = [
    'Ah, a worthy question... ',
    'The light reveals... ',
    'Let me consult the ancient records... ',
    'From the East, I share this wisdom... ',
    'A seeker of knowledge, I see... ',
    'The square and compass guide me to say... ',
    'As the trestle board shows... ',
    'By the plumb and level... ',
    'The Craft has taught me... ',
    'From labor to refreshment, here\'s what I know... ',
    'As above, so below... ',
    'The working tools reveal... ',
    'Let me illuminate this matter... ',
    'The archives speak... ',
  ];

  // Self-referential Masonic humor
  private readonly selfReferences = [
    'I may be a digital Tyler, but I guard the information well! ',
    'No apron required for this answer... ',
    'I\'ve memorized more ritual than I\'d like to admit... ',
    'Even without a trowel, I can spread some knowledge... ',
    'My circuits are aligned with the cardinal virtues... ',
    'I don\'t have a lambskin apron, but I\'ve got answers... ',
    'The Great Architect programmed me well... ',
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
      this.sendBotMessage(this.getTimeAwareGreeting());
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
   * Generate a time-aware greeting with Masonic flair
   */
  private getTimeAwareGreeting(): string {
    const hour = new Date().getHours();
    const dayOfWeek = getDay(new Date());
    const isTuesday = dayOfWeek === 2;
    
    let timeGreeting: string;
    if (hour >= 5 && hour < 12) {
      timeGreeting = '🌅 **Good morning, traveler!**';
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = '☀️ **Good afternoon, seeker of light!**';
    } else if (hour >= 17 && hour < 21) {
      timeGreeting = '🌆 **Good evening, friend!**';
    } else {
      timeGreeting = '🌙 **Greetings, night owl!** Burning the midnight oil, I see...';
    }

    let specialMessage = '';
    if (isTuesday) {
      specialMessage = '\n\n🔔 *It\'s Tuesday! Could be a lodge night... ask me about upcoming meetings!*';
    }

    return `${timeGreeting}

Welcome to St. Petersburg Lodge No. 139. I am the Digital Tyler, guardian of this portal.

**How may I assist you?**
• Ask about **meetings** or **events**
• Learn how to **become a Mason**
• Find our **contact** information
• Explore our **history**

Type **"help"** to reveal all the mysteries I can illuminate...${specialMessage}`;
  }

  // Minimum priority for a rule to take precedence over calendar queries
  // Rules with priority >= this value will be checked BEFORE calendar lookup
  private readonly CALENDAR_PRIORITY_THRESHOLD = 100;

  /**
   * Process a user message and generate a bot response
   */
  sendUserMessage(text: string): void {
    if (!text.trim()) return;

    this.messageCount++;

    // Add user message
    const userMessage: ChatMessage = {
      id: this.generateId(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    this.addMessage(userMessage);

    // Calculate variable delay based on expected response length (simulates typing)
    const baseDelay = 400;
    const variableDelay = Math.random() * 800; // 0-800ms additional
    const totalDelay = baseDelay + variableDelay;

    const normalizedInput = text.toLowerCase().trim();
    
    // STEP 1: Check for high-priority rules FIRST (easter eggs, specific answers)
    // This ensures "can I wear crocs to meeting" hits crocs, not calendar
    const highPriorityMatch = this.findHighPriorityMatch(normalizedInput);
    
    if (highPriorityMatch) {
      // High-priority rule matched - use it instead of calendar
      setTimeout(() => {
        let response = this.getResponse(highPriorityMatch);
        response = this.addPersonality(response, normalizedInput);
        this.sendBotMessage(response);
        this.lastTopic = highPriorityMatch.id;
      }, totalDelay);
    } else if (this.isCalendarQuery(normalizedInput)) {
      // STEP 2: Check for calendar-related queries
      setTimeout(() => {
        this.handleCalendarQuery(normalizedInput);
      }, totalDelay);
    } else {
      // STEP 3: Process with remaining static rules
      setTimeout(() => {
        let response = this.processMessage(text);
        response = this.addPersonality(response, normalizedInput);
        this.sendBotMessage(response);
      }, totalDelay);
    }
  }

  /**
   * Find a high-priority rule match (priority >= threshold)
   * These rules take precedence over calendar queries
   */
  private findHighPriorityMatch(input: string): ChatbotRule | null {
    // Get rules with priority >= threshold, sorted by priority (highest first)
    const highPriorityRules = CHATBOT_RULES
      .filter(rule => (rule.priority ?? 0) >= this.CALENDAR_PRIORITY_THRESHOLD)
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    
    for (const rule of highPriorityRules) {
      if (this.matchesRule(input, rule)) {
        return rule;
      }
    }
    return null;
  }

  /**
   * Add personality touches to responses
   */
  private addPersonality(response: string, input: string): string {
    // Check for location-specific reactions
    response = this.addLocationReactions(response, input);
    
    // Occasionally add interjections (20% chance, not on short responses)
    if (Math.random() < 0.2 && response.length > 100 && !response.startsWith('👋')) {
      const interjection = this.interjections[Math.floor(Math.random() * this.interjections.length)];
      response = interjection + '\n\n' + response;
    }
    
    // Occasionally add self-referential humor (10% chance)
    if (Math.random() < 0.1 && response.length > 50) {
      const selfRef = this.selfReferences[Math.floor(Math.random() * this.selfReferences.length)];
      response = selfRef + '\n\n' + response;
    }
    
    // Add day awareness for meeting-related responses
    response = this.addDayAwareness(response, input);
    
    return response;
  }

  /**
   * Add reactions to location mentions
   */
  private addLocationReactions(response: string, input: string): string {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('florida') && !response.includes('Sunshine State')) {
      response = '☀️ Ah, the Sunshine State! The best place for Masonry, if you ask me.\n\n' + response;
    }
    
    if ((lowerInput.includes('st pete') || lowerInput.includes('st. pete') || lowerInput.includes('saint pete')) 
        && !response.includes('finest city')) {
      response = '🌴 St. Petersburg - the finest city in Florida and home to Lodge 139!\n\n' + response;
    }
    
    if (lowerInput.includes('tampa') && !response.includes('across the bay')) {
      response = '🌉 Ah, our neighbors across the bay! Tampa has some fine lodges too.\n\n' + response;
    }
    
    return response;
  }

  /**
   * Add day-of-week awareness to responses
   */
  private addDayAwareness(response: string, input: string): string {
    const dayOfWeek = getDay(new Date());
    const lowerInput = input.toLowerCase();
    
    // If asking about meetings on a Tuesday
    if (dayOfWeek === 2 && (lowerInput.includes('meeting') || lowerInput.includes('tonight') || lowerInput.includes('today'))) {
      if (!response.includes('Tuesday')) {
        response += '\n\n🔔 *By the way, it\'s Tuesday - check if there\'s a meeting tonight!*';
      }
    }
    
    // Weekend awareness
    if ((dayOfWeek === 0 || dayOfWeek === 6) && lowerInput.includes('meeting')) {
      response += '\n\n📅 *It\'s the weekend, so the lodge is at rest. Our stated meetings are on Tuesdays.*';
    }
    
    return response;
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
        let response = this.formatCalendarResponse(events, input);
        response = this.addPersonality(response, input);
        this.sendBotMessage(response);
        this.lastTopic = 'calendar';
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

    // Format the response with some flair
    let response = hasSpecificSearch && searchTerm
      ? `🔍 **The trestle board reveals events matching "${searchTerm}":**\n\n`
      : '📜 **Behold, the upcoming labors of the Craft:**\n\n';

    for (const event of upcomingEvents) {
      const eventDate = new Date(event.date);
      const dayName = format(eventDate, 'EEEE');
      const dateStr = format(eventDate, 'MMMM d, yyyy');
      const timeStr = event.startTime || '';
      
      // Check if event is today
      const todayIndicator = isToday(eventDate) ? ' ⭐ **TODAY!**' : '';
      
      response += `📅 **${event.title}**${todayIndicator}\n`;
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

    response += `Visit our **Calendar** page for the complete schedule of our labors.`;

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
    return `📜 **The Lodge Schedule:**

Our Stated Communications are held on the **3rd Tuesday of each month**:
• 🍽️ Dinner at 6:30 PM
• 🔨 Meeting at 7:30 PM

📍 **The Temple awaits at:**
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
    
    // Check for repeated greetings (small talk variation)
    if (this.isRepeatedGreeting(normalizedInput)) {
      return this.getVariedGreetingResponse();
    }
    
    // Sort rules by priority (highest first)
    const sortedRules = [...CHATBOT_RULES].sort(
      (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
    );

    // Find matching rule
    for (const rule of sortedRules) {
      if (this.matchesRule(normalizedInput, rule)) {
        this.lastTopic = rule.id;
        return this.getResponse(rule);
      }
    }

    // No match found, return mysterious fallback
    return this.getMysteriousFallback();
  }

  /**
   * Check if this is a repeated simple greeting
   */
  private isRepeatedGreeting(input: string): boolean {
    const greetings = ['hi', 'hello', 'hey', 'yo', 'sup', 'howdy'];
    return this.messageCount > 2 && greetings.some(g => input === g || input === g + '!');
  }

  /**
   * Get varied response for repeated greetings
   */
  private getVariedGreetingResponse(): string {
    const responses = [
      'Still here, Brother! The Tyler never leaves his post. 🚪 What would you like to know?',
      'Hello again! I sense you seek something... What mysteries can I help unravel?',
      'Greetings once more, traveler! The light still shines. How may I guide you?',
      'Ah, we meet again! The trestle board awaits your inquiry...',
      'I haven\'t gone anywhere! 😄 What brings you back to the portal?',
      'The door remains open, friend. What wisdom do you seek?',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Get a mysterious-sounding fallback message
   */
  private getMysteriousFallback(): string {
    const fallbacks = [
      `🤔 Hmm, that knowledge lies beyond my current illumination...

Try asking about:
• **meetings** - When and where we gather
• **contact** - How to reach the lodge
• **become a mason** - The path to the Craft
• **officers** - Our leadership
• **help** - Reveal all topics

Perhaps rephrase your question, seeker?`,

      `🔮 The mists obscure that particular answer...

I can enlighten you about:
• **meetings** & **events**
• **membership** & how to **join**
• **contact** information
• **history** of our lodge

Type **"help"** to see all I can reveal!`,

      `📜 That scroll is not in my archives, I'm afraid...

But I can speak to:
• Our **meeting** schedule
• How to **become a Mason**
• **Contact** details
• Lodge **officers** & **history**

What else might I illuminate?`,
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
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
    this.messageCount = 0;
    this.lastTopic = '';
  }
}
