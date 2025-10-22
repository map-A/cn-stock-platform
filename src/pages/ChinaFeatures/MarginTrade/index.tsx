import React, { useState } from 'react';
import { Card, Tabs, Table, Space, Typography, Statistic, Row, Col, DatePicker, Tag, Progress } from 'antd';
import { RiseOutlined, FallOutlined, DollarOutlined, PercentageOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getMarginTradeOverview, getMarginTradeTop } from '@/services/china-features';
import { Line } from '@ant-design/plots';
import { history } from 'umi';
import { formatCurrency, formatPercent, formatNumber } from '@/utils/format';
import type { MarginTradeStock } from '@/typings/china-features';
import dayjs, { Dayjs } from 'dayjs';
import styles from './index.less';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

/**
 * 融资融券页面
 * 展示两融余额、融资买入、融券卖出等数据
 */
const MarginTrade: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  // 获取融资融券概览数据
  const { data: overviewData, loading: overviewLoading } = useRequest(
    () => getMarginTradeOverview({
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
    }),
    {
      refreshDeps: [dateRange],
    },
  );

  // 获取融资融券TOP榜单
  const { data: topData, loading: topLoading } = useRequest(
    () => getMarginTradeTop({
      sortBy: 'marginBalance',
      limit: 50,
    }),
  );

  // 处理股票点击
  const handleStockClick = (symbol: string) => {
    history.push(`/stock/${symbol}`);
  };

  // 图表配置
  const chartConfig = {
    data: overviewData?.map(item => [
      { date: item.date, value: item.marginBalance / 100000000, type: '融资余额' },
      { date: item.date, value: item.shortBalance / 100000000, type: '融券余额' },
    ]).flat() || [],
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    color: ['#f5222d', '#52c41a'],
    xAxis: {
      type: 'time',
      tickCount: 10,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${v}亿`,
      },
    },
    tooltip: {
      formatter: (datum: any) => ({
        name: datum.type,
        value: `${datum.value.toFixed(2)}亿元`,
      }),
    },
  };

  // TOP榜单列定义
  const topColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 60,
      fixed: 'left' as const,
      render: (rank: number) => {
        const color = rank <= 3 ? 'red' : rank <= 10 ? 'orange' : 'default';
        return <Tag color={color}>{rank}</Tag>;
      },
    },
    {
      title: '股票',
      dataIndex: 'symbol',
      width: 200,
      fixed: 'left' as const,
      render: (_: string, record: MarginTradeStock) => (
        <Space direction="vertical" size={0}>
          <a onClick={() => handleStockClick(record.symbol)} style={{ fontWeight: 500 }}>
            {record.name}
          </a>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.symbol}
          </Text>
        </Space>
      ),
    },
    {
      title: '最新价',
      dataIndex: 'price',
      width: 100,
      align: 'right' as const,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      width: 100,
      align: 'right' as const,
      render: (percent: number) => {
        const isPositive = percent >= 0;
        return (
          <Text style={{ color: isPositive ? '#f5222d' : '#52c41a', fontWeight: 500 }}>
            {isPositive ? '+' : ''}{formatPercent(percent)}
          </Text>
        );
      },
    },
    {
      title: '融资余额',
      dataIndex: 'marginBalance',
      width: 120,
      align: 'right' as const,
      sorter: (a: MarginTradeStock, b: MarginTradeStock) => a.marginBalance - b.marginBalance,
      render: (balance: number) => (
        <Text strong style={{ color: '#f5222d' }}>
          {formatCurrency(balance)}
        </Text>
      ),
    },
    {
      title: '融资买入额',
      dataIndex: 'marginBuy',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: '融资偿还额',
      dataIndex: 'marginRepay',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: '融资净买入',
      dataIndex: 'marginNet',
      width: 120,
      align: 'right' as const,
      sorter: (a: MarginTradeStock, b: MarginTradeStock) => a.marginNet - b.marginNet,
      render: (amount: number) => {
        const isPositive = amount >= 0;
        return (
          <Text strong style={{ color: isPositive ? '#f5222d' : '#52c41a' }}>
            {isPositive ? '+' : ''}{formatCurrency(amount)}
          </Text>
        );
      },
    },
    {
      title: '融券余额',
      dataIndex: 'shortBalance',
      width: 120,
      align: 'right' as const,
      render: (balance: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          {formatCurrency(balance)}
        </Text>
      ),
    },
    {
      title: '融资占比',
      dataIndex: 'marginRatio',
      width: 120,
      align: 'right' as const,
      render: (ratio: number) => (
        <Progress
          percent={ratio}
          size="small"
          strokeColor="#f5222d"
          format={() => formatPercent(ratio)}
        />
      ),
    },
  ];

  // 统计数据
  const latestData = overviewData?.[overviewData.length - 1];
  const prevData = overviewData?.[overviewData.length - 2];

  return (
    <div className={styles.container}>
      {/* 页面标题 */}
      <div className={styles.header}>
        <Title level={2}>
          <DollarOutlined style={{ color: '#faad14' }} /> 融资融券
        </Title>
        <Text type="secondary">追踪两融余额变化，洞察市场杠杆情绪</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="融资余额"
              value={latestData ? latestData.marginBalance / 100000000 : 0}
              precision={2}
              suffix="亿"
              valueStyle={{ color: '#f5222d' }}
            />
            {prevData && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                较前一日 {latestData!.marginBalance >= prevData.marginBalance ? '+' : ''}
                {((latestData!.marginBalance - prevData.marginBalance) / 100000000).toFixed(2)}亿
              </Text>
            )}
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="融券余额"
              value={latestData ? latestData.shortBalance / 100000000 : 0}
              precision={2}
              suffix="亿"
              valueStyle={{ color: '#52c41a' }}
            />
            {prevData && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                较前一日 {latestData!.shortBalance >= prevData.shortBalance ? '+' : ''}
                {((latestData!.shortBalance - prevData.shortBalance) / 100000000).toFixed(2)}亿
              </Text>
            )}
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="两融总额"
              value={latestData ? (latestData.marginBalance + latestData.shortBalance) / 100000000 : 0}
              precision={2}
              suffix="亿"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="融资买入额"
              value={latestData ? latestData.marginBuy / 100000000 : 0}
              precision={2}
              suffix="亿"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主内容卡片 */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'overview', label: '市场概览' },
            { key: 'top-balance', label: '余额排行' },
            { key: 'top-buy', label: '买入排行' },
            { key: 'top-ratio', label: '占比排行' },
          ]}
        />

        {activeTab === 'overview' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Text strong>时间范围：</Text>
                <RangePicker
                  value={dateRange}
                  onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                  format="YYYY-MM-DD"
                />
              </Space>
            </div>
            <Line {...chartConfig} height={400} loading={overviewLoading} />
          </div>
        )}

        {activeTab !== 'overview' && (
          <Table
            dataSource={topData}
            columns={topColumns}
            loading={topLoading}
            rowKey="symbol"
            scroll={{ x: 1600 }}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default MarginTrade;
