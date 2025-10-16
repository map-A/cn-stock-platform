/**
 * @file 社区与工具服务模块导出
 * @description 统一导出所有社区相关服务
 */

export { default as newsService } from './newsService';
export { default as sentimentService } from './sentimentService';
export { default as aiChatService } from './aiChatService';
export { default as learningService } from './learningService';
export { default as toolsService } from './toolsService';

// 类型导出
export type { NewsItem, MarketNewsParams, CompanyNewsParams } from './newsService';
export type {
  SentimentStock,
  SocialTrend,
  FearGreedIndex,
} from './sentimentService';
export type {
  ChatMessage,
  ChatThread,
  AIAgent,
  RandomChat,
} from './aiChatService';
export type { Article, ArticleCategory } from './learningService';
export type {
  ComparisonData,
  BacktestParams,
  BacktestResult,
  Strategy,
} from './toolsService';
