import React, { useState } from 'react';
import { createStyles } from 'antd-style';
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

const useStyles = createStyles(({ token }) => ({
  panel: {
    width: '320px',
    background: token.colorBgElevated,
    borderLeft: `1px solid ${token.colorBorder}`,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  tabs: {
    height: '48px',
    borderBottom: `1px solid ${token.colorBorder}`,
    padding: '0 8px',
    '& .ant-tabs-nav': {
      marginBottom: 0,
    },
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '12px',
  },
  watchlistHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  stockRow: {
    cursor: 'pointer',
    '&:hover': {
      background: token.colorBgTextHover,
    },
  },
  priceUp: {
    color: token.colorSuccess,
  },
  priceDown: {
    color: token.colorError,
  },
  detailSection: {
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '12px',
    color: token.colorTextSecondary,
  },
  statValue: {
    fontSize: '14px',
    fontWeight: 500,
  },
}));

interface WatchlistStock {
  key: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const RightPanel: React.FC = () => {
  const { styles } = useStyles();
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {record.logo && (
            <img 
              src={record.logo} 
              alt={text}
              style={{ width: '20px', height: '20px', borderRadius: '50%' }}
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 500, fontSize: '12px' }}>{text}</span>
            {record.delayed && <Tag color="default" style={{ fontSize: '9px', padding: '0 2px', lineHeight: '14px', marginTop: '2px' }}>D</Tag>}
          </div>
          {record.status && <Tag color="default" style={{ fontSize: '9px', padding: '0 2px' }}>{record.status}</Tag>}
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
        <div style={{ flex: 1 }} />
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
        rowClassName={(record) => record.isGroup ? '' : styles.stockRow}
        onRow={(record) => ({
          style: record.isGroup ? {
            background: '#fafafa',
            fontWeight: 600,
            cursor: 'default',
          } : undefined,
        })}
      />
    </div>
  );

  const renderDetails = () => (
    <div>
      {/* 公司信息头部 */}
      <div className={styles.detailSection}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
          <img 
            src="https://s3-symbol-logo.tradingview.com/nvidia.svg" 
            alt="NVDA"
            style={{ width: '40px', height: '40px', borderRadius: '8px' }}
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <a href="#" style={{ fontSize: '16px', fontWeight: 600, color: '#1890ff' }}>
                NVIDIA Corporation
              </a>
              <span style={{ color: '#999', fontSize: '12px' }}>NASDAQ</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
              <a href="#" style={{ color: '#1890ff' }}>电子科技</a>
              <span style={{ color: '#999' }}>·</span>
              <a href="#" style={{ color: '#1890ff' }}>半导体</a>
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '28px', fontWeight: 600, marginBottom: '4px' }}>
            195.36 <span style={{ fontSize: '14px', color: '#999' }}>USD</span>
          </div>
          <div style={{ fontSize: '16px', color: '#52c41a', fontWeight: 500 }}>
            +2.20 +1.14%
          </div>
          <Tag color="success" style={{ marginTop: '8px' }}>开市</Tag>
        </div>

        <Card size="small" style={{ marginBottom: '16px', background: '#fafafa' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <div>3小时前</div>
            <div style={{ marginTop: '4px', fontWeight: 500, color: '#000' }}>
              投资者为长期增长目标欢呼，AMD 股价攀升
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.detailSection}>
        <div className={styles.sectionTitle}>关键统计</div>
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>下一份财报</span>
            <span className={styles.statValue}>8天后</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>成交量</span>
            <span className={styles.statValue}>4.59M</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>平均成交量(30)</span>
            <span className={styles.statValue}>181.16M</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>市值</span>
            <span className={styles.statValue}>4.69T</span>
          </div>
        </div>
      </div>

      <div className={styles.detailSection}>
        <div className={styles.sectionTitle}>表现</div>
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>1周</span>
            <span className={styles.statValue}>
              <span className={styles.priceDown}>-4.85%</span>
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>1月</span>
            <span className={styles.statValue}>
              <span className={styles.priceDown}>-0.18%</span>
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>3月</span>
            <span className={styles.statValue}>
              <span className={styles.priceUp}>+5.77%</span>
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>年初至今</span>
            <span className={styles.statValue}>
              <span className={styles.priceUp}>+42.03%</span>
            </span>
          </div>
        </div>
      </div>

      <div className={styles.detailSection}>
        <div className={styles.sectionTitle}>技术指标</div>
        <Card size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>评级</span>
              <Tag color="warning">中立</Tag>
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              基于移动平均线和振荡指标
            </div>
          </Space>
        </Card>
      </div>

      <div className={styles.detailSection}>
        <div className={styles.sectionTitle}>分析师评级</div>
        <Card size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>评级</span>
              <Tag color="success">强烈买入</Tag>
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              1年价格目标: $233.76 (+21.02%)
            </div>
          </Space>
        </Card>
      </div>

      <div className={styles.detailSection}>
        <div className={styles.sectionTitle}>概览</div>
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>网站</span>
            <a href="https://nvidia.com" target="_blank" rel="noopener noreferrer">
              nvidia.com
            </a>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>员工(FY)</span>
            <span className={styles.statValue}>36K</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>行业</span>
            <span className={styles.statValue}>半导体</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>部门</span>
            <span className={styles.statValue}>电子科技</span>
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
      children: <div style={{ padding: '20px', textAlign: 'center' }}>暂无警报</div>,
    },
    {
      key: 'details',
      label: <UnorderedListOutlined />,
      children: renderDetails(),
    },
    {
      key: 'screener',
      label: <FilterOutlined />,
      children: <div style={{ padding: '20px', textAlign: 'center' }}>筛选器功能</div>,
    },
    {
      key: 'calendar',
      label: <CalendarOutlined />,
      children: <div style={{ padding: '20px', textAlign: 'center' }}>财经日历</div>,
    },
    {
      key: 'community',
      label: <TeamOutlined />,
      children: <div style={{ padding: '20px', textAlign: 'center' }}>社区观点</div>,
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
