/**
 * 列表表格组件
 * 通用的股票列表展示组件
 */

import React, { useState } from 'react';
import { Table, Tag, Button, Space, Tooltip } from 'antd';
import {
  DownloadOutlined,
  StarOutlined,
  StarFilled,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { ListItem, ColumnConfig } from '@/services/listService';
import { formatNumber, formatPercent, formatCurrency } from '@/utils/format';
import { history } from '@umijs/max';
import styles from './ListTable.less';

interface ListTableProps {
  data: ListItem[];
  columns: ColumnConfig[];
  loading?: boolean;
  pagination?: TablePaginationConfig;
  onPageChange?: (page: number, pageSize: number) => void;
  onSort?: (field: string, order: 'ascend' | 'descend' | null) => void;
  onExport?: () => void;
  showWatchlist?: boolean;
  watchlistSymbols?: string[];
  onToggleWatchlist?: (symbol: string) => void;
}

const ListTable: React.FC<ListTableProps> = ({
  data,
  columns: columnConfigs,
  loading = false,
  pagination,
  onPageChange,
  onSort,
  onExport,
  showWatchlist = true,
  watchlistSymbols = [],
  onToggleWatchlist,
}) => {
  const [sortField, setSortField] = useState<string>();
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>();

  /**
   * 格式化值
   */
  const formatValue = (value: any, format?: string) => {
    if (value === null || value === undefined) return '-';

    switch (format) {
      case 'number':
        return formatNumber(value);
      case 'percent':
        return formatPercent(value);
      case 'currency':
        return formatCurrency(value);
      case 'date':
        return value;
      default:
        return value;
    }
  };

  /**
   * 渲染涨跌幅
   */
  const renderChange = (value: number, record: ListItem) => {
    const isPositive = value >= 0;
    return (
      <Space>
        {isPositive ? (
          <RiseOutlined style={{ color: '#f5222d' }} />
        ) : (
          <FallOutlined style={{ color: '#52c41a' }} />
        )}
        <span style={{ color: isPositive ? '#f5222d' : '#52c41a' }}>
          {formatPercent(value)}
        </span>
      </Space>
    );
  };

  /**
   * 渲染股票名称
   */
  const renderStock = (name: string, record: ListItem) => {
    const isInWatchlist = watchlistSymbols.includes(record.symbol);

    return (
      <Space>
        <a
          onClick={() => history.push(`/stock/${record.symbol}`)}
          className={styles.stockLink}
        >
          {name}
        </a>
        <Tag>{record.symbol}</Tag>
        {showWatchlist && (
          <Tooltip title={isInWatchlist ? '取消自选' : '加入自选'}>
            {isInWatchlist ? (
              <StarFilled
                className={styles.watchlistIcon}
                style={{ color: '#faad14' }}
                onClick={() => onToggleWatchlist?.(record.symbol)}
              />
            ) : (
              <StarOutlined
                className={styles.watchlistIcon}
                onClick={() => onToggleWatchlist?.(record.symbol)}
              />
            )}
          </Tooltip>
        )}
      </Space>
    );
  };

  /**
   * 构建表格列
   */
  const buildColumns = (): ColumnsType<ListItem> => {
    const baseColumns: ColumnsType<ListItem> = [
      {
        title: '股票',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 200,
        render: renderStock,
      },
      {
        title: '最新价',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        sorter: true,
        render: (value) => formatCurrency(value),
      },
      {
        title: '涨跌幅',
        dataIndex: 'changePercent',
        key: 'changePercent',
        width: 120,
        sorter: true,
        render: renderChange,
      },
    ];

    // 添加自定义列
    const customColumns: ColumnsType<ListItem> = columnConfigs.map((col) => ({
      title: col.tooltip ? (
        <Tooltip title={col.tooltip}>
          {col.title} <span style={{ color: '#999' }}>(?)</span>
        </Tooltip>
      ) : (
        col.title
      ),
      dataIndex: ['indicators', col.dataIndex],
      key: col.key,
      width: 120,
      sorter: col.sortable !== false,
      render: (value) => formatValue(value, col.format),
    }));

    return [...baseColumns, ...customColumns];
  };

  /**
   * 处理表格变化
   */
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: any,
    sorter: any,
  ) => {
    // 处理分页
    if (pagination.current !== undefined && pagination.pageSize !== undefined) {
      onPageChange?.(pagination.current, pagination.pageSize);
    }

    // 处理排序
    if (sorter.field) {
      const field = Array.isArray(sorter.field) ? sorter.field.join('.') : sorter.field;
      const order = sorter.order as 'ascend' | 'descend' | null;
      setSortField(field);
      setSortOrder(order || undefined);
      onSort?.(field, order);
    }
  };

  return (
    <div className={styles.listTable}>
      <div className={styles.toolbar}>
        <Space>
          <span className={styles.total}>共 {pagination?.total || 0} 只股票</span>
        </Space>
        {onExport && (
          <Button icon={<DownloadOutlined />} onClick={onExport}>
            导出数据
          </Button>
        )}
      </div>

      <Table<ListItem>
        columns={buildColumns()}
        dataSource={data}
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleTableChange}
        rowKey="symbol"
        scroll={{ x: 1200 }}
        size="middle"
      />
    </div>
  );
};

export default ListTable;
