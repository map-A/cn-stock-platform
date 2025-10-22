/**
 * 回测结果展示组件 (简化版)
 * 
 * 功能特性:
 * - 性能指标展示
 * - 图表可视化
 * - 交易明细
 * - 风险分析
 */

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tabs,
  Space,
  Tag,
  Typography,
  Empty,
  Spin,
} from 'antd';
import {
  LineChartOutlined,
  BarChartOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Line } from '@ant-design/plots';
import type { BacktestResults } from '@/types/backtest';
import { formatNumber, formatPercent, formatCurrency } from '@/utils/format';
import moment from 'moment';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface BacktestResultsProps {
  backtestId: string;
  results: BacktestResults;
  loading?: boolean;
}

const BacktestResultsComponent: React.FC<BacktestResultsProps> = ({
  backtestId,
  results,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>回测结果加载中...</div>
      </div>
    );
  }

  if (!results) {
    return (
      <Empty 
        description="暂无回测结果"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const { performance, trades, risk, timeSeries } = results;

  // 性能指标卡片
  const PerformanceCards = () => (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card>
          <Statistic
            title="总收益率"
            value={performance.totalReturn}
            precision={2}
            suffix="%"
            valueStyle={{ 
              color: performance.totalReturn >= 0 ? '#3f8600' : '#cf1322' 
            }}
            prefix={
              performance.totalReturn >= 0 ? <RiseOutlined /> : <FallOutlined />
            }
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="年化收益率"
            value={performance.annualizedReturn}
            precision={2}
            suffix="%"
            valueStyle={{ 
              color: performance.annualizedReturn >= 0 ? '#3f8600' : '#cf1322' 
            }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="夏普比率"
            value={performance.sharpeRatio}
            precision={2}
            valueStyle={{ 
              color: performance.sharpeRatio >= 1 ? '#3f8600' : '#cf1322' 
            }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="最大回撤"
            value={Math.abs(performance.maxDrawdown)}
            precision={2}
            suffix="%"
            valueStyle={{ color: '#cf1322' }}
            prefix={<FallOutlined />}
          />
        </Card>
      </Col>
      
      <Col span={6}>
        <Card>
          <Statistic
            title="波动率"
            value={performance.volatility}
            precision={2}
            suffix="%"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="胜率"
            value={performance.winRate}
            precision={1}
            suffix="%"
            valueStyle={{ 
              color: performance.winRate >= 50 ? '#3f8600' : '#cf1322' 
            }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="盈亏比"
            value={performance.profitFactor}
            precision={2}
            valueStyle={{ 
              color: performance.profitFactor >= 1 ? '#3f8600' : '#cf1322' 
            }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="交易次数"
            value={trades.totalTrades}
            suffix="笔"
          />
        </Card>
      </Col>
    </Row>
  );

  // 收益曲线图
  const EquityCurve = () => {
    const data = timeSeries.equity.map((item, index) => {
      const result = [{ date: item.date, value: item.value, type: '策略净值' }];
      if (timeSeries.benchmark?.[index]) {
        result.push({ 
          date: item.date, 
          value: timeSeries.benchmark[index].value, 
          type: '基准净值' 
        });
      }
      return result;
    }).flat();

    const config = {
      data,
      xField: 'date',
      yField: 'value',
      seriesField: 'type',
      smooth: true,
      animation: {
        appear: {
          animation: 'path-in',
          duration: 2000,
        },
      },
      legend: {
        position: 'top-right' as const,
      },
      tooltip: {
        formatter: (datum: any) => ({
          name: datum.type,
          value: formatNumber(datum.value, 4),
        }),
      },
    };

    return <Line {...config} />;
  };

  // 交易记录表格
  const TradesTable = () => {
    const columns = [
      {
        title: '股票代码',
        dataIndex: 'symbol',
        key: 'symbol',
        render: (symbol: string) => <Text code>{symbol}</Text>,
      },
      {
        title: '交易类型',
        dataIndex: 'side',
        key: 'side',
        render: (side: 'buy' | 'sell') => (
          <Tag color={side === 'buy' ? 'green' : 'red'}>
            {side === 'buy' ? '买入' : '卖出'}
          </Tag>
        ),
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        key: 'quantity',
        render: (quantity: number) => formatNumber(quantity, 0),
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render: (price: number) => formatCurrency(price),
      },
      {
        title: '盈亏',
        dataIndex: 'pnl',
        key: 'pnl',
        render: (pnl: number) => (
          <Text style={{ color: pnl >= 0 ? '#3f8600' : '#cf1322' }}>
            {formatCurrency(pnl)}
          </Text>
        ),
      },
      {
        title: '手续费',
        dataIndex: 'commission',
        key: 'commission',
        render: (commission: number) => formatCurrency(commission),
      },
      {
        title: '交易时间',
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (timestamp: string) => moment(timestamp).format('YYYY-MM-DD HH:mm:ss'),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={timeSeries.trades}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showTotal: (total) => `共 ${total} 笔交易`,
        }}
        scroll={{ x: 1200 }}
      />
    );
  };

  // 风险指标
  const RiskMetrics = () => (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title="风险指标" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>VaR (95%)</span>
              <Text strong>{formatPercent(risk.var95)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>CVaR (95%)</span>
              <Text strong>{formatPercent(risk.cvar95)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Beta</span>
              <Text strong>{formatNumber(risk.beta || 0, 2)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Alpha</span>
              <Text strong>{formatPercent(risk.alpha || 0)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>信息比率</span>
              <Text strong>{formatNumber(risk.informationRatio || 0, 2)}</Text>
            </div>
          </Space>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="交易统计" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>总交易数</span>
              <Text strong>{trades.totalTrades}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>盈利交易</span>
              <Text strong style={{ color: '#3f8600' }}>{trades.winningTrades}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>亏损交易</span>
              <Text strong style={{ color: '#cf1322' }}>{trades.losingTrades}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>最大单笔盈利</span>
              <Text strong style={{ color: '#3f8600' }}>
                {formatCurrency(trades.largestWin)}
              </Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>最大单笔亏损</span>
              <Text strong style={{ color: '#cf1322' }}>
                {formatCurrency(trades.largestLoss)}
              </Text>
            </div>
          </Space>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>回测结果分析</Title>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={
            <span>
              <TrophyOutlined />
              概览
            </span>
          } 
          key="overview"
        >
          <PerformanceCards />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <LineChartOutlined />
              收益曲线
            </span>
          } 
          key="equity"
        >
          <Card title="净值曲线" style={{ marginTop: 16 }}>
            <EquityCurve />
          </Card>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <BarChartOutlined />
              交易记录
            </span>
          } 
          key="trades"
        >
          <TradesTable />
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <InfoCircleOutlined />
              风险分析
            </span>
          } 
          key="risk"
        >
          <RiskMetrics />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BacktestResultsComponent;