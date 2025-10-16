/**
 * 行业表现图表组件
 * 展示行业涨跌排行的柱状图
 */

import React, { useMemo } from 'react';
import { Column } from '@ant-design/plots';
import { Card, Space, Typography, Segmented } from 'antd';
import type { IndustryPerformance } from '@/services/industry';
import styles from '../index.less';

const { Title } = Typography;

interface IndustryPerformanceChartProps {
  /** 行业表现数据 */
  data: IndustryPerformance[];
  /** 时间范围 */
  timeRange: '1d' | '5d' | '1m' | '3m' | '6m' | '1y';
}

/**
 * 行业表现图表组件
 */
const IndustryPerformanceChart: React.FC<IndustryPerformanceChartProps> = ({
  data,
  timeRange,
}) => {
  const [viewType, setViewType] = React.useState<'gainers' | 'losers' | 'all'>('all');

  /**
   * 根据时间范围获取涨跌幅
   */
  const getChangeByTimeRange = (record: IndustryPerformance) => {
    switch (timeRange) {
      case '1d':
        return record.dayChange;
      case '5d':
        return record.weekChange;
      case '1m':
        return record.monthChange;
      case '1y':
        return record.yearChange;
      default:
        return record.dayChange;
    }
  };

  /**
   * 处理图表数据
   */
  const chartData = useMemo(() => {
    let filtered = data.map((item) => ({
      name: item.name,
      value: getChangeByTimeRange(item),
      type: getChangeByTimeRange(item) >= 0 ? '上涨' : '下跌',
    }));

    // 根据视图类型筛选
    if (viewType === 'gainers') {
      filtered = filtered.filter((item) => item.value >= 0);
    } else if (viewType === 'losers') {
      filtered = filtered.filter((item) => item.value < 0);
    }

    // 按绝对值排序并取前20
    return filtered.sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 20);
  }, [data, timeRange, viewType]);

  /**
   * 图表配置
   */
  const config = {
    data: chartData,
    xField: 'name',
    yField: 'value',
    seriesField: 'type',
    color: ({ type }: any) => {
      return type === '上涨' ? '#cf1322' : '#3f8600';
    },
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.8,
      },
      formatter: ({ value }: any) => `${value.toFixed(2)}%`,
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
        style: {
          fontSize: 12,
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}%`,
      },
    },
    legend: {
      position: 'top-right' as const,
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: '涨跌幅', value: `${datum.value.toFixed(2)}%` };
      },
    },
    animation: {
      appear: {
        animation: 'scale-in-y',
        duration: 1000,
      },
    },
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>行业涨跌排行 TOP 20</Title>
          <Segmented
            options={[
              { label: '全部', value: 'all' },
              { label: '上涨', value: 'gainers' },
              { label: '下跌', value: 'losers' },
            ]}
            value={viewType}
            onChange={(value) => setViewType(value as any)}
          />
        </div>

        <div className={styles.performanceChart}>
          <Column {...config} />
        </div>
      </Space>
    </Card>
  );
};

export default IndustryPerformanceChart;
