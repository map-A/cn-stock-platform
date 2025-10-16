/**
 * 期权总览Tab
 */

import React, { useState } from 'react';
import { Card, Table, Tabs, DatePicker, Space, Statistic, Row, Col, Tag } from 'antd';
import { useRequest } from 'ahooks';
import { getOptionsChain } from '@/services/options';
import PriceTag from '@/components/PriceTag';
import dayjs from 'dayjs';

interface OptionsOverviewProps {
  ticker: string;
}

const OptionsOverview: React.FC<OptionsOverviewProps> = ({ ticker }) => {
  const [selectedExpiry, setSelectedExpiry] = useState<string>();

  const { data: optionsData, loading } = useRequest(
    () => getOptionsChain(ticker, selectedExpiry),
    { refreshDeps: [ticker, selectedExpiry] },
  );

  // 提取所有到期日
  const expiryDates = optionsData
    ? Array.from(new Set(optionsData.map((item) => item.expiryDate)))
    : [];

  const columns = [
    {
      title: '行权价',
      dataIndex: 'strike',
      key: 'strike',
      width: 100,
      align: 'center' as const,
      fixed: 'left' as const,
      render: (val: number) => `$${val}`,
    },
    {
      title: 'Call',
      children: [
        {
          title: '买价',
          dataIndex: ['call', 'bid'],
          key: 'callBid',
          width: 80,
          align: 'right' as const,
          render: (val: number) => `$${val.toFixed(2)}`,
        },
        {
          title: '卖价',
          dataIndex: ['call', 'ask'],
          key: 'callAsk',
          width: 80,
          align: 'right' as const,
          render: (val: number) => `$${val.toFixed(2)}`,
        },
        {
          title: '最新价',
          dataIndex: ['call', 'lastPrice'],
          key: 'callLast',
          width: 90,
          align: 'right' as const,
          render: (val: number) => (
            <span style={{ fontWeight: 600 }}>${val.toFixed(2)}</span>
          ),
        },
        {
          title: '成交量',
          dataIndex: ['call', 'volume'],
          key: 'callVolume',
          width: 90,
          align: 'right' as const,
          render: (val: number) => val.toLocaleString(),
        },
        {
          title: '持仓量',
          dataIndex: ['call', 'openInterest'],
          key: 'callOI',
          width: 90,
          align: 'right' as const,
          render: (val: number) => val.toLocaleString(),
        },
        {
          title: 'IV',
          dataIndex: ['call', 'impliedVolatility'],
          key: 'callIV',
          width: 80,
          align: 'right' as const,
          render: (val: number) => `${(val * 100).toFixed(1)}%`,
        },
      ],
    },
    {
      title: 'Put',
      children: [
        {
          title: '买价',
          dataIndex: ['put', 'bid'],
          key: 'putBid',
          width: 80,
          align: 'right' as const,
          render: (val: number) => `$${val.toFixed(2)}`,
        },
        {
          title: '卖价',
          dataIndex: ['put', 'ask'],
          key: 'putAsk',
          width: 80,
          align: 'right' as const,
          render: (val: number) => `$${val.toFixed(2)}`,
        },
        {
          title: '最新价',
          dataIndex: ['put', 'lastPrice'],
          key: 'putLast',
          width: 90,
          align: 'right' as const,
          render: (val: number) => (
            <span style={{ fontWeight: 600 }}>${val.toFixed(2)}</span>
          ),
        },
        {
          title: '成交量',
          dataIndex: ['put', 'volume'],
          key: 'putVolume',
          width: 90,
          align: 'right' as const,
          render: (val: number) => val.toLocaleString(),
        },
        {
          title: '持仓量',
          dataIndex: ['put', 'openInterest'],
          key: 'putOI',
          width: 90,
          align: 'right' as const,
          render: (val: number) => val.toLocaleString(),
        },
        {
          title: 'IV',
          dataIndex: ['put', 'impliedVolatility'],
          key: 'putIV',
          width: 80,
          align: 'right' as const,
          render: (val: number) => `${(val * 100).toFixed(1)}%`,
        },
      ],
    },
  ];

  // 计算统计数据
  const stats = optionsData
    ? {
        totalCallVolume: optionsData.reduce((sum, item) => sum + item.call.volume, 0),
        totalPutVolume: optionsData.reduce((sum, item) => sum + item.put.volume, 0),
        totalCallOI: optionsData.reduce((sum, item) => sum + item.call.openInterest, 0),
        totalPutOI: optionsData.reduce((sum, item) => sum + item.put.openInterest, 0),
      }
    : null;

  return (
    <div>
      {/* 筛选器 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>到期日:</span>
          <Tabs
            activeKey={selectedExpiry}
            onChange={setSelectedExpiry}
            items={expiryDates.map((date) => ({
              key: date,
              label: (
                <span>
                  {dayjs(date).format('MM/DD')}
                  <br />
                  <span style={{ fontSize: 12, color: '#999' }}>
                    {dayjs(date).diff(dayjs(), 'day')}天
                  </span>
                </span>
              ),
            }))}
          />
        </Space>
      </Card>

      {/* 统计信息 */}
      {stats && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Call总成交量"
                value={stats.totalCallVolume}
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Put总成交量"
                value={stats.totalPutVolume}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Call总持仓量"
                value={stats.totalCallOI}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Put总持仓量"
                value={stats.totalPutOI}
              />
            </Col>
          </Row>
          <div style={{ marginTop: 16 }}>
            <span style={{ marginRight: 16 }}>
              看跌看涨比(P/C Volume): {(stats.totalPutVolume / stats.totalCallVolume).toFixed(2)}
            </span>
            <span>
              看跌看涨比(P/C OI): {(stats.totalPutOI / stats.totalCallOI).toFixed(2)}
            </span>
          </div>
        </Card>
      )}

      {/* 期权链表格 */}
      <Card title="期权链">
        <Table
          dataSource={optionsData || []}
          columns={columns}
          loading={loading}
          rowKey="strike"
          scroll={{ x: 1400 }}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个行权价`,
          }}
        />
      </Card>
    </div>
  );
};

export default OptionsOverview;
