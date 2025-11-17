/**
 * 结果面板主组件
 */

import React, { useState } from 'react';
import type { ScreenerResult, ScreenerFilters } from '../../types';
import Toolbar from './Toolbar';
import ResultTable from './ResultTable';
import StockDetailDrawer from './StockDetailDrawer';
import styles from './index.less';

interface ResultPanelProps {
  data: ScreenerResult[];
  total: number;
  loading?: boolean;
  pagination: {
    current: number;
    pageSize: number;
    onChange: (page: number, pageSize: number) => void;
  };
  filters: ScreenerFilters;
  onExport: (type: 'current' | 'all') => void;
  onSaveFilters: () => void;
  onSaveAsStrategy: () => void;
  onReset: () => void;
}

const ResultPanel: React.FC<ResultPanelProps> = ({
  data,
  total,
  loading,
  pagination,
  filters,
  onExport,
  onSaveFilters,
  onSaveAsStrategy,
  onReset,
}) => {
  const [selectedStock, setSelectedStock] = useState<ScreenerResult | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [columnConfigVisible, setColumnConfigVisible] = useState(false);

  const handleRowClick = (record: ScreenerResult) => {
    setSelectedStock(record);
    setDrawerVisible(true);
  };

  const handleColumnConfig = () => {
    setColumnConfigVisible(true);
  };

  return (
    <div className={styles.resultPanel}>
      <Toolbar
        total={total}
        current={data.length}
        onExport={onExport}
        onSave={onSaveFilters}
        onSaveAsStrategy={onSaveAsStrategy}
        onReset={onReset}
        onColumnConfig={handleColumnConfig}
        loading={loading}
      />

      <div className={styles.tableContainer}>
        <ResultTable
          data={data}
          loading={loading}
          pagination={pagination}
          onRowClick={handleRowClick}
        />
      </div>

      <StockDetailDrawer
        visible={drawerVisible}
        stock={selectedStock}
        onClose={() => setDrawerVisible(false)}
      />
    </div>
  );
};

export default ResultPanel;
