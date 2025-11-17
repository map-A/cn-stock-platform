import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Button, Space, Tag } from 'antd';
import {
  StarOutlined,
  MoreOutlined,
  EyeInvisibleOutlined,
  SettingOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { ChartType } from '../types';
import styles from './ChartArea.module.less';

interface ChartAreaProps {
  chartType?: ChartType;
  symbol?: string;
}

const ChartArea: React.FC<ChartAreaProps> = ({ 
  chartType = 'candles',
  symbol = 'NVDA' 
}) => {
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

  // 生成模拟的K线数据
  const generateMockKlineData = () => {
    const data = [];
    const dates = [];
    const volumes = [];
    let basePrice = 190;
    const today = new Date();
    
    for (let i = 60; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
      
      const open = basePrice + (Math.random() - 0.5) * 5;
      const close = open + (Math.random() - 0.5) * 8;
      const high = Math.max(open, close) + Math.random() * 3;
      const low = Math.min(open, close) - Math.random() * 3;
      const volume = Math.floor(Math.random() * 10000000 + 2000000);
      
      data.push([open.toFixed(2), close.toFixed(2), low.toFixed(2), high.toFixed(2)]);
      volumes.push(volume);
      basePrice = close;
    }
    
    return { dates, data, volumes };
  };

  const klineData = useMemo(() => generateMockKlineData(), []);

  const getMainSeries = () => {
    const closeData = klineData.data.map((d: any) => parseFloat(d[1]));
    
    switch (chartType) {
      case 'candles':
      case 'bars':
      case 'hollow_candles':
      case 'volume_candles':
      case 'heikinashi':
        return {
          name: 'K线',
          type: 'candlestick' as const,
          data: klineData.data,
          itemStyle: {
            color: '#ef5350',
            color0: '#26a69a',
            borderColor: '#ef5350',
            borderColor0: '#26a69a',
          },
        };
      
      case 'line':
      case 'line_with_markers':
        return {
          name: '价格',
          type: 'line' as const,
          data: closeData,
          smooth: false,
          symbol: chartType === 'line_with_markers' ? 'circle' : 'none',
          symbolSize: 6,
          lineStyle: {
            color: '#1E90FF',
            width: 2,
          },
          itemStyle: {
            color: '#1E90FF',
          },
        };
      
      case 'step_line':
        return {
          name: '价格',
          type: 'line' as const,
          data: closeData,
          step: 'end' as const,
          symbol: 'none',
          lineStyle: {
            color: '#1E90FF',
            width: 2,
          },
        };
      
      case 'area':
      case 'hlc_area':
      case 'baseline':
        return {
          name: '价格',
          type: 'line' as const,
          data: closeData,
          smooth: false,
          symbol: 'none',
          lineStyle: {
            color: '#1E90FF',
            width: 2,
          },
          areaStyle: {
            color: 'rgba(30, 144, 255, 0.3)',
          },
        };
      
      case 'column':
        return {
          name: '价格',
          type: 'bar' as const,
          data: closeData,
          itemStyle: {
            color: '#1E90FF',
          },
        };
      
      case 'hi_lo':
        return {
          name: '高低',
          type: 'line' as const,
          data: klineData.data.map((d: any) => [parseFloat(d[3]), parseFloat(d[2])]),
          lineStyle: {
            color: '#1E90FF',
            width: 2,
          },
        };
      
      default:
        return {
          name: 'K线',
          type: 'candlestick' as const,
          data: klineData.data,
          itemStyle: {
            color: '#ef5350',
            color0: '#26a69a',
            borderColor: '#ef5350',
            borderColor0: '#26a69a',
          },
        };
    }
  };

  const getChartOption = (): EChartsOption => {
    return {
      animation: true,
      grid: [
        {
          left: '10%',
          right: '8%',
          top: '15%',
          height: '55%',
        },
        {
          left: '10%',
          right: '8%',
          top: '75%',
          height: '15%',
        },
      ],
      xAxis: [
        {
          type: 'category',
          data: klineData.dates,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
        },
        {
          type: 'category',
          gridIndex: 1,
          data: klineData.dates,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
        },
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true,
          },
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 50,
          end: 100,
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          top: '92%',
          start: 50,
          end: 100,
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
          color: '#000',
        },
        position: function (pos, params, el, elRect, size) {
          const obj: any = { top: 10 };
          obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;
        },
      },
      series: [
        getMainSeries(),
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: klineData.volumes,
          itemStyle: {
            color: function (params: any) {
              const dataIndex = params.dataIndex;
              const klineItem = klineData.data[dataIndex];
              return parseFloat(klineItem[1]) >= parseFloat(klineItem[0]) ? '#ef5350' : '#26a69a';
            },
          },
        },
      ],
    };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container} ref={chartRef}>
      {/* Header with symbol info */}
      <div className={styles.header}>
        <div className={`${styles.symbolInfo} ${styles.headerItem}`}>
          {mockData.logo && (
            <img 
              src={mockData.logo} 
              alt={mockData.symbol}
              className={styles.logo}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <Button type="text" size="small" className={styles.symbolButton}>
            {mockData.name}
          </Button>
          <span className={styles.divider}>·</span>
          <Button type="text" size="small">1天</Button>
          <span className={styles.divider}>·</span>
          <span className={styles.exchangeText}>{mockData.exchange}</span>
          <Button type="text" size="small" icon={<StarOutlined />} />
          <Button type="text" size="small" icon={<MoreOutlined />} />
        </div>

        <div className={styles.headerItem}>
          <Button type="text" size="small" className={styles.statusInfo}>
            {mockData.status} · {mockData.updateFrequency} · {mockData.dataSource}
          </Button>
        </div>

        <div className={styles.ohlcInfo}>
          <span>开=<span className={styles.value}>{mockData.open}</span></span>
          <span>高=<span className={styles.value}>{mockData.high}</span></span>
          <span>低=<span className={styles.value}>{mockData.low}</span></span>
          <span>收=<span className={styles.value}>{mockData.close}</span></span>
          <span className={`${styles.change} ${mockData.change >= 0 ? styles.priceUp : styles.priceDown}`}>
            {mockData.change >= 0 ? '+' : ''}{mockData.change.toFixed(2)} ({mockData.change >= 0 ? '+' : ''}{mockData.changePercent.toFixed(2)}%)
          </span>
        </div>

        <div className={styles.spacer} />

        <div className={`${styles.symbolInfo} ${styles.headerItem} ${styles.bidAskInfo}`}>
          <div className={styles.row}>
            <span className={`${styles.price} ${styles.priceDown}`}>{mockData.bid}</span>
            <span className={styles.label}>卖出</span>
          </div>
          <div className={styles.spread}>{mockData.spread.toFixed(2)}</div>
          <div className={styles.row}>
            <span className={`${styles.price} ${styles.priceUp}`}>{mockData.ask}</span>
            <span className={styles.label}>买入</span>
          </div>
        </div>
      </div>

      {/* Volume indicator */}
      <div className={styles.volumeIndicator}>
        <Button type="text" size="small" icon={<EyeInvisibleOutlined />} />
        <span className={styles.label}>Vol</span>
        <Button type="text" size="small" icon={<SettingOutlined />} />
        <Button type="text" size="small" icon={<CloseOutlined />} />
        <Button type="text" size="small" icon={<MoreOutlined />} />
        <span className={styles.value}>{mockData.volume}</span>
      </div>

      {/* Chart canvas - ECharts */}
      <div className={styles.chartCanvas}>
        {isLoading ? (
          <div className={styles.placeholder}>
            <div>图表加载中...</div>
            <div className={styles.subText}>
              正在准备 K 线数据
            </div>
          </div>
        ) : (
          <ReactECharts
            option={getChartOption()}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        )}
      </div>
    </div>
  );
};

export default ChartArea;
