/**
 * 迷你K线图组件
 * 用于在结果面板中显示单个股票的K线图
 */

import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { Card, Spin, Radio } from 'antd';

export type KLinePeriod = 'daily' | 'weekly' | 'monthly';

interface MiniKLineChartProps {
  symbol: string;
  name: string;
  data?: {
    dates: string[];
    kline: number[][]; // [open, close, low, high]
    volume: number[];
    ma5?: number[];
    ma10?: number[];
    ma20?: number[];
  };
  loading?: boolean;
  onPeriodChange?: (period: KLinePeriod) => void;
}

const MiniKLineChart: React.FC<MiniKLineChartProps> = ({
  symbol,
  name,
  data,
  loading = false,
  onPeriodChange,
}) => {
  const [period, setPeriod] = useState<KLinePeriod>('daily');
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option: EChartsOption = {
      animation: false,
      grid: [
        {
          left: 50,
          right: 40,
          top: 40,
          height: 180,
        },
        {
          left: 50,
          right: 40,
          top: 240,
          height: 60,
        },
      ],
      xAxis: [
        {
          type: 'category',
          data: data.dates,
          boundaryGap: true,
          axisLine: { lineStyle: { color: '#8392A5' } },
          axisLabel: {
            fontSize: 10,
            formatter: (value: string) => {
              // 只显示月-日
              return value.slice(5);
            },
          },
          gridIndex: 0,
        },
        {
          type: 'category',
          data: data.dates,
          boundaryGap: true,
          axisLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          gridIndex: 1,
        },
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true,
          },
          axisLine: { lineStyle: { color: '#8392A5' } },
          axisLabel: {
            fontSize: 10,
          },
          gridIndex: 0,
        },
        {
          scale: true,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          gridIndex: 1,
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 80,
          end: 100,
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          bottom: 10,
          height: 20,
          start: 80,
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
          fontSize: 12,
        },
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex;
          const klineData = data.kline[dataIndex];
          const volumeData = data.volume[dataIndex];
          
          let html = `<div style="font-size:12px;">
            <div style="font-weight:600;margin-bottom:6px;">${data.dates[dataIndex]}</div>
            <div>开盘：${klineData[0].toFixed(2)}</div>
            <div>收盘：${klineData[1].toFixed(2)}</div>
            <div>最低：${klineData[2].toFixed(2)}</div>
            <div>最高：${klineData[3].toFixed(2)}</div>
            <div>成交量：${(volumeData / 10000).toFixed(2)}万手</div>`;
          
          if (data.ma5 && data.ma5[dataIndex]) {
            html += `<div>MA5：${data.ma5[dataIndex].toFixed(2)}</div>`;
          }
          if (data.ma10 && data.ma10[dataIndex]) {
            html += `<div>MA10：${data.ma10[dataIndex].toFixed(2)}</div>`;
          }
          if (data.ma20 && data.ma20[dataIndex]) {
            html += `<div>MA20：${data.ma20[dataIndex].toFixed(2)}</div>`;
          }
          
          html += '</div>';
          return html;
        },
      },
      series: [
        {
          name: 'K线',
          type: 'candlestick',
          data: data.kline,
          itemStyle: {
            color: '#ef5350',
            color0: '#26a69a',
            borderColor: '#ef5350',
            borderColor0: '#26a69a',
          },
          xAxisIndex: 0,
          yAxisIndex: 0,
        },
        ...(data.ma5
          ? [
              {
                name: 'MA5',
                type: 'line',
                data: data.ma5,
                smooth: true,
                lineStyle: {
                  opacity: 0.8,
                  width: 1,
                  color: '#1890ff',
                },
                showSymbol: false,
                xAxisIndex: 0,
                yAxisIndex: 0,
              },
            ]
          : []),
        ...(data.ma10
          ? [
              {
                name: 'MA10',
                type: 'line',
                data: data.ma10,
                smooth: true,
                lineStyle: {
                  opacity: 0.8,
                  width: 1,
                  color: '#faad14',
                },
                showSymbol: false,
                xAxisIndex: 0,
                yAxisIndex: 0,
              },
            ]
          : []),
        ...(data.ma20
          ? [
              {
                name: 'MA20',
                type: 'line',
                data: data.ma20,
                smooth: true,
                lineStyle: {
                  opacity: 0.8,
                  width: 1,
                  color: '#9254de',
                },
                showSymbol: false,
                xAxisIndex: 0,
                yAxisIndex: 0,
              },
            ]
          : []),
        {
          name: '成交量',
          type: 'bar',
          data: data.volume,
          itemStyle: {
            color: (params: any) => {
              const dataIndex = params.dataIndex;
              const klineData = data.kline[dataIndex];
              return klineData[1] > klineData[0] ? '#ef5350' : '#26a69a';
            },
          },
          xAxisIndex: 1,
          yAxisIndex: 1,
        },
      ],
    };

    chartInstance.current.setOption(option);

    // 处理窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  // 清理
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  const handlePeriodChange = (newPeriod: KLinePeriod) => {
    setPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  const getPeriodLabel = () => {
    switch (period) {
      case 'daily':
        return '日K';
      case 'weekly':
        return '周K';
      case 'monthly':
        return '月K';
      default:
        return '日K';
    }
  };

  return (
    <Card
      title={`${symbol} - ${name} K线图 (${getPeriodLabel()})`}
      size="small"
      bodyStyle={{ padding: 0 }}
      extra={
        <Radio.Group 
          size="small" 
          value={period} 
          onChange={(e) => handlePeriodChange(e.target.value)}
        >
          <Radio.Button value="daily">日K</Radio.Button>
          <Radio.Button value="weekly">周K</Radio.Button>
          <Radio.Button value="monthly">月K</Radio.Button>
        </Radio.Group>
      }
    >
      <Spin spinning={loading}>
        {data ? (
          <div ref={chartRef} style={{ width: '100%', height: 360 }} />
        ) : (
          <div
            style={{
              height: 360,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8c8c8c',
            }}
          >
            选中表格行查看K线图
          </div>
        )}
      </Spin>
    </Card>
  );
};

export default MiniKLineChart;
