export interface Link {
  text: string;
  href: string;
  isExternal: boolean;
}

export interface Heading {
  level: number;
  text: string;
}

export interface ScrapeResult {
  url: string;
  title: string;
  description?: string;
  markdown: string;
  content: string;
  headings: Heading[];
  links: Link[];
  summary: string;
  wordCount: number;
  fetchedAt: string;
  usedPlaywright: boolean;
}

export type ScrapeErrorCode =
  | 'INVALID_URL'
  | 'FETCH_FAILED'
  | 'TIMEOUT'
  | 'BLOCKED'
  | 'EMPTY_CONTENT'
  | 'UNKNOWN';

export interface ScrapeError {
  error: string;
  code: ScrapeErrorCode;
}

export interface HistoryEntry {
  url: string;
  title: string;
  timestamp: string;
}
