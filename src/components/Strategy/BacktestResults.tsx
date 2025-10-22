/**
 * 回测结果组件
 * 
 * 功能特性:
 * - 回测结果概览
 * - 性能指标展示
 * - 收益曲线图表
 * - 交易记录分析
 * - 风险指标分析
 * - 详细报告导出
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Tabs,
  Typography,
  Progress,
  Alert,
  Tooltip,
  Divider,
  message,
  Empty,
  Spin,
} from 'antd';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  RiseOutlined,
  FallOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  BarChartOutlined,
  PieChartOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { getBacktestResult, getBacktestTrades } from '@/services/strategy';
import type { BacktestResult, BacktestTrade, PerformanceMetrics } from '@/types/strategy';
import './BacktestResults.less';

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

export interface BacktestResultsProps {
  backtestId: string;
  strategyId: string;
  onExport?: (backtestId: string) => void;
}

const BacktestResults: React.FC<BacktestResultsProps> = ({
  backtestId,
  strategyId,
  onExport,
}) => {
  const [loading, setLoading] = useState(false);
  const [backtestData, setBacktestData] = useState<BacktestResult | null>(null);
  const [trades, setTrades] = useState<BacktestTrade[]>([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  /**
   * 加载回测结果
   */
  const loadBacktestResults = async () => {
    try {
      setLoading(true);
      const [resultData, tradesData] = await Promise.all([
        getBacktestResult(strategyId, backtestId),
        getBacktestTrades(strategyId, backtestId),
      ]);
      setBacktestData(resultData);
      setTrades(tradesData);
    } catch (error) {
      console.error('加载回测结果失败:', error);
      message.error('加载回测结果失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 计算额外指标
   */
  const calculatedMetrics = useMemo(() => {
    if (!backtestData || !trades.length) return null;

    const { performance } = backtestData;
    const winningTrades = trades.filter(trade => trade.pnl > 0);
    const losingTrades = trades.filter(trade => trade.pnl < 0);
    
    return {
      winRate: (winningTrades.length / trades.length) * 100,
      avgWin: winningTrades.length ? winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length : 0,
      avgLoss: losingTrades.length ? losingTrades.reduce((sum, trade) => sum + Math.abs(trade.pnl), 0) / losingTrades.length : 0,
      profitFactor: losingTrades.length ? 
        Math.abs(winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / losingTrades.reduce((sum, trade) => sum + trade.pnl, 0)) : 
        Infinity,
      totalTrades: trades.length,
      longestWinStreak: calculateLongestStreak(trades, true),
      longestLossStreak: calculateLongestStreak(trades, false),
    };
  }, [backtestData, trades]);

  /**
   * 计算最长连胜/连败
   */
  const calculateLongestStreak = (trades: BacktestTrade[], isWin: boolean): number => {
    let maxStreak = 0;
    let currentStreak = 0;
    
    trades.forEach(trade => {
      if ((isWin && trade.pnl > 0) || (!isWin && trade.pnl < 0)) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  };

  /**
   * 准备收益曲线数据
   */
  const equityCurveData = useMemo(() => {
    if (!backtestData?.dailyReturns) return [];
    
    let cumulativeReturn = 0;
    const initialCapital = backtestData.parameters.capital;
    
    return backtestData.dailyReturns.map((dailyReturn, index) => {
      cumulativeReturn += dailyReturn.return;
      return {
        date: dailyReturn.date,
        equity: initialCapital * (1 + cumulativeReturn),
        return: cumulativeReturn * 100,
        drawdown: dailyReturn.drawdown * 100,
      };
    });
  }, [backtestData]);

  /**
   * 准备月度收益数据
   */
  const monthlyReturnsData = useMemo(() => {
    if (!backtestData?.dailyReturns) return [];
    
    const monthlyData: { [key: string]: number } = {};
    
    backtestData.dailyReturns.forEach(daily => {
      const month = daily.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += daily.return;
    });
    
    return Object.entries(monthlyData).map(([month, return_]) => ({
      month,
      return: return_ * 100,
      color: return_ >= 0 ? '#52c41a' : '#ff4d4f',
    }));
  }, [backtestData]);

  /**
   * 交易记录表格列配置
   */
  const tradesColumns = [
    {
      title: '开仓时间',
      dataIndex: 'entryTime',
      key: 'entryTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '平仓时间',
      dataIndex: 'exitTime',
      key: 'exitTime',
      render: (time: string) => time ? new Date(time).toLocaleString() : '-',
    },
    {
      title: '方向',
      dataIndex: 'side',
      key: 'side',
      render: (side: string) => (
        <Tag color={side === 'long' ? 'green' : 'red'}>
          {side === 'long' ? '做多' : '做空'}
        </Tag>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => quantity.toFixed(4),
    },
    {
      title: '开仓价',
      dataIndex: 'entryPrice',
      key: 'entryPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: '平仓价',
      dataIndex: 'exitPrice',
      key: 'exitPrice',
      render: (price: number) => price ? `$${price.toFixed(2)}` : '-',
    },
    {
      title: '盈亏',
      dataIndex: 'pnl',
      key: 'pnl',
      render: (pnl: number) => (
        <Text type={pnl >= 0 ? 'success' : 'danger'}>
          {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
        </Text>
      ),
    },
    {
      title: '收益率',
      dataIndex: 'returnRate',
      key: 'returnRate',
      render: (rate: number) => (
        <Text type={rate >= 0 ? 'success' : 'danger'}>
          {rate >= 0 ? '+' : ''}{(rate * 100).toFixed(2)}%
        </Text>
      ),
    },
  ];

  /**
   * 导出报告
   */
  const handleExport = () => {
    onExport?.(backtestId);
    message.success('报告导出成功');
  };

  /**
   * 初始化
   */
  useEffect(() => {
    if (backtestId && strategyId) {
      loadBacktestResults();
    }
  }, [backtestId, strategyId]);

  if (loading) {
    return (
      <div className="backtest-results-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!backtestData) {
    return (
      <Empty
        description="暂无回测结果"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const { performance } = backtestData;

  return (
    <div className="backtest-results">
      {/* 基本信息 */}
      <Card size="small" className="result-header">
        <Row align="middle" justify="space-between">
          <Col>
            <Space>
              <Title level={4} style={{ margin: 0 }}>
                回测结果 - {backtestData.name}
              </Title>
              <Tag color={performance.totalReturn >= 0 ? 'green' : 'red'}>
                {performance.totalReturn >= 0 ? '盈利' : '亏损'}
              </Tag>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出报告
              </Button>
            </Space>
          </Col>
        </Row>
        
        <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
          回测周期: {backtestData.startTime} ~ {backtestData.endTime}
        </Paragraph>
      </Card>

      <Tabs activeKey={selectedTab} onChange={setSelectedTab}>
        {/* 概览 */}
        <TabPane tab="概览" key="overview">
          <Row gutter={[16, 16]}>
            {/* 核心指标 */}
            <Col span={24}>
              <Card title="核心业绩指标" size="small">
                <Row gutter={[16, 16]}>
                  <Col xs={12} sm={8} md={6}>
                    <Statistic
                      title="总收益率"
                      value={performance.totalReturn * 100}
                      precision={2}
                      suffix="%"
                      valueStyle={{ 
                        color: performance.totalReturn >= 0 ? '#3f8600' : '#cf1322' 
                      }}
                      prefix={
                        performance.totalReturn >= 0 ? 
                        <RiseOutlined /> : <FallOutlined />
                      }
                    />
                  </Col>
                  
                  <Col xs={12} sm={8} md={6}>
                    <Statistic
                      title="年化收益率"
                      value={performance.annualizedReturn * 100}
                      precision={2}
                      suffix="%"
                      valueStyle={{ 
                        color: performance.annualizedReturn >= 0 ? '#3f8600' : '#cf1322' 
                      }}
                    />
                  </Col>
                  
                  <Col xs={12} sm={8} md={6}>
                    <Statistic
                      title="最大回撤"
                      value={Math.abs(performance.maxDrawdown * 100)}
                      precision={2}
                      suffix="%"
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Col>
                  
                  <Col xs={12} sm={8} md={6}>
                    <Statistic
                      title="夏普比率"
                      value={performance.sharpeRatio}
                      precision={3}
                      valueStyle={{ 
                        color: performance.sharpeRatio >= 1 ? '#3f8600' : '#722ed1' 
                      }}
                    />
                  </Col>
                  
                  <Col xs={12} sm={8} md={6}>
                    <Statistic
                      title="胜率"
                      value={calculatedMetrics?.winRate}
                      precision={1}
                      suffix="%"
                      valueStyle={{ 
                        color: (calculatedMetrics?.winRate || 0) >= 50 ? '#3f8600' : '#cf1322' 
                      }}
                    />
                  </Col>
                  
                  <Col xs={12} sm={8} md={6}>
                    <Statistic
                      title="盈亏比"
                      value={calculatedMetrics?.profitFactor}
                      precision={2}
                      valueStyle={{ 
                        color: (calculatedMetrics?.profitFactor || 0) >= 1 ? '#3f8600' : '#cf1322' 
                      }}
                    />
                  </Col>
                  
                  <Col xs={12} sm={8} md={6}>
                    <Statistic
                      title="交易次数"
                      value={calculatedMetrics?.totalTrades}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                  
                  <Col xs={12} sm={8} md={6}>
                    <Statistic
                      title="卡尔玛比率"
                      value={performance.calmarRatio}
                      precision={3}
                      valueStyle={{ 
                        color: performance.calmarRatio >= 1 ? '#3f8600' : '#722ed1' 
                      }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* 收益曲线 */}
            <Col span={24}>
              <Card title="资产净值曲线" size="small">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={equityCurveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(value: number, name: string) => [
                        name === 'equity' ? `$${value.toFixed(2)}` : `${value.toFixed(2)}%`,
                        name === 'equity' ? '净值' : '收益率'
                      ]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="equity" 
                      stroke="#1890ff" 
                      fill="#1890ff" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* 回撤曲线 */}
            <Col span={24}>
              <Card title="回撤曲线" size="small">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={equityCurveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(value: number) => [`${value.toFixed(2)}%`, '回撤']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="drawdown" 
                      stroke="#ff4d4f" 
                      fill="#ff4d4f" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 详细分析 */}
        <TabPane tab="详细分析" key="analysis">
          <Row gutter={[16, 16]}>
            {/* 月度收益 */}
            <Col span={24}>
              <Card title="月度收益分布" size="small">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyReturnsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip 
                      formatter={(value: number) => [`${value.toFixed(2)}%`, '收益率']}
                    />
                    <Bar dataKey="return" fill="#1890ff">
                      {monthlyReturnsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>

            {/* 风险指标 */}
            <Col span={12}>
              <Card title="风险指标" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text>波动率</Text>
                    <div>
                      <Progress 
                        percent={(performance.volatility * 100)} 
                        showInfo={false}
                        strokeColor="#722ed1"
                      />
                      <Text type="secondary">{(performance.volatility * 100).toFixed(2)}%</Text>
                    </div>
                  </div>
                  
                  <div>
                    <Text>最大回撤持续时间</Text>
                    <div>
                      <Progress 
                        percent={Math.min((performance.maxDrawdownDuration || 0) / 30 * 100, 100)} 
                        showInfo={false}
                        strokeColor="#ff4d4f"
                      />
                      <Text type="secondary">{performance.maxDrawdownDuration || 0} 天</Text>
                    </div>
                  </div>
                  
                  <div>
                    <Text>下行风险</Text>
                    <div>
                      <Progress 
                        percent={(performance.downriskDeviation || 0) * 100} 
                        showInfo={false}
                        strokeColor="#fa8c16"
                      />
                      <Text type="secondary">{((performance.downriskDeviation || 0) * 100).toFixed(2)}%</Text>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>

            {/* 交易统计 */}
            <Col span={12}>
              <Card title="交易统计" size="small">
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Statistic
                      title="平均盈利"
                      value={calculatedMetrics?.avgWin}
                      precision={2}
                      prefix="$"
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="平均亏损"
                      value={calculatedMetrics?.avgLoss}
                      precision={2}
                      prefix="$"
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="最长连胜"
                      value={calculatedMetrics?.longestWinStreak}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="最长连败"
                      value={calculatedMetrics?.longestLossStreak}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* 交易记录 */}
        <TabPane tab="交易记录" key="trades">
          <Card size="small">
            <Table
              dataSource={trades}
              columns={tradesColumns}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条交易记录`,
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BacktestResults;