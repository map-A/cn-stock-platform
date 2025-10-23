/**
 * 学习中心页面
 * 提供投资教育和学习资源
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  learningService,
  type LearningArticle,
  type ArticleCategory,
  type ArticleTag,
} from '@/services/learningService';
import './style.css';

const DIFFICULTY_LABELS = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
};

const LearningCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<LearningArticle[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [tags, setTags] = useState<ArticleTag[]>([]);
  const [popularArticles, setPopularArticles] = useState<LearningArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, selectedDifficulty, selectedTag, sortBy, currentPage]);

  const loadInitialData = async () => {
    try {
      const [categoriesData, tagsData, popularData] = await Promise.all([
        learningService.getCategories(),
        learningService.getTags(),
        learningService.getPopularArticles(),
      ]);
      setCategories(categoriesData);
      setTags(tagsData);
      setPopularArticles(popularData);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const response = await learningService.getArticles({
        category: selectedCategory,
        tag: selectedTag,
        difficulty: selectedDifficulty,
        search: searchQuery,
        page: currentPage,
        pageSize: 12,
        sort: sortBy,
      });
      setArticles(response.articles);
      setTotalPages(Math.ceil(response.total / response.pageSize));
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadArticles();
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSelectedTag('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getDifficultyClass = (difficulty: string) => {
    const classes = {
      beginner: 'difficulty-beginner',
      intermediate: 'difficulty-intermediate',
      advanced: 'difficulty-advanced',
    };
    return classes[difficulty as keyof typeof classes] || '';
  };

  return (
    <div className="learning-center-page">
      <div className="page-header">
        <h1>📚 投资学习中心</h1>
        <p>从基础知识到高级策略，全面提升你的投资技能</p>
      </div>

      <div className="learning-content">
        {/* 侧边栏筛选 */}
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3>搜索</h3>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">搜索</button>
            </form>
          </div>

          <div className="filter-section">
            <h3>分类</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={!selectedCategory}
                  onChange={() => setSelectedCategory('')}
                />
                全部分类
              </label>
              {categories.map((category) => (
                <label key={category.id} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === category.slug}
                    onChange={() => setSelectedCategory(category.slug)}
                  />
                  {category.name} ({category.articleCount})
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>难度</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="difficulty"
                  checked={!selectedDifficulty}
                  onChange={() => setSelectedDifficulty('')}
                />
                全部难度
              </label>
              {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                <label key={value} className="filter-option">
                  <input
                    type="radio"
                    name="difficulty"
                    checked={selectedDifficulty === value}
                    onChange={() => setSelectedDifficulty(value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>标签</h3>
            <div className="tags-list">
              {tags.slice(0, 20).map((tag) => (
                <button
                  key={tag.id}
                  className={`tag-btn ${selectedTag === tag.slug ? 'active' : ''}`}
                  onClick={() =>
                    setSelectedTag(selectedTag === tag.slug ? '' : tag.slug)
                  }
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            清除筛选
          </button>
        </aside>

        {/* 主内容区 */}
        <main className="articles-main">
          <div className="articles-header">
            <div className="sort-options">
              <label>排序：</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                <option value="latest">最新发布</option>
                <option value="popular">最受欢迎</option>
                <option value="trending">热门趋势</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-state">加载中...</div>
          ) : (
            <>
              <div className="articles-grid">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="article-card"
                    onClick={() => navigate(`/learning-center/article/${article.slug}`)}
                  >
                    {article.coverImage && (
                      <div className="article-cover">
                        <img src={article.coverImage} alt={article.title} />
                      </div>
                    )}
                    <div className="article-content">
                      <div className="article-meta">
                        <span className={`difficulty-badge ${getDifficultyClass(article.difficulty)}`}>
                          {DIFFICULTY_LABELS[article.difficulty]}
                        </span>
                        <span className="read-time">📖 {article.readTime}分钟</span>
                      </div>
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-summary">{article.summary}</p>
                      <div className="article-footer">
                        <span className="category">{article.category.name}</span>
                        <div className="article-stats">
                          <span>👁️ {article.views}</span>
                          <span>❤️ {article.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    上一页
                  </button>
                  <span>
                    第 {currentPage} / {totalPages} 页
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* 右侧热门文章 */}
        <aside className="popular-sidebar">
          <h3>🔥 热门文章</h3>
          <div className="popular-articles">
            {popularArticles.map((article, index) => (
              <div
                key={article.id}
                className="popular-article-item"
                onClick={() => navigate(`/learning-center/article/${article.slug}`)}
              >
                <span className="rank">{index + 1}</span>
                <div>
                  <h4>{article.title}</h4>
                  <span className="views">👁️ {article.views} 次阅读</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LearningCenterPage;
