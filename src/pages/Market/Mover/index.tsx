/**
 * 涨跌榜页面
 */
import React, { useState } from 'react';
import { Card, Tabs, Table, Tag, Space, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { history } from 'umi';
import { getMarketMovers } from '@/services/market';
import { formatPrice, formatPercent, formatVolume, formatAmount, getPriceColor } from '@/utils/format';
import type { MarketMoverData } from '@/typings/stock';
import styles from './index.less';

const { Text } = Typography;

const MarketMover: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'active' | 'amplitude'>('gainers');

  const { data, loading, refresh } = useRequest(
    () => getMarketMovers(activeTab, 100),
    {
      refreshDeps: [activeTab],
      pollingInterval: 5000, // 5秒刷新
    }
  );

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 80,
      fixed: 'left' as const,
      render: (rank: number) => (
        <Tag color={rank <= 3 ? 'gold' : 'default'}>{rank}</Tag>
      ),
    },
    {
      title: '股票代码',
      dataIndex: 'symbol',
      width: 120,
      fixed: 'left' as const,
    },
    {
      title: '股票名称',
      dataIndex: 'name',
      width: 120,
      fixed: 'left' as const,
      render: (name: string, record: MarketMoverData) => (
        <a onClick={() => history.push(`/stock/${record.symbol}`)}>
          {name}
        </a>
      ),
    },
    {
      title: '最新价',
      dataIndex: 'price',
      width: 100,
      align: 'right' as const,
      render: (price: number) => `¥${formatPrice(price)}`,
    },
    {
      title: '涨跌额',
      dataIndex: 'change',
      width: 100,
      align: 'right' as const,
      render: (change: number) => (
        <Text style={{ color: getPriceColor(change) }}>
          {change >= 0 ? '+' : ''}{formatPrice(change)}
        </Text>
      ),
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      width: 100,
      align: 'right' as const,
      sorter: (a: MarketMoverData, b: MarketMoverData) => a.changePercent - b.changePercent,
      render: (percent: number) => (
        <Space>
          {percent >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          <Text style={{ color: getPriceColor(percent) }}>
            {formatPercent(percent)}
          </Text>
        </Space>
      ),
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      width: 120,
      align: 'right' as const,
      sorter: (a: MarketMoverData, b: MarketMoverData) => a.volume - b.volume,
      render: (volume: number) => formatVolume(volume),
    },
    {
      title: '成交额',
      dataIndex: 'amount',
      width: 120,
      align: 'right' as const,
      sorter: (a: MarketMoverData, b: MarketMoverData) => a.amount - b.amount,
      render: (amount: number) => formatAmount(amount),
    },
    {
      title: '换手率',
      dataIndex: 'turnoverRate',
      width: 100,
      align: 'right' as const,
      sorter: (a: MarketMoverData, b: MarketMoverData) => a.turnoverRate - b.turnoverRate,
      render: (rate: number) => `${rate.toFixed(2)}%`,
    },
    {
      title: '振幅',
      dataIndex: 'amplitude',
      width: 100,
      align: 'right' as const,
      sorter: (a: MarketMoverData, b: MarketMoverData) => (a.amplitude || 0) - (b.amplitude || 0),
      render: (amplitude?: number) => amplitude ? `${amplitude.toFixed(2)}%` : '--',
    },
  ];

  const tabs = [
    { key: 'gainers', label: '涨幅榜' },
    { key: 'losers', label: '跌幅榜' },
    { key: 'active', label: '成交榜' },
    { key: 'amplitude', label: '振幅榜' },
  ];

  return (
    <div className={styles.marketMover}>
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as any)}
          items={tabs}
          tabBarExtraContent={
            <Space>
              <Text type="secondary">自动刷新（5秒）</Text>
              <a onClick={refresh}>手动刷新</a>
            </Space>
          }
        />

        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          rowKey="symbol"
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 只股票`,
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default MarketMover;
