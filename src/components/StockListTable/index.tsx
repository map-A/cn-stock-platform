/**
 * 通用股票列表表格组件
 */

import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { history } from 'umi';
import PriceTag from '@/components/PriceTag';
import type { StockListItem } from '@/services/featuredLists';

export interface StockListTableProps {
  dataSource: any[];
  loading?: boolean;
  pagination?: any;
  onChange?: (pagination: any) => void;
  extraColumns?: ColumnsType<any>;
  hideColumns?: string[];
}

const StockListTable: React.FC<StockListTableProps> = ({
  dataSource,
  loading,
  pagination,
  onChange,
  extraColumns = [],
  hideColumns = [],
}) => {
  const baseColumns: ColumnsType<StockListItem> = [
    {
      title: '代码',
      dataIndex: 'ticker',
      key: 'ticker',
      width: 100,
      fixed: 'left',
      render: (ticker: string, record) => (
        <a
          onClick={() => history.push(`/stock/${ticker}`)}
          style={{ fontWeight: 600 }}
        >
          {ticker}
        </a>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      render: (val: number) => `$${val.toFixed(2)}`,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changesPercentage',
      key: 'changesPercentage',
      width: 120,
      align: 'right',
      sorter: (a: any, b: any) => a.changesPercentage - b.changesPercentage,
      render: (val: number) => <PriceTag value={val} suffix="%" showIcon />,
    },
    {
      title: '涨跌额',
      dataIndex: 'change',
      key: 'change',
      width: 100,
      align: 'right',
      render: (val: number) => <PriceTag value={val} prefix="$" />,
    },
    {
      title: '市值',
      dataIndex: 'marketCap',
      key: 'marketCap',
      width: 120,
      align: 'right',
      sorter: (a: any, b: any) => a.marketCap - b.marketCap,
      render: (val: number) => {
        if (val >= 1000000000000) return `$${(val / 1000000000000).toFixed(2)}T`;
        if (val >= 1000000000) return `$${(val / 1000000000).toFixed(2)}B`;
        if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
        return `$${val.toLocaleString()}`;
      },
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      width: 120,
      align: 'right',
      render: (val: number) => {
        if (val >= 1000000) return `${(val / 1000000).toFixed(2)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(2)}K`;
        return val.toLocaleString();
      },
    },
    {
      title: '板块',
      dataIndex: 'sector',
      key: 'sector',
      width: 120,
      ellipsis: true,
      render: (val: string) => val && <Tag>{val}</Tag>,
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 150,
      ellipsis: true,
    },
  ];

  // 过滤掉隐藏的列
  const filteredColumns = baseColumns.filter(
    (col) => !hideColumns.includes(col.key as string),
  );

  // 合并自定义列
  const columns = [...filteredColumns, ...extraColumns];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      rowKey="ticker"
      scroll={{ x: 1200 }}
      pagination={
        pagination !== false
          ? {
              ...pagination,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 只股票`,
            }
          : false
      }
      onChange={onChange}
    />
  );
};

export default StockListTable;
