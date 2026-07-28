/** Native Trestle Board content — update this file when the Secretary publishes a new edition. */

export interface OfficerMessage {
  id: string;
  role: string;
  author: string;
  imageUrl: string;
  title?: string;
  paragraphs: string[];
  closing?: string;
}

export interface MeetingSynopsis {
  dateLabel: string;
  body: string;
}

export interface MilestonePerson {
  name: string;
  detail: string;
}

export interface EducationResource {
  title: string;
  description: string;
  href: string;
  group: 'booklet' | 'article' | 'reference';
}

export interface LodgeResourceLink {
  title: string;
  description: string;
  route: string;
  icon: string;
}

export const trestleBoardMeta = {
  editionLabel: 'July 2026',
  lastUpdated: 'July 26, 2026',
  intro:
    'This is where Lodge updates live: officer messages, stated-communication synopses, member milestones, and Masonic education. Standing member services and how to reach the Secretary are on the Secretary’s Office page. Schedules and public event listings stay on the Calendar and home page.',
};

export const memorialNotice =
  'It is with great sadness that we report the Passing of Worshipful John Gicking. More information will be posted as received.';

export const officerMessages: OfficerMessage[] = [
  {
    id: 'wm',
    role: 'Worshipful Master',
    author: 'W∴ Valentino Francis Michael Pine 32°, P∴M∴',
    imageUrl: 'assets/officers/Val WM 4.jpg',
    title: 'The Hidden Stone — The Esoteric Secrets of Spiritual Alchemy',
    paragraphs: [
      'Popular history remembers alchemy as failed chemistry, hooded men bent over crucibles, chasing gold from lead. The adepts told a different story. The furnace was a veil; the true laboratory was the alchemist himself. Spiritual alchemy is the Magnum Opus, the Great Work: the transmutation of the base lead of the unregenerate self into the incorruptible gold of an illuminated soul. Its motto is “solve et coagula” — dissolve and coagulate: break down every false part of the self and reassemble what remains in divine order. The Work proceeds through nigredo, the blackening, in which the old man dies; albedo, the whitening, in which the soul is washed; and rubedo, the reddening, in which spirit and body reunite in glory. Every Mason will recognize this as his rough ashlar, worked toward the perfect ashlar.',
      'Western alchemy flowered inside Christendom, not against it. Its masters were canons, monks, and mystics. Matter suffers, dies, blackens in the tomb of the vessel, and rises glorified — putrefaction and resurrection. Many named the Philosopher’s Stone an emblem of Christ: “The stone that the builders rejected has become the cornerstone” (Psalm 118:22). Spiritual alchemy offered the contemplative Christian an interior science of regeneration, and this great work takes place inside the character and soul of a man, not a laboratory.',
      'The art speaks in emblems. Sulphur, Mercury, and Salt — the Tria Prima — are soul, spirit, and body. Sun and Moon, gold and silver, king and queen, are the active and passive principles whose “chemical wedding” begets the regenerated man. The Craft knows these luminaries well. The Ouroboros teaches that the Work is circular and the One is the All. In the Chamber of Reflection the whole secret is compressed into seven letters — V.I.T.R.I.O.L.: Visita Interiora Terrae Rectificando Invenies Occultum Lapidem — “Visit the interior of the earth; by rectifying, you will find the hidden Stone.” Very simply: to discover ultimate truth, look deep within yourself and correct your flaws.',
      'The lapis philosophorum is no mineral and no red powder. The Stone is the perfected man himself — consciousness rectified, the soul fixed and made incorruptible. In Masonic language: the perfect ashlar, hewn for that house not made with hands. The final secret is grammatical: the Stone is not found; it is become.',
      'The rolls of early Freemasonry are thick with Sons of Hermes — Elias Ashmole, Sir Robert Moray, and Sir Isaac Newton among them. The alchemist and the Mason work from one trestle board: a man raised from base matter, squared, polished, and made fit for the Temple.',
      'To learn more, look no further than St. Petersburg Lodge No. 139’s official challenge coin. A free booklet authored by your Worshipful Master, containing the esoteric knowledge of our challenge, is soon to be published. Stop by the Lodge and pick one up next month.',
    ],
    closing: 'Fraternally; As Above, So Below.',
  },
  {
    id: 'sw',
    role: 'Senior Warden',
    author: 'Right Worshipful Alan Scott Rosenthal, PDDGM (2010)',
    imageUrl: 'assets/officers/Alan Rosenthal Junior Warden 1.jpg',
    paragraphs: [
      'A message from the Senior Warden will appear here in the next edition of the Trestle Board.',
    ],
  },
  {
    id: 'jw',
    role: 'Junior Warden',
    author: 'Brother Craig Hull',
    imageUrl: 'assets/officers/Craig Hull Sr Deacon 1.jpg',
    paragraphs: [
      'As we reflect on the past several months, I am grateful for the growth and momentum our Lodge has experienced. We have been blessed to welcome new Entered Apprentices, Fellow Crafts, and Master Masons into our lodge at a rapid rate. The interest of Men to become Masons is inspiring!',
      'This year has also been a remarkable one for Masonic education. We have enjoyed an outstanding variety of educational programs presented by distinguished guest speakers as well as thoughtful lectures and discussions led by our own Brothers. These presentations have challenged us to think more deeply about our ritual, our symbolism, and, most importantly, how the principles of Freemasonry should guide our daily lives. Education remains one of the greatest investments we can make in ourselves and in our Lodge, and I am grateful for every Brother who has shared his time, knowledge, and experience with us.',
      'There is also much to be excited about as we look toward the future. The anticipation surrounding our new Lodge building continues to grow, and we look forward to the opportunities it will provide for fellowship, education, and service for generations to come. Very few Masons are blessed with the opportunity to build a new Lodge building during their lifetime. We have been entrusted with that rare privilege, and with it comes the responsibility to build not only for ourselves, but for the generations of Masons who will one day labor within its walls. Alongside this exciting chapter, we have also taken great pride in enhancing the identity of our Lodge through new challenge coins, an updated Lodge crest, and Lodge polos that allow us to represent St. Pete Lodge with pride both inside and outside our meetings.',
      'Finally, I would like to express my sincere appreciation for the outstanding leadership of our Worshipful Master. His dedication, vision, and commitment to the Craft have helped foster an atmosphere where every Brother feels welcomed, valued, and loved. Even more importantly, our Lodge continues to be characterized by genuine love, harmony, and brotherly affection. It is these qualities — not our building, our regalia, or our traditions alone — that truly define the strength of St. Pete Lodge No. 139!',
      'As we continue our labor together, may we never lose sight of our shared purpose: the building of our personal temples, and those of our brothers. I am grateful to call us brothers!',
    ],
    closing: 'Fraternally,',
  },
  {
    id: 'secretary',
    role: 'Secretary',
    author: 'Worshipful John Livingston, P∴M∴',
    imageUrl: 'assets/officers/John Livingston Secretary.jpg',
    title: 'Welcome Brothers!',
    paragraphs: [
      'This Trestle Board is where we publish living updates for the Craft — officer messages, meeting synopses, milestones, and education. Because schedules and news change often, we keep them here rather than in a paper periodical.',
      'For membership records, dues, certificates, forms, and how to reach the Secretary’s Office, use the Secretary’s Office page on this site. The Calendar and home page carry event listings and featured announcements for everyone.',
    ],
  },
  {
    id: 'chaplain',
    role: 'Chaplain',
    author: 'Worshipful John Edward Gunter, P∴M∴',
    imageUrl: 'assets/officers/John Gunter Degree Master.jpg',
    paragraphs: [
      'May we continue to walk in wisdom, integrity, and brotherly love. Let us remember that the true strength of our Lodge is not found in its walls, but in the character of the men who gather within them. May we be guided by faith, inspired to serve others with compassion, and committed to living according to the virtues we profess.',
      'May the Great Architect of the Universe watch over you and your families, granting you health, peace, and strength until we meet again in harmony.',
    ],
    closing: 'Fraternally,',
  },
];

