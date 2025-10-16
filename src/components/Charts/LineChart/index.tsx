/**
 * 折线图组件 - 用于分时图
 */
import React, { useEffect, useRef } from 'react';
import { Line } from '@ant-design/plots';
import type { TimeShareData } from '@/typings/stock';

interface LineChartProps {
  data: TimeShareData[];
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, height = 400 }) => {
  const config = {
    data,
    xField: 'time',
    yField: 'price',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    line: {
      color: '#1890ff',
      size: 2,
    },
    area: {
      style: {
        fill: 'l(270) 0:#1890ff 0.5:rgba(24,144,255,0.5) 1:rgba(24,144,255,0.1)',
      },
    },
    xAxis: {
      type: 'time',
      tickCount: 6,
      label: {
        formatter: (text: string) => {
          const date = new Date(text);
          return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `¥${parseFloat(v).toFixed(2)}`,
      },
      grid: {
        line: {
          style: {
            stroke: '#f0f0f0',
            lineWidth: 1,
            lineDash: [4, 4],
          },
        },
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '价格',
        value: `¥${datum.price.toFixed(2)}`,
      }),
      customItems: (originalItems: any[]) => {
        const datum = originalItems[0]?.data;
        const items = [
          {
            name: '价格',
            value: `¥${datum?.price?.toFixed(2) || '--'}`,
            color: '#1890ff',
          },
        ];
        
        if (datum?.avgPrice) {
          items.push({
            name: '均价',
            value: `¥${datum.avgPrice.toFixed(2)}`,
            color: '#faad14',
          });
        }
        
        if (datum?.volume) {
          items.push({
            name: '成交量',
            value: `${(datum.volume / 100).toFixed(0)}手`,
            color: '#52c41a',
          });
        }
        
        return items;
      },
    },
  };

  return <Line {...config} height={height} />;
};

export default LineChart;
