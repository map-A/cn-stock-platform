/**
 * 资金曲线图组件
 */
import React from 'react';
import { Card, Empty, Radio } from 'antd';
import { Line, Area } from '@ant-design/plots';
import type { AccountDailySnapshot } from '@/services/account';

interface EquityCurveChartProps {
  snapshots: AccountDailySnapshot[];
  loading?: boolean;
}

const EquityCurveChart: React.FC<EquityCurveChartProps> = ({ snapshots, loading }) => {
  const [chartType, setChartType] = React.useState<'total' | 'return'>('total');

  if (!snapshots || snapshots.length === 0) {
    return (
      <Card loading={loading}>
        <Empty description="暂无资金曲线数据" />
      </Card>
    );
  }

  // 准备资金总值曲线数据
  const totalValueData = snapshots.map((item) => ({
    date: item.snapshot_date,
    value: Number(item.total_value),
    type: '总资产',
  }));

  const cashData = snapshots.map((item) => ({
    date: item.snapshot_date,
    value: Number(item.cash),
    type: '现金',
  }));

  const marketValueData = snapshots.map((item) => ({
    date: item.snapshot_date,
    value: Number(item.market_value),
    type: '持仓市值',
  }));

  // 准备收益率曲线数据
  const returnData = snapshots
    .filter((item) => item.cumulative_return !== null)
    .map((item) => ({
      date: item.snapshot_date,
      value: Number(item.cumulative_return),
    }));

  const totalValueConfig = {
    data: [...totalValueData, ...cashData, ...marketValueData],
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
    yAxis: {
      label: {
        formatter: (v: string) => `¥${(Number(v) / 10000).toFixed(1)}万`,
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type,
        value: `¥${Number(datum.value).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`,
      }),
    },
    legend: {
      position: 'top-right' as const,
    },
  };

  const returnConfig = {
    data: returnData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    areaStyle: () => ({
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    }),
    yAxis: {
      label: {
        formatter: (v: string) => `${Number(v).toFixed(1)}%`,
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: '累计收益率',
        value: `${Number(datum.value).toFixed(2)}%`,
      }),
    },
  };

  return (
    <Card
      title="资金曲线"
      loading={loading}
      extra={
        <Radio.Group value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <Radio.Button value="total">资金总值</Radio.Button>
          <Radio.Button value="return">收益率</Radio.Button>
        </Radio.Group>
      }
    >
      <div style={{ height: 400 }}>
        {chartType === 'total' ? <Line {...totalValueConfig} /> : <Area {...returnConfig} />}
      </div>
    </Card>
  );
};

export default EquityCurveChart;
