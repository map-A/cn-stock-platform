/**
 * 新闻分析主页面
 * 
 * 功能特性:
 * - 新闻列表展示
 * - 市场情绪分析
 * - 关键词云展示
 * - 新闻详情查看
 * - 筛选和搜索
 */

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Button, Space, message } from 'antd';
import {
  ReloadOutlined,
  SettingOutlined,
  BellOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import NewsList from '@/components/NewsAnalysis/NewsList';
import MarketSentimentDashboard from '@/components/NewsAnalysis/MarketSentimentDashboard';
import KeywordCloud from '@/components/NewsAnalysis/KeywordCloud';
import NewsDetailModal from '@/components/NewsAnalysis/NewsDetailModal';
import { getTrendingNews } from '@/services/news';
import type { NewsItem, NewsCategory, NewsSentiment } from '@/types/news';
import './index.less';

const { TabPane } = Tabs;

const NewsAnalysis: React.FC = () => {
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [showNewsDetail, setShowNewsDetail] = useState(false);
  const [activeCategory, setActiveCategory] = useState<NewsCategory | undefined>();
  const [activeSentiment, setActiveSentiment] = useState<NewsSentiment | undefined>();
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [trendingNews, setTrendingNews] = useState<NewsItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * 加载热门新闻
   */
  const loadTrendingNews = async () => {
    try {
      const news = await getTrendingNews(activeCategory, 5);
      setTrendingNews(news);
    } catch (error) {
      console.error('加载热门新闻失败:', error);
    }
  };

  /**
   * 新闻点击处理
   */
  const handleNewsClick = (news: NewsItem) => {
    setSelectedNewsId(news.id);
    setShowNewsDetail(true);
  };

  /**
   * 关闭新闻详情
   */
  const handleCloseNewsDetail = () => {
    setShowNewsDetail(false);
    setSelectedNewsId(null);
  };

  /**
   * 情绪点击处理
   */
  const handleSentimentClick = (sentiment: NewsSentiment) => {
    setActiveSentiment(sentiment);
    setActiveCategory(undefined);
    setSearchKeyword('');
  };

  /**
   * 关键词点击处理
   */
  const handleKeywordClick = (keyword: string) => {
    setSearchKeyword(keyword);
    setActiveCategory(undefined);
    setActiveSentiment(undefined);
  };

  /**
   * 刷新页面数据
   */
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    loadTrendingNews();
    message.success('数据已刷新');
  };

  /**
   * 分类切换处理
   */
  const handleCategoryChange = (category: NewsCategory | undefined) => {
    setActiveCategory(category);
    setActiveSentiment(undefined);
    setSearchKeyword('');
  };

  /**
   * 清除筛选
   */
  const handleClearFilters = () => {
    setActiveCategory(undefined);
    setActiveSentiment(undefined);
    setSearchKeyword('');
  };

  /**
   * 初始化加载
   */
  useEffect(() => {
    loadTrendingNews();
  }, [activeCategory]);

  return (
    <div className="news-analysis-page">
      {/* 页面头部 */}
      <div className="page-header">
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <h2 style={{ margin: 0 }}>新闻分析</h2>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={handleClearFilters}
                disabled={!activeCategory && !activeSentiment && !searchKeyword}
              >
                清除筛选
              </Button>
              <Button
                icon={<BellOutlined />}
                type="default"
              >
                订阅设置
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
              >
                刷新
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]}>
        {/* 左侧新闻列表 */}
        <Col xs={24} lg={14}>
          <Card 
            title="新闻资讯" 
            size="small"
            extra={
              activeCategory || activeSentiment || searchKeyword ? (
                <span style={{ fontSize: '12px', color: '#666' }}>
                  筛选: {activeCategory && `分类=${activeCategory}`}
                  {activeSentiment && ` 情绪=${activeSentiment}`}
                  {searchKeyword && ` 关键词="${searchKeyword}"`}
                </span>
              ) : null
            }
          >
            <NewsList
              key={`${refreshKey}-${activeCategory}-${activeSentiment}-${searchKeyword}`}
              onNewsClick={handleNewsClick}
              category={activeCategory}
              maxHeight={600}
            />
          </Card>
        </Col>

        {/* 右侧分析面板 */}
        <Col xs={24} lg={10}>
          <div className="analysis-panels">
            {/* 市场情绪分析 */}
            <div style={{ marginBottom: 16 }}>
              <MarketSentimentDashboard
                onSentimentClick={handleSentimentClick}
              />
            </div>

            {/* 关键词云 */}
            <div style={{ marginBottom: 16 }}>
              <KeywordCloud
                onKeywordClick={handleKeywordClick}
                maxWords={30}
                showTrend={true}
              />
            </div>

            {/* 热门新闻 */}
            {trendingNews.length > 0 && (
              <Card title="热门新闻" size="small">
                <div className="trending-news">
                  {trendingNews.map((news, index) => (
                    <div 
                      key={news.id} 
                      className="trending-item"
                      onClick={() => handleNewsClick(news)}
                    >
                      <div className="trending-rank">{index + 1}</div>
                      <div className="trending-content">
                        <div className="trending-title">{news.title}</div>
                        <div className="trending-meta">
                          <Space size="small">
                            <span style={{ fontSize: '11px', color: '#999' }}>
                              {news.source}
                            </span>
                            <span style={{ fontSize: '11px', color: '#999' }}>
                              {news.readCount || 0} 阅读
                            </span>
                          </Space>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </Col>
      </Row>

      {/* 分类快捷筛选 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card size="small" bodyStyle={{ padding: '12px 16px' }}>
            <Space wrap>
              <span style={{ fontSize: '13px', color: '#666' }}>快速筛选:</span>
              <Button 
                size="small" 
                type={activeCategory === 'market' ? 'primary' : 'default'}
                onClick={() => handleCategoryChange(activeCategory === 'market' ? undefined : 'market')}
              >
                市场新闻
              </Button>
              <Button 
                size="small" 
                type={activeCategory === 'stock' ? 'primary' : 'default'}
                onClick={() => handleCategoryChange(activeCategory === 'stock' ? undefined : 'stock')}
              >
                个股新闻
              </Button>
              <Button 
                size="small" 
                type={activeCategory === 'policy' ? 'primary' : 'default'}
                onClick={() => handleCategoryChange(activeCategory === 'policy' ? undefined : 'policy')}
              >
                政策新闻
              </Button>
              <Button 
                size="small" 
                type={activeCategory === 'finance' ? 'primary' : 'default'}
                onClick={() => handleCategoryChange(activeCategory === 'finance' ? undefined : 'finance')}
              >
                财经新闻
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 新闻详情弹窗 */}
      <NewsDetailModal
        visible={showNewsDetail}
        newsId={selectedNewsId}
        onClose={handleCloseNewsDetail}
        onRelatedNewsClick={handleNewsClick}
      />
    </div>
  );
};

export default NewsAnalysis;