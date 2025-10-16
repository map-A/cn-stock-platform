/**
 * 学习中心服务
 * 提供投资教育内容相关的API调用
 */

import { apiClient } from './apiClient';

/**
 * 文章分类
 */
export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
}

/**
 * 文章标签
 */
export interface ArticleTag {
  id: string;
  name: string;
  slug: string;
}

/**
 * 学习文章
 */
export interface LearningArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: ArticleCategory;
  tags: ArticleTag[];
  author: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number; // 分钟
  views: number;
  likes: number;
  publishedAt: string;
  updatedAt: string;
  coverImage?: string;
}

/**
 * 用户学习进度
 */
export interface UserProgress {
  articleId: string;
  completed: boolean;
  progress: number; // 0-100
  lastReadAt: string;
}

/**
 * 文章列表请求参数
 */
export interface ArticleListParams {
  category?: string;
  tag?: string;
  difficulty?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: 'latest' | 'popular' | 'trending';
}

/**
 * 文章列表响应
 */
export interface ArticleListResponse {
  articles: LearningArticle[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 学习中心服务类
 */
class LearningService {
  /**
   * 获取文章列表
   */
  async getArticles(params: ArticleListParams = {}): Promise<ArticleListResponse> {
    const response = await apiClient.get('/api/learning/articles', { params });
    return response.data;
  }

  /**
   * 获取文章详情
   */
  async getArticle(slug: string): Promise<LearningArticle> {
    const response = await apiClient.get(`/api/learning/articles/${slug}`);
    return response.data;
  }

  /**
   * 获取所有分类
   */
  async getCategories(): Promise<ArticleCategory[]> {
    const response = await apiClient.get('/api/learning/categories');
    return response.data;
  }

  /**
   * 获取所有标签
   */
  async getTags(): Promise<ArticleTag[]> {
    const response = await apiClient.get('/api/learning/tags');
    return response.data;
  }

  /**
   * 搜索文章
   */
  async searchArticles(query: string, page = 1): Promise<ArticleListResponse> {
    return this.getArticles({ search: query, page });
  }

  /**
   * 获取推荐文章
   */
  async getRecommendedArticles(limit = 5): Promise<LearningArticle[]> {
    const response = await apiClient.get('/api/learning/recommended', {
      params: { limit },
    });
    return response.data;
  }

  /**
   * 获取热门文章
   */
  async getPopularArticles(limit = 10): Promise<LearningArticle[]> {
    const response = await apiClient.get('/api/learning/popular', {
      params: { limit },
    });
    return response.data;
  }

  /**
   * 获取用户学习进度
   */
  async getUserProgress(): Promise<UserProgress[]> {
    const response = await apiClient.get('/api/learning/progress');
    return response.data;
  }

  /**
   * 更新学习进度
   */
  async updateProgress(articleId: string, progress: number): Promise<void> {
    await apiClient.post(`/api/learning/progress/${articleId}`, { progress });
  }

  /**
   * 标记文章为已完成
   */
  async markAsCompleted(articleId: string): Promise<void> {
    await apiClient.post(`/api/learning/progress/${articleId}/complete`);
  }

  /**
   * 点赞文章
   */
  async likeArticle(articleId: string): Promise<void> {
    await apiClient.post(`/api/learning/articles/${articleId}/like`);
  }

  /**
   * 取消点赞
   */
  async unlikeArticle(articleId: string): Promise<void> {
    await apiClient.delete(`/api/learning/articles/${articleId}/like`);
  }

  /**
   * 记录阅读
   */
  async recordView(articleId: string): Promise<void> {
    await apiClient.post(`/api/learning/articles/${articleId}/view`);
  }

  /**
   * 获取相关文章
   */
  async getRelatedArticles(articleId: string, limit = 5): Promise<LearningArticle[]> {
    const response = await apiClient.get(`/api/learning/articles/${articleId}/related`, {
      params: { limit },
    });
    return response.data;
  }
}

export const learningService = new LearningService();
export default learningService;
