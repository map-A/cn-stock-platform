/**
 * 股票详情页
 */
import React, { useEffect } from 'react';
import { Card, Row, Col, Tabs, Spin } from 'antd';
import { useParams } from 'umi';
import { useRequest } from 'ahooks';
import { getStockInfo, getStockQuote } from '@/services/stock';
import { useStockStore } from '@/models/stock';
import { useStockWebSocket } from '@/hooks/useWebSocket';

import PriceCard from './components/PriceCard';
import ChartPanel from './components/ChartPanel';
import InfoPanel from './components/InfoPanel';
import NewsPanel from './components/NewsPanel';
import LoadingSpinner from '@/components/LoadingSpinner';

import styles from './index.less';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { setCurrentSymbol, updateRealtimeQuote, isMarketOpen } = useStockStore();

  // 获取股票基本信息
  const { data: stockInfo, loading: infoLoading } = useRequest(
    () => getStockInfo(symbol!),
    {
      refreshDeps: [symbol],
      cacheKey: `stock-info-${symbol}`,
    }
  );

  // 获取股票行情
  const { data: stockQuote, loading: quoteLoading, refresh } = useRequest(
    () => getStockQuote(symbol!),
    {
      refreshDeps: [symbol],
      pollingInterval: isMarketOpen ? 3000 : 0, // 开盘时每3秒轮询
      cacheKey: `stock-quote-${symbol}`,
    }
  );

  // WebSocket实时行情（仅在开盘时）
  useStockWebSocket(
    isMarketOpen ? symbol! : null,
    (data) => {
      if (data.quote) {
        updateRealtimeQuote(data.quote);
      }
    }
  );

  // 设置当前股票代码
  useEffect(() => {
    if (symbol) {
      setCurrentSymbol(symbol);
    }
  }, [symbol, setCurrentSymbol]);

  if (infoLoading || quoteLoading) {
    return <LoadingSpinner fullscreen tip="加载股票数据中..." />;
  }

  if (!stockInfo || !stockQuote) {
    return (
      <div className={styles.error}>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <h3>未找到股票信息</h3>
            <p>股票代码: {symbol}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.stockDetail}>
      <Row gutter={[16, 16]}>
        {/* 价格卡片 */}
        <Col span={24}>
          <PriceCard quote={stockQuote} info={stockInfo} />
        </Col>

        {/* 图表 + 信息面板 */}
        <Col xs={24} lg={18}>
          <Card className={styles.chartCard}>
            <ChartPanel symbol={symbol!} />
          </Card>
        </Col>

        <Col xs={24} lg={6}>
          <InfoPanel info={stockInfo} quote={stockQuote} />
        </Col>

        {/* Tabs 区域 */}
        <Col span={24}>
          <Card>
            <Tabs
              defaultActiveKey="news"
              items={[
                {
                  key: 'news',
                  label: '新闻公告',
                  children: <NewsPanel symbol={symbol!} />,
                },
                {
                  key: 'financial',
                  label: '财务数据',
                  children: <div style={{ padding: 20 }}>财务数据开发中...</div>,
                },
                {
                  key: 'insider',
                  label: '内部交易',
                  children: <div style={{ padding: 20 }}>内部交易开发中...</div>,
                },
                {
                  key: 'institutional',
                  label: '机构持仓',
                  children: <div style={{ padding: 20 }}>机构持仓开发中...</div>,
                },
                {
                  key: 'shareholder',
                  label: '股东信息',
                  children: <div style={{ padding: 20 }}>股东信息开发中...</div>,
                },
                {
                  key: 'analysis',
                  label: '技术分析',
                  children: <div style={{ padding: 20 }}>技术分析开发中...</div>,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StockDetail;
