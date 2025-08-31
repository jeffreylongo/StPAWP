export interface Announcement {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  date: Date;
  slug: string;
  featured?: boolean;
  author?: string;
  category?: string;
}

export interface Page {
  id: number;
  title: string;
  content: string;
  slug: string;
  lastModified: Date;
  status: 'draft' | 'published' | 'archived';
  author?: string;
}

export interface BlogPost extends Page {
  excerpt: string;
  publishDate: Date;
  tags?: string[];
  category?: string;
  featuredImage?: string;
}
