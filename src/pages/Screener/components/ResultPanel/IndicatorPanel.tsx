/**
 * 指标面板组件
 * 显示RSI、MACD等技术指标小图
 */

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption } from 'echarts';
import { Card, Row, Col } from 'antd';

interface IndicatorPanelProps {
  symbol: string;
  name: string;
  data?: {
    dates: string[];
    rsi?: number[];
    macd?: {
      dif: number[];
      dea: number[];
      histogram: number[];
    };
  };
}

const IndicatorPanel: React.FC<IndicatorPanelProps> = ({ symbol, name, data }) => {
  const rsiChartRef = useRef<HTMLDivElement>(null);
  const macdChartRef = useRef<HTMLDivElement>(null);
  const rsiInstance = useRef<echarts.ECharts | null>(null);
  const macdInstance = useRef<echarts.ECharts | null>(null);

  // RSI 图表
  useEffect(() => {
    if (!rsiChartRef.current || !data?.rsi) return;

    if (!rsiInstance.current) {
      rsiInstance.current = echarts.init(rsiChartRef.current);
    }

    const option: EChartsOption = {
      animation: false,
      title: {
        text: 'RSI 相对强弱指标',
        textStyle: { fontSize: 14, fontWeight: 'normal' },
        left: 10,
        top: 5,
      },
      grid: {
        left: 45,
        right: 25,
        top: 40,
        bottom: 30,
      },
      xAxis: {
        type: 'category',
        data: data.dates,
        axisLabel: {
          fontSize: 10,
          formatter: (value: string) => value.slice(5),
        },
      },
      yAxis: {
        type: 'value',
        max: 100,
        min: 0,
        axisLabel: { fontSize: 10 },
        splitLine: {
          lineStyle: { type: 'dashed', opacity: 0.3 },
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const value = params[0].data;
          return `${params[0].name}<br/>RSI: ${value.toFixed(2)}`;
        },
      },
      series: [
        {
          name: 'RSI',
          type: 'line',
          data: data.rsi,
          smooth: true,
          lineStyle: { color: '#1890ff', width: 2 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
              ],
            },
          },
          markLine: {
            silent: true,
            symbol: 'none',
            data: [
              {
                yAxis: 70,
                lineStyle: { color: '#f5222d', type: 'dashed', width: 1 },
                label: { formatter: '超买(70)', fontSize: 10 },
              },
              {
                yAxis: 30,
                lineStyle: { color: '#52c41a', type: 'dashed', width: 1 },
                label: { formatter: '超卖(30)', fontSize: 10 },
              },
            ],
          },
        },
      ],
    };

    rsiInstance.current.setOption(option);
  }, [data]);

  // MACD 图表
  useEffect(() => {
    if (!macdChartRef.current || !data?.macd) return;

    if (!macdInstance.current) {
      macdInstance.current = echarts.init(macdChartRef.current);
    }

    const option: EChartsOption = {
      animation: false,
      title: {
        text: 'MACD 指标',
        textStyle: { fontSize: 14, fontWeight: 'normal' },
        left: 10,
        top: 5,
      },
      legend: {
        data: ['DIF', 'DEA', 'MACD'],
        top: 5,
        right: 10,
        textStyle: { fontSize: 10 },
      },
      grid: {
        left: 45,
        right: 25,
        top: 40,
        bottom: 30,
      },
      xAxis: {
        type: 'category',
        data: data.dates,
        axisLabel: {
          fontSize: 10,
          formatter: (value: string) => value.slice(5),
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 10 },
        splitLine: {
          lineStyle: { type: 'dashed', opacity: 0.3 },
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let html = `${params[0].name}<br/>`;
          params.forEach((p: any) => {
            html += `${p.seriesName}: ${p.data.toFixed(4)}<br/>`;
          });
          return html;
        },
      },
      series: [
        {
          name: 'DIF',
          type: 'line',
          data: data.macd.dif,
          smooth: true,
          lineStyle: { color: '#1890ff', width: 1.5 },
          showSymbol: false,
        },
        {
          name: 'DEA',
          type: 'line',
          data: data.macd.dea,
          smooth: true,
          lineStyle: { color: '#faad14', width: 1.5 },
          showSymbol: false,
        },
        {
          name: 'MACD',
          type: 'bar',
          data: data.macd.histogram,
          itemStyle: {
            color: (params: any) => {
              return params.data >= 0 ? '#ef5350' : '#26a69a';
            },
          },
        },
      ],
    };

    macdInstance.current.setOption(option);
  }, [data]);

  // 清理
  useEffect(() => {
    return () => {
      rsiInstance.current?.dispose();
      macdInstance.current?.dispose();
    };
  }, []);

  if (!data) {
    return (
      <Card size="small" title="技术指标">
        <div style={{ textAlign: 'center', padding: 40, color: '#8c8c8c' }}>
          暂无指标数据
        </div>
      </Card>
    );
  }

  return (
    <Card size="small" title={`${symbol} - ${name} 技术指标`}>
      <Row gutter={16}>
        <Col span={12}>
          <div ref={rsiChartRef} style={{ width: '100%', height: 180 }} />
        </Col>
        <Col span={12}>
          <div ref={macdChartRef} style={{ width: '100%', height: 180 }} />
        </Col>
      </Row>
    </Card>
  );
};

export default IndicatorPanel;
