import React, { useState, useEffect } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import {
  Card,
  Row,
  Col,
  Tabs,
  Space,
  Button,
  DatePicker,
  Select,
  Table,
  Tag,
  Statistic,
  message,
  Empty,
  Tooltip,
  Progress,
  Typography,
} from 'antd';
import {
  ReloadOutlined,
  SearchOutlined,
  ExportOutlined,
  FileTextOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

// 导入交易记录组件
import TradeHistory from '@/components/Trade/TradeHistory';
import TradeAnalysis from '@/components/Trade/TradeAnalysis';
import ProfitLossReport from '@/components/Trade/ProfitLossReport';
import TradePerformance from '@/components/Trade/TradePerformance';

// 引入API
// import { getTradeRecords, getTradeAnalysis } from '@/services/account';

import './index.less';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 定义数据类型
export interface TradeRecord {
  trade_id: string;
  order_id: string;
  stock_code: string;
  stock_name: string;
  trade_type: 'buy' | 'sell';
  quantity: number;
  price: number;
  amount: number;
  commission: number;
  stamp_duty: number;
  transfer_fee: number;
  total_cost: number;
  trade_time: string;
  account_id: string;
  status: 'filled' | 'partial' | 'cancelled';
  strategy_id?: string;
  strategy_name?: string;
  remarks?: string;
}

export interface TradeStats {
  totalTrades: number;
  totalVolume: number;
  totalCommission: number;
  totalProfitLoss: number;
  profitLossRatio: number;
  winRate: number;
  avgHoldingDays: number;
  maxSingleProfit: number;
  maxSingleLoss: number;
  sharpeRatio: number;
}

const TradePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('history');
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('all');
  
  // 交易数据状态
  const [tradeRecords, setTradeRecords] = useState<TradeRecord[]>([]);
  const [tradeStats, setTradeStats] = useState<TradeStats>({
    totalTrades: 0,
    totalVolume: 0,
    totalCommission: 0,
    totalProfitLoss: 0,
    profitLossRatio: 0,
    winRate: 0,
    avgHoldingDays: 0,
    maxSingleProfit: 0,
    maxSingleLoss: 0,
    sharpeRatio: 0,
  });

  // 模拟数据生成
  const generateMockData = () => {
    const stocks = [
      { code: '000001', name: '平安银行' },
      { code: '000002', name: '万科A' },
      { code: '600036', name: '招商银行' },
      { code: '600519', name: '贵州茅台' },
      { code: '000858', name: '五粮液' },
      { code: '300059', name: '东方财富' },
      { code: '002415', name: '海康威视' },
      { code: '000725', name: '京东方A' },
    ];

    const strategies = ['价值投资', '技术分析', '量化策略', '套利策略', '手动交易'];
    
    const records: TradeRecord[] = [];
    let totalPnL = 0;
    let winCount = 0;
    
    for (let i = 0; i < 100; i++) {
      const stock = stocks[Math.floor(Math.random() * stocks.length)];
      const tradeType = Math.random() > 0.5 ? 'buy' : 'sell';
      const quantity = Math.floor(Math.random() * 1000 + 100);
      const price = 10 + Math.random() * 90;
      const amount = quantity * price;
      const commission = amount * 0.0003;
      const stampDuty = tradeType === 'sell' ? amount * 0.001 : 0;
      const transferFee = amount * 0.00002;
      const totalCost = amount + commission + stampDuty + transferFee;
      
      // 模拟盈亏
      const pnl = (Math.random() - 0.4) * amount * 0.1; // 稍微偏向盈利
      if (pnl > 0) winCount++;
      totalPnL += pnl;
      
      const tradeTime = dayjs()
        .subtract(Math.floor(Math.random() * 30), 'day')
        .subtract(Math.floor(Math.random() * 24), 'hour')
        .subtract(Math.floor(Math.random() * 60), 'minute')
        .format('YYYY-MM-DD HH:mm:ss');

      records.push({
        trade_id: `T${Date.now()}_${i}`,
        order_id: `O${Date.now()}_${i}`,
        stock_code: stock.code,
        stock_name: stock.name,
        trade_type: tradeType,
        quantity,
        price,
        amount,
        commission,
        stamp_duty: stampDuty,
        transfer_fee: transferFee,
        total_cost: totalCost,
        trade_time: tradeTime,
        account_id: `ACC${Math.floor(Math.random() * 3) + 1}`,
        status: Math.random() > 0.1 ? 'filled' : 'partial',
        strategy_id: `ST${Math.floor(Math.random() * 5) + 1}`,
        strategy_name: strategies[Math.floor(Math.random() * strategies.length)],
        remarks: Math.random() > 0.7 ? '备注信息' : undefined,
      });
    }

    const stats: TradeStats = {
      totalTrades: records.length,
      totalVolume: records.reduce((sum, record) => sum + record.amount, 0),
      totalCommission: records.reduce((sum, record) => sum + record.commission + record.stamp_duty + record.transfer_fee, 0),
      totalProfitLoss: totalPnL,
      profitLossRatio: (totalPnL / records.reduce((sum, record) => sum + record.amount, 0)) * 100,
      winRate: (winCount / records.length) * 100,
      avgHoldingDays: 3 + Math.random() * 7,
      maxSingleProfit: Math.max(...records.map(() => Math.random() * 50000)),
      maxSingleLoss: -Math.max(...records.map(() => Math.random() * 30000)),
      sharpeRatio: 0.8 + Math.random() * 0.6,
    };

    return { records, stats };
  };

  // 获取交易数据
  const fetchTradeData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      const { records, stats } = generateMockData();
      setTradeRecords(records);
      setTradeStats(stats);
    } catch (error) {
      message.error('获取交易数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradeData();
  }, [dateRange, selectedAccount, selectedStrategy]);

  // 筛选和控制面板
  const renderControls = () => (
    <Card size="small" className="trade-controls">
      <Row gutter={16} align="middle">
        <Col span={6}>
          <Space>
            <span>时间范围:</span>
            <RangePicker
              value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([
                    dates[0].format('YYYY-MM-DD'),
                    dates[1].format('YYYY-MM-DD'),
                  ]);
                }
              }}
              format="YYYY-MM-DD"
              size="small"
            />
          </Space>
        </Col>
        <Col span={4}>
          <Space>
            <span>账户:</span>
            <Select
              value={selectedAccount}
              onChange={setSelectedAccount}
              style={{ width: 100 }}
              size="small"
            >
              <Option value="all">全部</Option>
              <Option value="ACC1">账户1</Option>
              <Option value="ACC2">账户2</Option>
              <Option value="ACC3">账户3</Option>
            </Select>
          </Space>
        </Col>
        <Col span={4}>
          <Space>
            <span>策略:</span>
            <Select
              value={selectedStrategy}
              onChange={setSelectedStrategy}
              style={{ width: 100 }}
              size="small"
            >
              <Option value="all">全部</Option>
              <Option value="ST1">价值投资</Option>
              <Option value="ST2">技术分析</Option>
              <Option value="ST3">量化策略</Option>
              <Option value="ST4">套利策略</Option>
              <Option value="ST5">手动交易</Option>
            </Select>
          </Space>
        </Col>
        <Col span={10}>
          <Space style={{ float: 'right' }}>
            <Button
              size="small"
              icon={<SearchOutlined />}
              onClick={fetchTradeData}
              loading={loading}
            >
              查询
            </Button>
            <Button
              size="small"
              icon={<ExportOutlined />}
              onClick={() => message.info('导出功能开发中...')}
            >
              导出
            </Button>
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={fetchTradeData}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );

  // 统计概览
  const renderStatistics = () => (
    <Row gutter={16} style={{ marginTop: 16 }}>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title={
              <span>
                总交易笔数
                <Tooltip title="所选时间范围内的总交易笔数">
                  <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                </Tooltip>
              </span>
            }
            value={tradeStats.totalTrades}
            suffix="笔"
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title={
              <span>
                总成交金额
                <Tooltip title="所选时间范围内的总成交金额">
                  <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                </Tooltip>
              </span>
            }
            value={tradeStats.totalVolume}
            precision={2}
            prefix="¥"
            formatter={(value) => `${(Number(value) / 10000).toFixed(2)}万`}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title={
              <span>
                总盈亏
                <Tooltip title="所选时间范围内的总盈亏">
                  <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                </Tooltip>
              </span>
            }
            value={tradeStats.totalProfitLoss}
            precision={2}
            prefix="¥"
            valueStyle={{ color: tradeStats.totalProfitLoss >= 0 ? '#3f8600' : '#cf1322' }}
            formatter={(value) => `${(Number(value) / 10000).toFixed(2)}万`}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card size="small">
          <Statistic
            title={
              <span>
                胜率
                <Tooltip title="盈利交易占总交易的比例">
                  <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                </Tooltip>
              </span>
            }
            value={tradeStats.winRate}
            precision={1}
            suffix="%"
            valueStyle={{ color: tradeStats.winRate >= 60 ? '#3f8600' : '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );

  // Tab标签页内容
  const tabItems = [
    {
      key: 'history',
      label: '交易历史',
      children: (
        <TradeHistory
          records={tradeRecords}
          loading={loading}
          onRefresh={fetchTradeData}
        />
      ),
    },
    {
      key: 'analysis',
      label: '交易分析',
      children: (
        <TradeAnalysis
          records={tradeRecords}
          stats={tradeStats}
          loading={loading}
        />
      ),
    },
    {
      key: 'profit-loss',
      label: '盈亏报表',
      children: (
        <ProfitLossReport
          records={tradeRecords}
          dateRange={dateRange}
          loading={loading}
        />
      ),
    },
    {
      key: 'performance',
      label: '绩效评估',
      children: (
        <TradePerformance
          stats={tradeStats}
          records={tradeRecords}
          loading={loading}
        />
      ),
    },
  ];

  return (
    <PageContainer
      title="交易记录"
      extra={[
        <Button key="refresh" icon={<ReloadOutlined />} onClick={fetchTradeData} loading={loading}>
          刷新数据
        </Button>,
        <Button key="export" icon={<ExportOutlined />} onClick={() => message.info('导出功能开发中...')}>
          导出报告
        </Button>,
      ]}
    >
      {renderControls()}
      {renderStatistics()}
      
      <Card style={{ marginTop: 16 }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="small"
        />
      </Card>
    </PageContainer>
  );
};

export default TradePage;