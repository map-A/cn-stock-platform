/**
 * 结果表格组件
 */

import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ScreenerResult } from '../../types';
import { useNavigate } from '@umijs/max';

interface ResultTableProps {
  data: ScreenerResult[];
  loading?: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onRowClick?: (record: ScreenerResult) => void;
}

const ResultTable: React.FC<ResultTableProps> = ({
  data,
  loading,
  pagination,
  onRowClick,
}) => {
  const navigate = useNavigate();

  const columns: ColumnsType<ScreenerResult> = [
    {
      title: '代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 100,
      fixed: 'left',
      render: (symbol: string) => (
        <a
          onClick={e => {
            e.stopPropagation();
            navigate(`/stock/${symbol}`);
          }}
          style={{ fontWeight: 600 }}
        >
          {symbol}
        </a>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      fixed: 'left',
    },
    {
      title: '市场',
      dataIndex: 'market',
      key: 'market',
      width: 80,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      sorter: true,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      width: 100,
      align: 'right',
      sorter: true,
      render: (percent: number) => (
        <Tag color={percent >= 0 ? 'red' : 'green'} style={{ margin: 0 }}>
          {percent >= 0 ? '+' : ''}
          {percent.toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      width: 100,
      align: 'right',
      sorter: true,
      render: (volume: number) => {
        if (volume >= 100000000) {
          return `${(volume / 100000000).toFixed(2)}亿`;
        }
        return `${(volume / 10000).toFixed(2)}万`;
      },
    },
    {
      title: '市值',
      dataIndex: 'marketCap',
      key: 'marketCap',
      width: 120,
      align: 'right',
      sorter: true,
      render: (cap: number) => `${(cap / 100000000).toFixed(2)}亿`,
    },
    {
      title: 'PE',
      dataIndex: 'peRatio',
      key: 'peRatio',
      width: 80,
      align: 'right',
      sorter: true,
      render: (ratio?: number) => (ratio ? ratio.toFixed(2) : '-'),
    },
    {
      title: 'PB',
      dataIndex: 'pbRatio',
      key: 'pbRatio',
      width: 80,
      align: 'right',
      sorter: true,
      render: (ratio?: number) => (ratio ? ratio.toFixed(2) : '-'),
    },
    {
      title: 'ROE',
      dataIndex: 'roe',
      key: 'roe',
      width: 80,
      align: 'right',
      sorter: true,
      render: (roe?: number) => (roe ? `${roe.toFixed(2)}%` : '-'),
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 120,
      render: (industry: string) => <Tag>{industry}</Tag>,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="symbol"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      scroll={{ x: 1200, y: 'calc(100vh - 400px)' }}
      onRow={record => ({
        onClick: () => onRowClick?.(record),
        style: { cursor: 'pointer' },
      })}
      size="small"
    />
  );
};

export default ResultTable;
