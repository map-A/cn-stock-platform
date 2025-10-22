import React, { useEffect, useRef, useState } from 'react';
import { Card, Row, Col, Space, Typography, Statistic, Select, DatePicker, Radio, Tag } from 'antd';
import { 
  RiseOutlined, 
  FallOutlined, 
  BarChartOutlined,
  LineChartOutlined 
} from '@ant-design/icons';
import * as echarts from 'echarts';
import dayjs, { Dayjs } from 'dayjs';
import './PerformanceAnalysis.less';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface PerformanceData {
  /** 日期 */
  date: string;
  /** 投资组合收益率 */
  portfolioReturn: number;
  /** 累计收益率 */
  cumulativeReturn: number;
  /** 基准收益率 */
  benchmarkReturn?: number;
  /** 基准累计收益率 */
  benchmarkCumulative?: number;
  /** 组合净值 */
  portfolioValue: number;
  /** 基准净值 */
  benchmarkValue?: number;
}

interface PerformanceMetrics {
  /** 总收益率 */
  totalReturn: number;
  /** 年化收益率 */
  annualizedReturn: number;
  /** 波动率 */
  volatility: number;
  /** 夏普比率 */
  sharpeRatio: number;
  /** 最大回撤 */
  maxDrawdown: number;
  /** 胜率 */
  winRate: number;
  /** 基准超额收益 */
  excessReturn?: number;
  /** 信息比率 */
  informationRatio?: number;
}

interface PerformanceAnalysisProps {
  /** 收益数据 */
  performanceData?: PerformanceData[];
  /** 绩效指标 */
  metrics?: PerformanceMetrics;
  /** 基准名称 */
  benchmarkName?: string;
  /** 图表高度 */
  height?: number;
  /** 加载状态 */
  loading?: boolean;
  /** 日期范围变化回调 */
  onDateRangeChange?: (dates: [Dayjs, Dayjs] | null) => void;
}

type ChartType = 'cumulative' | 'daily' | 'drawdown';
type TimeRange = '1M' | '3M' | '6M' | '1Y' | 'YTD' | 'ALL';

