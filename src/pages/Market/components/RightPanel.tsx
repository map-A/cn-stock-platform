import React, { useState } from 'react';
import {
  StarOutlined,
  BellOutlined,
  UnorderedListOutlined,
  FilterOutlined,
  CalendarOutlined,
  TeamOutlined,
  NotificationOutlined,
  AppstoreOutlined,
  PlusOutlined,
  SettingOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Button, Tabs, Input, Space, Table, Tag, Card } from 'antd';
import type { TabsProps, ColumnsType } from 'antd';
import styles from './RightPanel.module.less';

interface WatchlistStock {
  key: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const RightPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('watchlist');

  interface WatchlistStock {
    key: string;
    symbol: string;
    name: string;
    price?: number;
    change?: number;
    changePercent?: number;
    logo?: string;
    delayed?: boolean;
    status?: string;
    isGroup?: boolean;
  }

  const mockWatchlist: WatchlistStock[] = [
    { key: '1', symbol: '000001', name: '上证指数', price: 4000.14, change: -2.62, changePercent: -0.07, logo: 'https://s3-symbol-logo.tradingview.com/indices/sse-composite.svg', delayed: true, status: '休市' },
    { key: '2', symbol: '399106', name: '深证综指', price: 2507.84, change: -9.74, changePercent: -0.39, logo: 'https://s3-symbol-logo.tradingview.com/indices/szse-composite-index.svg', delayed: true, status: '休市' },
    { key: '3', symbol: 'HSI', name: '恒生指数', price: 26922.74, change: 226.32, changePercent: 0.85, logo: 'https://s3-symbol-logo.tradingview.com/indices/hang-seng.svg', status: '休市' },
    { key: '4', symbol: 'SPX', name: '标普500', price: 6867.11, change: 20.50, changePercent: 0.30, logo: 'https://s3-symbol-logo.tradingview.com/indices/s-and-p-500.svg' },
    { key: 'g1', symbol: '股票', name: '股票', isGroup: true },
    { key: '5', symbol: 'AAPL', name: '苹果', price: 274.62, change: -0.63, changePercent: -0.23, logo: 'https://s3-symbol-logo.tradingview.com/apple.svg' },
    { key: '6', symbol: 'TSLA', name: '特斯拉', price: 441.50, change: 1.88, changePercent: 0.43, logo: 'https://s3-symbol-logo.tradingview.com/tesla.svg' },
    { key: '7', symbol: 'NVDA', name: '英伟达', price: 195.36, change: 2.20, changePercent: 1.14, logo: 'https://s3-symbol-logo.tradingview.com/nvidia.svg' },
  ];

  const columns: ColumnsType<WatchlistStock> = [
    {
      title: '商品',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 100,
      render: (text, record) => (
        <div className={styles.symbolCell}>
          {record.logo && (
            <img 
              src={record.logo} 
              alt={text}
              className={styles.logo}
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          )}
          <div className={styles.info}>
            <span className={styles.symbol}>{text}</span>
            {record.delayed && <Tag color="default" className={styles.tag}>D</Tag>}
          </div>
          {record.status && <Tag color="default" className={styles.statusTag}>{record.status}</Tag>}
        </div>
      ),
    },
    {
      title: '最新价',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      align: 'right',
      render: (price, record) => record.isGroup ? '' : price?.toFixed(2) || '-',
    },
    {
      title: '涨跌%',
      dataIndex: 'changePercent',
      key: 'changePercent',
      width: 70,
      align: 'right',
      render: (percent, record) => {
        if (record.isGroup) return '';
        if (percent === undefined) return '-';
        return (
          <span className={record.change && record.change >= 0 ? styles.priceUp : styles.priceDown}>
            {percent >= 0 ? '+' : ''}{percent.toFixed(2)}%
          </span>
        );
      },
    },
  ];

  const renderWatchlist = () => (
    <div>
      <div className={styles.watchlistHeader}>
        <Button type="text" icon={<PlusOutlined />} size="small">
          添加商品代码
        </Button>
        <div className={styles.spacer} />
        <Button type="text" icon={<EyeOutlined />} size="small">
          高级视图
        </Button>
        <Button type="text" icon={<SettingOutlined />} size="small" />
      </div>

      <Table
        columns={columns}
        dataSource={mockWatchlist}
        pagination={false}
        size="small"
        rowClassName={(record) => record.isGroup ? styles.groupRow : styles.stockRow}
      />
    </div>
  );

