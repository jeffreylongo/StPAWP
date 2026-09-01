export interface EducationResource {
  title: string;
  description: string;
  href: string;
  group: 'booklet' | 'article' | 'reference';
}

/** Grand Lodge education hosted on the Secretary’s site, 139sec.org. */
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
