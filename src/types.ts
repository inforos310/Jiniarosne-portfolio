export interface Project {
  id: string;
  title: string;
  category: string;
  tagline: string;
  colSpan: string; // e.g. "md:col-span-7" | "md:col-span-5"
  aspectRatio: string;
  image: string;
  tags: string[];
  description: string;
  challenge: string;
  solution: string;
  deliverables: string[];
  year: string;
  client: string;
  metrics?: string;
  link?: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  slug: string;
  readTime: string;
  date: string;
  category: string;
  summary: string;
  image: string;
  content: string[];
}

export interface ExplorationItem {
  id: string;
  title: string;
  category: string;
  image: string;
  rotation: string;
  description: string;
  tags: string[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  description: string;
}
