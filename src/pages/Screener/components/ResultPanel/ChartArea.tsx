/**
 * 图表区域组件
 */

import React, { useState, useEffect } from 'react';
import { Card, Radio, Empty, Spin, Space } from 'antd';
import { LineChartOutlined, RadarChartOutlined, EyeInvisibleOutlined, BarChartOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import MiniKLineChart from './MiniKLineChart';
import IndicatorPanel from './IndicatorPanel';
import type { ScreenerResult, ChartMode } from '../../types';
import styles from './ChartArea.less';

interface ChartAreaProps {
  selectedStocks: ScreenerResult[];
  loading?: boolean;
  onModeChange?: (mode: ChartMode) => void;
}

const ChartArea: React.FC<ChartAreaProps> = ({
  selectedStocks,
  loading,
  onModeChange,
}) => {
  const [mode, setMode] = useState<ChartMode>('hidden');

  useEffect(() => {
    if (selectedStocks.length === 0) {
      setMode('hidden');
    } else if (selectedStocks.length === 1) {
      setMode('single');
    } else {
      setMode('compare');
    }
  }, [selectedStocks]);

  const handleModeChange = (newMode: ChartMode) => {
    setMode(newMode);
    onModeChange?.(newMode);
  };

  // 生成雷达图配置
  const getRadarOption = () => {
    if (selectedStocks.length === 0) return null;

    const indicators = [
      { name: 'PE', max: 100 },
      { name: 'PB', max: 10 },
      { name: 'ROE', max: 50 },
      { name: 'EPS增长', max: 100 },
      { name: '营收增长', max: 100 },
    ];

    const series = selectedStocks.map(stock => ({
      name: stock.name,
      value: [
        stock.peRatio || 0,
        stock.pbRatio || 0,
        stock.roe || 0,
        stock.epsGrowth || 0,
        stock.revenueGrowth || 0,
      ],
    }));

    return {
      title: {
        text: '多维指标对比',
        left: 'center',
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 10,
        data: series.map(s => s.name),
      },
      radar: {
        indicator: indicators,
        radius: '60%',
      },
      series: [
        {
          type: 'radar',
          data: series,
        },
      ],
    };
  };

  // 生成散点图配置
  const getScatterOption = () => {
    if (selectedStocks.length === 0) return null;

    const data = selectedStocks.map(stock => ({
      name: stock.name,
      value: [stock.peRatio || 0, stock.pbRatio || 0],
      symbolSize: Math.sqrt(stock.marketCap / 1000000000) * 5,
    }));

    return {
      title: {
        text: 'PE vs PB 分布',
        left: 'center',
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${params.data.name}<br/>PE: ${params.data.value[0]}<br/>PB: ${params.data.value[1]}`;
        },
      },
      xAxis: {
        name: 'PE',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      yAxis: {
        name: 'PB',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      series: [
        {
          type: 'scatter',
          data: data,
          emphasis: {
            focus: 'series',
          },
        },
      ],
    };
  };

  if (mode === 'hidden') {
    return null;
  }

  return (
    <Card
      className={styles.chartArea}
      size="small"
      title="图表对比"
      extra={
        <Radio.Group value={mode} onChange={e => handleModeChange(e.target.value)} size="small">
          <Radio.Button value="single">
            <LineChartOutlined /> 单股
          </Radio.Button>
          <Radio.Button value="compare">
            <RadarChartOutlined /> 对比
          </Radio.Button>
          <Radio.Button value="hidden">
            <EyeInvisibleOutlined /> 隐藏
          </Radio.Button>
        </Radio.Group>
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin />
        </div>
      ) : selectedStocks.length === 0 ? (
        <Empty description="请在表格中选择股票" />
      ) : mode === 'single' && selectedStocks.length >= 1 ? (
        (() => {
          // 生成模拟K线数据
          const stock = selectedStocks[0];
          const days = 30;
          const dates: string[] = [];
          const kline: number[][] = [];
          const volume: number[] = [];
          const ma5: number[] = [];
          const ma10: number[] = [];
          const ma20: number[] = [];

          const basePrice = stock.price;
          
          for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().slice(0, 10));

            const open = basePrice * (0.95 + Math.random() * 0.1);
            const close = basePrice * (0.95 + Math.random() * 0.1);
            const low = Math.min(open, close) * (0.98 + Math.random() * 0.02);
            const high = Math.max(open, close) * (1 + Math.random() * 0.02);

            kline.push([open, close, low, high]);
            volume.push(stock.volume * (0.5 + Math.random()));

            // 计算均线
            if (kline.length >= 5) {
              const sum5 = kline.slice(-5).reduce((s, k) => s + k[1], 0) / 5;
              ma5.push(sum5);
            } else {
              ma5.push(NaN);
            }

            if (kline.length >= 10) {
              const sum10 = kline.slice(-10).reduce((s, k) => s + k[1], 0) / 10;
              ma10.push(sum10);
            } else {
              ma10.push(NaN);
            }

            if (kline.length >= 20) {
              const sum20 = kline.slice(-20).reduce((s, k) => s + k[1], 0) / 20;
              ma20.push(sum20);
            } else {
              ma20.push(NaN);
            }
          }

          // 生成技术指标数据
          const rsi: number[] = [];
          const macd = { dif: [] as number[], dea: [] as number[], histogram: [] as number[] };
          
          for (let i = 0; i < dates.length; i++) {
            // RSI 模拟数据
            rsi.push(30 + Math.random() * 40);
            
            // MACD 模拟数据
            const dif = (Math.random() - 0.5) * 0.5;
            const dea = (Math.random() - 0.5) * 0.4;
            macd.dif.push(dif);
            macd.dea.push(dea);
            macd.histogram.push((dif - dea) * 2);
          }

          return (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <MiniKLineChart
                symbol={stock.symbol}
                name={stock.name}
                data={{ dates, kline, volume, ma5, ma10, ma20 }}
                loading={false}
              />
              <IndicatorPanel
                symbol={stock.symbol}
                name={stock.name}
                data={{ dates, rsi, macd }}
              />
            </Space>
          );
        })()
      ) : mode === 'compare' && selectedStocks.length > 1 ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ReactECharts option={getRadarOption()} style={{ height: 300 }} />
          <ReactECharts option={getScatterOption()} style={{ height: 300 }} />
        </div>
      ) : (
        <Empty description="请选择多只股票进行对比" />
      )}
    </Card>
  );
};

export default ChartArea;