const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({
  performanceData = [],
  metrics,
  benchmarkName = '沪深300',
  height = 400,
  loading = false,
  onDateRangeChange,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [chartType, setChartType] = useState<ChartType>('cumulative');
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);

  // 初始化图表
  useEffect(() => {
    if (chartRef.current && !loading) {
      chartInstance.current = echarts.init(chartRef.current);
      updateChart();
      
      const handleResize = () => {
        chartInstance.current?.resize();
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        chartInstance.current?.dispose();
      };
    }
  }, [performanceData, chartType, loading]);

  // 更新图表
  const updateChart = () => {
    if (!chartInstance.current || performanceData.length === 0) return;

    const dates = performanceData.map(item => item.date);
    let option: echarts.EChartsOption = {};

    switch (chartType) {
      case 'cumulative':
        option = {
          title: {
            text: '累计收益率',
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
            },
            formatter: (params: any) => {
              let content = `<div><strong>${params[0].axisValue}</strong><br/>`;
              params.forEach((param: any) => {
                content += `${param.seriesName}: ${param.value.toFixed(2)}%<br/>`;
              });
              content += '</div>';
              return content;
            },
          },
          legend: {
            data: ['投资组合', benchmarkName],
            top: 30,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '15%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates,
            axisLabel: {
              formatter: (value: string) => dayjs(value).format('MM-DD'),
            },
          },
          yAxis: {
            type: 'value',
            name: '收益率 (%)',
            axisLabel: {
              formatter: '{value}%',
            },
          },
          series: [
            {
              name: '投资组合',
              type: 'line',
              data: performanceData.map(item => item.cumulativeReturn),
              smooth: true,
              lineStyle: {
                color: '#1890ff',
                width: 2,
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                  { offset: 1, color: 'rgba(24, 144, 255, 0.1)' },
                ]),
              },
            },
            ...(performanceData[0]?.benchmarkCumulative !== undefined ? [{
              name: benchmarkName,
              type: 'line',
              data: performanceData.map(item => item.benchmarkCumulative || 0),
              smooth: true,
              lineStyle: {
                color: '#52c41a',
                width: 2,
                type: 'dashed' as const,
              },
            }] : []),
          ],
        };
        break;

      case 'daily':
        option = {
          title: {
            text: '日收益率',
            left: 'center',
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
            },
          },
          legend: {
            data: ['投资组合', benchmarkName],
            top: 30,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '15%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
              formatter: (value: string) => dayjs(value).format('MM-DD'),
            },
          },
          yAxis: {
            type: 'value',
            name: '日收益率 (%)',
            axisLabel: {
              formatter: '{value}%',
            },
          },
          series: [
            {
              name: '投资组合',
              type: 'bar',
              data: performanceData.map(item => ({
                value: item.portfolioReturn,
                itemStyle: {
                  color: item.portfolioReturn >= 0 ? '#52c41a' : '#ff4d4f',
                },
              })),
            },
            ...(performanceData[0]?.benchmarkReturn !== undefined ? [{
              name: benchmarkName,
              type: 'line',
              data: performanceData.map(item => item.benchmarkReturn || 0),
              lineStyle: {
                color: '#faad14',
                width: 1,
              },
            }] : []),
          ],
        };
        break;

      case 'drawdown':
        // 计算回撤数据
        const drawdownData = calculateDrawdown(performanceData);
        option = {
          title: {
            text: '回撤分析',
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
            },
            formatter: (params: any) => {
              return `
                <div>
                  <strong>${params[0].axisValue}</strong><br/>
                  回撤: ${params[0].value.toFixed(2)}%
                </div>
              `;
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '15%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: dates,
            axisLabel: {
              formatter: (value: string) => dayjs(value).format('MM-DD'),
            },
          },
          yAxis: {
            type: 'value',
            name: '回撤 (%)',
            max: 0,
            axisLabel: {
              formatter: '{value}%',
            },
          },
          series: [
            {
              name: '回撤',
              type: 'line',
              data: drawdownData,
              smooth: true,
              lineStyle: {
                color: '#ff4d4f',
                width: 2,
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(255, 77, 79, 0.3)' },
                  { offset: 1, color: 'rgba(255, 77, 79, 0.1)' },
                ]),
              },
            },
          ],
        };
        break;
    }

    chartInstance.current.setOption(option, true);
  };

  // 计算回撤
  const calculateDrawdown = (data: PerformanceData[]) => {
    let peak = 0;
    return data.map(item => {
      const value = item.portfolioValue;
      if (value > peak) {
        peak = value;
      }
      const drawdown = peak > 0 ? ((value - peak) / peak) * 100 : 0;
      return drawdown;
    });
  };

  // 处理时间范围选择
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    const now = dayjs();
    let startDate: Dayjs;

    switch (range) {
      case '1M':
        startDate = now.subtract(1, 'month');
        break;
      case '3M':
        startDate = now.subtract(3, 'month');
        break;
      case '6M':
        startDate = now.subtract(6, 'month');
        break;
      case '1Y':
        startDate = now.subtract(1, 'year');
        break;
      case 'YTD':
        startDate = now.startOf('year');
        break;
      default:
        startDate = now.subtract(1, 'year');
    }

    if (range !== 'ALL') {
      setDateRange([startDate, now]);
      onDateRangeChange?.([startDate, now]);
    } else {
      setDateRange(null);
      onDateRangeChange?.(null);
    }
  };

  // 处理自定义日期范围
  const handleDateRangeChange = (dates: [Dayjs, Dayjs] | null) => {
    setDateRange(dates);
    setTimeRange('ALL');
    onDateRangeChange?.(dates);
  };

  return (
    <div className="performance-analysis">
      <Card
        title={
          <Space>
            <LineChartOutlined />
            <Text strong>收益率分析</Text>
          </Space>
        }
        extra={
          <Space wrap>
            <Radio.Group
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              size="small"
            >
              <Radio.Button value="1M">1月</Radio.Button>
              <Radio.Button value="3M">3月</Radio.Button>
              <Radio.Button value="6M">6月</Radio.Button>
              <Radio.Button value="1Y">1年</Radio.Button>
              <Radio.Button value="YTD">今年</Radio.Button>
              <Radio.Button value="ALL">全部</Radio.Button>
            </Radio.Group>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              size="small"
              style={{ width: 200 }}
            />
            <Select
              value={chartType}
              onChange={setChartType}
              size="small"
              style={{ width: 120 }}
            >
              <Option value="cumulative">累计收益</Option>
              <Option value="daily">日收益</Option>
              <Option value="drawdown">回撤分析</Option>
            </Select>
          </Space>
        }
      >
        {/* 绩效指标 */}
        {metrics && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={8} md={6}>
              <Statistic
                title="总收益率"
                value={metrics.totalReturn}
                precision={2}
                suffix="%"
                valueStyle={{ 
                  color: metrics.totalReturn >= 0 ? '#52c41a' : '#ff4d4f' 
                }}
                prefix={metrics.totalReturn >= 0 ? <RiseOutlined /> : <FallOutlined />}
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Statistic
                title="年化收益率"
                value={metrics.annualizedReturn}
                precision={2}
                suffix="%"
                valueStyle={{ 
                  color: metrics.annualizedReturn >= 0 ? '#52c41a' : '#ff4d4f' 
                }}
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Statistic
                title="波动率"
                value={metrics.volatility}
                precision={2}
                suffix="%"
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Statistic
                title="夏普比率"
                value={metrics.sharpeRatio}
                precision={2}
                valueStyle={{ 
                  color: metrics.sharpeRatio >= 1 ? '#52c41a' : '#faad14' 
                }}
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Statistic
                title="最大回撤"
                value={Math.abs(metrics.maxDrawdown)}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#ff4d4f' }}
                prefix="-"
              />
            </Col>
            <Col xs={12} sm={8} md={6}>
              <Statistic
                title="胜率"
                value={metrics.winRate}
                precision={1}
                suffix="%"
                valueStyle={{ 
                  color: metrics.winRate >= 50 ? '#52c41a' : '#faad14' 
                }}
              />
            </Col>
            {metrics.excessReturn !== undefined && (
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="超额收益"
                  value={metrics.excessReturn}
                  precision={2}
                  suffix="%"
                  valueStyle={{ 
                    color: metrics.excessReturn >= 0 ? '#52c41a' : '#ff4d4f' 
                  }}
                />
              </Col>
            )}
            {metrics.informationRatio !== undefined && (
              <Col xs={12} sm={8} md={6}>
                <Statistic
                  title="信息比率"
                  value={metrics.informationRatio}
                  precision={2}
                  valueStyle={{ 
                    color: metrics.informationRatio >= 0.5 ? '#52c41a' : '#faad14' 
                  }}
                />
              </Col>
            )}
          </Row>
        )}

        {/* 图表区域 */}
        <div
          ref={chartRef}
          style={{ width: '100%', height }}
          className="performance-chart"
        />
      </Card>
    </div>
  );
};

export default PerformanceAnalysis;