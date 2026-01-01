/**
 * Rule-based Chatbot Configuration
 * 
 * This file contains all the rules for the chatbot.
 * To add new responses, simply add a new rule object to the CHATBOT_RULES array.
 * 
 * Rule Types:
 * - 'keyword': Matches if ANY of the patterns exactly match a word in the input
 * - 'contains': Matches if ANY of the patterns are found anywhere in the input
 * - 'regex': Matches if ANY of the regex patterns match the input
 * 
 * Priority: Higher numbers are checked first. If multiple rules match, highest priority wins.
 * 
 * IMPORTANT: All information in this file comes directly from the site content.
 * Do NOT add information that is not on the website.
 */

export interface ChatbotRule {
  id: string;
  description: string;
  matchType: 'keyword' | 'contains' | 'regex';
  patterns: string[];
  response: string | string[];
  priority?: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// ============================================================================
// CHATBOT RULES - Edit this array to customize bot responses
// All information sourced directly from site content
// ============================================================================

export const CHATBOT_RULES: ChatbotRule[] = [
  // Profanity filter - HIGH PRIORITY, kind but cheeky response
  {
    id: 'profanity',
    description: 'Responds to profane language with a kind but cheeky reply',
    matchType: 'contains',
    patterns: [
      'fuck', 'shit', 'damn', 'ass', 'bitch', 'bastard', 'crap',
      'hell', 'piss', 'dick', 'cock', 'pussy', 'whore', 'slut',
      'wtf', 'stfu', 'lmao', 'lmfao'
    ],
    response: [
      'Whoa there, Brother! We keep things family-friendly here. 😉 How can I actually help you today?',
      'Easy now! This is a lodge, not a locker room. 😄 What would you like to know about us?',
      'Well, that\'s certainly... colorful! Let\'s try again. What can I help you with?',
      'My Grand Lodge programming doesn\'t allow me to respond to that! 😏 Ask me about meetings, membership, or our history instead.',
      'A Mason is always mindful of his words! How about we start over - what brings you here today?',
    ],
    priority: 300,
  },

  // Greeting rules
  {
    id: 'greeting',
    description: 'Responds to hello, hi, hey, etc.',
    matchType: 'keyword',
    patterns: ['hello', 'hi', 'hey', 'greetings', 'howdy', 'hola'],
    response: [
      'Hello! How can I help you today?',
      'Greetings! What would you like to know about St. Petersburg Lodge No. 139?',
      'Welcome! Feel free to ask about our meetings, contact info, or how to become a Mason.',
    ],
    priority: 10,
  },

  // Help / Menu
  {
    id: 'help',
    description: 'Shows available topics when user asks for help',
    matchType: 'keyword',
    patterns: ['help', 'menu', 'options', 'commands', '?'],
    response: `Here's what I can help you with:
• **Meetings** - When and where we meet
• **Contact** - How to reach us
• **Become a Mason** - Information about joining
• **Officers** - Our current lodge officers
• **History** - Learn about our lodge history
• **Calendar** - Upcoming events
• **Dues** - Payment information

Just type any of these topics!`,
    priority: 100,
  },

  // Meetings - ACCURATE INFO from contact.component.html and about.component.ts
  {
    id: 'meetings',
    description: 'Information about lodge meetings',
    matchType: 'contains',
    patterns: ['meeting', 'meetings', 'when do you meet', 'lodge night', 'stated communication', 'next meeting', 'when is'],
    response: `**Stated Communication:**
We meet on the **3rd Tuesday of each month**.

🍽️ **Dinner:** 6:30 PM
🔨 **Meeting:** 7:30 PM

📍 **Temporarily Located at:**
3325 1st St NE
St. Petersburg, FL 33704

All Master Masons in good standing are welcome to attend.`,
    priority: 50,
  },

  // Contact Information - ACCURATE from contact.component.html
  {
    id: 'contact',
    description: 'Contact information for the lodge',
    matchType: 'contains',
    patterns: ['contact', 'phone', 'email', 'address', 'location', 'where are you', 'how to reach', 'get in touch'],
    response: `**Contact St. Petersburg Lodge No. 139:**

📍 **Temporarily Located at:**
3325 1st St NE
St. Petersburg, FL 33704

📞 **Phone:** (727) 418-3356

📧 **Email:** secretary@stpete139.org

You can also visit our **Contact** page for a contact form.`,
    priority: 50,
  },

  // Becoming a Mason - ACCURATE from becoming-mason.component.ts
  {
    id: 'become-mason',
    description: 'Information about becoming a Mason',
    matchType: 'contains',
    patterns: ['become', 'join', 'member', 'membership', 'petition', 'how to be a mason', 'interested in joining', 'want to join'],
    response: `**Interested in Becoming a Mason?**

To join St. Petersburg Lodge 139, you must:
• Be an able-bodied man at least 18 years old
• Possess a belief in a supreme being
• Be of good moral character

**Next Steps:**
1. Join us for dinner any 3rd Tuesday - we'd love to meet you!
2. Download a petition from our **Becoming a Mason** page
3. Complete your petition with two lodge members as sponsors

**Petitions Chairman:** W∴ Chris Webb, P∴M∴ - (727) 393-6007
He can help guide you through the membership process.

Or contact our Secretary at secretary@stpete139.org`,
    priority: 60,
  },

  // Officers - from officers.component.ts
  {
    id: 'officers',
    description: 'Information about lodge officers',
    matchType: 'contains',
    patterns: ['officer', 'officers', 'worshipful master', 'warden', 'secretary', 'treasurer', 'leadership'],
    response: `**2025 Lodge Officers:**

• **Worshipful Master:** W∴ Valentino Pine, P∴M∴ - (727) 637-3106
• **Senior Warden:** W∴ Ricardo Colon-Marquez, P∴M∴ - (315) 412-1672
• **Junior Warden:** R∴W∴ Alan Rosenthal, P∴M∴ - (727) 504-7310
• **Secretary:** W∴ John Livingston, P∴M∴ - (727) 418-3356
• **Treasurer:** W∴ Michael Mignone, P∴M∴

Visit our **Officers** page to see all officers and their photos.`,
    priority: 40,
  },

  // History - ACCURATE from history.component.ts
  {
    id: 'history',
    description: 'Lodge history information',
    matchType: 'contains',
    patterns: ['history', 'founded', 'when was', 'how old', 'established', 'charter'],
    response: `**Lodge History:**

St. Petersburg Lodge No. 139 F&AM was established as a U.D. Lodge on **December 1, 1893** with 9 charter members.

The Lodge received its charter on **January 17, 1894**, making it one of the oldest continuously operating Masonic lodges in Pinellas County.

**Charter Members included:**
• Walter W. Coleman (1st Worshipful Master)
• Henry W. Hibbs
• John Constantine Williams Jr.
• And 6 others

Visit our **History** page to learn more about our 130+ year legacy.`,
    priority: 40,
  },

  // Past Masters
  {
    id: 'past-masters',
    description: 'Past Masters information',
    matchType: 'contains',
    patterns: ['past master', 'past masters', 'former master'],
    response: `**Past Masters:**

Our first Worshipful Master was **Walter W. Coleman** (1894-1895).

The lodge reached peak membership of **1,256 members in 1956**.

Visit our **Past Masters** page to see the complete list of those who have led our lodge since 1894.`,
    priority: 40,
  },

  // Calendar / Events
  {
    id: 'calendar',
    description: 'Calendar and events information',
    matchType: 'contains',
    patterns: ['calendar', 'events', 'upcoming', 'schedule', 'what\'s happening', 'next event'],
    response: `**Lodge Schedule:**

Our Stated Communications are held on the **3rd Tuesday of each month**:
• Dinner at 6:30 PM
• Meeting at 7:30 PM

Check our **Calendar** page for:
• Degree work nights
• Special events and dinners
• District and Grand Lodge events

We update our calendar regularly with all lodge activities.`,
    priority: 40,
  },

  // Dues / Donations - ACCURATE from dues-donations.component.ts
  {
    id: 'dues',
    description: 'Information about dues and donations',
    matchType: 'contains',
    patterns: ['dues', 'payment', 'pay', 'donate', 'donation', 'fee', 'cost'],
    response: `**Dues & Donations:**

Visit our **Dues & Donations** page for:
• Online dues payment
• PayPal donations
• "Let Your Pennies Make Good Sense" contribution to the Masonic Home

**Payment Options:**
• Online via our store
• PayPal
• Check payable to: St. Petersburg Lodge No. 139 F&AM
  Mail to: 3325 1st St NE, St. Petersburg, FL 33704

Financial assistance is available - contact the Secretary confidentially.`,
    priority: 40,
  },

  // Secretary Office
  {
    id: 'secretary',
    description: 'Secretary office and forms',
    matchType: 'contains',
    patterns: ['secretary', 'forms', 'paperwork', 'documents', 'demit', 'certificate'],
    response: `**Secretary's Office:**

**Secretary:** W∴ John Livingston, P∴M∴
**Phone:** (727) 418-3356
**Email:** secretary@stpete139.org

The Secretary handles:
• Membership records
• Official correspondence
• Lodge forms and documents
• Dues payments

Office hours available by appointment.`,
    priority: 40,
  },

  // Trestle Board
  {
    id: 'trestle-board',
    description: 'Trestle Board newsletter',
    matchType: 'contains',
    patterns: ['trestle', 'newsletter', 'bulletin', 'publication'],
    response: `**Trestle Board:**

Our Trestle Board is the lodge newsletter containing:
• Messages from the Worshipful Master
• Upcoming events and activities
• Lodge news and announcements

Visit the **Trestle Board** page to read the latest edition.`,
    priority: 40,
  },

  // Masonry general - from about.component.ts
  {
    id: 'masonry-general',
    description: 'General questions about Freemasonry',
    matchType: 'contains',
    patterns: ['what is masonry', 'what is freemasonry', 'freemason', 'fraternity'],
    response: `**About Freemasonry:**

Freemasonry is the world's oldest and largest fraternal organization. Our core values are:

• **Brotherly Love** - Tolerance, respect, and kindness to our fellow creatures
• **Relief** - Charity and compassion to those in need
• **Truth** - Honesty and seeking knowledge through self-improvement

Masons are men of good character who strive to improve themselves and make the world a better place.

Visit our **About** or **Becoming a Mason** pages to learn more.`,
    priority: 30,
  },

  // Location / Directions
  {
    id: 'directions',
    description: 'Directions to the lodge',
    matchType: 'contains',
    patterns: ['directions', 'map', 'google maps', 'how to get', 'where is the lodge'],
    response: `**Lodge Location:**

📍 **Temporarily Located at:**
3325 1st St NE
St. Petersburg, FL 33704

🗺️ **Google Maps:** 
https://maps.google.com/?q=3325+1st+St+NE,+St.+Petersburg,+FL+33704

We meet on the 3rd Tuesday of each month.`,
    priority: 45,
  },

  // Social Media
  {
    id: 'social',
    description: 'Social media links',
    matchType: 'contains',
    patterns: ['facebook', 'instagram', 'social media', 'follow'],
    response: `**Connect With Us:**

📘 **Facebook:** facebook.com/StPeteLodge139
📸 **Instagram:** instagram.com/stpetelodge139

Follow us for updates, photos, and lodge news!`,
    priority: 35,
  },

  // Misconceptions about Freemasonry - HIGH PRIORITY to catch these first
  // NOTE: Be careful with patterns - avoid words that appear in legitimate Masonic terms
  // e.g., "worship" is in "worshipful master" so we use "worship satan" etc. instead
  {
    id: 'misconceptions',
    description: 'Addresses common misconceptions and conspiracy theories about Freemasonry',
    matchType: 'contains',
    patterns: [
      'satan', 'satanic', 'devil', 'worship satan', 'evil',
      'sacrifice', 'blood ritual', 'ritual killing', 
      'illuminati', 'new world order', 'secret society',
      'occult', 'demonic', 'lucifer', 'black magic', 'devil worship',
      'are you a cult', 'is this a cult', 'is masonry a cult', 'is freemasonry a cult', 'cult'
    ],
    response: `**No.** Freemasonry is not affiliated with any of those things.

Freemasonry is a **fraternal organization** focused on:
• **Brotherly Love** - Caring for one another
• **Relief** - Charitable giving to those in need
• **Truth** - Personal growth and self-improvement

We require members to believe in a Supreme Being, but we are **not a religion** and do not promote any specific religious doctrine.

Freemasonry has been around since 1717 and includes members from all walks of life who simply want to become better men and help their communities.

Visit us any 3rd Tuesday for dinner and see for yourself!`,
    priority: 200,
  },

  // Thanks / Goodbye
  {
    id: 'thanks',
    description: 'Responds to thank you messages',
    matchType: 'contains',
    patterns: ['thank', 'thanks', 'appreciate', 'helpful'],
    response: [
      'You\'re welcome! Is there anything else I can help you with?',
      'Happy to help! Let me know if you have other questions.',
      'My pleasure! Feel free to ask if you need anything else.',
    ],
    priority: 20,
  },

  {
    id: 'goodbye',
    description: 'Responds to goodbye messages',
    matchType: 'keyword',
    patterns: ['bye', 'goodbye', 'later', 'farewell'],
    response: [
      'Goodbye! Hope to see you at the lodge soon.',
      'Take care! Feel free to come back if you have more questions.',
      'Farewell! Visit us anytime.',
    ],
    priority: 20,
  },
];

// ============================================================================
// FALLBACK & GREETING MESSAGES
// ============================================================================

export const GREETING_MESSAGE = `👋 **Welcome to St. Petersburg Lodge No. 139!**

I'm here to help answer questions about our lodge.

Try asking about:
• **meetings** - When and where we meet
• **contact** - How to reach us
• **become a mason** - Joining information

Type **"help"** to see all topics!`;

export const FALLBACK_MESSAGE = `I'm not sure I have that information.

Try asking about:
• **meetings** - When and where we meet
• **contact** - Phone, email, address
• **become a mason** - How to join
• **officers** - Our leadership
• **history** - Lodge history
• **help** - See all topics

Or visit our website pages for more details!`;
