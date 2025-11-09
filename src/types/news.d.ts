export type NewsSentiment = 'positive' | 'negative' | 'neutral';

export interface NewsItem {
  id: string;
  title: string;
  content?: string;
  summary?: string;
  sentiment?: NewsSentiment;
  source?: string;
  publishTime?: string;
  stocks?: string[];
  [key: string]: any;
}

export interface NewsAnalysis {
  sentiment: NewsSentiment;
  score?: number;
  keywords?: string[];
  [key: string]: any;
}
