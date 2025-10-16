/**
 * ETF列表页面
 */

import React, { useState } from 'react';
import { Card, Table, Input, Select, Space, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { history } from 'umi';
import { getETFList, ETFInfo } from '@/services/etf';
import PriceTag from '@/components/PriceTag';

const { Search } = Input;
const { Option } = Select;

const ETFList: React.FC = () => {
  const [filters, setFilters] = useState({
    type: undefined,
    sortBy: 'totalAssets',
    page: 1,
    pageSize: 20,
  });

  const { data, loading } = useRequest(() => getETFList(filters), {
    refreshDeps: [filters],
  });

  const columns = [
    {
      title: 'ETF代码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      render: (code: string, record: ETFInfo) => (
        <a onClick={() => history.push(`/etf/${code}`)}>{code} {record.name}</a>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: '规模(亿)',
      dataIndex: 'totalAssets',
      key: 'totalAssets',
      width: 120,
      align: 'right' as const,
      render: (value: number) => (value / 100000000).toFixed(2),
    },
    {
      title: '今年以来',
      dataIndex: 'ytd',
      key: 'ytd',
      width: 100,
      render: (value: number) => <PriceTag value={value} suffix="%" showIcon />,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Space size="middle" style={{ marginBottom: 16 }}>
          <Search placeholder="搜索ETF" style={{ width: 300 }} prefix={<SearchOutlined />} />
          <Select
            placeholder="ETF类型"
            style={{ width: 150 }}
            value={filters.type}
            onChange={(value) => setFilters({ ...filters, type: value, page: 1 })}
          >
            <Option value="stock">股票型</Option>
            <Option value="bond">债券型</Option>
          </Select>
        </Space>
        <Table
          dataSource={data?.list || []}
          columns={columns}
          loading={loading}
          rowKey="code"
          pagination={{
            current: filters.page,
            pageSize: filters.pageSize,
            total: data?.total || 0,
            onChange: (page, pageSize) => setFilters({ ...filters, page, pageSize: pageSize || 20 }),
          }}
        />
      </Card>
    </div>
  );
};

export default ETFList;
