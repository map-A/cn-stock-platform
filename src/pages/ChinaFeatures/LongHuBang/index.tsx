import React, { useState } from 'react';
import { Card, Tabs, DatePicker, Table, Tag, Space, Typography, Statistic, Row, Col } from 'antd';
import { RiseOutlined, FallOutlined, FireOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getLongHuBangList } from '@/services/china-features';
import { history } from '@umijs/max';
import { formatCurrency, formatPercent } from '@/utils/format';
import type { LongHuBangRecord } from '@/typings/china-features';
import dayjs, { Dayjs } from 'dayjs';
import styles from './index.less';

const { Title, Text } = Typography;

/**
 * 龙虎榜页面
 * 展示上榜股票的大单交易数据、机构席位、游资动向
 */
const LongHuBang: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

  // 获取龙虎榜列表
  const { data, loading } = useRequest(
    () => getLongHuBangList({
      date: selectedDate.format('YYYY-MM-DD'),
      type: activeTab,
    }),
    {
      refreshDeps: [selectedDate, activeTab],
    },
  );

  // 处理股票点击
  const handleStockClick = (symbol: string) => {
    history.push(`/stock/${symbol}`);
  };

  // 表格列定义
  const columns = [
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
      render: (_: string, record: LongHuBangRecord) => (
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
      title: '涨跌幅',
      dataIndex: 'changePercent',
      width: 100,
      align: 'right' as const,
      sorter: (a: LongHuBangRecord, b: LongHuBangRecord) => a.changePercent - b.changePercent,
      render: (percent: number) => {
        const isPositive = percent >= 0;
        return (
          <Space>
            {isPositive ? <RiseOutlined style={{ color: '#f5222d' }} /> : <FallOutlined style={{ color: '#52c41a' }} />}
            <Text style={{ color: isPositive ? '#f5222d' : '#52c41a', fontWeight: 500 }}>
              {formatPercent(percent)}
            </Text>
          </Space>
        );
      },
    },
    {
      title: '收盘价',
      dataIndex: 'closePrice',
      width: 100,
      align: 'right' as const,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '上榜原因',
      dataIndex: 'reason',
      width: 180,
      render: (reason: string) => (
        <Tag color="blue">{reason}</Tag>
      ),
    },
    {
      title: '买入金额',
      dataIndex: 'buyAmount',
      width: 120,
      align: 'right' as const,
      sorter: (a: LongHuBangRecord, b: LongHuBangRecord) => a.buyAmount - b.buyAmount,
      render: (amount: number) => (
        <Text strong style={{ color: '#f5222d' }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: '卖出金额',
      dataIndex: 'sellAmount',
      width: 120,
      align: 'right' as const,
      sorter: (a: LongHuBangRecord, b: LongHuBangRecord) => a.sellAmount - b.sellAmount,
      render: (amount: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: '净额',
      dataIndex: 'netAmount',
      width: 120,
      align: 'right' as const,
      sorter: (a: LongHuBangRecord, b: LongHuBangRecord) => a.netAmount - b.netAmount,
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
      title: '机构参与',
      dataIndex: 'institutionCount',
      width: 100,
      align: 'center' as const,
      render: (count: number) => {
        if (count > 0) {
          return <Tag color="purple" icon={<FireOutlined />}>{count}家</Tag>;
        }
        return <Text type="secondary">-</Text>;
      },
    },
    {
      title: '成交额占比',
      dataIndex: 'amountRatio',
      width: 110,
      align: 'right' as const,
      render: (ratio: number) => formatPercent(ratio),
    },
  ];

  // 统计数据
  const statistics = {
    total: data?.length || 0,
    avgChangePercent: data ? data.reduce((sum, item) => sum + item.changePercent, 0) / data.length : 0,
    totalBuyAmount: data ? data.reduce((sum, item) => sum + item.buyAmount, 0) : 0,
    totalSellAmount: data ? data.reduce((sum, item) => sum + item.sellAmount, 0) : 0,
  };

  return (
    <div className={styles.container}>
      {/* 页面标题 */}
      <div className={styles.header}>
        <Title level={2}>
          <FireOutlined style={{ color: '#ff4d4f' }} /> 龙虎榜
        </Title>
        <Text type="secondary">追踪主力资金动向，洞察机构博弈</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="上榜股票数"
              value={statistics.total}
              suffix="只"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均涨跌幅"
              value={statistics.avgChangePercent}
              precision={2}
              suffix="%"
              valueStyle={{ color: statistics.avgChangePercent >= 0 ? '#f5222d' : '#52c41a' }}
              prefix={statistics.avgChangePercent >= 0 ? <RiseOutlined /> : <FallOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="买入总额"
              value={statistics.totalBuyAmount / 100000000}
              precision={2}
              suffix="亿"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="卖出总额"
              value={statistics.totalSellAmount / 100000000}
              precision={2}
              suffix="亿"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主内容卡片 */}
      <Card>
        {/* 日期选择器 */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Text strong>选择日期：</Text>
            <DatePicker
              value={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              disabledDate={(current) => current && current > dayjs().endOf('day')}
              format="YYYY-MM-DD"
            />
          </Space>
        </div>

        {/* 分类标签 */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: '全部' },
            { key: 'rise-limit', label: '涨停板' },
            { key: 'fall-limit', label: '跌停板' },
            { key: 'large-trade', label: '大额交易' },
            { key: 'institution', label: '机构参与' },
            { key: 'hot-money', label: '游资龙虎' },
          ]}
        />

        {/* 数据表格 */}
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          rowKey="symbol"
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default LongHuBang;
