/**
 * 新发行ETF页面
 */

import React, { useState } from 'react';
import { Card, Table, Tag, Select, Space, Badge } from 'antd';
import { useRequest } from 'ahooks';
import { getNewLaunchETFs } from '@/services/etf';
import { history } from 'umi';
import { RocketOutlined } from '@ant-design/icons';
import PriceTag from '@/components/PriceTag';

const { Option } = Select;

const NewLaunches: React.FC = () => {
  const [days, setDays] = useState(90);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });

  const { data, loading } = useRequest(
    () =>
      getNewLaunchETFs({
        days,
        page: pagination.current,
        pageSize: pagination.pageSize,
      }),
    {
      refreshDeps: [days, pagination],
    },
  );

  const columns = [
    {
      title: 'ETF代码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
      fixed: 'left' as const,
      render: (code: string, record: any) => (
        <a onClick={() => history.push(`/etf/${code}`)}>
          <div>{code}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.name}</div>
        </a>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, { color: string; text: string }> = {
          stock: { color: 'blue', text: '股票型' },
          bond: { color: 'green', text: '债券型' },
          commodity: { color: 'orange', text: '商品型' },
          hybrid: { color: 'purple', text: '混合型' },
          index: { color: 'cyan', text: '指数型' },
        };
        const config = typeMap[type] || { color: 'default', text: type };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '上市日期',
      dataIndex: 'listingDate',
      key: 'listingDate',
      width: 120,
      sorter: (a: any, b: any) => new Date(a.listingDate).getTime() - new Date(b.listingDate).getTime(),
      render: (date: string) => {
        const days = Math.floor(
          (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24),
        );
        return (
          <div>
            <div>{date}</div>
            {days <= 30 && (
              <Badge status="success" text={`新上市${days}天`} style={{ fontSize: 12 }} />
            )}
          </div>
        );
      },
    },
    {
      title: '基金经理',
      dataIndex: 'manager',
      key: 'manager',
      width: 150,
      ellipsis: true,
    },
    {
      title: '规模(亿)',
      dataIndex: 'totalAssets',
      key: 'totalAssets',
      width: 120,
      align: 'right' as const,
      sorter: (a: any, b: any) => a.totalAssets - b.totalAssets,
      render: (val: number) => (val / 100000000).toFixed(2),
    },
    {
      title: '单位净值',
      dataIndex: 'unitNetValue',
      key: 'unitNetValue',
      width: 120,
      align: 'right' as const,
      render: (val: number) => `¥${val.toFixed(4)}`,
    },
    {
      title: '今年以来',
      dataIndex: 'ytd',
      key: 'ytd',
      width: 100,
      align: 'right' as const,
      sorter: (a: any, b: any) => a.ytd - b.ytd,
      render: (val: number) => <PriceTag value={val} suffix="%" showIcon />,
    },
    {
      title: '管理费率',
      dataIndex: 'managementFee',
      key: 'managementFee',
      width: 110,
      align: 'right' as const,
      render: (val: number) => `${val.toFixed(2)}%`,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 筛选器 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <RocketOutlined style={{ fontSize: 20, color: '#1890ff' }} />
          <span>时间范围:</span>
          <Select value={days} onChange={setDays} style={{ width: 150 }}>
            <Option value={30}>最近30天</Option>
            <Option value={60}>最近60天</Option>
            <Option value={90}>最近90天</Option>
            <Option value={180}>最近半年</Option>
            <Option value={365}>最近一年</Option>
          </Select>
          <span style={{ color: '#999', marginLeft: 16 }}>
            共 {data?.total || 0} 只新发行ETF
          </span>
        </Space>
      </Card>

      {/* 新发行ETF列表 */}
      <Card title="新发行ETF列表">
        <Table
          dataSource={data?.list || []}
          columns={columns}
          loading={loading}
          rowKey="code"
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 只新发行ETF`,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize: pageSize || 20 });
            },
          }}
        />
      </Card>
    </div>
  );
};

export default NewLaunches;
