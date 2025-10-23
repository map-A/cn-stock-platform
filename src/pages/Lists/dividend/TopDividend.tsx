/**
 * 最佳分红股票列表页
 */

import React, { useState } from 'react';
import { Card, Space, Statistic, Row, Col, Alert } from 'antd';
import { TrophyOutlined, DollarOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getTopDividendStocks, type DividendStock } from '@/services/featuredLists';
import StockListTable from '@/components/StockListTable';
import type { ColumnsType } from 'antd/es/table';

const TopDividend: React.FC = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 50 });

  const { data, loading } = useRequest(
    () => getTopDividendStocks({ page: pagination.current, pageSize: pagination.pageSize }),
    { refreshDeps: [pagination] },
  );

  // 额外的列
  const extraColumns: ColumnsType<DividendStock> = [
    {
      title: '股息率',
      dataIndex: 'dividendYield',
      key: 'dividendYield',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.dividendYield - b.dividendYield,
      render: (val: number) => (
        <span style={{ color: '#52c41a', fontWeight: 600 }}>{val.toFixed(2)}%</span>
      ),
    },
    {
      title: '每股分红',
      dataIndex: 'dividendPerShare',
      key: 'dividendPerShare',
      width: 110,
      align: 'right',
      render: (val: number) => `$${val.toFixed(2)}`,
    },
    {
      title: '派息率',
      dataIndex: 'payoutRatio',
      key: 'payoutRatio',
      width: 100,
      align: 'right',
      render: (val: number) => `${val.toFixed(1)}%`,
    },
    {
      title: '除息日',
      dataIndex: 'exDividendDate',
      key: 'exDividendDate',
      width: 120,
    },
  ];

  // 计算统计数据
  const stats = data?.list
    ? {
        avgYield:
          data.list.reduce((sum, item) => sum + item.dividendYield, 0) / data.list.length,
        maxYield: Math.max(...data.list.map((item) => item.dividendYield)),
        count: data.total,
      }
    : null;

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 8 }}>
              <TrophyOutlined style={{ color: '#faad14', marginRight: 12 }} />
              最佳分红股票
            </h1>
            <p style={{ color: '#666', fontSize: 14 }}>
              筛选出股息率最高、分红稳定的优质股票
            </p>
          </div>

          {stats && (
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="总股票数"
                  value={stats.count}
                  suffix="只"
                  prefix={<DollarOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="平均股息率"
                  value={stats.avgYield}
                  precision={2}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="最高股息率"
                  value={stats.maxYield}
                  precision={2}
                  suffix="%"
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
            </Row>
          )}
        </Space>
      </Card>

      {/* 说明 */}
      <Alert
        message="什么是高分红股票？"
        description="高分红股票通常指股息率较高、现金流稳定、具有持续分红能力的公司。投资高分红股票可以获得稳定的现金流收入，适合追求稳健收益的投资者。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* 股票列表 */}
      <Card title="高分红股票列表">
        <StockListTable
          dataSource={data?.list || []}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.total || 0,
          }}
          onChange={(newPagination) => {
            setPagination({
              current: newPagination.current || 1,
              pageSize: newPagination.pageSize || 50,
            });
          }}
          extraColumns={extraColumns}
        />
      </Card>
    </div>
  );
};

export default TopDividend;
