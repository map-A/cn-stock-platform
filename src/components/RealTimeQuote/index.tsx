/**
 * @fileoverview 实时行情组件
 * @description 显示股票的实时价格、涨跌幅、成交量等关键信息
 * @author AI Assistant
 * @created 2024-01-01
 */

import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Tag, Tooltip, Row, Col, Statistic, Progress, Divider } from 'antd';
import { 
  RiseOutlined, 
  FallOutlined, 
  MinusOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useStockQuote } from '@/hooks/useStockData';
import './index.less';

const { Text } = Typography;

export interface RealTimeQuoteProps {
  /** 股票代码 */
  stockCode: string;
  /** 股票名称 */
  stockName?: string;
  /** 是否显示详细信息 */
  showDetails?: boolean;
  /** 点击回调 */
  onClick?: (stockCode: string) => void;
  /** 组件尺寸 */
  size?: 'small' | 'default' | 'large';
  /** 是否显示迷你版本 */
  mini?: boolean;
}

/**
 * 实时行情组件
 * 用于展示股票的实时价格和交易信息
 */
const RealTimeQuote: React.FC<RealTimeQuoteProps> = ({
  stockCode,
  stockName,
  showDetails = false,
  onClick,
  size = 'default',
  mini = false,
}) => {
  const { quote, loading, error } = useStockQuote(stockCode);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');

  useEffect(() => {
    if (quote) {
      setLastUpdateTime(new Date().toLocaleTimeString());
    }
  }, [quote]);

  // 获取涨跌状态
  const getTrendInfo = () => {
    if (!quote) return { icon: <MinusOutlined />, color: '#666', status: 'flat' };
    
    if (quote.change > 0) {
      return { icon: <RiseOutlined />, color: '#52c41a', status: 'rise' };
    } else if (quote.change < 0) {
      return { icon: <FallOutlined />, color: '#ff4d4f', status: 'fall' };
    }
    return { icon: <MinusOutlined />, color: '#666', status: 'flat' };
  };

  // 计算振幅
  const getAmplitude = () => {
    if (!quote || !quote.prevClosePrice) return 0;
    return (((quote.highPrice - quote.lowPrice) / quote.prevClosePrice) * 100).toFixed(2);
  };

  // 计算换手率（模拟数据）
  const getTurnoverRate = () => {
    if (!quote) return 0;
    // 换手率 = 成交量 / 流通股本 * 100%
    const circulationShares = 1000000000; // 10亿股（示例）
    return ((quote.volume / circulationShares) * 100).toFixed(2);
  };

  const trendInfo = getTrendInfo();

  // 错误状态
  if (error) {
    return (
      <Card size="small" className="real-time-quote error">
        <Text type="danger">{error}</Text>
      </Card>
    );
  }

  // 加载状态
  if (loading && !quote) {
    return (
      <Card loading className="real-time-quote">
        <div style={{ height: size === 'small' ? 60 : size === 'large' ? 120 : 80 }} />
      </Card>
    );
  }

  // 无数据状态
  if (!quote) {
    return (
      <Card className="real-time-quote no-data">
        <Text type="secondary">暂无行情数据</Text>
      </Card>
    );
  }

  // 迷你版本
  if (mini) {
    return (
      <div className="real-time-quote mini" onClick={() => onClick?.(stockCode)}>
        <Space>
          <Text strong>{stockName || stockCode}</Text>
          <Text className={`price-${trendInfo.status}`} style={{ color: trendInfo.color }}>
            ¥{quote.currentPrice}
          </Text>
          <Text className={`change-${trendInfo.status}`} style={{ color: trendInfo.color }}>
            {trendInfo.icon} {quote.change > 0 ? '+' : ''}{quote.change} ({quote.changePercent > 0 ? '+' : ''}{quote.changePercent}%)
          </Text>
        </Space>
      </div>
    );
  }

  return (
    <Card 
      className={`real-time-quote ${size}`}
      onClick={() => onClick?.(stockCode)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      title={
        <Space>
          <Text strong>{stockName || stockCode}</Text>
          <Tag color="green">实时</Tag>
          {lastUpdateTime && (
            <Text type="secondary">
              <ClockCircleOutlined /> {lastUpdateTime}
            </Text>
          )}
        </Space>
      }
    >
      <div className="quote-main">
        {/* 主要价格信息 */}
        <div className="price-section">
          <div className="current-price" style={{ color: trendInfo.color }}>
            <span className="price-value">¥{quote.currentPrice}</span>
            <span className="price-change">
              {trendInfo.icon}
              <span className="change-value">
                {quote.change > 0 ? '+' : ''}{quote.change}
              </span>
              <span className="change-percent">
                ({quote.changePercent > 0 ? '+' : ''}{quote.changePercent}%)
              </span>
            </span>
          </div>
        </div>

        {showDetails && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            
            {/* 基础行情数据 */}
            <Row gutter={[16, 8]}>
              <Col span={6}>
                <Statistic
                  title="今开"
                  value={quote.openPrice}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ fontSize: '14px' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="昨收"
                  value={quote.prevClosePrice}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ fontSize: '14px' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="最高"
                  value={quote.highPrice}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ fontSize: '14px', color: '#52c41a' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="最低"
                  value={quote.lowPrice}
                  precision={2}
                  prefix="¥"
                  valueStyle={{ fontSize: '14px', color: '#ff4d4f' }}
                />
              </Col>
            </Row>

            <Divider style={{ margin: '12px 0' }} />

            {/* 成交信息 */}
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Statistic
                  title="成交量"
                  value={quote.volume}
                  suffix="股"
                  valueStyle={{ fontSize: '14px' }}
                  formatter={(value) => `${(Number(value) / 10000).toFixed(1)}万`}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="成交额"
                  value={quote.turnover}
                  prefix="¥"
                  valueStyle={{ fontSize: '14px' }}
                  formatter={(value) => `${(Number(value) / 100000000).toFixed(2)}亿`}
                />
              </Col>
              <Col span={12}>
                <div className="indicator-item">
                  <Text type="secondary">振幅</Text>
                  <Text>{getAmplitude()}%</Text>
                </div>
              </Col>
              <Col span={12}>
                <div className="indicator-item">
                  <Text type="secondary">换手率</Text>
                  <Text>{getTurnoverRate()}%</Text>
                </div>
              </Col>
            </Row>

            {/* 涨跌进度条 */}
            <div className="price-range">
              <div className="range-labels">
                <Text type="secondary">{quote.lowPrice}</Text>
                <Text type="secondary">{quote.highPrice}</Text>
              </div>
              <Progress
                percent={((quote.currentPrice - quote.lowPrice) / (quote.highPrice - quote.lowPrice)) * 100}
                showInfo={false}
                strokeColor={trendInfo.color}
                size="small"
              />
              <div className="current-position">
                <Text>当前: ¥{quote.currentPrice}</Text>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};


export default RealTimeQuote;