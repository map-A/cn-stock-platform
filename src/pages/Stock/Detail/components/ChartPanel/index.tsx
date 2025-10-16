/**
 * 图表面板组件
 */
import React, { useState } from 'react';
import { Radio, Space, Spin } from 'antd';
import { useRequest } from 'ahooks';
import { getStockChart, getTimeShareData } from '@/services/stock';
import { TIME_PERIODS } from '@/constants/market';
import LineChart from '@/components/Charts/LineChart';
import KLineChart from '@/components/Charts/KLineChart';
import styles from './index.less';

interface ChartPanelProps {
  symbol: string;
}

type ChartType = 'timeshare' | 'kline';

const ChartPanel: React.FC<ChartPanelProps> = ({ symbol }) => {
  const [chartType, setChartType] = useState<ChartType>('timeshare');
  const [period, setPeriod] = useState('1D');

  // 获取分时数据
  const { data: timeShareData, loading: timeShareLoading } = useRequest(
    () => getTimeShareData(symbol),
    {
      refreshDeps: [symbol],
      ready: chartType === 'timeshare',
      pollingInterval: 3000, // 3秒刷新
    }
  );

  // 获取K线数据
  const { data: chartData, loading: chartLoading } = useRequest(
    () => getStockChart(symbol, period as any),
    {
      refreshDeps: [symbol, period],
      ready: chartType === 'kline',
    }
  );

  const loading = chartType === 'timeshare' ? timeShareLoading : chartLoading;

  return (
    <div className={styles.chartPanel}>
      {/* 图表类型切换 */}
      <div className={styles.toolbar}>
        <Space size="large">
          <Radio.Group
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="timeshare">分时</Radio.Button>
            <Radio.Button value="kline">K线</Radio.Button>
          </Radio.Group>

          {chartType === 'kline' && (
            <Radio.Group
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            >
              {TIME_PERIODS.map((p) => (
                <Radio.Button key={p.value} value={p.value}>
                  {p.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          )}
        </Space>
      </div>

      {/* 图表区域 */}
      <div className={styles.chartArea}>
        {loading ? (
          <div className={styles.loading}>
            <Spin tip="加载图表数据中..." />
          </div>
        ) : chartType === 'timeshare' && timeShareData ? (
          <LineChart data={timeShareData} />
        ) : chartType === 'kline' && chartData ? (
          <KLineChart data={chartData.data} />
        ) : (
          <div className={styles.noData}>暂无数据</div>
        )}
      </div>
    </div>
  );
};

export default ChartPanel;
