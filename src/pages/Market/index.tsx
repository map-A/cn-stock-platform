import React, { useState } from 'react';
import { createStyles } from 'antd-style';
import TopToolbar from './components/TopToolbar';
import LeftToolbar from './components/LeftToolbar';
import ChartArea from './components/ChartArea';
import RightPanel from './components/RightPanel';
import BottomToolbar from './components/BottomToolbar';
import BottomBar from './components/BottomBar';
import type { ChartType } from './types';

const useStyles = createStyles(({ token }) => ({
  container: {
    position: 'fixed',
    width: '85%',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',  // 强制白色背景
    overflow: 'hidden',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
    minHeight: 0,
  },
  chartWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    minHeight: 0,
    minWidth: 0,
  },
}));

const TradingViewChart: React.FC = () => {
  const { styles } = useStyles();
  const [chartType, setChartType] = useState<ChartType>('candles');

  return (
    <div className={styles.container}>
      <TopToolbar onChartTypeChange={setChartType} />
      <div className={styles.mainContent}>
        <LeftToolbar />
        <div className={styles.chartWrapper}>
          <ChartArea chartType={chartType} />
          <BottomToolbar />
        </div>
        <RightPanel />
      </div>
      <BottomBar />
    </div>
  );
};

export default TradingViewChart;
