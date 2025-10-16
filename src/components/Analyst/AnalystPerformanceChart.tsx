/**
 * 分析师表现图表组件
 * 展示分析师的历史表现趋势
 */

import React from 'react';
import { Card } from 'antd';
import { Line } from '@ant-design/plots';

export interface AnalystPerformanceChartProps {
  data: Array<{
    date: string;
    successRate: number;
    avgReturn: number;
  }>;
  title?: string;
  height?: number;
}

const AnalystPerformanceChart: React.FC<AnalystPerformanceChartProps> = ({
  data,
  title = '历史表现趋势',
  height = 300,
}) => {
  // 转换数据格式为 G2Plot 需要的格式
  const chartData = data.flatMap((item) => [
    {
      date: item.date,
      value: item.successRate,
      type: '成功率 (%)',
    },
    {
      date: item.date,
      value: item.avgReturn,
      type: '平均回报 (%)',
    },
  ]);

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    legend: {
      position: 'top' as const,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}%`,
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type,
        value: `${datum.value.toFixed(2)}%`,
      }),
    },
    color: ['#1890ff', '#52c41a'],
  };

  return (
    <Card title={title}>
      <Line {...config} height={height} />
    </Card>
  );
};

export default AnalystPerformanceChart;
