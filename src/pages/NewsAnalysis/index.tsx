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

import React, { useState } from 'react';
import { Row, Col, Card, Button, Space, message } from 'antd';
import {
  FilterOutlined,
} from '@ant-design/icons';
import NewsList from '@/components/NewsAnalysis/NewsList';
import NewsDetailModal from '@/components/NewsAnalysis/NewsDetailModal';
import type { NewsItem, NewsCategory, NewsSentiment } from '@/types/news';
import './index.less';

const NewsAnalysis: React.FC = () => {
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [showNewsDetail, setShowNewsDetail] = useState(false);
  const [activeCategory, setActiveCategory] = useState<NewsCategory | undefined>();
  const [activeSentiment, setActiveSentiment] = useState<NewsSentiment | undefined>();
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  /**
   * 新闻点击处理
   */
  const handleNewsClick = (news: NewsItem) => {
    setSelectedNewsId(news.id);
    setSelectedNews(news);
    setShowNewsDetail(true);
  };

  /**
   * 关闭新闻详情
   */
  const handleCloseNewsDetail = () => {
    setShowNewsDetail(false);
    setSelectedNewsId(null);
    setSelectedNews(null);
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

  return (
    <div className="news-analysis-page">
      {/* 页面头部 */}
      <div className="page-header">
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <h2 style={{ margin: 0 }}>新闻分析</h2>
          </Col>
          <Col>
            <Button
              icon={<FilterOutlined />}
              onClick={handleClearFilters}
              disabled={!activeCategory && !activeSentiment && !searchKeyword}
            >
              清除筛选
            </Button>
          </Col>
        </Row>
      </div>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]}>
        {/* 新闻列表 - 全宽显示 */}
        <Col xs={24}>
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
              key={`${activeCategory}-${activeSentiment}-${searchKeyword}`}
              onNewsClick={handleNewsClick}
              category={activeCategory}
              maxHeight={800}
            />
          </Card>
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
        newsData={selectedNews}
        onClose={handleCloseNewsDetail}
        onRelatedNewsClick={handleNewsClick}
      />
    </div>
  );
};

export default NewsAnalysis;