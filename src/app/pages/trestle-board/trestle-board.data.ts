/** Slim Trestle Board — officer messages only. Education lives on /masonic-education. */

export interface OfficerMessage {
  id: string;
  role: string;
  author: string;
  imageUrl: string;
  title?: string;
  paragraphs: string[];
  closing?: string;
}

export const trestleBoardMeta = {
  editionLabel: 'July 2026',
  lastUpdated: 'July 26, 2026',
  intro:
    'Officer messages for the Craft. Member records, notices, and the Secretary’s working files live at 139sec.org. Degree booklets and essays are on the Masonic Education page.',
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
      'Current notices, membership records, and working files for the Craft are published at 139sec.org — the official Secretary’s Office. This Trestle Board carries officer messages only.',
      'Degree booklets and Masonic essays are collected on our Masonic Education page. For dues, petitions, or how to reach me, use the Secretary’s Office page on this site.',
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
