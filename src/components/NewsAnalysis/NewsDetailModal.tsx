/**
 * 新闻详情组件
 * 
 * 功能特性:
 * - 新闻详情展示
 * - 相关新闻推荐
 * - 市场反应分析
 * - 社交媒体指标
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Card,
  Typography,
  Space,
  Tag,
  Divider,
  Row,
  Col,
  Statistic,
  List,
  Button,
  Tooltip,
  Image,
  message,
} from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  LinkOutlined,
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
  EyeOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getNewsDetail, submitNewsFeedback } from '@/services/news';
import type { NewsDetail, NewsItem } from '@/types/news';
import './NewsDetailModal.less';

const { Title, Paragraph, Text } = Typography;

export interface NewsDetailModalProps {
  visible: boolean;
  newsId: string | null;
  onClose: () => void;
  onRelatedNewsClick?: (news: NewsItem) => void;
}

const NewsDetailModal: React.FC<NewsDetailModalProps> = ({
  visible,
  newsId,
  onClose,
  onRelatedNewsClick,
}) => {
  const [newsDetail, setNewsDetail] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * 加载新闻详情
   */
  const loadNewsDetail = async (id: string) => {
    try {
      setLoading(true);
      const detail = await getNewsDetail(id);
      setNewsDetail(detail);
    } catch (error) {
      console.error('加载新闻详情失败:', error);
      message.error('加载新闻详情失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 提交反馈
   */
  const handleFeedback = async (feedback: {
    relevant: boolean;
    sentiment: 'accurate' | 'inaccurate';
    comment?: string;
  }) => {
    if (!newsDetail) return;
    
    try {
      await submitNewsFeedback(newsDetail.id, feedback);
      message.success('反馈提交成功');
    } catch (error) {
      console.error('提交反馈失败:', error);
      message.error('提交反馈失败');
    }
  };

  /**
   * 获取情感标签
   */
  const getSentimentTag = (sentiment: 'positive' | 'negative' | 'neutral', score: number) => {
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
      <Tag color={colors[sentiment]}>
        {labels[sentiment]} {(score * 100).toFixed(0)}%
      </Tag>
    );
  };

  /**
   * 获取市场反应指标
   */
  const getMarketReactionColor = (change: number) => {
    return change > 0 ? '#52c41a' : change < 0 ? '#ff4d4f' : '#faad14';
  };

  /**
   * 监听newsId变化
   */
  useEffect(() => {
    if (visible && newsId) {
      loadNewsDetail(newsId);
    } else {
      setNewsDetail(null);
    }
  }, [visible, newsId]);

  return (
    <Modal
      title="新闻详情"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="news-detail-modal"
    >
      {loading ? (
        <Card loading />
      ) : newsDetail ? (
        <div className="news-detail-content">
          {/* 新闻标题和元信息 */}
          <div className="news-header">
            <Title level={4} style={{ marginBottom: 16 }}>
              {newsDetail.title}
            </Title>
            
            <div className="news-meta">
              <Space wrap size="middle">
                <Text type="secondary">
                  <CalendarOutlined /> {dayjs(newsDetail.publishedAt).format('YYYY-MM-DD HH:mm')}
                </Text>
                <Text type="secondary">
                  <UserOutlined /> {newsDetail.source}
                </Text>
                {newsDetail.author && (
                  <Text type="secondary">
                    {newsDetail.author}
                  </Text>
                )}
                <Text type="secondary">
                  <EyeOutlined /> {newsDetail.readCount || 0} 次阅读
                </Text>
              </Space>
              
              <Space style={{ marginTop: 8 }}>
                {getSentimentTag(newsDetail.sentiment, newsDetail.sentimentScore)}
                {newsDetail.importance && (
                  <Tag color={
                    newsDetail.importance === 'high' ? 'red' : 
                    newsDetail.importance === 'medium' ? 'orange' : 'default'
                  }>
                    {newsDetail.importance === 'high' ? '重要' : 
                     newsDetail.importance === 'medium' ? '一般' : '普通'}
                  </Tag>
                )}
                <Tag>{newsDetail.category === 'market' ? '市场' : 
                      newsDetail.category === 'stock' ? '个股' : 
                      newsDetail.category === 'policy' ? '政策' : '财经'}</Tag>
              </Space>
            </div>
          </div>

          <Divider />

          {/* 新闻图片 */}
          {newsDetail.imageUrl && (
            <div className="news-image" style={{ marginBottom: 16 }}>
              <Image
                src={newsDetail.imageUrl}
                alt={newsDetail.title}
                style={{ maxWidth: '100%', maxHeight: 300 }}
              />
            </div>
          )}

          {/* 新闻摘要 */}
          <Card size="small" style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
            <Paragraph style={{ marginBottom: 0, fontWeight: 500 }}>
              {newsDetail.summary}
            </Paragraph>
          </Card>

          {/* 新闻正文 */}
          <div className="news-content">
            <Paragraph>
              {newsDetail.fullContent || newsDetail.content}
            </Paragraph>
          </div>

          {/* 相关股票 */}
          {newsDetail.relatedStocks.length > 0 && (
            <div className="related-stocks" style={{ marginBottom: 16 }}>
              <Text strong style={{ marginRight: 8 }}>相关股票:</Text>
              <Space wrap>
                {newsDetail.relatedStocks.map(stock => (
                  <Tag key={stock} color="blue">
                    {stock}
                  </Tag>
                ))}
              </Space>
            </div>
          )}

          {/* 市场反应 */}
          {newsDetail.marketReaction && (
            <Card title="市场反应" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="价格变化"
                    value={newsDetail.marketReaction.priceChange}
                    precision={2}
                    suffix="%"
                    valueStyle={{ 
                      color: getMarketReactionColor(newsDetail.marketReaction.priceChange) 
                    }}
                    prefix={
                      newsDetail.marketReaction.priceChange > 0 ? 
                      <RiseOutlined /> : <FallOutlined />
                    }
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="成交量变化"
                    value={newsDetail.marketReaction.volumeChange}
                    precision={2}
                    suffix="%"
                    valueStyle={{ 
                      color: getMarketReactionColor(newsDetail.marketReaction.volumeChange) 
                    }}
                  />
                </Col>
                <Col span={8}>
                  <Text type="secondary">
                    时间窗口: {newsDetail.marketReaction.timeframe}
                  </Text>
                </Col>
              </Row>
            </Card>
          )}

          {/* 社交媒体指标 */}
          {newsDetail.socialMetrics && (
            <Card title="社交媒体反响" size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="分享数"
                    value={newsDetail.socialMetrics.shares}
                    prefix={<ShareAltOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="评论数"
                    value={newsDetail.socialMetrics.comments}
                    prefix={<MessageOutlined />}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="点赞数"
                    value={newsDetail.socialMetrics.likes}
                    prefix={<HeartOutlined />}
                  />
                </Col>
              </Row>
            </Card>
          )}

          {/* 相关新闻 */}
          {newsDetail.relatedNews && newsDetail.relatedNews.length > 0 && (
            <Card title="相关新闻" size="small" style={{ marginBottom: 16 }}>
              <List
                size="small"
                dataSource={newsDetail.relatedNews}
                renderItem={(item) => (
                  <List.Item
                    className="related-news-item"
                    onClick={() => onRelatedNewsClick?.(item)}
                    actions={[
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {dayjs(item.publishedAt).format('MM-DD HH:mm')}
                      </Text>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Text ellipsis style={{ cursor: 'pointer' }}>
                          {item.title}
                        </Text>
                      }
                      description={
                        <Space>
                          {getSentimentTag(item.sentiment, item.sentimentScore)}
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {item.source}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* 操作按钮 */}
          <div className="news-actions">
            <Space>
              <Button
                type="primary"
                icon={<LinkOutlined />}
                onClick={() => window.open(newsDetail.url, '_blank')}
              >
                查看原文
              </Button>
              
              <Tooltip title="标记为相关">
                <Button
                  icon={<HeartOutlined />}
                  onClick={() => handleFeedback({ relevant: true, sentiment: 'accurate' })}
                >
                  有用
                </Button>
              </Tooltip>
              
              <Tooltip title="标记为不相关">
                <Button
                  onClick={() => handleFeedback({ relevant: false, sentiment: 'inaccurate' })}
                >
                  无用
                </Button>
              </Tooltip>
            </Space>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Text type="secondary">未找到新闻详情</Text>
        </div>
      )}
    </Modal>
  );
};

export default NewsDetailModal;