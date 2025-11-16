import React from 'react';
import { createStyles } from 'antd-style';
import TopToolbar from './components/TopToolbar';
import LeftToolbar from './components/LeftToolbar';
import ChartArea from './components/ChartArea';
import RightPanel from './components/RightPanel';
import BottomToolbar from './components/BottomToolbar';
import BottomBar from './components/BottomBar';

const useStyles = createStyles(({ token }) => ({
  container: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: token.colorBgContainer,
    overflow: 'hidden',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
  },
  chartWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
}));

const TradingViewChart: React.FC = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      <TopToolbar />
      <div className={styles.mainContent}>
        <LeftToolbar />
        <div className={styles.chartWrapper}>
          <ChartArea />
          <BottomToolbar />
        </div>
        <RightPanel />
      </div>
      <BottomBar />
    </div>
  );
};

export default TradingViewChart;
