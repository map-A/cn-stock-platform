/**
 * ETF持仓明细Tab
 */

import React, { useState } from 'react';
import { Table, Card, Row, Col, Progress } from 'antd';
import { useRequest } from 'ahooks';
import { getETFHoldings, getETFSectorDistribution } from '@/services/etf';
import PriceTag from '@/components/PriceTag';
import { Column } from '@ant-design/plots';

interface HoldingsTabProps {
  code: string;
}

const HoldingsTab: React.FC<HoldingsTabProps> = ({ code }) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });

  const { data: holdingsData, loading } = useRequest(
    () => getETFHoldings(code, { page: pagination.current, pageSize: pagination.pageSize }),
    { refreshDeps: [code, pagination] },
  );

  const { data: sectorData } = useRequest(() => getETFSectorDistribution(code), {
    refreshDeps: [code],
  });

  const columns = [
    {
      title: '股票代码',
      dataIndex: 'stockCode',
      key: 'stockCode',
      width: 120,
      fixed: 'left' as const,
    },
    {
      title: '股票名称',
      dataIndex: 'stockName',
      key: 'stockName',
      width: 150,
    },
    {
      title: '持仓占比',
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
      align: 'right' as const,
      sorter: (a: any, b: any) => a.weight - b.weight,
      render: (val: number) => (
        <div>
          <div>{val.toFixed(2)}%</div>
          <Progress percent={val} showInfo={false} size="small" />
        </div>
      ),
    },
    {
      title: '持股数量',
      dataIndex: 'shares',
      key: 'shares',
      width: 120,
      align: 'right' as const,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '市值(万)',
      dataIndex: 'marketValue',
      key: 'marketValue',
      width: 120,
      align: 'right' as const,
      render: (val: number) => (val / 10000).toFixed(2),
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      width: 100,
      align: 'right' as const,
      render: (val: number) => <PriceTag value={val} suffix="%" showIcon />,
    },
    {
      title: '所属行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 120,
      ellipsis: true,
    },
  ];

  return (
    <div>
      {/* 行业分布 */}
      {sectorData && sectorData.sectors && (
        <Card title="行业分布" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Column
                data={sectorData.sectors}
                xField="sector"
                yField="weight"
                label={{
                  position: 'top',
                  formatter: (datum: any) => `${datum.weight.toFixed(1)}%`,
                }}
                meta={{
                  weight: { alias: '占比(%)' },
                  sector: { alias: '行业' },
                }}
                height={300}
              />
            </Col>
          </Row>
          <div style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
            数据更新时间: {sectorData.asOfDate}
          </div>
        </Card>
      )}

      {/* 持仓明细表格 */}
      <Card title="持仓明细">
        <Table
          dataSource={holdingsData?.holdings || []}
          columns={columns}
          loading={loading}
          rowKey="stockCode"
          scroll={{ x: 1000 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: holdingsData?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 只股票`,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize: pageSize || 20 });
            },
          }}
        />
        {holdingsData && (
          <div style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
            持仓数据更新时间: {holdingsData.asOfDate}
          </div>
        )}
      </Card>
    </div>
  );
};

export default HoldingsTab;
