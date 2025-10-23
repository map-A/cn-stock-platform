import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  Statistic, 
  Typography, 
  Space,
  Button,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { 
  TrophyOutlined, 
  RiseOutlined, 
  FallOutlined, 
  ReloadOutlined,
  BarChartOutlined,
  LineChartOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Line, Column, Radar } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface PerformanceData {
  date: string;
  net_value: number;
  daily_return: number;
  cumulative_return: number;
  benchmark_return: number;
  alpha: number;
  beta: number;
  tracking_error: number;
}

interface PerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  calmarRatio: number;
  sortinoRatio: number;
  winRate: number;
  profitLossRatio: number;
  beta: number;
  alpha: number;
  informationRatio: number;
  treynorRatio: number;
  var95: number;
  var99: number;
}

interface Props {
  accountId: string;
}

const PerformanceMetrics: React.FC<Props> = ({ accountId }) => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(1, 'year'),
    dayjs(),
  ]);
  const [benchmarkType, setBenchmarkType] = useState<'hs300' | 'sz50' | 'zz500'>('hs300');
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  // 模拟生成绩效数据
  const generateMockData = () => {
    const data: PerformanceData[] = [];
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    let currentDate = startDate.clone();
    let netValue = 1.0;
    let cumulativeReturn = 0;
    let benchmarkCumReturn = 0;

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      // 模拟日收益率
      const dailyReturn = (Math.random() - 0.48) * 0.04; // 稍微正偏的收益率
      const benchmarkReturn = (Math.random() - 0.5) * 0.03; // 基准收益率
      
      netValue *= (1 + dailyReturn);
      cumulativeReturn = (netValue - 1) * 100;
      benchmarkCumReturn += benchmarkReturn * 100;
      
      // 计算alpha和beta（简化计算）
      const alpha = dailyReturn - benchmarkReturn;
      const beta = 0.8 + Math.random() * 0.4; // 0.8-1.2之间的beta值
      
      data.push({
        date: currentDate.format('YYYY-MM-DD'),
        net_value: netValue,
        daily_return: dailyReturn * 100,
        cumulative_return: cumulativeReturn,
        benchmark_return: benchmarkCumReturn,
        alpha: alpha * 100,
        beta: beta,
        tracking_error: Math.abs(dailyReturn - benchmarkReturn) * 100,
      });

      currentDate = currentDate.add(1, 'day');
    }

    return data;
  };

  // 计算绩效指标
  const calculateMetrics = (data: PerformanceData[]): PerformanceMetrics => {
    if (data.length === 0) {
      return {
        totalReturn: 0,
        annualizedReturn: 0,
        volatility: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        calmarRatio: 0,
        sortinoRatio: 0,
        winRate: 0,
        profitLossRatio: 0,
        beta: 0,
        alpha: 0,
        informationRatio: 0,
        treynorRatio: 0,
        var95: 0,
        var99: 0,
      };
    }

    const returns = data.map(d => d.daily_return);
    const finalData = data[data.length - 1];
    const days = data.length;
    
    // 总收益率
    const totalReturn = finalData.cumulative_return;
    
    // 年化收益率
    const annualizedReturn = totalReturn * (365 / days);
    
    // 波动率（年化）
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) / returns.length;
    const volatility = Math.sqrt(variance * 365);
    
    // 夏普比率
    const riskFreeRate = 3;
    const sharpeRatio = volatility > 0 ? (annualizedReturn - riskFreeRate) / volatility : 0;
    
    // 最大回撤
    let maxDrawdown = 0;
    let peak = data[0].net_value;
    
    data.forEach(d => {
      if (d.net_value > peak) {
        peak = d.net_value;
      }
      const drawdown = (peak - d.net_value) / peak * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });
    
    // Calmar比率
    const calmarRatio = maxDrawdown > 0 ? annualizedReturn / maxDrawdown : 0;
    
    // 下行波动率
    const negativeReturns = returns.filter(r => r < avgReturn);
    const downVolatility = negativeReturns.length > 0 ? 
      Math.sqrt(negativeReturns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) / negativeReturns.length * 365) : 0;
    
    // Sortino比率
    const sortinoRatio = downVolatility > 0 ? (annualizedReturn - riskFreeRate) / downVolatility : 0;
    
    // 胜率
    const profitableDays = returns.filter(r => r > 0).length;
    const winRate = (profitableDays / returns.length) * 100;
    
    // 盈亏比
    const avgProfit = returns.filter(r => r > 0).reduce((sum, r) => sum + r, 0) / profitableDays || 0;
    const avgLoss = Math.abs(returns.filter(r => r < 0).reduce((sum, r) => sum + r, 0) / (returns.length - profitableDays)) || 0;
    const profitLossRatio = avgLoss > 0 ? avgProfit / avgLoss : 0;
    
    // Beta和Alpha
    const beta = data.reduce((sum, d) => sum + d.beta, 0) / data.length;
    const alpha = data.reduce((sum, d) => sum + d.alpha, 0) / data.length;
    
    // 信息比率
    const trackingErrors = data.map(d => d.tracking_error);
    const avgTrackingError = trackingErrors.reduce((sum, te) => sum + te, 0) / trackingErrors.length;
    const informationRatio = avgTrackingError > 0 ? alpha / avgTrackingError : 0;
    
    // Treynor比率
    const treynorRatio = beta > 0 ? (annualizedReturn - riskFreeRate) / beta : 0;
    
    // VaR计算
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const var95 = sortedReturns[Math.floor(sortedReturns.length * 0.05)] || 0;
    const var99 = sortedReturns[Math.floor(sortedReturns.length * 0.01)] || 0;

    return {
      totalReturn,
      annualizedReturn,
      volatility,
      sharpeRatio,
      maxDrawdown,
      calmarRatio,
      sortinoRatio,
      winRate,
      profitLossRatio,
      beta,
      alpha,
      informationRatio,
      treynorRatio,
      var95: Math.abs(var95),
      var99: Math.abs(var99),
    };
  };

  // 加载绩效数据
  const loadPerformanceData = async () => {
    setLoading(true);
    try {
      const mockData = generateMockData();
      setPerformanceData(mockData);
      setMetrics(calculateMetrics(mockData));
    } catch (error) {
      console.error('加载绩效数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      loadPerformanceData();
    }
  }, [accountId, dateRange, benchmarkType]);

  // 净值曲线配置
  const netValueConfig = {
    data: performanceData,
    xField: 'date',
    yField: 'net_value',
    smooth: true,
    color: '#1890ff',
    xAxis: {
      type: 'time',
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (v: string) => Number(v).toFixed(3),
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: '净值',
          value: datum.net_value.toFixed(4),
        };
      },
    },
  };

  // 收益率对比配置
  const returnComparisonConfig = {
    data: performanceData.flatMap(d => [
      { date: d.date, type: '策略收益', value: d.cumulative_return },
      { date: d.date, type: '基准收益', value: d.benchmark_return },
    ]),
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    color: ['#1890ff', '#52c41a'],
    xAxis: {
      type: 'time',
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${Number(v).toFixed(1)}%`,
      },
    },
  };

  // 雷达图数据
  const radarData = metrics ? [
    { metric: '收益能力', value: Math.min(100, (metrics.annualizedReturn + 50) * 1.5) },
    { metric: '风险控制', value: Math.min(100, 100 - metrics.volatility * 3) },
    { metric: '稳定性', value: Math.min(100, 100 - metrics.maxDrawdown * 5) },
    { metric: '选股能力', value: Math.min(100, (metrics.alpha + 10) * 5) },
    { metric: '择时能力', value: Math.min(100, metrics.winRate) },
    { metric: '风险调整收益', value: Math.min(100, (metrics.sharpeRatio + 2) * 20) },
  ] : [];

  // 雷达图配置
  const radarConfig = {
    data: radarData,
    xField: 'metric',
    yField: 'value',
    meta: {
      value: {
        alias: '评分',
        min: 0,
        max: 100,
      },
    },
    xAxis: {
      line: null,
      tickLine: null,
    },
    yAxis: {
      label: false,
      grid: {
        alternateColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    point: {
      size: 2,
    },
    area: {
      color: '#1890ff',
      style: {
        fillOpacity: 0.2,
      },
    },
  };

  // 指标分类
  const metricCategories = [
    {
      title: '收益指标',
      icon: <DollarOutlined style={{ color: '#52c41a' }} />,
      metrics: [
        { name: '总收益率', value: metrics?.totalReturn, suffix: '%', precision: 2 },
        { name: '年化收益率', value: metrics?.annualizedReturn, suffix: '%', precision: 2 },
        { name: 'Alpha', value: metrics?.alpha, suffix: '%', precision: 2 },
      ],
    },
    {
      title: '风险指标',
      icon: <BarChartOutlined style={{ color: '#ff4d4f' }} />,
      metrics: [
        { name: '年化波动率', value: metrics?.volatility, suffix: '%', precision: 2 },
        { name: '最大回撤', value: metrics?.maxDrawdown, suffix: '%', precision: 2 },
        { name: 'VaR(95%)', value: metrics?.var95, suffix: '%', precision: 2 },
      ],
    },
    {
      title: '风险调整收益',
      icon: <TrophyOutlined style={{ color: '#1890ff' }} />,
      metrics: [
        { name: '夏普比率', value: metrics?.sharpeRatio, precision: 3 },
        { name: 'Calmar比率', value: metrics?.calmarRatio, precision: 3 },
        { name: 'Sortino比率', value: metrics?.sortinoRatio, precision: 3 },
      ],
    },
    {
      title: '交易指标',
      icon: <LineChartOutlined style={{ color: '#faad14' }} />,
      metrics: [
        { name: '胜率', value: metrics?.winRate, suffix: '%', precision: 1 },
        { name: '盈亏比', value: metrics?.profitLossRatio, precision: 2 },
        { name: 'Beta', value: metrics?.beta, precision: 3 },
      ],
    },
  ];

  return (
    <div>
      {/* 控制面板 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Space>
              <Text>分析期间：</Text>
              <RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Text>基准指数：</Text>
              <Select value={benchmarkType} onChange={setBenchmarkType} style={{ width: 120 }}>
                <Option value="hs300">沪深300</Option>
                <Option value="sz50">上证50</Option>
                <Option value="zz500">中证500</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={loadPerformanceData} loading={loading}>
              刷新
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 核心绩效指标 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {metricCategories.map((category, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card 
              title={
                <Space>
                  {category.icon}
                  <Text strong>{category.title}</Text>
                </Space>
              } 
              size="small"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {category.metrics.map((metric, idx) => (
                  <Statistic
                    key={idx}
                    title={metric.name}
                    value={metric.value || 0}
                    precision={metric.precision}
                    suffix={metric.suffix}
                    valueStyle={{
                      fontSize: '16px',
                      color: metric.value && metric.value > 0 ? '#52c41a' : 
                            metric.value && metric.value < 0 ? '#ff4d4f' : '#666666',
                    }}
                  />
                ))}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 图表展示 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="净值曲线" size="small">
            <Line {...netValueConfig} height={250} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="收益率对比" size="small">
            <Line {...returnComparisonConfig} height={250} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="综合能力雷达图" size="small">
            <Radar {...radarConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="详细指标表" size="small">
            <Table
              dataSource={[
                { metric: '信息比率', value: metrics?.informationRatio?.toFixed(3) || '0.000' },
                { metric: 'Treynor比率', value: metrics?.treynorRatio?.toFixed(3) || '0.000' },
                { metric: 'VaR(99%)', value: `${metrics?.var99?.toFixed(2) || '0.00'}%` },
                { metric: '跟踪误差', value: `${(performanceData.reduce((sum, d) => sum + d.tracking_error, 0) / performanceData.length)?.toFixed(2) || '0.00'}%` },
              ]}
              columns={[
                { title: '指标', dataIndex: 'metric', key: 'metric' },
                { title: '数值', dataIndex: 'value', key: 'value', align: 'right' },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PerformanceMetrics;
