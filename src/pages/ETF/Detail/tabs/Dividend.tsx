/**
 * ETF分红历史Tab
 */

import React from 'react';
import { Card, Table, Timeline, Row, Col, Statistic, Empty } from 'antd';
import { useRequest } from 'ahooks';
import { getETFDividends } from '@/services/etf';
import { GiftOutlined } from '@ant-design/icons';

interface DividendTabProps {
  code: string;
}

const DividendTab: React.FC<DividendTabProps> = ({ code }) => {
  const { data: dividendData, loading } = useRequest(() => getETFDividends(code), {
    refreshDeps: [code],
  });

  // 计算统计数据
  const stats = dividendData
    ? {
        totalDividends: dividendData.reduce((sum, item) => sum + item.dividendPerUnit, 0),
        avgDividend:
          dividendData.reduce((sum, item) => sum + item.dividendPerUnit, 0) / dividendData.length,
        count: dividendData.length,
        avgYield:
          dividendData.reduce((sum, item) => sum + item.dividendYield, 0) / dividendData.length,
      }
    : null;

  const columns = [
    {
      title: '除权日',
      dataIndex: 'exDate',
      key: 'exDate',
      width: 120,
    },
    {
      title: '股权登记日',
      dataIndex: 'recordDate',
      key: 'recordDate',
      width: 120,
    },
    {
      title: '分红发放日',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 120,
    },
    {
      title: '每份分红(元)',
      dataIndex: 'dividendPerUnit',
      key: 'dividendPerUnit',
      width: 130,
      align: 'right' as const,
      render: (val: number) => `¥${val.toFixed(4)}`,
      sorter: (a: any, b: any) => a.dividendPerUnit - b.dividendPerUnit,
    },
    {
      title: '股息率',
      dataIndex: 'dividendYield',
      key: 'dividendYield',
      width: 100,
      align: 'right' as const,
      render: (val: number) => `${val.toFixed(2)}%`,
      sorter: (a: any, b: any) => a.dividendYield - b.dividendYield,
    },
  ];

  if (loading) {
    return <Card loading />;
  }

  if (!dividendData || dividendData.length === 0) {
    return (
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无分红记录"
        />
      </Card>
    );
  }

  return (
    <div>
      {/* 统计卡片 */}
      {stats && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="累计分红次数"
                value={stats.count}
                suffix="次"
                prefix={<GiftOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="累计分红总额"
                value={stats.totalDividends}
                precision={4}
                prefix="¥"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="平均每次分红"
                value={stats.avgDividend}
                precision={4}
                prefix="¥"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="平均股息率"
                value={stats.avgYield}
                precision={2}
                suffix="%"
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* 分红历史表格 */}
      <Card title="分红历史" style={{ marginBottom: 16 }}>
        <Table
          dataSource={dividendData}
          columns={columns}
          rowKey="exDate"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 分红时间轴 */}
      <Card title="分红时间线">
        <Timeline
          items={dividendData.slice(0, 10).map((item) => ({
            children: (
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {item.exDate} - 每份分红 ¥{item.dividendPerUnit.toFixed(4)}
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  股息率: {item.dividendYield.toFixed(2)}% | 登记日: {item.recordDate} | 发放日:{' '}
                  {item.paymentDate}
                </div>
              </div>
            ),
          }))}
        />
        {dividendData.length > 10 && (
          <div style={{ textAlign: 'center', marginTop: 16, color: '#999' }}>
            仅显示最近10条记录，完整记录请查看上方表格
          </div>
        )}
      </Card>
    </div>
  );
};

export default DividendTab;
