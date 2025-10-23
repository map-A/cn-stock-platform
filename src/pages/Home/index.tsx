/**
 * 首页 - 使用 ProLayout
 * 布局结构：
 * 1. Hero 搜索区域
 * 2. 快速导航卡片（6列网格）
 * 3. 三列布局：
 *    - 左：市场行情（涨跌榜）
 *    - 右：分析报告、即将收益、期权流
 * 4. 新闻区域
 */
import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Space, Typography, Input, Table, Button, Tabs, Skeleton } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  RiseOutlined,
  FallOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { useNavigate, useIntl } from '@umijs/max';
import { getHotStocks } from '@/services/stock';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useStockStore } from '@/stores/modules/stock';
import styles from './index.less';

const { Title, Text } = Typography;

interface QuickCard {
  icon: string;
  label: string;
  href: string;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [searchText, setSearchText] = useState('');
  const { isMarketOpen } = useStockStore();

  // 获取热门股票
  const { data: hotStocks = [] } = useRequest(
    () => getHotStocks(100),
    {
      cacheKey: 'home-hot-stocks',
      staleTime: 60000,
    }
  );

  // 快速导航卡片（6列）
  const quickCards: QuickCard[] = [
    { icon: '🤖', label: intl.formatMessage({ id: 'home.quickCard.aiAgent' }), href: '/chat' },
    { icon: '📈', label: intl.formatMessage({ id: 'home.quickCard.movers' }), href: '/market/mover' },
    { icon: '🔍', label: intl.formatMessage({ id: 'home.quickCard.screener' }), href: '/screener' },
    { icon: '💹', label: intl.formatMessage({ id: 'home.quickCard.options' }), href: '/options' },
    { icon: '📅', label: intl.formatMessage({ id: 'home.quickCard.calendar' }), href: '/market/calendar' },
    { icon: '⭐', label: intl.formatMessage({ id: 'home.quickCard.watchlist' }), href: '/watchlist' },
  ];

  // 涨跌数据
  const gainers = hotStocks.filter((s: any) => s.changePercent > 0).slice(0, 10);
  const losers = hotStocks.filter((s: any) => s.changePercent < 0).slice(0, 10);

  const marketMoverColumns = [
    {
      title: intl.formatMessage({ id: 'home.table.symbol' }),
      dataIndex: 'symbol',
      key: 'symbol',
      width: 80,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: intl.formatMessage({ id: 'home.table.price' }),
      dataIndex: 'price',
      key: 'price',
      width: 80,
      render: (price: number) => price?.toFixed(2),
    },
    {
      title: intl.formatMessage({ id: 'home.table.change' }),
      dataIndex: 'change',
      key: 'change',
      width: 80,
      render: (change: number) => (
        <Text className={change >= 0 ? 'positive' : 'negative'}>
          {change >= 0 ? '+' : ''}{change?.toFixed(2)}
        </Text>
      ),
    },
    {
      title: intl.formatMessage({ id: 'home.table.changePercent' }),
      dataIndex: 'changePercent',
      key: 'changePercent',
      width: 100,
      render: (changePercent: number) => (
        <Text className={changePercent >= 0 ? 'positive' : 'negative'}>
          {changePercent >= 0 ? '+' : ''}{changePercent?.toFixed(2)}%
        </Text>
      ),
    },
  ];

