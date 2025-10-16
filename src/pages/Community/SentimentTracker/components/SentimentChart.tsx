/**
 * @file 情绪趋势图表组件
 * @description 展示市场情绪的趋势变化
 */

import React from 'react';
import { Card } from 'antd';
import { Line } from '@ant-design/plots';

/**
 * 情绪图表组件
 */
const SentimentChart: React.FC = () => {
  // Mock data - 实际应该从API获取
  const data = React.useMemo(() => {
    const result = [];
    const now = Date.now();
    for (let i = 30; i >= 0; i--) {
      result.push({
        date: new Date(now - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sentiment: 50 + Math.random() * 30,
        type: '市场情绪',
      });
    }
    return result;
  }, []);

  const config = {
    data,
    xField: 'date',
    yField: 'sentiment',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: '情绪分数',
      },
    },
    xAxis: {
      title: {
        text: '日期',
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `${datum.sentiment.toFixed(1)}分`,
        };
      },
    },
  };

  return (
    <Card title="市场情绪趋势" bordered={false}>
      <Line {...config} height={300} />
    </Card>
  );
};

export default SentimentChart;
