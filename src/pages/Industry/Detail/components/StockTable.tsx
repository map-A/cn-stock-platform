/**
 * 行业成分股表格组件
 */

import React from 'react';
import { Table, Space, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import type { ColumnsType } from 'antd/es/table';
import type { IndustryStock } from '@/services/industry';
import { formatNumber, formatPercent } from '@/utils/format';

const { Text } = Typography;

interface StockTableProps {
  data: IndustryStock[];
}

const StockTable: React.FC<StockTableProps> = ({ data }) => {
  const columns: ColumnsType<IndustryStock> = [
    {
      title: '股票名称',
      key: 'name',
      fixed: 'left',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.symbol}
          </Text>
        </Space>
      ),
    },
    {
      title: '当前价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (value) => `¥${value.toFixed(2)}`,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      width: 120,
      sorter: (a, b) => a.changePercent - b.changePercent,
      render: (value) => {
        const isPositive = value >= 0;
        return (
          <Space>
            {isPositive ? (
              <ArrowUpOutlined style={{ color: '#cf1322' }} />
            ) : (
              <ArrowDownOutlined style={{ color: '#3f8600' }} />
            )}
            <Text style={{ color: isPositive ? '#cf1322' : '#3f8600' }}>
              {formatPercent(value)}
            </Text>
          </Space>
        );
      },
    },
    {
      title: '市值',
      dataIndex: 'marketCap',
      key: 'marketCap',
      width: 120,
      sorter: (a, b) => a.marketCap - b.marketCap,
      render: (value) => formatNumber(value, '亿'),
    },
    {
      title: '成交额',
      dataIndex: 'volume',
      key: 'volume',
      width: 120,
      sorter: (a, b) => a.volume - b.volume,
      render: (value) => formatNumber(value, '亿'),
    },
    {
      title: '市盈率',
      dataIndex: 'pe',
      key: 'pe',
      width: 100,
      render: (value) => (value ? `${value.toFixed(2)}倍` : '-'),
    },
    {
      title: '市净率',
      dataIndex: 'pb',
      key: 'pb',
      width: 100,
      render: (value) => (value ? `${value.toFixed(2)}倍` : '-'),
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      width: 100,
      render: (value) => (value ? formatPercent(value) : '-'),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="symbol"
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 只股票`,
      }}
      scroll={{ x: 1000 }}
      onRow={(record) => ({
        onClick: () => history.push(`/stock/${record.symbol}`),
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default StockTable;
