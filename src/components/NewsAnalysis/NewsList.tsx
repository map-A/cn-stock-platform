/**
 * 新闻列表组件
 * 
 * 功能特性:
 * - 新闻列表展示
 * - 筛选和搜索
 * - 情感分析展示
 * - 分页功能
 * - 实时更新
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Input,
  Select,
  DatePicker,
  Tag,
  Space,
  Avatar,
  Typography,
  Tooltip,
  Row,
  Col,
  Badge,
  Button,
  Skeleton,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  HeartOutlined,
  HeartFilled,
  LinkOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getNewsList, markNewsAsRead } from '@/services/news';
import type { NewsItem, NewsFilterParams, NewsCategory, NewsSentiment } from '@/types/news';
import './NewsList.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

export interface NewsListProps {
  onNewsClick?: (news: NewsItem) => void;
  showFilters?: boolean;
  category?: NewsCategory;
  stockCode?: string;
  maxHeight?: number;
}

const NewsList: React.FC<NewsListProps> = ({
  onNewsClick,
  showFilters = true,
  category,
  stockCode,
  maxHeight,
}) => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize] = useState(20);
  const [filters, setFilters] = useState<NewsFilterParams>({
    category,
    stockCode,
    page: 1,
    pageSize,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval] = useState(30000); // 30秒自动刷新

  /**
   * 加载新闻列表
   */
  const loadNewsList = async (params: NewsFilterParams) => {
    try {
      setLoading(true);
      const response = await getNewsList(params);
      
      if (params.page === 1) {
        setNewsList(response.items);
      } else {
        // 分页加载，追加数据
        setNewsList(prev => [...prev, ...response.items]);
      }
      
      setTotal(response.total);
      setCurrent(response.page);
    } catch (error) {
      console.error('加载新闻列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 搜索新闻
   */
  const handleSearch = (keyword: string) => {
    const newFilters = {
      ...filters,
      keyword,
      page: 1,
    };
    setFilters(newFilters);
    loadNewsList(newFilters);
  };

  /**
   * 筛选变更
   */
  const handleFilterChange = (key: keyof NewsFilterParams, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value,
      page: 1,
    };
    setFilters(newFilters);
    loadNewsList(newFilters);
  };

  /**
   * 日期范围变更
   */
  const handleDateRangeChange = (dates: any) => {
    const newFilters = {
      ...filters,
      startDate: dates?.[0]?.format('YYYY-MM-DD'),
      endDate: dates?.[1]?.format('YYYY-MM-DD'),
      page: 1,
    };
    setFilters(newFilters);
    loadNewsList(newFilters);
  };

  /**
   * 加载更多
   */
  const handleLoadMore = () => {
    if (loading || newsList.length >= total) return;
    
    const newFilters = {
      ...filters,
      page: current + 1,
    };
    setFilters(newFilters);
    loadNewsList(newFilters);
  };

  /**
   * 新闻点击
   */
  const handleNewsClick = async (news: NewsItem) => {
    try {
      // 标记为已读
      await markNewsAsRead(news.id);
      
      // 更新本地状态
      setNewsList(prev =>
        prev.map(item =>
          item.id === news.id
            ? { ...item, readCount: (item.readCount || 0) + 1 }
            : item
        )
      );
      
      onNewsClick?.(news);
    } catch (error) {
      console.error('标记新闻已读失败:', error);
      onNewsClick?.(news);
    }
  };

  /**
   * 获取情感标签
   */
  const getSentimentTag = (sentiment: NewsSentiment, score: number) => {
    const colors = {
      positive: 'success',
      negative: 'error',
      neutral: 'default',
    };
    
    const labels = {
      positive: '正面',
      negative: '负面',
      neutral: '中性',
    };

    return (
      <Tag color={colors[sentiment]} style={{ fontSize: '11px' }}>
        {labels[sentiment]} {(score * 100).toFixed(0)}%
      </Tag>
    );
  };

  /**
   * 获取重要性标签
   */
  const getImportanceTag = (importance?: number | 'high' | 'medium' | 'low') => {
    if (!importance) return null;
    
    // 如果是数字，转换为对应的等级
    let level: 'high' | 'medium' | 'low';
    if (typeof importance === 'number') {
      if (importance >= 8) level = 'high';
      else if (importance >= 5) level = 'medium';
      else level = 'low';
    } else {
      level = importance;
    }
    
    const configs = {
      high: { color: 'red', text: '重要' },
      medium: { color: 'orange', text: '一般' },
      low: { color: 'default', text: '普通' },
    };
    
    const config = configs[level];
    return (
      <Tag color={config.color} style={{ fontSize: '11px' }}>
        {config.text}
      </Tag>
    );
  };

  /**
   * 初始化加载
   */
  useEffect(() => {
    loadNewsList(filters);
  }, []);

  /**
   * 外部参数变化时重新加载
   */
  useEffect(() => {
    if (category !== filters.category || stockCode !== filters.stockCode) {
      const newFilters = {
        ...filters,
        category,
        stockCode,
        page: 1,
      };
      setFilters(newFilters);
      loadNewsList(newFilters);
    }
  }, [category, stockCode]);

  /**
   * 自动刷新
   */
  useEffect(() => {
    if (!autoRefresh) return;
    
    const timer = setInterval(() => {
      // 只刷新第一页
      loadNewsList({ ...filters, page: 1 });
    }, refreshInterval);
    
    return () => clearInterval(timer);
  }, [autoRefresh, filters, refreshInterval]);

  return (
    <div className="news-list">
      {showFilters && (
        <Card size="small" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="搜索新闻标题、内容"
                allowClear
                onSearch={handleSearch}
                style={{ width: '100%' }}
              />
            </Col>
            
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="分类"
                allowClear
                style={{ width: '100%' }}
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
              >
                <Option value="market">市场</Option>
                <Option value="stock">个股</Option>
                <Option value="policy">政策</Option>
                <Option value="finance">财经</Option>
              </Select>
            </Col>
            
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="情感"
                allowClear
                style={{ width: '100%' }}
                value={filters.sentiment}
                onChange={(value) => handleFilterChange('sentiment', value)}
              >
                <Option value="positive">正面</Option>
                <Option value="neutral">中性</Option>
                <Option value="negative">负面</Option>
              </Select>
            </Col>
            
            <Col xs={24} sm={12} md={8}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={handleDateRangeChange}
                placeholder={['开始日期', '结束日期']}
              />
            </Col>
          </Row>
        </Card>
      )}

      <List
        loading={loading && newsList.length === 0}
        dataSource={newsList}
        style={{ maxHeight, overflow: 'auto' }}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className="news-item"
            onClick={() => handleNewsClick(item)}
            style={{ cursor: 'pointer' }}
          >
            <List.Item.Meta
              title={
                <div className="news-title">
                  <Text strong ellipsis style={{ maxWidth: '70%' }}>
                    {item.title}
                  </Text>
                  <Space size="small" style={{ marginLeft: 8 }}>
                    {getSentimentTag(item.sentiment, item.sentimentScore)}
                    {getImportanceTag(item.importance)}
                  </Space>
                </div>
              }
              description={
                <div className="news-meta">
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ marginBottom: 8 }}
                  >
                    {item.summary}
                  </Paragraph>
                  
                  <div className="news-info">
                    <Space split={<span style={{ color: '#d9d9d9' }}>|</span>}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        <CalendarOutlined /> {dayjs(item.publishedAt).format('MM-DD HH:mm')}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {item.source}
                      </Text>
                      {item.author && (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {item.author}
                        </Text>
                      )}
                      {item.readCount && (
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <EyeOutlined /> {item.readCount}
                        </Text>
                      )}
                    </Space>
                  </div>
                  
                  {item.stocks && item.stocks.length > 0 && (
                    <div className="related-stocks" style={{ marginTop: 8 }}>
                      <Space wrap>
                        {item.stocks.slice(0, 3).map(stock => (
                          <Tag key={stock} size="small" color="blue">
                            {stock}
                          </Tag>
                        ))}
                        {item.stocks.length > 3 && (
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            +{item.stocks.length - 3}
                          </Text>
                        )}
                      </Space>
                    </div>
                  )}
                </div>
              }
            />
            
            <div className="news-actions">
              <Space direction="vertical">
                <Tooltip title="查看原文">
                  <Button
                    type="text"
                    size="small"
                    icon={<LinkOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(item.url, '_blank');
                    }}
                  />
                </Tooltip>
              </Space>
            </div>
          </List.Item>
        )}
        footer={
          newsList.length < total && (
            <div style={{ textAlign: 'center', padding: 16 }}>
              <Button
                loading={loading}
                onClick={handleLoadMore}
                disabled={newsList.length >= total}
              >
                {loading ? '加载中...' : '加载更多'}
              </Button>
            </div>
          )
        }
      />
    </div>
  );
};

export default NewsList;