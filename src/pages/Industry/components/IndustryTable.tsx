/**
 * 行业表格组件
 * 展示行业列表及其表现数据
 */

import React, { useMemo } from 'react';
import { Table, Tag, Space, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { IndustryPerformance } from '@/services/industry';
import { formatNumber, formatPercent } from '@/utils/format';

const { Text } = Typography;

interface IndustryTableProps {
  /** 行业表现数据 */
  data: IndustryPerformance[];
  /** 时间范围 */
  timeRange: '1d' | '5d' | '1m' | '3m' | '6m' | '1y';
  /** 行点击事件 */
  onRowClick?: (record: IndustryPerformance) => void;
  /** 是否加载中 */
  loading?: boolean;
}

/**
 * 行业表格组件
 */
const IndustryTable: React.FC<IndustryTableProps> = ({
  data,
  timeRange,
  onRowClick,
  loading = false,
}) => {
  /**
   * 渲染涨跌幅
   */
  const renderChange = (value: number) => {
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
  };

  /**
   * 渲染领涨/领跌股
   */
  const renderTopStock = (
    stock?: { symbol: string; name: string; changePercent: number },
  ) => {
    if (!stock) return '-';
    return (
      <Space direction="vertical" size={0}>
        <Text strong>{stock.name}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {stock.symbol} {formatPercent(stock.changePercent)}
        </Text>
      </Space>
    );
  };

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
   * 表格列配置
   */
  const columns: ColumnsType<IndustryPerformance> = useMemo(
    () => [
      {
        title: '行业名称',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 150,
        render: (text, record) => (
          <Space>
            <Text strong>{text}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.code}
            </Text>
          </Space>
        ),
      },
      {
        title: '涨跌幅',
        key: 'change',
        width: 120,
        sorter: (a, b) => getChangeByTimeRange(a) - getChangeByTimeRange(b),
        defaultSortOrder: 'descend',
        render: (_, record) => renderChange(getChangeByTimeRange(record)),
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
        title: '资金流向',
        dataIndex: 'moneyFlow',
        key: 'moneyFlow',
        width: 120,
        sorter: (a, b) => a.moneyFlow - b.moneyFlow,
        render: (value) => {
          const isInflow = value >= 0;
          return (
            <Tag color={isInflow ? 'red' : 'green'}>
              {isInflow ? '流入' : '流出'} {formatNumber(Math.abs(value), '亿')}
            </Tag>
          );
        },
      },
      {
        title: '领涨股',
        dataIndex: 'topGainer',
        key: 'topGainer',
        width: 140,
        render: renderTopStock,
      },
      {
        title: '领跌股',
        dataIndex: 'topLoser',
        key: 'topLoser',
        width: 140,
        render: renderTopStock,
      },
    ],
    [timeRange],
  );

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="code"
      loading={loading}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 个行业`,
      }}
      scroll={{ x: 900 }}
      onRow={(record) => ({
        onClick: () => onRowClick?.(record),
        style: { cursor: onRowClick ? 'pointer' : 'default' },
      })}
    />
  );
};

export default IndustryTable;
