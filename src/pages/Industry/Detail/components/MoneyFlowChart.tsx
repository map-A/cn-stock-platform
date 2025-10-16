/**
 * 资金流向图表组件
 */

import React from 'react';
import { Column, DualAxes } from '@ant-design/plots';
import type { IndustryMoneyFlow } from '@/services/industry';

interface MoneyFlowChartProps {
  data: IndustryMoneyFlow[];
}

const MoneyFlowChart: React.FC<MoneyFlowChartProps> = ({ data }) => {
  // 主力资金流向柱状图
  const mainFlowConfig = {
    data: data.map((item) => ({
      date: item.date,
      value: item.mainNetInflow,
      type: '主力净流入',
    })),
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    color: ({ value }: any) => (value >= 0 ? '#cf1322' : '#3f8600'),
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.8,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: '主力净流入',
          value: `${(datum.value / 100000000).toFixed(2)}亿`,
        };
      },
    },
  };

  // 资金流向明细双轴图
  const detailFlowConfig = {
    data: [
      data.map((item) => ({
        date: item.date,
        value: item.superLargeNetInflow,
        type: '超大单',
      })),
      data.map((item) => ({
        date: item.date,
        value: item.largeNetInflow,
        type: '大单',
      })),
    ],
    xField: 'date',
    yField: ['value', 'value'],
    geometryOptions: [
      {
        geometry: 'column',
        seriesField: 'type',
        isGroup: true,
        color: ['#1890ff', '#52c41a'],
      },
      {
        geometry: 'line',
        smooth: true,
        color: '#faad14',
      },
    ],
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `${(datum.value / 100000000).toFixed(2)}亿`,
        };
      },
    },
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h4>主力资金净流入</h4>
        <Column {...mainFlowConfig} height={300} />
      </div>
      <div>
        <h4>资金流向明细</h4>
        <DualAxes {...detailFlowConfig} height={300} />
      </div>
    </div>
  );
};

export default MoneyFlowChart;
