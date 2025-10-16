/**
 * @file 学习中心服务
 * @description 提供投资教育、教程文章等内容
 */

import request from '@/utils/request';

export interface Article {
  id: string;
  title: string;
  abstract: string;
  content: string;
  cover: string;
  author: string;
  category: string;
  tags: string[];
  readTime: number; // 阅读时长（分钟）
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  created: string;
  updated: string;
  views: number;
  likes: number;
}

export interface ArticleCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  articleCount: number;
}

/**
 * 学习中心服务类
 */
class LearningService {
  /**
   * 获取文章列表
   * @description 获取所有教育文章
   */
  async getArticles(params: {
    page?: number;
    size?: number;
    category?: string;
    difficulty?: string;
    sortBy?: 'latest' | 'popular' | 'trending';
  }): Promise<{
    articles: Article[];
    total: number;
  }> {
    const response = await request.get('/api/learning/articles', { params });
    return response.data;
  }

  /**
   * 获取文章详情
   * @description 根据标题slug获取文章详细内容
   */
  async getArticle(slug: string): Promise<Article> {
    const response = await request.get(`/api/learning/article/${slug}`);
    return response.data;
  }

  /**
   * 获取分类列表
   * @description 获取所有文章分类
   */
  async getCategories(): Promise<ArticleCategory[]> {
    const response = await request.get('/api/learning/categories');
    return response.data;
  }

  /**
   * 获取推荐文章
   * @description 根据用户兴趣推荐文章
   */
  async getRecommendedArticles(params: {
    limit?: number;
  }): Promise<Article[]> {
    const response = await request.get('/api/learning/recommended', { params });
    return response.data;
  }

  /**
   * 搜索文章
   * @description 按关键词搜索文章
   */
  async searchArticles(params: {
    query: string;
    page?: number;
    size?: number;
  }): Promise<{
    articles: Article[];
    total: number;
  }> {
    const response = await request.get('/api/learning/search', { params });
    return response.data;
  }

  /**
   * 记录文章阅读
   * @description 记录用户阅读文章行为
   */
  async recordView(articleId: string): Promise<{ success: boolean }> {
    const response = await request.post(`/api/learning/article/${articleId}/view`);
    return response.data;
  }

  /**
   * 点赞文章
   * @description 用户点赞文章
   */
  async likeArticle(articleId: string): Promise<{ success: boolean; likes: number }> {
    const response = await request.post(`/api/learning/article/${articleId}/like`);
    return response.data;
  }

  /**
   * 获取学习路径
   * @description 获取系统性的学习路径建议
   */
  async getLearningPaths(): Promise<{
    paths: Array<{
      id: string;
      name: string;
      description: string;
      difficulty: string;
      articles: string[]; // 文章ID列表
      estimatedTime: number; // 预计学习时长（小时）
    }>;
  }> {
    const response = await request.get('/api/learning/paths');
    return response.data;
  }

  /**
   * 获取词汇表
   * @description 获取金融投资术语词汇表
   */
  async getGlossary(params: {
    letter?: string;
    category?: string;
  }): Promise<{
    terms: Array<{
      term: string;
      definition: string;
      category: string;
      examples?: string[];
    }>;
  }> {
    const response = await request.get('/api/learning/glossary', { params });
    return response.data;
  }
}

export default new LearningService();
