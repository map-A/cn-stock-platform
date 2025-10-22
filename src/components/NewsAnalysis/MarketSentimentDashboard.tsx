/**
 * 市场情绪仪表板组件
 * 
 * 功能特性:
 * - 整体情绪指标展示
 * - 情绪趋势图表
 * - 情绪分布统计
 * - 实时更新
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Space, Tooltip } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
  SmileOutlined,
  FrownOutlined,
  MehOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { getMarketSentiment } from '@/services/news';
import type { MarketSentiment, NewsSentiment } from '@/types/news';
import './MarketSentimentDashboard.less';

export interface MarketSentimentDashboardProps {
  timeRange?: '1d' | '7d' | '30d';
  onSentimentClick?: (sentiment: NewsSentiment) => void;
}

const MarketSentimentDashboard: React.FC<MarketSentimentDashboardProps> = ({
  timeRange = '7d',
  onSentimentClick,
}) => {
  const [sentimentData, setSentimentData] = useState<MarketSentiment[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSentiment, setCurrentSentiment] = useState<MarketSentiment | null>(null);
  
  const trendChartRef = useRef<HTMLDivElement>(null);
  const distributionChartRef = useRef<HTMLDivElement>(null);

  /**
   * 加载市场情绪数据
   */
  const loadSentimentData = async () => {
    try {
      setLoading(true);
      const endDate = dayjs().format('YYYY-MM-DD');
      const startDate = dayjs().subtract(
        timeRange === '1d' ? 1 : timeRange === '7d' ? 7 : 30,
        'day'
      ).format('YYYY-MM-DD');
      
      const data = await getMarketSentiment(startDate, endDate);
      setSentimentData(data);
      
      if (data.length > 0) {
        setCurrentSentiment(data[data.length - 1]);
      }
    } catch (error) {
      console.error('加载市场情绪数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 初始化趋势图表
   */
  const initTrendChart = () => {
    if (!trendChartRef.current || sentimentData.length === 0) return;

    const chart = echarts.init(trendChartRef.current);
    
    const option = {
      title: {
        text: '情绪趋势',
        textStyle: { fontSize: 14 },
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          const sentiment = data.value > 0.6 ? '正面' : data.value < 0.4 ? '负面' : '中性';
          return `${data.axisValue}<br/>情绪指数: ${(data.value * 100).toFixed(1)}%<br/>情绪: ${sentiment}`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: sentimentData.map(item => dayjs(item.date).format('MM-DD')),
        axisLabel: {
          fontSize: 11,
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1,
        axisLabel: {
          formatter: (value: number) => (value * 100).toFixed(0) + '%',
          fontSize: 11,
        },
      },
      series: [
        {
          name: '情绪指数',
          type: 'line',
          data: sentimentData.map(item => item.sentimentScore),
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#1890ff',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
              ],
            },
          },
          markLine: {
            silent: true,
            data: [
              { yAxis: 0.6, lineStyle: { color: '#52c41a', type: 'dashed' } },
              { yAxis: 0.4, lineStyle: { color: '#ff4d4f', type: 'dashed' } },
            ],
          },
        },
      ],
    };

    chart.setOption(option);
    return () => chart.dispose();
  };

  /**
   * 初始化分布图表
   */
  const initDistributionChart = () => {
    if (!distributionChartRef.current || !currentSentiment) return;

    const chart = echarts.init(distributionChartRef.current);
    
    const option = {
      title: {
        text: '情绪分布',
        textStyle: { fontSize: 14 },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      series: [
        {
          name: '新闻情绪',
          type: 'pie',
          radius: '60%',
          data: [
            {
              value: currentSentiment.positiveCount,
              name: '正面',
              itemStyle: { color: '#52c41a' },
            },
            {
              value: currentSentiment.neutralCount,
              name: '中性',
              itemStyle: { color: '#faad14' },
            },
            {
              value: currentSentiment.negativeCount,
              name: '负面',
              itemStyle: { color: '#ff4d4f' },
            },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            fontSize: 12,
          },
        },
      ],
    };

    chart.setOption(option);
    return () => chart.dispose();
  };

  /**
   * 获取情绪图标
   */
  const getSentimentIcon = (sentiment: NewsSentiment) => {
    const icons = {
      positive: <SmileOutlined style={{ color: '#52c41a' }} />,
      neutral: <MehOutlined style={{ color: '#faad14' }} />,
      negative: <FrownOutlined style={{ color: '#ff4d4f' }} />,
    };
    return icons[sentiment];
  };

  /**
   * 获取趋势图标
   */
  const getTrendIcon = (direction: 'up' | 'down' | 'stable') => {
    const icons = {
      up: <RiseOutlined style={{ color: '#52c41a' }} />,
      down: <FallOutlined style={{ color: '#ff4d4f' }} />,
      stable: <MinusOutlined style={{ color: '#faad14' }} />,
    };
    return icons[direction];
  };

  /**
   * 初始化图表
   */
  useEffect(() => {
    const cleanupTrend = initTrendChart();
    const cleanupDistribution = initDistributionChart();
    
    return () => {
      cleanupTrend?.();
      cleanupDistribution?.();
    };
  }, [sentimentData, currentSentiment]);

  /**
   * 加载数据
   */
  useEffect(() => {
    loadSentimentData();
  }, [timeRange]);

  if (!currentSentiment) {
    return (
      <Card loading={loading} title="市场情绪">
        <div style={{ height: 200 }} />
      </Card>
    );
  }

  return (
    <div className="market-sentiment-dashboard">
      {/* 情绪概览 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="当前情绪"
              value={currentSentiment.sentimentScore * 100}
              precision={1}
              suffix="%"
              prefix={getSentimentIcon(currentSentiment.overallSentiment)}
              valueStyle={{
                color:
                  currentSentiment.overallSentiment === 'positive'
                    ? '#52c41a'
                    : currentSentiment.overallSentiment === 'negative'
                    ? '#ff4d4f'
                    : '#faad14',
              }}
            />
            <div style={{ marginTop: 8 }}>
              <Space>
                <Tag color={
                  currentSentiment.overallSentiment === 'positive'
                    ? 'success'
                    : currentSentiment.overallSentiment === 'negative'
                    ? 'error'
                    : 'warning'
                }>
                  {currentSentiment.overallSentiment === 'positive'
                    ? '正面'
                    : currentSentiment.overallSentiment === 'negative'
                    ? '负面'
                    : '中性'}
                </Tag>
                {getTrendIcon(currentSentiment.trendDirection)}
              </Space>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="新闻总数"
              value={currentSentiment.totalCount}
              prefix={<SmileOutlined />}
            />
            <Progress
              percent={(currentSentiment.positiveCount / currentSentiment.totalCount) * 100}
              size="small"
              strokeColor="#52c41a"
              format={(percent) => `正面 ${percent?.toFixed(0)}%`}
            />
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card size="small">
            <Statistic
              title="置信度"
              value={currentSentiment.confidenceLevel * 100}
              precision={1}
              suffix="%"
            />
            <div style={{ marginTop: 8 }}>
              <Progress
                percent={currentSentiment.confidenceLevel * 100}
                size="small"
                strokeColor="#1890ff"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card size="small" className="sentiment-actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Tooltip title="查看正面新闻">
                <div
                  className="sentiment-item positive"
                  onClick={() => onSentimentClick?.('positive')}
                >
                  <SmileOutlined /> 正面 {currentSentiment.positiveCount}
                </div>
              </Tooltip>
              <Tooltip title="查看中性新闻">
                <div
                  className="sentiment-item neutral"
                  onClick={() => onSentimentClick?.('neutral')}
                >
                  <MehOutlined /> 中性 {currentSentiment.neutralCount}
                </div>
              </Tooltip>
              <Tooltip title="查看负面新闻">
                <div
                  className="sentiment-item negative"
                  onClick={() => onSentimentClick?.('negative')}
                >
                  <FrownOutlined /> 负面 {currentSentiment.negativeCount}
                </div>
              </Tooltip>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 图表展示 */}
      <Row gutter={16}>
        <Col xs={24} lg={14}>
          <Card title="情绪趋势分析" size="small">
            <div ref={trendChartRef} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="情绪分布" size="small">
            <div ref={distributionChartRef} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MarketSentimentDashboard;