export const meetingSynopses: MeetingSynopsis[] = [
  {
    dateLabel: 'Stated Communication — Tuesday, June 21, 2026',
    body: 'We opened in Due Form with 26 members & visitors present at 7:30 pm. The minutes, bills, correspondence & sick report were all read and dealt with. The sick report contained the announcement of the Passing to the Celestial Lodge above of three of our Brothers: Brother Dean Joseph Bolvin (283), Brother George Wilsey (139), and Brother Jesse Brown Battle, III (139). A Resolution for Honorary Membership received a clear ballot. There were four First Time Visitors this evening: Right Worshipful Steve Clark, Venice No. 301, Venice, FL; Worshipful Kenneth Warner, Sutherland Lodge No. 174, Dunedin, FL; Worshipful John Kelley, Saint Alban’s No. 38, AF & AM, Bradford, CT; and Brother Ahmed Alameen, Saint Alban’s No. 38, AF & AM, Bradford, CT. Right Worshipful Clark, who is a candidate for the Grand South, presented an abbreviated view of his vision of the future of Florida Masonry and answered questions from the Craft. Three of our Fellow Crafts stood to demonstrate their Catechism proficiency. (August 11th will be a Master Mason Degree with up to four candidates). A Petition for the Three Degrees was received from Mr. Jeffrey A. Williams and referred to the Investigating Committee. After much discussion, the Craft voted to support the St. Pete Diving Club, Northshore Elementary School, The Grand Master’s Charity, the First Lady’s Project, and assistance for Venezuela. Brother Craig Hull, Junior Warden, presented another excellent Masonic Education program. The Mite Box was for Northshore Elementary School and collected $22.00. The Lodge closed with Peace and Harmony prevailing at 11:30 pm.',
  },
  {
    dateLabel: 'Stated Communication — Tuesday, June 16, 2026',
    body: 'We opened in Due Form with 27 members & visitors present at 7:30 pm. The minutes, bills, correspondence & sick report were all read and dealt with. A Resolution concerning the reduction of fees due for an NPD suspended member who wants to reinstate was approved. Fellow Craft Brother Cody Sirgey presented an excellent Fellow Craft Degree Catechism Proficiency. Worshipful John Gunter was his Coach. A copy of our Charter was shown to the Craft together with the newly restored and framed Charter — the difference is amazing! Mr. Thomas Heath and Mr. Robert Loomis were both elected to receive the Three Degrees of Freemasonry in our Lodge. Worshipful Hardy Bryan informed us that North Shore Elementary School would be celebrating its 100th anniversary this year. The Lodge will contact the school to see what support we may be able to provide through the Adopt a School or Adopt a Class Programs. The Mite Box collected $32.00 for the school fund. We closed at 9:30 pm.',
  },
];

