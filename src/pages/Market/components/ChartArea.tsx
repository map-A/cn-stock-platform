import React, { useEffect, useRef, useState } from 'react';
import { createStyles } from 'antd-style';
import { Button, Space, Tag } from 'antd';
import {
  StarOutlined,
  MoreOutlined,
  EyeInvisibleOutlined,
  SettingOutlined,
  CloseOutlined,
} from '@ant-design/icons';

const useStyles = createStyles(({ token }) => ({
  container: {
    flex: 1,
    position: 'relative',
    background: token.colorBgContainer,
    overflow: 'hidden',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '48px',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    zIndex: 10,
    pointerEvents: 'none',
  },
  headerItem: {
    pointerEvents: 'all',
  },
  symbolInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(0, 0, 0, 0.02)',
    padding: '4px 12px',
    borderRadius: token.borderRadius,
  },
  symbol: {
    fontWeight: 600,
    fontSize: '16px',
  },
  price: {
    fontSize: '16px',
    fontWeight: 600,
  },
  change: {
    fontSize: '14px',
  },
  priceUp: {
    color: token.colorSuccess,
  },
  priceDown: {
    color: token.colorError,
  },
  ohlcInfo: {
    display: 'flex',
    gap: '12px',
    fontSize: '13px',
    color: token.colorTextSecondary,
  },
  chartCanvas: {
    width: '100%',
    height: '100%',
    background: token.colorBgContainer,
  },
  volumeIndicator: {
    position: 'absolute',
    bottom: '0',
    left: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: 'rgba(0, 0, 0, 0.02)',
    borderRadius: token.borderRadius,
    zIndex: 10,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: token.colorTextSecondary,
    fontSize: '16px',
  },
}));

const ChartArea: React.FC = () => {
  const { styles, cx } = useStyles();
  const chartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockData = {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    logo: 'https://s3-symbol-logo.tradingview.com/nvidia.svg',
    price: 195.36,
    change: 2.20,
    changePercent: 1.14,
    open: 195.72,
    high: 195.88,
    low: 195.21,
    close: 195.32,
    volume: '4.59M',
    status: '开市',
    updateFrequency: '每5秒更新一次',
    dataSource: '来自Cboe One的NASDAQ',
    bid: 195.34,
    ask: 195.50,
    spread: 0.16,
  };

  useEffect(() => {
    // TODO: 初始化 SciChart
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container} ref={chartRef}>
      {/* Header with symbol info */}
      <div className={styles.header}>
        <div className={cx(styles.symbolInfo, styles.headerItem)}>
          {mockData.logo && (
            <img 
              src={mockData.logo} 
              alt={mockData.symbol}
              style={{ width: '24px', height: '24px', marginRight: '8px' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <Button type="text" size="small" style={{ fontWeight: 600 }}>
            {mockData.name}
          </Button>
          <span style={{ margin: '0 8px', color: '#999' }}>·</span>
          <Button type="text" size="small">1天</Button>
          <span style={{ margin: '0 8px', color: '#999' }}>·</span>
          <span style={{ fontSize: '12px', color: '#999' }}>{mockData.exchange}</span>
          <Button type="text" size="small" icon={<StarOutlined />} />
          <Button type="text" size="small" icon={<MoreOutlined />} />
        </div>

        <div className={styles.headerItem}>
          <Button type="text" size="small" style={{ fontSize: '11px' }}>
            {mockData.status} · {mockData.updateFrequency} · {mockData.dataSource}
          </Button>
        </div>

        <div className={styles.ohlcInfo}>
          <span>开=<span style={{ fontWeight: 500 }}>{mockData.open}</span></span>
          <span>高=<span style={{ fontWeight: 500 }}>{mockData.high}</span></span>
          <span>低=<span style={{ fontWeight: 500 }}>{mockData.low}</span></span>
          <span>收=<span style={{ fontWeight: 500 }}>{mockData.close}</span></span>
          <span className={mockData.change >= 0 ? styles.priceUp : styles.priceDown} style={{ fontWeight: 500 }}>
            {mockData.change >= 0 ? '+' : ''}{mockData.change.toFixed(2)} ({mockData.change >= 0 ? '+' : ''}{mockData.changePercent.toFixed(2)}%)
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <div className={cx(styles.symbolInfo, styles.headerItem)} style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '4px 12px', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            <span className={styles.priceDown} style={{ fontWeight: 500 }}>{mockData.bid}</span>
            <span style={{ color: '#999' }}>卖出</span>
          </div>
          <div style={{ fontSize: '11px', color: '#999', textAlign: 'center' }}>{mockData.spread.toFixed(2)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            <span className={styles.priceUp} style={{ fontWeight: 500 }}>{mockData.ask}</span>
            <span style={{ color: '#999' }}>买入</span>
          </div>
        </div>
      </div>

      {/* Volume indicator */}
      <div className={styles.volumeIndicator}>
        <Button type="text" size="small" icon={<EyeInvisibleOutlined />} />
        <span style={{ fontWeight: 600 }}>Vol</span>
        <Button type="text" size="small" icon={<SettingOutlined />} />
        <Button type="text" size="small" icon={<CloseOutlined />} />
        <Button type="text" size="small" icon={<MoreOutlined />} />
        <span style={{ marginLeft: '8px' }}>{mockData.volume}</span>
      </div>

      {/* Chart canvas - will be replaced with SciChart */}
      <div className={styles.chartCanvas}>
        {isLoading ? (
          <div className={styles.placeholder}>
            <div>图表加载中...</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>
              正在准备 K 线数据
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <div>图表区域</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>
              此处将集成 SciChart.js 显示 K 线图和成交量
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartArea;
