/**
 * 关键词云组件
 * 
 * 功能特性:
 * - 热门关键词展示
 * - 词频可视化
 * - 关键词趋势分析
 * - 交互式点击
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tag, Space, Tooltip, Select, Spin } from 'antd';
import { getKeywordAnalysis } from '@/services/news';
import type { KeywordAnalysis } from '@/types/news';
import './KeywordCloud.less';

const { Option } = Select;

export interface KeywordCloudProps {
  timeframe?: '1d' | '7d' | '30d';
  onKeywordClick?: (keyword: string) => void;
  maxWords?: number;
  showTrend?: boolean;
}

const KeywordCloud: React.FC<KeywordCloudProps> = ({
  timeframe = '7d',
  onKeywordClick,
  maxWords = 50,
  showTrend = true,
}) => {
  const [keywords, setKeywords] = useState<KeywordAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const cloudRef = useRef<HTMLDivElement>(null);

  /**
   * 加载关键词数据
   */
  const loadKeywords = async (tf: '1d' | '7d' | '30d') => {
    try {
      setLoading(true);
      const data = await getKeywordAnalysis(tf);
      setKeywords(data.slice(0, maxWords));
    } catch (error) {
      console.error('加载关键词失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取关键词大小
   */
  const getKeywordSize = (frequency: number, maxFreq: number, minFreq: number) => {
    const maxSize = 24;
    const minSize = 12;
    const range = maxFreq - minFreq;
    
    if (range === 0) return minSize;
    
    const normalizedFreq = (frequency - minFreq) / range;
    return minSize + (maxSize - minSize) * normalizedFreq;
  };

  /**
   * 获取关键词颜色
   */
  const getKeywordColor = (sentiment: 'positive' | 'negative' | 'neutral', importance: 'high' | 'medium' | 'low') => {
    if (importance === 'high') {
      return sentiment === 'positive' ? '#52c41a' : sentiment === 'negative' ? '#ff4d4f' : '#1890ff';
    } else if (importance === 'medium') {
      return sentiment === 'positive' ? '#73d13d' : sentiment === 'negative' ? '#ff7875' : '#40a9ff';
    } else {
      return sentiment === 'positive' ? '#95de64' : sentiment === 'negative' ? '#ffa39e' : '#69c0ff';
    }
  };

  /**
   * 获取趋势指示器
   */
  const getTrendIndicator = (trendScore: number) => {
    if (trendScore > 0.3) {
      return { symbol: '↗', color: '#52c41a', text: '上升' };
    } else if (trendScore < -0.3) {
      return { symbol: '↘', color: '#ff4d4f', text: '下降' };
    } else {
      return { symbol: '→', color: '#faad14', text: '稳定' };
    }
  };

  /**
   * 处理关键词点击
   */
  const handleKeywordClick = (keyword: KeywordAnalysis) => {
    onKeywordClick?.(keyword.keyword);
  };

  /**
   * 时间范围变更
   */
  const handleTimeframeChange = (value: '1d' | '7d' | '30d') => {
    setSelectedTimeframe(value);
    loadKeywords(value);
  };

  /**
   * 初始化加载
   */
  useEffect(() => {
    loadKeywords(selectedTimeframe);
  }, []);

  /**
   * 计算最大最小频率
   */
  const maxFreq = Math.max(...keywords.map(k => k.frequency));
  const minFreq = Math.min(...keywords.map(k => k.frequency));

  /**
   * 渲染关键词云
   */
  const renderKeywordCloud = () => {
    if (keywords.length === 0) {
      return <div className="empty-keywords">暂无关键词数据</div>;
    }

    return (
      <div className="keyword-cloud-container" ref={cloudRef}>
        {keywords.map((keyword, index) => {
          const fontSize = getKeywordSize(keyword.frequency, maxFreq, minFreq);
          const color = getKeywordColor(keyword.sentiment, keyword.importance);
          const trend = getTrendIndicator(keyword.trendScore);

          return (
            <Tooltip
              key={keyword.keyword}
              title={
                <div>
                  <div>频率: {keyword.frequency}</div>
                  <div>情感: {keyword.sentiment === 'positive' ? '正面' : keyword.sentiment === 'negative' ? '负面' : '中性'}</div>
                  <div>重要性: {keyword.importance === 'high' ? '高' : keyword.importance === 'medium' ? '中' : '低'}</div>
                  {showTrend && <div>趋势: {trend.text}</div>}
                  {keyword.relatedStocks.length > 0 && (
                    <div>相关股票: {keyword.relatedStocks.slice(0, 3).join(', ')}</div>
                  )}
                </div>
              }
            >
              <span
                className={`keyword-item ${keyword.importance}`}
                style={{
                  fontSize,
                  color,
                  fontWeight: keyword.importance === 'high' ? 'bold' : keyword.importance === 'medium' ? '500' : 'normal',
                }}
                onClick={() => handleKeywordClick(keyword)}
              >
                {keyword.keyword}
                {showTrend && (
                  <span 
                    className="trend-indicator"
                    style={{ color: trend.color }}
                  >
                    {trend.symbol}
                  </span>
                )}
              </span>
            </Tooltip>
          );
        })}
      </div>
    );
  };

  /**
   * 渲染关键词列表（备用显示方式）
   */
  const renderKeywordList = () => {
    return (
      <div className="keyword-list">
        <Space wrap>
          {keywords.slice(0, 20).map((keyword) => {
            const trend = getTrendIndicator(keyword.trendScore);
            
            return (
              <Tag
                key={keyword.keyword}
                color={
                  keyword.sentiment === 'positive'
                    ? 'green'
                    : keyword.sentiment === 'negative'
                    ? 'red'
                    : 'blue'
                }
                style={{ 
                  fontSize: keyword.importance === 'high' ? '14px' : '12px',
                  cursor: 'pointer',
                }}
                onClick={() => handleKeywordClick(keyword)}
              >
                {keyword.keyword} ({keyword.frequency})
                {showTrend && (
                  <span style={{ color: trend.color, marginLeft: 4 }}>
                    {trend.symbol}
                  </span>
                )}
              </Tag>
            );
          })}
        </Space>
      </div>
    );
  };

  return (
    <Card
      title="热门关键词"
      size="small"
      loading={loading}
      extra={
        <Select
          value={selectedTimeframe}
          onChange={handleTimeframeChange}
          size="small"
          style={{ width: 80 }}
        >
          <Option value="1d">今日</Option>
          <Option value="7d">7天</Option>
          <Option value="30d">30天</Option>
        </Select>
      }
    >
      <Spin spinning={loading}>
        <div className="keyword-cloud">
          {renderKeywordCloud()}
          
          {/* 图例 */}
          <div className="keyword-legend">
            <Space split={<span style={{ color: '#d9d9d9' }}>|</span>}>
              <span style={{ color: '#52c41a', fontSize: '12px' }}>● 正面</span>
              <span style={{ color: '#faad14', fontSize: '12px' }}>● 中性</span>
              <span style={{ color: '#ff4d4f', fontSize: '12px' }}>● 负面</span>
            </Space>
            {showTrend && (
              <div style={{ marginTop: 4 }}>
                <Space split={<span style={{ color: '#d9d9d9' }}>|</span>}>
                  <span style={{ color: '#52c41a', fontSize: '12px' }}>↗ 上升</span>
                  <span style={{ color: '#faad14', fontSize: '12px' }}>→ 稳定</span>
                  <span style={{ color: '#ff4d4f', fontSize: '12px' }}>↘ 下降</span>
                </Space>
              </div>
            )}
          </div>
        </div>
      </Spin>
    </Card>
  );
};

export default KeywordCloud;