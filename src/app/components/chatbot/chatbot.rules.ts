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
  // NOTE: Using 'keyword' match to avoid false positives (e.g., "hello" contains "hell")
  {
    id: 'profanity',
    description: 'Responds to profane language with a kind but cheeky reply',
    matchType: 'keyword',
    patterns: [
      'fuck', 'fucking', 'fucked', 'shit', 'shitty', 'damn', 'dammit',
      'ass', 'asshole', 'bitch', 'bastard', 'crap', 'crappy',
      'piss', 'pissed', 'dick', 'cock', 'pussy', 'whore', 'slut',
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

  // ============================================================================
  // FUN EASTER EGGS & INSIDE JOKES
  // ============================================================================

  // Dobby / House Elf
  {
    id: 'dobby',
    description: 'Harry Potter reference - Dobby the house elf',
    matchType: 'contains',
    patterns: ['dobby', 'house elf', 'house-elf', 'houseelf'],
    response: `🧦 Dobby is currently out running errands in Diagon Alley...

But you can try the **Secretary's Office** - they might be able to help!

📞 (727) 418-3356
📧 secretary@stpete139.org`,
    priority: 150,
  },

  // Goat reference
  {
    id: 'goat',
    description: 'Masonic goat joke',
    matchType: 'contains',
    patterns: ['goat', 'goats'],
    response: '🐐 So Mote It Baaaaaah! 🐐',
    priority: 150,
  },

  // Knock knock
  {
    id: 'knock-knock',
    description: 'Masonic knock knock response',
    matchType: 'contains',
    patterns: ['knock knock knock', 'knock-knock-knock', 'knockknockknock'],
    response: '🚪 Who comes here?',
    priority: 150,
  },

  // Amen
  {
    id: 'amen',
    description: 'Masonic response to Amen',
    matchType: 'keyword',
    patterns: ['amen'],
    response: '🙏 So Mote It Be.',
    priority: 150,
  },

  // Death / Dying / Passed away
  {
    id: 'death',
    description: 'Respectful response to mentions of death',
    matchType: 'contains',
    patterns: ['died', 'dying', 'passed away', 'passed on', 'death', 'funeral', 'memorial'],
    response: '🕯️ Alas, my Brother...\n\nIf you need assistance with Masonic funeral services or memorial arrangements, please contact our Secretary at (727) 418-3356.',
    priority: 150,
  },

  // Best lodge
  {
    id: 'best-lodge',
    description: 'Best lodge around',
    matchType: 'contains',
    patterns: ['best lodge', 'best masonic lodge', 'greatest lodge', 'favorite lodge', 'top lodge'],
    response: `🏆 **St. Petersburg Lodge No. 139**, obviously!

Founded in 1894, we're one of the oldest and finest lodges in Pinellas County. Come visit us any 3rd Tuesday and see for yourself!`,
    priority: 150,
  },

  // Other Masonic organizations
  {
    id: 'appendant-bodies',
    description: 'Information about other Masonic organizations',
    matchType: 'contains',
    patterns: ['scottish rite', 'york rite', 'shrine', 'shriners', 'grotto', 'other masonic', 'appendant', 'concordant'],
    response: `**Other Masonic Organizations:**

After becoming a Master Mason, you may explore:

⚔️ **Scottish Rite** - Continuing Masonic education through additional degrees
🏰 **York Rite** - Chapter, Council, and Commandery degrees
🎪 **Shrine** - Known for children's hospitals and fun fellowship
🎭 **Grotto** - Social organization for Master Masons

Check the links at the bottom of our website for more information on these organizations!`,
    priority: 140,
  },

  // I love you - Star Wars reference
  {
    id: 'love',
    description: 'Star Wars Han Solo reference',
    matchType: 'contains',
    patterns: ['i love you', 'love you'],
    response: '😎 I know.',
    priority: 150,
  },

  // Crocs
  {
    id: 'crocs',
    description: 'No crocs allowed',
    matchType: 'contains',
    patterns: ['crocs', 'croc'],
    response: '🚫👟 **No.** Crocs are NOT allowed. You will be jailed by order of the Worshipful Master.',
    priority: 150,
  },

  // Dinner
  {
    id: 'dinner',
    description: 'Whats for dinner',
    matchType: 'contains',
    patterns: ['whats for dinner', 'what\'s for dinner', 'what is for dinner', 'dinner menu', 'what are we eating'],
    response: '🥗 Green beans... JK... who knows! But I\'m sure it\'s something delicious and catered. 🍽️\n\nDinner is served at **6:30 PM** before our 7:30 PM meeting on the 3rd Tuesday.',
    priority: 150,
  },

  // Worshipful Master title explanation
  {
    id: 'worshipful-meaning',
    description: 'Why is the president called Worshipful Master',
    matchType: 'contains',
    patterns: ['why worshipful', 'worshipful mean', 'worshipful master mean', 'why is he called', 'president called'],
    response: `📚 **Great question!**

"Worshipful" comes from Old English usage where it meant **"worthy of respect"** or **"honorable"** - not religious worship.

It's similar to how judges in England are still addressed as "Your Worship." The Worshipful Master is simply the respected leader of the lodge.`,
    priority: 150,
  },

  // Coolest person
  {
    id: 'coolest',
    description: 'Coolest person in the lodge',
    matchType: 'contains',
    patterns: ['coolest person', 'coolest guy', 'coolest member', 'coolest mason', 'most handsome', 'best looking'],
    response: '😎 Probably **Jeff Longo**. He\'s got a great beard and is very handsome.',
    priority: 150,
  },

  // Who made the website
  {
    id: 'website-creator',
    description: 'Who made this website',
    matchType: 'contains',
    patterns: ['who made', 'who built', 'who created', 'who designed', 'website by', 'made this site', 'made this website'],
    response: `💻 This website was built by **Jeff Longo** of **Speedmaster Consulting**.

🌐 SpeedmasterConsulting.com`,
    priority: 150,
  },

  // Alcohol / Drinking
  {
    id: 'alcohol',
    description: 'Questions about drinking at lodge',
    matchType: 'contains',
    patterns: ['drink', 'alcohol', 'beer', 'wine', 'liquor', 'booze', 'bar', 'drinking'],
    response: `🚫🍺 No alcohol at Lodge meetings.

**However**, once you become a Master Mason, there are social organizations where libations flow freely:

🎪 **Shrine** - Famous for their festive gatherings
🎭 **Grotto** - Known for good times and fellowship

Ask about appendant bodies for more info!`,
    priority: 145,
  },

  // Secrets
  {
    id: 'secrets',
    description: 'Can you tell me secrets',
    matchType: 'contains',
    patterns: ['tell me secret', 'masonic secret', 'the secret', 'your secrets', 'any secrets'],
    response: '🤐 No.',
    priority: 150,
  },

  // WCYAAM
  {
    id: 'wcyaam',
    description: 'Masonic cipher response',
    matchType: 'keyword',
    patterns: ['wcyaam'],
    response: 'FALDTTHSJ',
    priority: 200,
  },

  // Watching / Spying
  {
    id: 'spying',
    description: 'Someone is watching me',
    matchType: 'contains',
    patterns: ['watching me', 'spying on me', 'being watched', 'someone watching', 'being followed'],
    response: '👁️ They are. Most likely CIA.',
    priority: 150,
  },

  // Are you alive
  {
    id: 'alive',
    description: 'Are you alive',
    matchType: 'contains',
    patterns: ['are you alive', 'are you real', 'are you a bot', 'are you ai', 'are you human'],
    response: '🤔 Maybe. I\'m not sure. Is there really a way to tell anymore?',
    priority: 150,
  },

  // Ford vs Chevy
  {
    id: 'chevy-ford',
    description: 'Ford vs Chevy debate',
    matchType: 'contains',
    patterns: ['ford', 'chevy', 'chevrolet', 'truck', 'f150', 'f-150', 'silverado'],
    response: '🚗 **Chevy is better.** Especially trucks. This is not up for debate. 🏆',
    priority: 150,
  },

  // Sports
  {
    id: 'sports',
    description: 'Best sport / team',
    matchType: 'contains',
    patterns: ['best sport', 'favorite sport', 'best team', 'favorite team', 'sports', 'football', 'baseball', 'basketball', 'hockey', 'soccer'],
    response: '🏒 **Hockey is the best sport.** And the **Tampa Bay Lightning** is the best team. ⚡\n\nThis is objective fact.',
    priority: 145,
  },

  // Meaning of life
  {
    id: 'meaning-of-life',
    description: 'Meaning of life',
    matchType: 'contains',
    patterns: ['meaning of life', 'purpose of life', 'why are we here', 'what is life'],
    response: '🌌 You aren\'t ready for it.',
    priority: 150,
  },

  // Best fast food
  {
    id: 'fast-food',
    description: 'Best fast food',
    matchType: 'contains',
    patterns: ['best fast food', 'favorite fast food', 'fast food', 'taco bell', 'mcdonalds', 'burger king', 'wendys'],
    response: '🌮 **Taco Bell.** Obviously.',
    priority: 150,
  },

  // Best investment
  {
    id: 'investment',
    description: 'Best investment',
    matchType: 'contains',
    patterns: ['best investment', 'invest', 'stocks', 'crypto', 'money', 'rich', 'wealth'],
    response: '💰 **Money producing assets.**\n\nThis is financial advice. (Not really, but kind of.)',
    priority: 145,
  },

  // Famous Masons
  {
    id: 'famous-masons',
    description: 'List of famous Freemasons',
    matchType: 'contains',
    patterns: ['famous mason', 'famous freemason', 'celebrity mason', 'well known mason', 'notable mason', 'who was a mason', 'who were mason'],
    response: `⭐ **Famous Freemasons Throughout History:**

**U.S. Presidents:**
🇺🇸 George Washington, Benjamin Franklin, Theodore Roosevelt, Franklin D. Roosevelt, Harry S. Truman, Gerald Ford, and 9 others!

**Founding Fathers:**
📜 Paul Revere, John Hancock, John Paul Jones

**Entertainment:**
🎬 John Wayne, Clark Gable, Will Rogers
🎵 Nat King Cole, Duke Ellington, Louis Armstrong
😂 Will Ferrell (yes, really!)

**Historical Figures:**
🗽 Davy Crockett, Buffalo Bill Cody
✍️ Mark Twain, Oscar Wilde, Voltaire
🔬 Buzz Aldrin (walked on the moon as a Mason!)

**Sports:**
⚾ Ty Cobb, Cy Young
🏀 Shaquille O'Neal
🥊 Sugar Ray Robinson, Jack Dempsey
🏈 John Elway

And many more! Freemasonry has attracted men of character from all walks of life for over 300 years.`,
    priority: 140,
  },

  // ============================================================================
  // STANDARD RULES
  // ============================================================================

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
  {
    id: 'compliment',
    description: 'Responds kindly to compliments and praise',
    matchType: 'contains',
    patterns: [
      'thank you', 'thanks', 'thank', 'appreciate',
      'helpful', 'great job', 'good job', 'nice job', 'well done',
      'awesome', 'amazing', 'wonderful', 'fantastic', 'excellent',
      'you\'re the best', 'youre the best', 'you rock', 'love this',
      'so helpful', 'very helpful', 'really helpful',
      'good bot', 'great bot', 'nice bot', 'smart bot',
      'impressed', 'cool', 'neat', 'brilliant'
    ],
    response: [
      'Thank you so much! I\'m glad I could help. Is there anything else you\'d like to know about the lodge?',
      'You\'re very welcome! It\'s my pleasure to assist. Feel free to ask me anything else!',
      'That\'s very kind of you to say! Let me know if there\'s anything else I can help with.',
      'I appreciate the kind words! I\'m here whenever you need assistance.',
      'Thank you! Helping Brothers and visitors learn about our lodge is what I\'m here for. 😊',
      'You\'re too kind! Don\'t hesitate to reach out if you have more questions.',
    ],
    priority: 25,
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