  const renderDetails = () => (
    <div>
      {/* 公司信息头部 */}
      <div className={styles.detailSection}>
        <div className={styles.companyHeader}>
          <img 
            src="https://s3-symbol-logo.tradingview.com/nvidia.svg" 
            alt="NVDA"
            className={styles.logo}
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
          <div className={styles.info}>
            <div className={styles.title}>
              <a href="#">NVIDIA Corporation</a>
              <span className={styles.exchange}>NASDAQ</span>
            </div>
            <div className={styles.categories}>
              <a href="#">电子科技</a>
              <span className={styles.dot}>·</span>
              <a href="#">半导体</a>
            </div>
          </div>
        </div>
        
        <div className={styles.priceInfo}>
          <div className={styles.price}>
            195.36 <span className={styles.currency}>USD</span>
          </div>
          <div className={styles.change}>
            +2.20 +1.14%
          </div>
          <Tag color="success" className={styles.status}>开市</Tag>
        </div>

        <Card size="small" className={styles.newsCard}>
          <div className={styles.newsContent}>
            <div className={styles.time}>3小时前</div>
            <div className={styles.title}>
              投资者为长期增长目标欢呼，AMD 股价攀升
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.detailSection}>
        <div className={styles.sectionTitle}>关键统计</div>
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <span className={styles.label}>下一份财报</span>
            <span className={styles.value}>8天后</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>成交量</span>
            <span className={styles.value}>4.59M</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>平均成交量(30)</span>
            <span className={styles.value}>181.16M</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>市值</span>
            <span className={styles.value}>4.69T</span>
          </div>
        </div>
      </div>

      <div className={styles.detailSection}>
        <div className={styles.sectionTitle}>表现</div>
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <span className={styles.label}>1周</span>
            <span className={`${styles.value} ${styles.priceDown}`}>-4.85%</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>1月</span>
            <span className={`${styles.value} ${styles.priceDown}`}>-0.18%</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>3月</span>
            <span className={`${styles.value} ${styles.priceUp}`}>+5.77%</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>年初至今</span>
            <span className={`${styles.value} ${styles.priceUp}`}>+42.03%</span>
          </div>
        </div>
      </div>

      <div className={styles.detailSection}>
        <div className={styles.sectionTitle}>技术指标</div>
        <Card size="small" className={styles.ratingCard}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className={styles.row}>
              <span>评级</span>
              <Tag color="warning">中立</Tag>
            </div>
            <div className={styles.description}>
              基于移动平均线和振荡指标
            </div>
          </Space>
        </Card>
      </div>

      <div className={styles.detailSection}>
        <div className={styles.sectionTitle}>分析师评级</div>
        <Card size="small" className={styles.ratingCard}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div className={styles.row}>
              <span>评级</span>
              <Tag color="success">强烈买入</Tag>
            </div>
            <div className={styles.description}>
              1年价格目标: $233.76 (+21.02%)
            </div>
          </Space>
        </Card>
      </div>

      <div className={styles.detailSection}>
        <div className={styles.sectionTitle}>概览</div>
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <span className={styles.label}>网站</span>
            <a href="https://nvidia.com" target="_blank" rel="noopener noreferrer">
              nvidia.com
            </a>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>员工(FY)</span>
            <span className={styles.value}>36K</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>行业</span>
            <span className={styles.value}>半导体</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.label}>部门</span>
            <span className={styles.value}>电子科技</span>
          </div>
        </div>
      </div>
    </div>
  );

  const tabItems: TabsProps['items'] = [
    {
      key: 'watchlist',
      label: <StarOutlined />,
      children: renderWatchlist(),
    },
    {
      key: 'alerts',
      label: <BellOutlined />,
      children: <div style={{ padding: 20, textAlign: 'center' }}>暂无警报</div>,
    },
    {
      key: 'details',
      label: <UnorderedListOutlined />,
      children: renderDetails(),
    },
    {
      key: 'screener',
      label: <FilterOutlined />,
      children: <div style={{ padding: 20, textAlign: 'center' }}>筛选器功能</div>,
    },
    {
      key: 'calendar',
      label: <CalendarOutlined />,
      children: <div style={{ padding: 20, textAlign: 'center' }}>财经日历</div>,
    },
    {
      key: 'community',
      label: <TeamOutlined />,
      children: <div style={{ padding: 20, textAlign: 'center' }}>社区观点</div>,
    },
  ];

  return (
    <div className={styles.panel}>
      <Tabs
        activeKey={activeTab}
        items={tabItems}
        onChange={setActiveTab}
        className={styles.tabs}
        size="small"
      />
      <div className={styles.content}>
        {tabItems.find((item) => item.key === activeTab)?.children}
      </div>
    </div>
  );
};

export default RightPanel;