export const julyBirthdays: MilestonePerson[] = [
  { name: 'Albert Currie Hopper III, P∴M∴', detail: 'July 10' },
  { name: 'Hardy William Bryan III, P∴M∴', detail: 'July 20' },
  { name: 'Richard Alan Aarts, P∴M∴', detail: 'July 24' },
  { name: 'James Calloway Stinson, Jr.', detail: 'July 26' },
  { name: 'Rocco Nick Griesi, P∴M∴', detail: 'July 29' },
  { name: 'Earl Clayton Ray, PDDGM', detail: 'July 30' },
  { name: 'Alan Scott Rosenthal, PDDGM', detail: 'July 31' },
];

export const julyRaisings: MilestonePerson[] = [
  { name: 'Mark Steven Hanisee', detail: 'Raised July 22, 1980' },
  { name: 'James William M. Thomas, P∴M∴', detail: 'Raised July 26, 1974' },
];

export const milestoneHighlight = {
  title: '50 Year Certificate & Pin',
  body: 'Worshipful Master Michael Johnson from Hay Market Lodge No. 313, Hay Market, VA, presented Right Worshipful Charles Wagner, PDDGM (1989), with a 50 year Certificate & Pin as a courtesy to St. Petersburg Lodge No. 139 and the Grand Lodge of Florida.',
};

