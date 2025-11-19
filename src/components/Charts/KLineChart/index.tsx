/**
 * K线图组件
 */
import React from 'react';
import { Stock } from '@ant-design/plots';
import { theme } from 'antd';
import type { KLineData } from '@/typings/stock';

interface KLineChartProps {
  data: KLineData[];
  height?: number;
}

const KLineChart: React.FC<KLineChartProps> = ({ data, height = 400 }) => {
  const { token } = theme.useToken();
  const config = {
    data,
    xField: 'time',
    yField: ['open', 'close', 'high', 'low'],
    animation: {
      appear: {
        animation: 'fade-in',
        duration: 1000,
      },
    },
    xAxis: {
      type: 'time',
      tickCount: 8,
      label: {
        formatter: (text: string) => {
          const date = new Date(text);
          return `${date.getMonth() + 1}/${date.getDate()}`;
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
                  stroke: token.colorBorderSecondary,
                  lineWidth: 1,
                  lineDash: [4, 4],
                },
              },
            },
          },
          tooltip: {
            fields: ['time', 'open', 'close', 'high', 'low', 'volume'],
            formatter: (datum: any) => {
              return {
                name: '行情',
                value: `
                开: ¥${datum.open.toFixed(2)}
                收: ¥${datum.close.toFixed(2)}
                高: ¥${datum.high.toFixed(2)}
                低: ¥${datum.low.toFixed(2)}
                ${datum.volume ? `量: ${(datum.volume / 10000).toFixed(2)}万手` : ''}
              `,
              };
            },
          },
          // K线样式
          stockStyle: {
            up: {
              fill: token.colorError,
              stroke: token.colorError,
            },
            down: {
              fill: token.colorSuccess,
              stroke: token.colorSuccess,
            },
          },
        };
  return <Stock {...config} height={height} />;
};

export default KLineChart;
