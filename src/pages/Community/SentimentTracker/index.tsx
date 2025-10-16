/**
 * @file 情绪追踪器页面
 * @description 追踪社交媒体上热门和最看涨的股票
 */

import React, { useState } from 'react';
import { Card, Table, Tag, Space, Typography, Spin, Select } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  FireOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { sentimentService } from '@/services/community';
import type { SentimentStock } from '@/services/community';
import type { ColumnsType } from 'antd/es/table';
import { formatNumber, formatMarketCap } from '@/utils/format';
import SentimentChart from './components/SentimentChart';
import styles from './index.module.less';

const { Text, Link } = Typography;
const { Option } = Select;

/**
 * 情绪追踪器页面
 */
const SentimentTracker: React.FC = () => {
  const [sortBy, setSortBy] = useState<'sentiment' | 'mentions' | 'change'>('sentiment');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // 获取情绪追踪数据
  const { data, loading } = useRequest(
    () =>
      sentimentService.getSentimentTracker({
        sortBy,
        page: currentPage,
        size: pageSize,
      }),
    {
      refreshDeps: [sortBy, currentPage, pageSize],
      pollingInterval: 30000, // 30秒刷新一次
    },
  );

  /**
   * 渲染情绪分数
   */
  const renderSentiment = (sentiment: number) => {
    let color = '#d9d9d9';
    let text = '中性';

    if (sentiment >= 75) {
      color = '#22c55e';
      text = '非常看涨';
    } else if (sentiment >= 60) {
      color = '#84cc16';
      text = '看涨';
    } else if (sentiment >= 40) {
      color = '#facc15';
      text = '中性';
    } else if (sentiment >= 25) {
      color = '#f97316';
      text = '看跌';
    } else {
      color = '#ee5365';
      text = '非常看跌';
    }

    return (
      <Space>
        <div
          className={styles.sentimentBar}
          style={{
            width: '80px',
            background: `linear-gradient(90deg, ${color} ${sentiment}%, #f0f0f0 ${sentiment}%)`,
          }}
        >
          <span style={{ color: sentiment > 50 ? '#fff' : '#000' }}>
            {sentiment.toFixed(0)}%
          </span>
        </div>
        <Tag color={color} style={{ margin: 0 }}>
          {text}
        </Tag>
      </Space>
    );
  };

  // 表格列配置
  const columns: ColumnsType<SentimentStock> = [
    {
      title: '股票',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 150,
      fixed: 'left',
      render: (symbol: string, record) => (
        <Space direction="vertical" size={0}>
          <Link href={`/stock/${symbol}`} strong>
            {symbol}
          </Link>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.name}
          </Text>
        </Space>
      ),
    },
    {
      title: '市值',
      dataIndex: 'marketCap',
      key: 'marketCap',
      width: 120,
      sorter: (a, b) => a.marketCap - b.marketCap,
      render: (marketCap: number) => (
        <Text>{formatMarketCap(marketCap)}</Text>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => (
        <Text strong>${price.toFixed(2)}</Text>
      ),
    },
    {
      title: '涨跌幅',
      dataIndex: 'changesPercentage',
      key: 'changesPercentage',
      width: 120,
      sorter: (a, b) => a.changesPercentage - b.changesPercentage,
      render: (change: number) => {
        const isPositive = change > 0;
        return (
          <Space size={4}>
            {isPositive ? (
              <ArrowUpOutlined style={{ color: '#22c55e' }} />
            ) : (
              <ArrowDownOutlined style={{ color: '#ee5365' }} />
            )}
            <Text
              style={{
                color: isPositive ? '#22c55e' : '#ee5365',
                fontWeight: 600,
              }}
            >
              {Math.abs(change).toFixed(2)}%
            </Text>
          </Space>
        );
      },
    },
    {
      title: '情绪分数',
      dataIndex: 'sentiment',
      key: 'sentiment',
      width: 200,
      sorter: (a, b) => a.sentiment - b.sentiment,
      render: (sentiment: number) => renderSentiment(sentiment),
    },
    {
      title: '提及次数',
      dataIndex: 'mentions',
      key: 'mentions',
      width: 120,
      sorter: (a, b) => (a.mentions || 0) - (b.mentions || 0),
      render: (mentions?: number) => (
        <Space size={4}>
          <MessageOutlined />
          <Text>{formatNumber(mentions || 0)}</Text>
        </Space>
      ),
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      width: 120,
      sorter: (a, b) => a.volume - b.volume,
      render: (volume: number) => (
        <Text>{formatNumber(volume)}</Text>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '情绪追踪器',
        subTitle: '实时追踪社交媒体热门股票和市场情绪',
        breadcrumb: {
          items: [
            { title: '首页', path: '/' },
            { title: '情绪追踪器' },
          ],
        },
      }}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        {/* 信息提示 */}
        <Card bordered={false}>
          <Space size={8}>
            <FireOutlined style={{ fontSize: 18, color: '#ff4d4f' }} />
            <Text>
              我们实时更新数据，为您提供 Twitter 和 StockTwits 上讨论最多的热门股票和最看涨的股票
            </Text>
          </Space>
        </Card>

        {/* 数据表格 */}
        <Card
          bordered={false}
          title={
            <Space size={16}>
              <Text strong style={{ fontSize: 16 }}>
                {data?.total?.toLocaleString() || 0} 支股票
              </Text>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 150 }}
              >
                <Option value="sentiment">按情绪排序</Option>
                <Option value="mentions">按提及次数</Option>
                <Option value="change">按涨跌幅</Option>
              </Select>
            </Space>
          }
        >
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={data?.data || []}
              rowKey="symbol"
              pagination={{
                current: currentPage,
                pageSize,
                total: data?.total || 0,
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size || 20);
                },
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
                pageSizeOptions: [20, 50, 100],
              }}
              scroll={{ x: 1200 }}
            />
          </Spin>
        </Card>

        {/* 情绪图表 */}
        <SentimentChart />
      </Space>
    </PageContainer>
  );
};

export default SentimentTracker;
