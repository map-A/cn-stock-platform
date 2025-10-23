import React, { useState, useEffect } from 'react';
import { Card, Select, DatePicker, Row, Col, Statistic, Table, Tag, Space, Button, Tooltip } from 'antd';
import { LineChartOutlined, BarChartOutlined, InfoCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import './HistoricalComparison.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 历史绩效数据接口
export interface HistoricalData {
  date: string;
  portfolioValue: number;
  portfolioReturn: number;
  cumulativeReturn: number;
  benchmarkValue: number;
  benchmarkReturn: number;
  benchmarkCumulative: number;
  volume?: number;
  sharpeRatio?: number;
  maxDrawdown?: number;
  volatility?: number;
  turnoverRate?: number;
}

// 比较周期枚举
export type ComparisonPeriod = '1M' | '3M' | '6M' | '1Y' | '2Y' | '3Y' | 'ALL';

// 组件属性接口
export interface HistoricalComparisonProps {
  historicalData: HistoricalData[];
  benchmarkName?: string;
  portfolioName?: string;
  loading?: boolean;
  onPeriodChange?: (period: ComparisonPeriod) => void;
  onDateRangeChange?: (dates: [string, string] | null) => void;
  onExport?: () => void;
}

const HistoricalComparison: React.FC<HistoricalComparisonProps> = ({
  historicalData = [],
  benchmarkName = '沪深300',
  portfolioName = '我的投资组合',
  loading = false,
  onPeriodChange,
  onDateRangeChange,
  onExport,
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [selectedPeriod, setSelectedPeriod] = useState<ComparisonPeriod>('1Y');
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

  // 处理绩效对比图表
  useEffect(() => {
    const chartDom = document.getElementById('historical-comparison-chart');
    if (!chartDom || loading || historicalData.length === 0) return;

    const chart = echarts.init(chartDom);
    setChartInstance(chart);

    const dates = historicalData.map(item => dayjs(item.date).format('MM-DD'));
    const portfolioValues = historicalData.map(item => item.portfolioValue);
    const benchmarkValues = historicalData.map(item => item.benchmarkValue);
    const portfolioReturns = historicalData.map(item => item.cumulativeReturn);
    const benchmarkReturns = historicalData.map(item => item.benchmarkCumulative);

    const option: echarts.EChartsOption = {
      title: {
        text: '历史绩效对比',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
        formatter: (params: any) => {
          const data = params[0];
          const date = historicalData[data.dataIndex]?.date;
          const portfolio = historicalData[data.dataIndex];
          
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 6px;">${dayjs(date).format('YYYY-MM-DD')}</div>
              <div style="display: flex; align-items: center; margin: 3px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background: #1890ff; border-radius: 50%; margin-right: 6px;"></span>
                ${portfolioName}: ${portfolio?.portfolioValue?.toFixed(4) || 0} (+${portfolio?.cumulativeReturn?.toFixed(2) || 0}%)
              </div>
              <div style="display: flex; align-items: center; margin: 3px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background: #52c41a; border-radius: 50%; margin-right: 6px;"></span>
                ${benchmarkName}: ${portfolio?.benchmarkValue?.toFixed(4) || 0} (+${portfolio?.benchmarkCumulative?.toFixed(2) || 0}%)
              </div>
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #f0f0f0;">
                <div>夏普比率: ${portfolio?.sharpeRatio?.toFixed(3) || 'N/A'}</div>
                <div>最大回撤: ${portfolio?.maxDrawdown?.toFixed(2) || 'N/A'}%</div>
                <div>波动率: ${portfolio?.volatility?.toFixed(2) || 'N/A'}%</div>
              </div>
            </div>
          `;
        },
      },
      legend: {
        data: [portfolioName, benchmarkName],
        top: '30px',
        left: 'center',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '80px',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: dates,
          axisLabel: {
            interval: Math.floor(dates.length / 10),
            rotate: 45,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '净值',
          position: 'left',
          alignTicks: true,
          axisLabel: {
            formatter: '{value}',
          },
        },
        {
          type: 'value',
          name: '累计收益率 (%)',
          position: 'right',
          alignTicks: true,
          axisLabel: {
            formatter: '{value}%',
          },
        },
      ],
      series: [
        {
          name: portfolioName,
          type: chartType,
          yAxisIndex: 0,
          data: portfolioValues,
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#1890ff',
          },
          itemStyle: {
            color: '#1890ff',
          },
          areaStyle: chartType === 'line' ? {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
            ]),
          } : undefined,
        },
        {
          name: benchmarkName,
          type: chartType,
          yAxisIndex: 0,
          data: benchmarkValues,
          smooth: true,
          lineStyle: {
            width: 2,
            color: '#52c41a',
          },
          itemStyle: {
            color: '#52c41a',
          },
          areaStyle: chartType === 'line' ? {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
              { offset: 1, color: 'rgba(82, 196, 26, 0.1)' },
            ]),
          } : undefined,
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 100,
          height: 30,
          bottom: 20,
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [historicalData, chartType, portfolioName, benchmarkName, loading]);

  // 计算统计数据
  const calculateStats = () => {
    if (historicalData.length === 0) {
      return {
        portfolioTotalReturn: 0,
        benchmarkTotalReturn: 0,
        outperformance: 0,
        winDays: 0,
        totalDays: 0,
        winRate: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        volatility: 0,
        beta: 0,
      };
    }

    const latest = historicalData[historicalData.length - 1];
    const first = historicalData[0];
    
    const portfolioTotalReturn = latest.cumulativeReturn;
    const benchmarkTotalReturn = latest.benchmarkCumulative;
    const outperformance = portfolioTotalReturn - benchmarkTotalReturn;
    
    // 计算胜率
    let winDays = 0;
    let totalDays = 0;
    
    for (let i = 1; i < historicalData.length; i++) {
      const prevData = historicalData[i - 1];
      const currData = historicalData[i];
      
      const portfolioDailyReturn = currData.portfolioReturn;
      const benchmarkDailyReturn = currData.benchmarkReturn;
      
      if (portfolioDailyReturn > benchmarkDailyReturn) {
        winDays++;
      }
      totalDays++;
    }
    
    const winRate = totalDays > 0 ? (winDays / totalDays) * 100 : 0;
    
    // 计算最大回撤
    let maxDrawdown = 0;
    let peak = first.portfolioValue;
    
    for (const data of historicalData) {
      if (data.portfolioValue > peak) {
        peak = data.portfolioValue;
      }
      const drawdown = ((peak - data.portfolioValue) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    // 计算夏普比率和波动率
    const returns = historicalData.slice(1).map(data => data.portfolioReturn);
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + (ret - avgReturn) ** 2, 0) / returns.length;
    const volatility = Math.sqrt(variance * 252); // 年化波动率
    const sharpeRatio = volatility > 0 ? (avgReturn * 252) / volatility : 0; // 假设无风险利率为0

    // 计算Beta (简化计算)
    const portfolioReturns = returns;
    const benchmarkReturns = historicalData.slice(1).map(data => data.benchmarkReturn);
    
    let covariance = 0;
    let benchmarkVariance = 0;
    const avgBenchmarkReturn = benchmarkReturns.reduce((sum, ret) => sum + ret, 0) / benchmarkReturns.length;
    
    for (let i = 0; i < portfolioReturns.length; i++) {
      covariance += (portfolioReturns[i] - avgReturn) * (benchmarkReturns[i] - avgBenchmarkReturn);
      benchmarkVariance += (benchmarkReturns[i] - avgBenchmarkReturn) ** 2;
    }
    
    const beta = benchmarkVariance > 0 ? covariance / benchmarkVariance : 1;

    return {
      portfolioTotalReturn,
      benchmarkTotalReturn,
      outperformance,
      winDays,
      totalDays,
      winRate,
      maxDrawdown,
      sharpeRatio,
      volatility: volatility * 100,
      beta,
    };
  };

  const stats = calculateStats();

  // 详细数据表格列定义
  const columns: ColumnsType<HistoricalData> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '组合净值',
      dataIndex: 'portfolioValue',
      key: 'portfolioValue',
      width: 100,
      align: 'right',
      render: (value) => value?.toFixed(4) || '0.0000',
    },
    {
      title: '组合收益率',
      dataIndex: 'portfolioReturn',
      key: 'portfolioReturn',
      width: 100,
      align: 'right',
      render: (value) => (
        <span style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {value?.toFixed(2) || '0.00'}%
        </span>
      ),
    },
    {
      title: '基准净值',
      dataIndex: 'benchmarkValue',
      key: 'benchmarkValue',
      width: 100,
      align: 'right',
      render: (value) => value?.toFixed(4) || '0.0000',
    },
    {
      title: '基准收益率',
      dataIndex: 'benchmarkReturn',
      key: 'benchmarkReturn',
      width: 100,
      align: 'right',
      render: (value) => (
        <span style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {value?.toFixed(2) || '0.00'}%
        </span>
      ),
    },
    {
      title: '超额收益',
      key: 'excessReturn',
      width: 100,
      align: 'right',
      render: (_, record) => {
        const excess = (record.portfolioReturn || 0) - (record.benchmarkReturn || 0);
        return (
          <span style={{ color: excess >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {excess.toFixed(2)}%
          </span>
        );
      },
    },
    {
      title: '夏普比率',
      dataIndex: 'sharpeRatio',
      key: 'sharpeRatio',
      width: 100,
      align: 'right',
      render: (value) => value?.toFixed(3) || 'N/A',
    },
    {
      title: '最大回撤',
      dataIndex: 'maxDrawdown',
      key: 'maxDrawdown',
      width: 100,
      align: 'right',
      render: (value) => (
        <span style={{ color: '#ff4d4f' }}>
          {value?.toFixed(2) || '0.00'}%
        </span>
      ),
    },
  ];

  const handlePeriodChange = (period: ComparisonPeriod) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');
      onDateRangeChange?.([startDate, endDate]);
    } else {
      onDateRangeChange?.(null);
    }
  };

  return (
    <div className="historical-comparison">
      {/* 控制面板 */}
      <Card className="historical-comparison-controls" size="small">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Space>
              <span>快速选择:</span>
              <Select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                style={{ width: 80 }}
              >
                <Option value="1M">1个月</Option>
                <Option value="3M">3个月</Option>
                <Option value="6M">6个月</Option>
                <Option value="1Y">1年</Option>
                <Option value="2Y">2年</Option>
                <Option value="3Y">3年</Option>
                <Option value="ALL">全部</Option>
              </Select>
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              <span>自定义日期:</span>
              <RangePicker
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
                size="small"
              />
            </Space>
          </Col>
          <Col span={8}>
            <Space style={{ float: 'right' }}>
              <Button.Group size="small">
                <Button
                  type={chartType === 'line' ? 'primary' : 'default'}
                  icon={<LineChartOutlined />}
                  onClick={() => setChartType('line')}
                >
                  线图
                </Button>
                <Button
                  type={chartType === 'bar' ? 'primary' : 'default'}
                  icon={<BarChartOutlined />}
                  onClick={() => setChartType('bar')}
                >
                  柱图
                </Button>
              </Button.Group>
              {onExport && (
                <Button size="small" icon={<DownloadOutlined />} onClick={onExport}>
                  导出
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 统计概览 */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span>
                  总收益率
                  <Tooltip title="投资组合在所选期间的总收益率">
                    <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                  </Tooltip>
                </span>
              }
              value={stats.portfolioTotalReturn}
              precision={2}
              suffix="%"
              valueStyle={{ color: stats.portfolioTotalReturn >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span>
                  超额收益
                  <Tooltip title="相对于基准指数的超额收益">
                    <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                  </Tooltip>
                </span>
              }
              value={stats.outperformance}
              precision={2}
              suffix="%"
              valueStyle={{ color: stats.outperformance >= 0 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span>
                  胜率
                  <Tooltip title="跑赢基准指数的交易日占比">
                    <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                  </Tooltip>
                </span>
              }
              value={stats.winRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: stats.winRate >= 50 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span>
                  夏普比率
                  <Tooltip title="风险调整后收益指标，值越高越好">
                    <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                  </Tooltip>
                </span>
              }
              value={stats.sharpeRatio}
              precision={3}
              valueStyle={{ color: stats.sharpeRatio >= 1 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 绩效对比图表 */}
      <Card title="绩效走势对比" style={{ marginTop: 16 }}>
        <div
          id="historical-comparison-chart"
          style={{ width: '100%', height: '400px' }}
        />
      </Card>

      {/* 详细数据表格 */}
      <Card title="历史数据明细" style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={historicalData}
          rowKey="date"
          size="small"
          scroll={{ x: 800, y: 400 }}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default HistoricalComparison;