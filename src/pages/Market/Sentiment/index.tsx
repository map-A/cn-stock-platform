/**
 * 市场情绪页面 - 恐慌贪婪指数
 * 展示市场情绪指标和恐慌贪婪指数
 */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Space, Typography, Tag, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Gauge, Line, Column } from '@ant-design/plots';
import {
  getCurrentFearGreedIndex,
  getFearGreedHistory,
  getFearGreedComponents,
  getMarketSentiment,
} from '@/services/industry';
import type {
  FearGreedIndex,
  FearGreedHistory,
  FearGreedComponents,
  MarketSentiment as MarketSentimentType,
} from '@/services/industry';
import styles from './index.less';

const { Title, Text } = Typography;

/**
 * 市场情绪页面组件
 */
const MarketSentiment: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fearGreedIndex, setFearGreedIndex] = useState<FearGreedIndex | null>(null);
  const [history, setHistory] = useState<FearGreedHistory[]>([]);
  const [components, setComponents] = useState<FearGreedComponents | null>(null);
  const [sentiment, setSentiment] = useState<MarketSentimentType | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  /**
   * 加载数据
   */
  const loadData = async () => {
    setLoading(true);
    try {
      const [indexData, historyData, componentsData, sentimentData] = await Promise.all([
        getCurrentFearGreedIndex(),
        getFearGreedHistory(undefined, undefined, 'day'),
        getFearGreedComponents(),
        getMarketSentiment(),
      ]);

      setFearGreedIndex(indexData);
      setHistory(historyData);
      setComponents(componentsData);
      setSentiment(sentimentData);
    } catch (error) {
      console.error('Failed to load sentiment data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /**
   * 获取分类颜色
   */
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'extreme_fear':
        return '#8B0000';
      case 'fear':
        return '#DC143C';
      case 'neutral':
        return '#808080';
      case 'greed':
        return '#32CD32';
      case 'extreme_greed':
        return '#006400';
      default:
        return '#808080';
    }
  };

  /**
   * 获取分类文本
   */
  const getCategoryText = (category: string) => {
    switch (category) {
      case 'extreme_fear':
        return '极度恐慌';
      case 'fear':
        return '恐慌';
      case 'neutral':
        return '中性';
      case 'greed':
        return '贪婪';
      case 'extreme_greed':
        return '极度贪婪';
      default:
        return '中性';
    }
  };

  /**
   * 渲染恐慌贪婪指数仪表盘
   */
  const renderGauge = () => {
    if (!fearGreedIndex) return null;

    const config = {
      percent: fearGreedIndex.value / 100,
      range: {
        color: ['l(0) 0:#8B0000 0.25:#DC143C 0.5:#808080 0.75:#32CD32 1:#006400'],
      },
      indicator: {
        pointer: {
          style: {
            stroke: '#D0D0D0',
          },
        },
        pin: {
          style: {
            stroke: '#D0D0D0',
          },
        },
      },
      statistic: {
        content: {
          style: {
            fontSize: '36px',
            lineHeight: '36px',
            color: getCategoryColor(fearGreedIndex.category),
          },
          formatter: () => fearGreedIndex.value.toString(),
        },
      },
      axis: {
        label: {
          formatter: (v: string) => {
            const value = Number(v) * 100;
            if (value === 0) return '0\n极度恐慌';
            if (value === 25) return '25\n恐慌';
            if (value === 50) return '50\n中性';
            if (value === 75) return '75\n贪婪';
            if (value === 100) return '100\n极度贪婪';
            return '';
          },
        },
      },
    };

    return (
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} align="center">
          <Title level={4}>恐慌贪婪指数</Title>
          <Gauge {...config} height={300} />
          <Space>
            <Tag color={getCategoryColor(fearGreedIndex.category)} style={{ fontSize: 16 }}>
              {getCategoryText(fearGreedIndex.category)}
            </Tag>
            {fearGreedIndex.change !== undefined && (
              <Text
                style={{
                  color: fearGreedIndex.change >= 0 ? '#cf1322' : '#3f8600',
                  fontSize: 16,
                }}
              >
                {fearGreedIndex.change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                {Math.abs(fearGreedIndex.change).toFixed(2)}
              </Text>
            )}
          </Space>
          <Text type="secondary">更新时间: {fearGreedIndex.updateTime}</Text>
        </Space>
      </Card>
    );
  };

  /**
   * 渲染历史趋势图
   */
  const renderHistoryChart = () => {
    if (history.length === 0) return null;

    const config = {
      data: history.map((item) => ({
        date: item.date,
        value: item.value,
      })),
      xField: 'date',
      yField: 'value',
      seriesField: 'value',
      color: '#1890ff',
      point: {
        size: 3,
        shape: 'circle',
      },
      yAxis: {
        min: 0,
        max: 100,
        tickCount: 5,
      },
      annotations: [
        {
          type: 'region',
          start: ['min', 0],
          end: ['max', 25],
          style: {
            fill: '#8B0000',
            fillOpacity: 0.1,
          },
        },
        {
          type: 'region',
          start: ['min', 75],
          end: ['max', 100],
          style: {
            fill: '#006400',
            fillOpacity: 0.1,
          },
        },
      ],
      tooltip: {
        formatter: (datum: any) => {
          return { name: '指数值', value: datum.value };
        },
      },
    };

    return (
      <Card title="历史趋势">
        <Line {...config} />
      </Card>
    );
  };

  /**
   * 渲染构成指标
   */
  const renderComponents = () => {
    if (!components) return null;

    const data = [
      { name: '市场动量', ...components.marketMomentum },
      { name: '股票强度', ...components.stockStrength },
      { name: '市场宽度', ...components.marketBreadth },
      { name: '看跌看涨比', ...components.putCallRatio },
      { name: '波动率', ...components.volatility },
      { name: '避险需求', ...components.safeHavenDemand },
      { name: '垃圾债需求', ...components.junkBondDemand },
    ];

    const config = {
      data: data.map((item) => ({
        name: item.name,
        value: item.value,
      })),
      xField: 'name',
      yField: 'value',
      seriesField: 'name',
      color: ({ value }: any) => {
        if (value < 25) return '#8B0000';
        if (value < 45) return '#DC143C';
        if (value < 55) return '#808080';
        if (value < 75) return '#32CD32';
        return '#006400';
      },
      label: {
        position: 'middle' as const,
        style: {
          fill: '#FFFFFF',
          opacity: 0.8,
        },
      },
      xAxis: {
        label: {
          autoRotate: false,
        },
      },
      yAxis: {
        min: 0,
        max: 100,
      },
    };

    return (
      <Card title="构成指标">
        <Column {...config} />
        <div style={{ marginTop: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {data.map((item) => (
              <div key={item.name}>
                <Text strong>{item.name}: </Text>
                <Text type="secondary">{item.description}</Text>
              </div>
            ))}
          </Space>
        </div>
      </Card>
    );
  };

  /**
   * 渲染市场情绪指标
   */
  const renderSentimentStats = () => {
    if (!sentiment) return null;

    return (
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="涨跌家数比"
              value={sentiment.advanceDeclineRatio}
              precision={2}
              valueStyle={{
                color: sentiment.advanceDeclineRatio >= 1 ? '#cf1322' : '#3f8600',
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="新高新低比"
              value={sentiment.newHighLowRatio}
              precision={2}
              valueStyle={{
                color: sentiment.newHighLowRatio >= 1 ? '#cf1322' : '#3f8600',
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="波动率指数"
              value={sentiment.volatilityIndex}
              precision={2}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="北向资金净流入"
              value={sentiment.northboundSentiment.netInflow}
              precision={2}
              suffix="亿"
              valueStyle={{
                color: sentiment.northboundSentiment.netInflow >= 0 ? '#cf1322' : '#3f8600',
              }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <PageContainer
      title="市场情绪"
      subTitle="通过恐慌贪婪指数和多维度指标分析市场情绪"
    >
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            {renderGauge()}
          </Col>
          <Col xs={24} lg={12}>
            {renderSentimentStats()}
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            {renderHistoryChart()}
          </Col>
          <Col xs={24} lg={12}>
            {renderComponents()}
          </Col>
        </Row>

        <Card style={{ marginTop: 16 }} title="指标说明">
          <Space direction="vertical">
            <div>
              <strong>恐慌贪婪指数：</strong>
              综合7个维度的市场数据，计算出0-100的情绪指数，0表示极度恐慌，100表示极度贪婪。
            </div>
            <div>
              <strong>使用建议：</strong>
              极度恐慌时可能是买入机会，极度贪婪时需要警惕风险。
            </div>
            <div>
              <strong>更新频率：</strong>
              每个交易日收盘后更新。
            </div>
          </Space>
        </Card>
      </Spin>
    </PageContainer>
  );
};

export default MarketSentiment;
