/**
 * 新闻分析模块类型定义
 * 
 * 依据文档: API_DESIGN_GUIDE.md - 新闻分析模块
 */

// 新闻情感类型
export type NewsSentiment = 'positive' | 'negative' | 'neutral';

// 新闻分类
export type NewsCategory = 'market' | 'stock' | 'policy' | 'finance' | 'other';

// 新闻项接口
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content?: string;
  url?: string;
  source: string;
  category: NewsCategory;
  stocks: string[]; // 关联股票代码列表
  relatedStocks?: string[]; // 向后兼容
  sentiment: NewsSentiment;
  sentimentScore: number;
  publishedAt: string;
  createdAt?: string;
  imageUrl?: string;
  author?: string;
  tags?: string[];
  readCount?: number;
  importance?: number | 'high' | 'medium' | 'low'; // API返回数字类型
}

// 新闻筛选参数
export interface NewsFilterParams {
  category?: NewsCategory;
  stockCode?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  sentiment?: NewsSentiment;
  importance?: 'high' | 'medium' | 'low';
  page?: number;
  pageSize?: number;
  sortBy?: 'publishedAt' | 'sentimentScore' | 'importance' | 'readCount';
  sortOrder?: 'asc' | 'desc';
}

// 新闻列表响应
export interface NewsListResponse {
  items: NewsItem[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

// 市场情绪指标
export interface MarketNewsSentiment {
  date: string;
  overallSentiment: NewsSentiment;
  sentimentScore: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  totalCount: number;
  trendDirection: 'up' | 'down' | 'stable';
  confidenceLevel: number;
}

// 股票新闻关联
export interface StockNewsRelation {
  stockCode: string;
  stockName: string;
  newsCount: number;
  averageSentiment: number;
  sentimentTrend: 'improving' | 'declining' | 'stable';
  latestNews: NewsItem[];
  impactScore: number;
}

// 关键词分析结果
export interface KeywordAnalysis {
  keyword: string;
  frequency: number;
  sentiment: NewsSentiment;
  relatedStocks: string[];
  trendScore: number;
  importance: 'high' | 'medium' | 'low';
}

// 新闻影响评估
export interface NewsImpact {
  newsId: string;
  stockCode: string;
  impactType: 'price' | 'volume' | 'sentiment';
  impactScore: number;
  confidenceLevel: number;
  timeframe: '1h' | '4h' | '1d' | '1w';
  prediction: 'bullish' | 'bearish' | 'neutral';
}

// 新闻摘要统计
export interface NewsSummaryStats {
  timeRange: string;
  totalNews: number;
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  categoryDistribution: Record<NewsCategory, number>;
  topKeywords: KeywordAnalysis[];
  mostMentionedStocks: StockNewsRelation[];
  importantNews: NewsItem[];
}

// 新闻订阅设置
export interface NewsSubscription {
  id: string;
  userId: string;
  keywords: string[];
  stockCodes: string[];
  categories: NewsCategory[];
  minImportance: 'high' | 'medium' | 'low';
  notificationEnabled: boolean;
  emailEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

// 新闻搜索建议
export interface NewsSearchSuggestion {
  keyword: string;
  type: 'stock' | 'category' | 'keyword';
  count: number;
  relatedTerms: string[];
}

// 新闻详情
export interface NewsDetail extends NewsItem {
  fullContent: string;
  relatedNews: NewsItem[];
  marketReaction?: {
    priceChange: number;
    volumeChange: number;
    timeframe: string;
  };
  socialMetrics?: {
    shares: number;
    comments: number;
    likes: number;
  };
}