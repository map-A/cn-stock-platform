/**
 * 最高Call成交量股票列表页
 */

import React, { useState } from 'react';
import { Card, Space, Alert } from 'antd';
import { RiseOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getHighestCallVolume, type OptionsStock } from '@/services/featuredLists';
import StockListTable from '@/components/StockListTable';
import type { ColumnsType } from 'antd/es/table';

const HighestCallVolume: React.FC = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 50 });

  const { data, loading } = useRequest(
    () => getHighestCallVolume({ page: pagination.current, pageSize: pagination.pageSize }),
    { refreshDeps: [pagination] },
  );

  const extraColumns: ColumnsType<OptionsStock> = [
    {
      title: 'Call成交量',
      dataIndex: 'optionVolume',
      key: 'optionVolume',
      width: 130,
      align: 'right',
      sorter: (a, b) => a.optionVolume - b.optionVolume,
      render: (val: number) => (
        <span style={{ color: '#cf1322', fontWeight: 600 }}>
          {val >= 1000000 ? `${(val / 1000000).toFixed(2)}M` : `${(val / 1000).toFixed(0)}K`}
        </span>
      ),
    },
    {
      title: 'Put/Call比率',
      dataIndex: 'putCallRatio',
      key: 'putCallRatio',
      width: 120,
      align: 'right',
      render: (val: number) => val.toFixed(2),
    },
    {
      title: '隐含波动率',
      dataIndex: 'impliedVolatility',
      key: 'impliedVolatility',
      width: 120,
      align: 'right',
      render: (val: number) => `${(val * 100).toFixed(1)}%`,
    },
    {
      title: '持仓量',
      dataIndex: 'openInterest',
      key: 'openInterest',
      width: 120,
      align: 'right',
      render: (val: number) => val.toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 8 }}>
              <RiseOutlined style={{ color: '#cf1322', marginRight: 12 }} />
              最高Call期权成交量
            </h1>
            <p style={{ color: '#666', fontSize: 14 }}>
              看涨期权(Call)成交量最高的股票，通常预示市场看涨情绪
            </p>
          </div>
        </Space>
      </Card>

      <Alert
        message="如何解读Call期权成交量？"
        description="Call期权成交量激增通常表明市场对该股票看涨情绪浓厚。大量买入Call期权可能意味着投资者预期股价上涨，或者机构在建立看涨头寸。结合Put/Call比率可以更好地判断市场情绪。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Card title="最高Call成交量股票">
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

export default HighestCallVolume;
