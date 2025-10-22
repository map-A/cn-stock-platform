import React, { useState } from 'react';
import { Card, Tabs, Table, Space, Typography, Statistic, Row, Col, DatePicker, Tag } from 'antd';
import { RiseOutlined, FallOutlined, SwapOutlined, GlobalOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getNorthMoneyFlow, getNorthMoneyTop } from '@/services/china-features';
import { Line } from '@ant-design/plots';
import { history } from 'umi';
import { formatCurrency, formatPercent } from '@/utils/format';
import type { NorthMoneyFlow, NorthMoneyStock } from '@/typings/china-features';
import dayjs, { Dayjs } from 'dayjs';
import styles from './index.less';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

/**
 * 北向资金（沪深港通）页面
 * 追踪外资流入流出情况
 */
const NorthMoney: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('flow');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);

  // 获取北向资金流向数据
  const { data: flowData, loading: flowLoading } = useRequest(
    () => getNorthMoneyFlow({
      startDate: dateRange[0].format('YYYY-MM-DD'),
      endDate: dateRange[1].format('YYYY-MM-DD'),
    }),
    {
      refreshDeps: [dateRange],
    },
  );

  // 获取北向资金持股TOP榜单
  const { data: topData, loading: topLoading } = useRequest(
    () => getNorthMoneyTop({
      sortBy: 'netAmount',
      limit: 50,
    }),
  );

  // 处理股票点击
  const handleStockClick = (symbol: string) => {
    history.push(`/stock/${symbol}`);
  };

  // 图表配置
  const chartConfig = {
    data: flowData?.map(item => ({
      date: item.date,
      value: item.netAmount / 100000000,
      type: '净流入',
    })) || [],
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    color: ['#1890ff'],
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
    areaStyle: {
      fillOpacity: 0.2,
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
      render: (_: string, record: NorthMoneyStock) => (
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
      sorter: (a: NorthMoneyStock, b: NorthMoneyStock) => a.changePercent - b.changePercent,
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
      title: '持股数量(万股)',
      dataIndex: 'holdingAmount',
      width: 140,
      align: 'right' as const,
      sorter: (a: NorthMoneyStock, b: NorthMoneyStock) => a.holdingAmount - b.holdingAmount,
      render: (amount: number) => (amount / 10000).toFixed(2),
    },
    {
      title: '持股市值',
      dataIndex: 'holdingValue',
      width: 120,
      align: 'right' as const,
      sorter: (a: NorthMoneyStock, b: NorthMoneyStock) => a.holdingValue - b.holdingValue,
      render: (value: number) => (
        <Text strong>{formatCurrency(value)}</Text>
      ),
    },
    {
      title: '占流通股比',
      dataIndex: 'holdingPercent',
      width: 110,
      align: 'right' as const,
      sorter: (a: NorthMoneyStock, b: NorthMoneyStock) => a.holdingPercent - b.holdingPercent,
      render: (percent: number) => formatPercent(percent),
    },
    {
      title: '今日净流入',
      dataIndex: 'todayNetAmount',
      width: 120,
      align: 'right' as const,
      sorter: (a: NorthMoneyStock, b: NorthMoneyStock) => a.todayNetAmount - b.todayNetAmount,
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
      title: '5日净流入',
      dataIndex: 'fiveDayNetAmount',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => {
        const isPositive = amount >= 0;
        return (
          <Text style={{ color: isPositive ? '#f5222d' : '#52c41a' }}>
            {isPositive ? '+' : ''}{formatCurrency(amount)}
          </Text>
        );
      },
    },
  ];

  // 统计数据
  const latestFlow = flowData?.[flowData.length - 1];
  const totalNetAmount = flowData?.reduce((sum, item) => sum + item.netAmount, 0) || 0;

  return (
    <div className={styles.container}>
      {/* 页面标题 */}
      <div className={styles.header}>
        <Title level={2}>
          <GlobalOutlined style={{ color: '#1890ff' }} /> 北向资金
        </Title>
        <Text type="secondary">追踪外资通过沪深港通流入的资金动向</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日净流入"
              value={latestFlow ? latestFlow.netAmount / 100000000 : 0}
              precision={2}
              suffix="亿"
              valueStyle={{ color: (latestFlow?.netAmount || 0) >= 0 ? '#f5222d' : '#52c41a' }}
              prefix={(latestFlow?.netAmount || 0) >= 0 ? <RiseOutlined /> : <FallOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="期间累计净流入"
              value={totalNetAmount / 100000000}
              precision={2}
              suffix="亿"
              valueStyle={{ color: totalNetAmount >= 0 ? '#f5222d' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="沪股通净流入"
              value={latestFlow ? latestFlow.shNetAmount / 100000000 : 0}
              precision={2}
              suffix="亿"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="深股通净流入"
              value={latestFlow ? latestFlow.szNetAmount / 100000000 : 0}
              precision={2}
              suffix="亿"
              valueStyle={{ color: '#52c41a' }}
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
            { key: 'flow', label: '资金流向' },
            { key: 'top', label: '持股排行' },
            { key: 'inflow', label: '净流入排行' },
            { key: 'outflow', label: '净流出排行' },
          ]}
        />

        {activeTab === 'flow' && (
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
            <Line {...chartConfig} height={400} loading={flowLoading} />
          </div>
        )}

        {activeTab !== 'flow' && (
          <Table
            dataSource={topData}
            columns={topColumns}
            loading={topLoading}
            rowKey="symbol"
            scroll={{ x: 1300 }}
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

export default NorthMoney;
