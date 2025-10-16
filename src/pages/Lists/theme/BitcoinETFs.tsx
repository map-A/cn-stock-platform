/**
 * 比特币ETF列表页
 */

import React, { useState } from 'react';
import { Card, Space, Alert, Tag } from 'antd';
import { AccountBookFilled } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getBitcoinETFs } from '@/services/featuredLists';
import StockListTable from '@/components/StockListTable';

const BitcoinETFs: React.FC = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 50 });

  const { data, loading } = useRequest(
    () => getBitcoinETFs({ page: pagination.current, pageSize: pagination.pageSize }),
    { refreshDeps: [pagination] },
  );

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 8 }}>
              <AccountBookFilled style={{ color: '#f7931a', marginRight: 12 }} />
              比特币ETF
            </h1>
            <p style={{ color: '#666', fontSize: 14 }}>
              追踪比特币价格的交易所交易基金
            </p>
          </div>

          <Space>
            <Tag color="gold">加密货币</Tag>
            <Tag color="orange">ETF</Tag>
            <Tag color="volcano">数字资产</Tag>
          </Space>
        </Space>
      </Card>

      <Alert
        message="比特币ETF投资指南"
        description="比特币ETF为投资者提供了一种便捷的方式来投资比特币，无需直接持有加密货币。这些ETF追踪比特币价格走势，可以在传统券商账户中交易。投资比特币ETF需要注意其费用率、跟踪误差和流动性。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Card title="比特币ETF列表">
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
        />
      </Card>
    </div>
  );
};

export default BitcoinETFs;
