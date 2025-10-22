/**
 * 策略性能分析组件
 * 
 * 功能特性:
 * - 实时性能监控
 * - 多维度性能对比
 * - 风险调整后收益分析
 * - 基准对比分析
 * - 归因分析
 * - 性能预警系统
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Button,
  Space,
  Table,
  Tag,
  Progress,
  Alert,
  Tooltip,
  Typography,
  Switch,
  Divider,
  message,
  Spin,
} from 'antd';
import {
  LineChart,
  Line,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  PieChartOutlined,
  AlertOutlined,
  SyncOutlined,
  DownloadOutlined,
  CompareOutlined,
} from '@ant-design/icons';
import { 
  getStrategyPerformance, 
  getStrategyComparison,
  getBenchmarkData,
  getPerformanceAlert 
} from '@/services/strategy';
import type { 
  StrategyPerformance, 
  PerformanceComparison, 
  BenchmarkData,
  PerformanceAlert 
} from '@/types/strategy';
import './PerformanceAnalysis.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

export interface PerformanceAnalysisProps {
  strategyId: string;
  compareStrategies?: string[];
  onExport?: (data: any) => void;
}

const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({
  strategyId,
  compareStrategies = [],
  onExport,
}) => {
  const [loading, setLoading] = useState(false);
  const [performance, setPerformance] = useState<StrategyPerformance | null>(null);
  const [comparison, setComparison] = useState<PerformanceComparison | null>(null);
  const [benchmark, setBenchmark] = useState<BenchmarkData | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [showBenchmark, setShowBenchmark] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  /**
   * 时间框架选项
   */
  const timeframeOptions = [
    { label: '1周', value: '1W' },
    { label: '1月', value: '1M' },
    { label: '3月', value: '3M' },
    { label: '6月', value: '6M' },
    { label: '1年', value: '1Y' },
    { label: '全部', value: 'ALL' },
    { label: '自定义', value: 'CUSTOM' },
  ];

  /**
   * 加载性能数据
   */
  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      
      const params = {
        timeframe: selectedTimeframe,
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
      };

      const [performanceData, alertsData] = await Promise.all([
        getStrategyPerformance(strategyId, params),
        getPerformanceAlert(strategyId),
      ]);

      setPerformance(performanceData);
      setAlerts(alertsData);

      // 如果有对比策略，加载对比数据
      if (compareStrategies.length > 0) {
        const comparisonData = await getStrategyComparison([strategyId, ...compareStrategies], params);
        setComparison(comparisonData);
      }

      // 加载基准数据
      if (showBenchmark) {
        const benchmarkData = await getBenchmarkData('SPX', params);
        setBenchmark(benchmarkData);
      }
    } catch (error) {
      console.error('加载性能数据失败:', error);
      message.error('加载性能数据失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 计算风险调整指标
   */
  const riskAdjustedMetrics = useMemo(() => {
    if (!performance) return null;

    const { metrics } = performance;
    return {
      sharpeRatio: metrics.sharpeRatio,
      treynorRatio: metrics.treynorRatio,
      informationRatio: metrics.informationRatio,
      sortinoRatio: metrics.sortinoRatio,
      calmarRatio: metrics.calmarRatio,
      omegaRatio: metrics.omegaRatio,
    };
  }, [performance]);

  /**
   * 准备性能对比图表数据
   */
  const performanceChartData = useMemo(() => {
    if (!performance) return [];

    const data = performance.dailyReturns.map((item, index) => ({
      date: item.date,
      strategy: item.cumulativeReturn * 100,
      benchmark: benchmark?.dailyReturns[index]?.cumulativeReturn * 100 || 0,
      drawdown: item.drawdown * 100,
    }));

    // 如果有对比策略数据，添加到图表中
    if (comparison) {
      comparison.strategies.forEach((strategyData, idx) => {
        if (strategyData.id !== strategyId) {
          data.forEach((item, index) => {
            item[`strategy_${idx}`] = strategyData.dailyReturns[index]?.cumulativeReturn * 100 || 0;
          });
        }
      });
    }

    return data;
  }, [performance, benchmark, comparison, strategyId]);

  /**
   * 风险分析雷达图数据
   */
  const riskRadarData = useMemo(() => {
    if (!riskAdjustedMetrics) return [];

    return [
      { metric: 'Sharpe', value: Math.max(0, Math.min(riskAdjustedMetrics.sharpeRatio * 20, 100)) },
      { metric: 'Treynor', value: Math.max(0, Math.min(riskAdjustedMetrics.treynorRatio * 10, 100)) },
      { metric: 'Information', value: Math.max(0, Math.min(riskAdjustedMetrics.informationRatio * 25, 100)) },
      { metric: 'Sortino', value: Math.max(0, Math.min(riskAdjustedMetrics.sortinoRatio * 20, 100)) },
      { metric: 'Calmar', value: Math.max(0, Math.min(riskAdjustedMetrics.calmarRatio * 25, 100)) },
      { metric: 'Omega', value: Math.max(0, Math.min(riskAdjustedMetrics.omegaRatio * 10, 100)) },
    ];
  }, [riskAdjustedMetrics]);

  /**
   * 月度收益表格数据
   */
  const monthlyReturnsData = useMemo(() => {
    if (!performance?.monthlyReturns) return [];

    return performance.monthlyReturns.map((item, index) => ({
      key: index,
      month: item.month,
      return: item.return,
      benchmark: benchmark?.monthlyReturns?.[index]?.return || 0,
      excess: item.return - (benchmark?.monthlyReturns?.[index]?.return || 0),
      rank: item.rank,
    }));
  }, [performance, benchmark]);

  /**
   * 月度收益表格列配置
   */
  const monthlyColumns = [
    {
      title: '月份',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: '策略收益',
      dataIndex: 'return',
      key: 'return',
      render: (value: number) => (
        <Text type={value >= 0 ? 'success' : 'danger'}>
          {value >= 0 ? '+' : ''}{(value * 100).toFixed(2)}%
        </Text>
      ),
    },
    {
      title: '基准收益',
      dataIndex: 'benchmark',
      key: 'benchmark',
      render: (value: number) => (
        <Text type={value >= 0 ? 'success' : 'danger'}>
          {value >= 0 ? '+' : ''}{(value * 100).toFixed(2)}%
        </Text>
      ),
    },
    {
      title: '超额收益',
      dataIndex: 'excess',
      key: 'excess',
      render: (value: number) => (
        <Text type={value >= 0 ? 'success' : 'danger'}>
          {value >= 0 ? '+' : ''}{(value * 100).toFixed(2)}%
        </Text>
      ),
    },
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank: number) => (
        <Tag color={rank <= 25 ? 'green' : rank <= 50 ? 'blue' : rank <= 75 ? 'orange' : 'red'}>
          {rank}%
        </Tag>
      ),
    },
  ];

  /**
   * 导出分析报告
   */
  const handleExport = () => {
    const exportData = {
      performance,
      comparison,
      benchmark,
      riskAdjustedMetrics,
      chartData: performanceChartData,
      monthlyData: monthlyReturnsData,
    };
    onExport?.(exportData);
    message.success('分析报告导出成功');
  };

  /**
   * 自动刷新处理
   */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        loadPerformanceData();
      }, 30000); // 30秒刷新一次
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, selectedTimeframe, dateRange]);

  /**
   * 初始化和数据刷新
   */
  useEffect(() => {
    loadPerformanceData();
  }, [strategyId, selectedTimeframe, dateRange, showBenchmark]);

  if (loading && !performance) {
    return (
      <div className="performance-analysis-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="performance-analysis">
      {/* 控制面板 */}
      <Card size="small" className="control-panel">
        <Row align="middle" justify="space-between">
          <Col>
            <Space>
              <Select
                value={selectedTimeframe}
                onChange={setSelectedTimeframe}
                style={{ width: 120 }}
              >
                {timeframeOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              
              {selectedTimeframe === 'CUSTOM' && (
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  format="YYYY-MM-DD"
                />
              )}
              
              <Switch
                checked={showBenchmark}
                onChange={setShowBenchmark}
                checkedChildren="显示基准"
                unCheckedChildren="隐藏基准"
              />
              
              <Switch
                checked={autoRefresh}
                onChange={setAutoRefresh}
                checkedChildren="自动刷新"
                unCheckedChildren="手动刷新"
              />
            </Space>
          </Col>
          
          <Col>
            <Space>
              <Button 
                icon={<SyncOutlined />} 
                onClick={loadPerformanceData}
                loading={loading}
              >
                刷新
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 性能预警 */}
      {alerts.length > 0 && (
        <Alert
          message="性能预警"
          description={
            <Space direction="vertical" size="small">
              {alerts.map((alert, index) => (
                <div key={index}>
                  <Tag color={alert.level === 'high' ? 'red' : alert.level === 'medium' ? 'orange' : 'blue'}>
                    {alert.type}
                  </Tag>
                  {alert.message}
                </div>
              ))}
            </Space>
          }
          type="warning"
          icon={<AlertOutlined />}
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Row gutter={[16, 16]}>
        {/* 核心指标 */}
        <Col span={24}>
          <Card title="核心性能指标" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="总收益率"
                  value={performance?.metrics.totalReturn ? performance.metrics.totalReturn * 100 : 0}
                  precision={2}
                  suffix="%"
                  valueStyle={{ 
                    color: (performance?.metrics.totalReturn || 0) >= 0 ? '#3f8600' : '#cf1322' 
                  }}
                  prefix={
                    (performance?.metrics.totalReturn || 0) >= 0 ? 
                    <RiseOutlined /> : <FallOutlined />
                  }
                />
              </Col>
              
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="年化收益"
                  value={performance?.metrics.annualizedReturn ? performance.metrics.annualizedReturn * 100 : 0}
                  precision={2}
                  suffix="%"
                  valueStyle={{ 
                    color: (performance?.metrics.annualizedReturn || 0) >= 0 ? '#3f8600' : '#cf1322' 
                  }}
                />
              </Col>
              
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="夏普比率"
                  value={performance?.metrics.sharpeRatio || 0}
                  precision={3}
                  valueStyle={{ 
                    color: (performance?.metrics.sharpeRatio || 0) >= 1 ? '#3f8600' : '#722ed1' 
                  }}
                />
              </Col>
              
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="最大回撤"
                  value={performance?.metrics.maxDrawdown ? Math.abs(performance.metrics.maxDrawdown * 100) : 0}
                  precision={2}
                  suffix="%"
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="胜率"
                  value={performance?.metrics.winRate ? performance.metrics.winRate * 100 : 0}
                  precision={1}
                  suffix="%"
                  valueStyle={{ 
                    color: (performance?.metrics.winRate || 0) >= 0.5 ? '#3f8600' : '#cf1322' 
                  }}
                />
              </Col>
              
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="波动率"
                  value={performance?.metrics.volatility ? performance.metrics.volatility * 100 : 0}
                  precision={2}
                  suffix="%"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 收益对比图表 */}
        <Col span={24}>
          <Card title="收益曲线对比" size="small">
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={performanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip 
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(2)}%`,
                    name === 'strategy' ? '策略' : 
                    name === 'benchmark' ? '基准' : 
                    name === 'drawdown' ? '回撤' : name
                  ]}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="strategy" 
                  stroke="#1890ff" 
                  strokeWidth={2}
                  dot={false}
                />
                {showBenchmark && (
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="benchmark" 
                    stroke="#52c41a" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                )}
                <Bar 
                  yAxisId="right"
                  dataKey="drawdown" 
                  fill="#ff4d4f" 
                  fillOpacity={0.3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 风险调整指标 */}
        <Col xs={24} lg={12}>
          <Card title="风险调整指标" size="small">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={riskRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="风险指标"
                  dataKey="value"
                  stroke="#1890ff"
                  fill="#1890ff"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* 风险指标详情 */}
        <Col xs={24} lg={12}>
          <Card title="风险指标详情" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              {riskAdjustedMetrics && Object.entries(riskAdjustedMetrics).map(([key, value]) => (
                <div key={key}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Text>
                    </Col>
                    <Col>
                      <Progress 
                        percent={Math.max(0, Math.min(value * 20, 100))} 
                        showInfo={false}
                        strokeColor={
                          value >= 1 ? '#52c41a' : 
                          value >= 0.5 ? '#1890ff' : 
                          value >= 0 ? '#faad14' : '#ff4d4f'
                        }
                        size="small"
                        style={{ width: 100 }}
                      />
                      <Text style={{ marginLeft: 8 }}>{value.toFixed(3)}</Text>
                    </Col>
                  </Row>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* 月度收益分析 */}
        <Col span={24}>
          <Card title="月度收益分析" size="small">
            <Table
              dataSource={monthlyReturnsData}
              columns={monthlyColumns}
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PerformanceAnalysis;