  return (
    <div className={styles.homeContainer}>
      {/* Hero 区域 */}
      <div className={styles.heroSection}>
        <div className={styles.heroInner}>
          <div className={styles.heroTextCenter}>
            <Title level={1} className={styles.heroTitle}>
              {intl.formatMessage({ id: 'home.hero.title' })}
            </Title>
            <Text className={styles.heroSubtitle}>
              {intl.formatMessage({ id: 'home.hero.subtitle' })}
            </Text>

            {/* 搜索框 */}
            <div className={styles.searchContainer}>
              <Input
                size="large"
                placeholder={intl.formatMessage({ id: 'home.search.placeholder' })}
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={() => {
                  if (searchText) {
                    navigate(`/stock/${searchText}`);
                  }
                }}
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 快速导航卡片 - 6列网格 */}
      <div className={styles.quickCardsWrapper}>
        <div className={styles.quickCardsGrid}>
          {quickCards.map((card, idx) => (
            <div
              key={idx}
              className={styles.quickCard}
              onClick={() => navigate(card.href)}
            >
              <div className={styles.quickCardInner}>
                <div className={styles.quickCardIcon}>{card.icon}</div>
                <div className={styles.quickCardLabel}>{card.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 主内容区 - 三列布局 */}
      <div className={styles.mainContent}>
        {/* 左侧：市场行情 */}
        <div className={styles.leftColumn}>
          <Card className={styles.section}>
            <div className={styles.sectionHeader}>
              <Title level={4} style={{ margin: 0 }}>
                📈 {intl.formatMessage({ id: 'home.market.title' })}
              </Title>
            </div>

            <Tabs
              items={[
                {
                  key: 'gainers',
                  label: `${intl.formatMessage({ id: 'home.market.gainers' })} (${gainers.length})`,
                  children: (
                    <Table
                      dataSource={gainers.map((s: any, i: number) => ({ ...s, key: i }))}
                      columns={marketMoverColumns}
                      pagination={false}
                      size="small"
                      rowKey="key"
                    />
                  ),
                },
                {
                  key: 'losers',
                  label: `${intl.formatMessage({ id: 'home.market.losers' })} (${losers.length})`,
                  children: (
                    <Table
                      dataSource={losers.map((s: any, i: number) => ({ ...s, key: i }))}
                      columns={marketMoverColumns}
                      pagination={false}
                      size="small"
                      rowKey="key"
                    />
                  ),
                },
              ]}
            />
          </Card>

          {/* 新闻区 */}
          <Card className={`${styles.section} ${styles.newsSection}`}>
            <div className={styles.sectionHeader}>
              <Title level={4} style={{ margin: 0 }}>
                📰 {intl.formatMessage({ id: 'home.news.title' })}
              </Title>
              <Button type="link" size="small" onClick={() => navigate('/community/news')}>
                {intl.formatMessage({ id: 'home.viewAll' })} →
              </Button>
            </div>
            <div className={styles.newsList}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={styles.newsItem}>
                  <div className={styles.newsTitle}>
                    示例新闻标题 {i}
                  </div>
                  <div className={styles.newsTime}>
                    {new Date(Date.now() - i * 3600000).toLocaleTimeString('zh-CN')}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 右侧：三个组件堆叠 */}
        <div className={styles.rightColumn}>
          {/* 分析报告 */}
          <Card className={styles.section}>
            <div className={styles.sectionHeader}>
              <Title level={4} style={{ margin: 0 }}>
                📊 {intl.formatMessage({ id: 'home.analysis.title' })}
              </Title>
            </div>
            <div className={styles.placeholderContent}>
              <Skeleton active />
              <div style={{ marginTop: 16 }}>
                <Skeleton active />
              </div>
            </div>
          </Card>

          {/* 即将收益 */}
          <Card className={styles.section}>
            <div className={styles.sectionHeader}>
              <Title level={4} style={{ margin: 0 }}>
                📅 {intl.formatMessage({ id: 'home.earnings.title' })}
              </Title>
              <Button type="link" size="small" onClick={() => navigate('/market/calendar')}>
                {intl.formatMessage({ id: 'home.viewAll' })} →
              </Button>
            </div>
            <div className={styles.placeholderContent}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.earningsItem}>
                  <div className={styles.earningsCode}>EXAMPLE{i}</div>
                  <div className={styles.earningsDate}>2024-10-{25 + i}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* 期权流 */}
          <Card className={styles.section}>
            <div className={styles.sectionHeader}>
              <Title level={4} style={{ margin: 0 }}>
                💰 {intl.formatMessage({ id: 'home.options.title' })}
              </Title>
              <Button type="link" size="small" onClick={() => navigate('/options')}>
                {intl.formatMessage({ id: 'home.viewAll' })} →
              </Button>
            </div>
            <div className={styles.placeholderContent}>
              <Skeleton active paragraph={{ rows: 3 }} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
