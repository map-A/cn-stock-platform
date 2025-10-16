/**
 * 首页
 */
import React from 'react';
import { Card, Row, Col, Statistic, Space, Typography, Divider } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getHotStocks } from '@/services/stock';
import StockCard from '@/components/StockCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useStockStore } from '@/models/stock';
import styles from './index.less';

const { Title, Text } = Typography;

const Home: React.FC = () => {
  const { isMarketOpen } = useStockStore();

  // 获取热门股票
  const { data: hotStocks, loading: hotStocksLoading } = useRequest(
    () => getHotStocks(8),
    {
      cacheKey: 'home-hot-stocks',
      staleTime: 60000, // 1分钟
    }
  );

  // 市场概览（模拟数据）
  const marketOverview = {
    sh: {
      name: '上证指数',
      value: 3245.67,
      change: 12.34,
      changePercent: 0.38,
    },
    sz: {
      name: '深证成指',
      value: 10876.54,
      change: -23.45,
      changePercent: -0.22,
    },
    cy: {
      name: '创业板指',
      value: 2156.78,
      change: 5.67,
      changePercent: 0.26,
    },
    kc: {
      name: '科创50',
      value: 987.65,
      change: -3.21,
      changePercent: -0.32,
    },
  };

  return (
    <div className={styles.home}>
      {/* 市场状态提示 */}
      <Card className={styles.marketStatus}>
        <Space size="large" align="center">
          <div className={styles.statusIndicator}>
            <div className={isMarketOpen ? styles.openDot : styles.closedDot} />
            <Text strong>
              {isMarketOpen ? '交易中' : '已休市'}
            </Text>
          </div>
          <Text type="secondary">
            {isMarketOpen
              ? '实时数据更新中，数据延迟约3秒'
              : '市场已休市，显示最新收盘数据'}
          </Text>
        </Space>
      </Card>

      {/* 市场概览 */}
      <Card title={<Title level={4}>市场概览</Title>} className={styles.section}>
        <Row gutter={[16, 16]}>
          {Object.entries(marketOverview).map(([key, market]) => {
            const isPositive = market.change >= 0;
            return (
              <Col xs={24} sm={12} md={6} key={key}>
                <Card hoverable>
                  <Statistic
                    title={market.name}
                    value={market.value}
                    precision={2}
                    valueStyle={{
                      color: isPositive ? '#f5222d' : '#52c41a',
                    }}
                    prefix={isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    suffix={
                      <span style={{ fontSize: 14 }}>
                        {isPositive ? '+' : ''}{market.changePercent.toFixed(2)}%
                      </span>
                    }
                  />
                  <div style={{ marginTop: 8, fontSize: 14 }}>
                    <Text type="secondary">
                      {isPositive ? '+' : ''}{market.change.toFixed(2)}
                    </Text>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* 涨跌统计 */}
      <Card className={styles.section}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="上涨"
              value={1234}
              valueStyle={{ color: '#f5222d' }}
              prefix={<RiseOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="下跌"
              value={987}
              valueStyle={{ color: '#52c41a' }}
              prefix={<FallOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="平盘"
              value={234}
              valueStyle={{ color: '#666' }}
            />
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* 热门股票 */}
      <Card
        title={<Title level={4}>热门股票</Title>}
        className={styles.section}
      >
        {hotStocksLoading ? (
          <LoadingSpinner />
        ) : (
          <Row gutter={[16, 16]}>
            {hotStocks?.map((stock) => (
              <Col xs={24} sm={12} md={8} lg={6} key={stock.symbol}>
                <StockCard stock={stock} />
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* 快速链接 */}
      <Card title={<Title level={4}>快速导航</Title>} className={styles.section}>
        <Row gutter={16}>
          <Col xs={12} sm={8} md={6}>
            <Card hoverable className={styles.quickLink}>
              <div className={styles.quickLinkContent}>
                <div className={styles.quickLinkIcon}>📈</div>
                <Text strong>涨跌榜</Text>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card hoverable className={styles.quickLink}>
              <div className={styles.quickLinkContent}>
                <div className={styles.quickLinkIcon}>🔍</div>
                <Text strong>选股器</Text>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card hoverable className={styles.quickLink}>
              <div className={styles.quickLinkContent}>
                <div className={styles.quickLinkIcon}>🐉</div>
                <Text strong>龙虎榜</Text>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card hoverable className={styles.quickLink}>
              <div className={styles.quickLinkContent}>
                <div className={styles.quickLinkIcon}>💰</div>
                <Text strong>北向资金</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Home;
