/**
 * 期权异常活动Tab
 */

import React, { useState } from 'react';
import { Card, Table, Tag, Select, Space, Badge, Tooltip } from 'antd';
import { ThunderboltOutlined, FireOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getUnusualActivity, UnusualActivity as UnusualActivityType } from '@/services/options';
import PriceTag from '@/components/PriceTag';

const { Option } = Select;

interface UnusualActivityProps {
  ticker: string;
}

const UnusualActivity: React.FC<UnusualActivityProps> = ({ ticker }) => {
  const [filters, setFilters] = useState({
    sentiment: undefined,
    minVolume: 1000,
    minPremium: 100000,
  });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });

  const { data, loading } = useRequest(
    () =>
      getUnusualActivity({
        ticker,
        ...filters,
        page: pagination.current,
        pageSize: pagination.pageSize,
      }),
    {
      refreshDeps: [ticker, filters, pagination],
    },
  );

  const columns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 120,
      render: (val: string) => new Date(val).toLocaleTimeString(),
    },
    {
      title: '合约',
      dataIndex: 'contractSymbol',
      key: 'contractSymbol',
      width: 180,
      render: (val: string, record: UnusualActivityType) => (
        <div>
          <div style={{ fontWeight: 600 }}>{val}</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {record.type.toUpperCase()} ${record.strike} {record.expiryDate}
          </div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (val: string) => (
        <Tag color={val === 'call' ? 'red' : 'green'}>{val.toUpperCase()}</Tag>
      ),
    },
    {
      title: '情绪',
      dataIndex: 'sentiment',
      key: 'sentiment',
      width: 100,
      render: (val: string) => {
        const config = {
          bullish: { color: 'success', text: '看涨' },
          bearish: { color: 'error', text: '看跌' },
          neutral: { color: 'default', text: '中性' },
        };
        const item = config[val as keyof typeof config] || config.neutral;
        return <Badge status={item.color as any} text={item.text} />;
      },
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      width: 120,
      align: 'right' as const,
      sorter: (a: any, b: any) => a.volume - b.volume,
      render: (val: number) => (
        <Tooltip title={`${val.toLocaleString()}`}>
          <span style={{ fontWeight: 600 }}>
            {val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val}
          </span>
        </Tooltip>
      ),
    },
    {
      title: '持仓量',
      dataIndex: 'openInterest',
      key: 'openInterest',
      width: 120,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Vol/OI',
      key: 'volumeOIRatio',
      width: 100,
      align: 'right' as const,
      render: (_: any, record: UnusualActivityType) => {
        const ratio = record.volumeOIRatio;
        let color = '#000';
        if (ratio > 2) color = '#cf1322';
        else if (ratio > 1) color = '#fa8c16';
        return <span style={{ color, fontWeight: 600 }}>{ratio.toFixed(2)}</span>;
      },
    },
    {
      title: '权利金',
      dataIndex: 'premium',
      key: 'premium',
      width: 120,
      align: 'right' as const,
      sorter: (a: any, b: any) => a.premium - b.premium,
      render: (val: number) => (
        <span style={{ fontWeight: 600 }}>
          ${val >= 1000000 ? `${(val / 1000000).toFixed(2)}M` : (val / 1000).toFixed(1) + 'K'}
        </span>
      ),
    },
    {
      title: '规模',
      dataIndex: 'tradeSize',
      key: 'tradeSize',
      width: 80,
      render: (val: string) => {
        const config = {
          large: { color: 'red', icon: <FireOutlined />, text: '大单' },
          medium: { color: 'orange', icon: <ThunderboltOutlined />, text: '中单' },
          small: { color: 'default', icon: null, text: '小单' },
        };
        const item = config[val as keyof typeof config] || config.small;
        return (
          <Tag color={item.color} icon={item.icon}>
            {item.text}
          </Tag>
        );
      },
    },
  ];

  return (
    <div>
      {/* 筛选器 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>情绪:</span>
          <Select
            style={{ width: 120 }}
            placeholder="全部"
            allowClear
            value={filters.sentiment}
            onChange={(value) => {
              setFilters({ ...filters, sentiment: value });
              setPagination({ current: 1, pageSize: 20 });
            }}
          >
            <Option value="bullish">看涨</Option>
            <Option value="bearish">看跌</Option>
            <Option value="neutral">中性</Option>
          </Select>

          <span style={{ marginLeft: 16 }}>最小成交量:</span>
          <Select
            style={{ width: 120 }}
            value={filters.minVolume}
            onChange={(value) => {
              setFilters({ ...filters, minVolume: value });
              setPagination({ current: 1, pageSize: 20 });
            }}
          >
            <Option value={500}>500</Option>
            <Option value={1000}>1,000</Option>
            <Option value={5000}>5,000</Option>
            <Option value={10000}>10,000</Option>
          </Select>

          <span style={{ marginLeft: 16 }}>最小权利金:</span>
          <Select
            style={{ width: 120 }}
            value={filters.minPremium}
            onChange={(value) => {
              setFilters({ ...filters, minPremium: value });
              setPagination({ current: 1, pageSize: 20 });
            }}
          >
            <Option value={50000}>$50K</Option>
            <Option value={100000}>$100K</Option>
            <Option value={500000}>$500K</Option>
            <Option value={1000000}>$1M</Option>
          </Select>
        </Space>
      </Card>

      {/* 说明 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: '#666', lineHeight: '1.8' }}>
          <FireOutlined style={{ color: '#cf1322', marginRight: 4 }} />
          <strong>异常活动</strong>识别标准：
          <ul style={{ marginTop: 8, marginBottom: 0 }}>
            <li>成交量/持仓量比例(Vol/OI) &gt; 1，表示当日交易活跃</li>
            <li>大额权利金交易，可能代表机构或大户操作</li>
            <li>快速关注这些异常合约，可能预示标的股票即将出现重大波动</li>
          </ul>
        </div>
      </Card>

      {/* 异常活动表格 */}
      <Card title={`异常活动记录 ${data?.total ? `(${data.total})` : ''}`}>
        <Table
          dataSource={data?.list || []}
          columns={columns}
          loading={loading}
          rowKey={(record) => `${record.contractSymbol}-${record.timestamp}`}
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条异常记录`,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize: pageSize || 20 });
            },
          }}
        />
      </Card>
    </div>
  );
};

export default UnusualActivity;