/** Education PDFs currently hosted on the Secretary’s resource site. */
export const educationResources: EducationResource[] = [
  {
    title: 'GL 201 — Instruction Booklet No. 1',
    description: 'Grand Lodge of Florida degree education',
    href: 'https://139sec.org/gl-201/',
    group: 'booklet',
  },
  {
    title: 'GL 202 — Instruction Booklet No. 2',
    description: 'Grand Lodge of Florida degree education',
    href: 'https://139sec.org/gl-202/',
    group: 'booklet',
  },
  {
    title: 'GL 203 — Entered Apprentice Booklet',
    description: 'EA degree education booklet',
    href: 'https://139sec.org/gl-203/',
    group: 'booklet',
  },
  {
    title: 'GL 204 — Instruction Booklet No. 3',
    description: 'Grand Lodge of Florida degree education',
    href: 'https://139sec.org/gl-204/',
    group: 'booklet',
  },
  {
    title: 'GL 205 — Fellow Craft Booklet',
    description: 'FC degree education booklet',
    href: 'https://139sec.org/gl-205/',
    group: 'booklet',
  },
  {
    title: 'GL 206 — Instruction Booklet No. 4',
    description: 'Grand Lodge of Florida degree education',
    href: 'https://139sec.org/gl-206/',
    group: 'booklet',
  },
  {
    title: 'GL 207 — Master Mason Booklet',
    description: 'MM degree education booklet',
    href: 'https://139sec.org/gl-207/',
    group: 'booklet',
  },
  {
    title: 'GL 208 — Masonic Etiquette Booklet',
    description: 'Etiquette and lodge custom',
    href: 'https://139sec.org/gl-208/',
    group: 'booklet',
  },
  {
    title: 'Florida Directory 2026',
    description: 'Grand Lodge of Florida directory',
    href: 'https://139sec.org/directory-2026/',
    group: 'reference',
  },
  {
    title: 'Delivering the Masonic Ritual',
    description: 'Essay on ritual delivery',
    href: 'https://139sec.org/ritual-delivery/',
    group: 'article',
  },
  {
    title: 'The Hiramic Legend',
    description: 'Educational article',
    href: 'https://139sec.org/legend/',
    group: 'article',
  },
];

/** Sections already covered elsewhere on the lodge site — link rather than duplicate. */
export const lodgeResourceLinks: LodgeResourceLink[] = [
  {
    title: 'Events Calendar',
    description: 'Upcoming degrees, practices, dinners, and fellowship',
    route: '/calendar',
    icon: 'fas fa-calendar-alt',
  },
  {
    title: "Secretary's Office",
    description: 'Lodge communications and member updates',
    route: '/secretary-office',
    icon: 'fas fa-user-tie',
  },
  {
    title: 'Lodge Officers',
    description: 'Current officer directory and contacts',
    route: '/officers',
    icon: 'fas fa-users',
  },
  {
    title: 'Past Masters',
    description: 'Worshipful Masters of Lodge No. 139, 1894–present',
    route: '/past-masters',
    icon: 'fas fa-medal',
  },
  {
    title: 'Forms & Petitions',
    description: 'Petitions, by-laws, and downloadable documents',
    route: '/forms',
    icon: 'fas fa-file-alt',
  },
  {
    title: 'Lodge History',
    description: 'Our story since 1894',
    route: '/history',
    icon: 'fas fa-landmark',
  },
];
