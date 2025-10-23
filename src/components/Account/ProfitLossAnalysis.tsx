import React, { useState, useEffect } from 'react';
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
} from 'antd';
import { 
  TrophyOutlined, 
  FallOutlined, 
  RiseOutlined, 
  ReloadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { Line, Area, Column } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface PositionInfo {
  code: string;
  total_shares: number;
  available_shares: number;
  avg_cost_price: number;
  current_price: number;
  market_value: number;
  profit_loss: number;
  profit_loss_ratio: number;
  position_ratio: number;
}

interface ProfitLossRecord {
  date: string;
  daily_profit_loss: number;
  cumulative_profit_loss: number;
  account_value: number;
  daily_return: number;
  cumulative_return: number;
}

interface Props {
  positions: PositionInfo[];
  accountId: string;
}

const ProfitLossAnalysis: React.FC<Props> = ({ positions, accountId }) => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [profitLossData, setProfitLossData] = useState<ProfitLossRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // 模拟生成盈亏数据
  const generateMockData = () => {
    const data: ProfitLossRecord[] = [];
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    let currentDate = startDate.clone();
    let cumulativePL = 0;
    let accountValue = 100000; // 初始账户价值10万元

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      // 模拟每日盈亏波动
      const dailyPL = (Math.random() - 0.5) * 2000; // -1000到1000的随机波动
      cumulativePL += dailyPL;
      accountValue += dailyPL;
      
      const dailyReturn = dailyPL / (accountValue - dailyPL) * 100;
      const cumulativeReturn = cumulativePL / 100000 * 100;

      data.push({
        date: currentDate.format('YYYY-MM-DD'),
        daily_profit_loss: dailyPL,
        cumulative_profit_loss: cumulativePL,
        account_value: accountValue,
        daily_return: dailyReturn,
        cumulative_return: cumulativeReturn,
      });

      currentDate = currentDate.add(1, 'day');
    }

    return data;
  };

  // 加载盈亏数据
  const loadProfitLossData = async () => {
    setLoading(true);
    try {
      // 这里应该调用真实的API
      const mockData = generateMockData();
      setProfitLossData(mockData);
    } catch (error) {
      console.error('加载盈亏数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      loadProfitLossData();
    }
  }, [accountId, dateRange, timeFrame]);

  // 计算统计指标
  const calculateMetrics = () => {
    if (profitLossData.length === 0) return null;

    const returns = profitLossData.map(d => d.daily_return);
    const finalData = profitLossData[profitLossData.length - 1];
    
    // 总收益率
    const totalReturn = finalData.cumulative_return;
    
    // 年化收益率
    const days = profitLossData.length;
    const annualizedReturn = totalReturn * (365 / days);
    
    // 波动率（年化）
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) / returns.length;
    const volatility = Math.sqrt(variance * 365);
    
    // 夏普比率（假设无风险利率为3%）
    const riskFreeRate = 3;
    const sharpeRatio = volatility > 0 ? (annualizedReturn - riskFreeRate) / volatility : 0;
    
    // 最大回撤
    let maxDrawdown = 0;
    let peak = profitLossData[0].account_value;
    
    profitLossData.forEach(d => {
      if (d.account_value > peak) {
        peak = d.account_value;
      }
      const drawdown = (peak - d.account_value) / peak * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });
    
    // 胜率
    const profitableDays = returns.filter(r => r > 0).length;
    const winRate = (profitableDays / returns.length) * 100;

    return {
      totalReturn,
      annualizedReturn,
      volatility,
      sharpeRatio,
      maxDrawdown,
      winRate,
      totalProfit: finalData.cumulative_profit_loss,
      finalValue: finalData.account_value,
    };
  };

  const metrics = calculateMetrics();

  // 累计盈亏曲线配置
  const cumulativePLConfig = {
    data: profitLossData,
    xField: 'date',
    yField: 'cumulative_profit_loss',
    smooth: true,
    color: '#1890ff',
    areaStyle: {
      fillOpacity: 0.2,
    },
    xAxis: {
      type: 'time',
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `¥${Number(v).toFixed(0)}`,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: '累计盈亏',
          value: `¥${datum.cumulative_profit_loss.toFixed(2)}`,
        };
      },
    },
  };

  // 账户价值曲线配置
  const accountValueConfig = {
    data: profitLossData,
    xField: 'date',
    yField: 'account_value',
    smooth: true,
    color: '#52c41a',
    xAxis: {
      type: 'time',
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `¥${Number(v).toFixed(0)}`,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: '账户价值',
          value: `¥${datum.account_value.toFixed(2)}`,
        };
      },
    },
  };

  // 每日收益率分布
  const dailyReturnConfig = {
    data: profitLossData,
    xField: 'date',
    yField: 'daily_return',
    color: ({ daily_return }: any) => daily_return >= 0 ? '#52c41a' : '#ff4d4f',
    xAxis: {
      type: 'time',
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${Number(v).toFixed(1)}%`,
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return {
          name: '日收益率',
          value: `${datum.daily_return.toFixed(2)}%`,
        };
      },
    },
  };

  // 近期盈亏明细表格数据
  const recentData = profitLossData.slice(-10).reverse();

  const tableColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('MM-DD'),
    },
    {
      title: '日盈亏',
      dataIndex: 'daily_profit_loss',
      key: 'daily_profit_loss',
      align: 'right' as const,
      render: (amount: number) => (
        <Text style={{ color: amount >= 0 ? '#cf1322' : '#3f8600' }}>
          {amount >= 0 ? '+' : ''}¥{amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: '日收益率',
      dataIndex: 'daily_return',
      key: 'daily_return',
      align: 'right' as const,
      render: (rate: number) => (
        <Text style={{ color: rate >= 0 ? '#cf1322' : '#3f8600' }}>
          {rate >= 0 ? '+' : ''}{rate.toFixed(2)}%
        </Text>
      ),
    },
    {
      title: '累计盈亏',
      dataIndex: 'cumulative_profit_loss',
      key: 'cumulative_profit_loss',
      align: 'right' as const,
      render: (amount: number) => (
        <Text style={{ color: amount >= 0 ? '#cf1322' : '#3f8600' }}>
          {amount >= 0 ? '+' : ''}¥{amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: '账户价值',
      dataIndex: 'account_value',
      key: 'account_value',
      align: 'right' as const,
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
  ];

  return (
    <div>
      {/* 控制面板 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Space>
              <Text>时间范围：</Text>
              <RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              />
            </Space>
          </Col>
          <Col>
            <Space>
              <Text>时间粒度：</Text>
              <Select value={timeFrame} onChange={setTimeFrame} style={{ width: 100 }}>
                <Option value="daily">日</Option>
                <Option value="weekly">周</Option>
                <Option value="monthly">月</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={loadProfitLossData} loading={loading}>
                刷新
              </Button>
              <Button icon={<DownloadOutlined />}>
                导出
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 核心指标 */}
      {metrics && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="总收益率"
                value={metrics.totalReturn}
                precision={2}
                suffix="%"
                valueStyle={{ color: metrics.totalReturn >= 0 ? '#cf1322' : '#3f8600' }}
                prefix={metrics.totalReturn >= 0 ? <RiseOutlined /> : <FallOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="年化收益率"
                value={metrics.annualizedReturn}
                precision={2}
                suffix="%"
                valueStyle={{ color: metrics.annualizedReturn >= 0 ? '#cf1322' : '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="年化波动率"
                value={metrics.volatility}
                precision={2}
                suffix="%"
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="夏普比率"
                value={metrics.sharpeRatio}
                precision={2}
                valueStyle={{ color: metrics.sharpeRatio >= 1 ? '#cf1322' : '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="最大回撤"
                value={metrics.maxDrawdown}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Card size="small">
              <Statistic
                title="胜率"
                value={metrics.winRate}
                precision={1}
                suffix="%"
                prefix={<TrophyOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 图表展示 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="累计盈亏曲线" size="small">
            <Area {...cumulativePLConfig} height={250} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="账户价值曲线" size="small">
            <Line {...accountValueConfig} height={250} />
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="每日收益率分布" size="small">
            <Column {...dailyReturnConfig} height={200} />
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="近期盈亏明细" size="small">
            <Table
              columns={tableColumns}
              dataSource={recentData}
              rowKey="date"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfitLossAnalysis;
