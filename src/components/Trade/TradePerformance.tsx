import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag, Tooltip, Select, Button } from 'antd';
import {
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  InfoCircleOutlined,
  ExportOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import type { TradeRecord, TradeStats } from '@/components/Trade';
import './TradePerformance.less';

const { Option } = Select;

export interface PerformanceMetric {
  name: string;
  value: number;
  benchmark?: number;
  unit: string;
  description: string;
  category: 'return' | 'risk' | 'efficiency';
  level: 'excellent' | 'good' | 'average' | 'poor';
}

export interface StockPerformance {
  stockCode: string;
  stockName: string;
  totalTrades: number;
  totalVolume: number;
  netProfitLoss: number;
  winRate: number;
  avgHoldingDays: number;
  maxProfit: number;
  maxLoss: number;
  sharpeRatio: number;
  profitFactor: number;
}

export interface TradePerformanceProps {
  stats: TradeStats;
  records: TradeRecord[];
  loading?: boolean;
  onExport?: () => void;
}

const TradePerformance: React.FC<TradePerformanceProps> = ({
  stats,
  records = [],
  loading = false,
  onExport,
}) => {
  const [performanceType, setPerformanceType] = useState<'overall' | 'stock' | 'strategy'>('overall');
  const [stockPerformances, setStockPerformances] = useState<StockPerformance[]>([]);

  // 计算绩效指标
  const calculatePerformanceMetrics = (): PerformanceMetric[] => {
    const getLevel = (value: number, thresholds: [number, number, number]): PerformanceMetric['level'] => {
      if (value >= thresholds[0]) return 'excellent';
      if (value >= thresholds[1]) return 'good';
      if (value >= thresholds[2]) return 'average';
      return 'poor';
    };

    return [
      {
        name: '总收益率',
        value: stats.profitLossRatio,
        benchmark: 15,
        unit: '%',
        description: '总盈亏与总投入资金的比例',
        category: 'return',
        level: getLevel(stats.profitLossRatio, [20, 10, 5]),
      },
      {
        name: '胜率',
        value: stats.winRate,
        benchmark: 60,
        unit: '%',
        description: '盈利交易占总交易笔数的比例',
        category: 'efficiency',
        level: getLevel(stats.winRate, [70, 60, 50]),
      },
      {
        name: '夏普比率',
        value: stats.sharpeRatio,
        benchmark: 1.0,
        unit: '',
        description: '风险调整后的收益指标',
        category: 'risk',
        level: getLevel(stats.sharpeRatio, [1.5, 1.0, 0.5]),
      },
      {
        name: '最大单笔盈利',
        value: stats.maxSingleProfit,
        unit: '¥',
        description: '单笔交易的最大盈利金额',
        category: 'return',
        level: getLevel(stats.maxSingleProfit, [100000, 50000, 20000]),
      },
      {
        name: '最大单笔亏损',
        value: Math.abs(stats.maxSingleLoss),
        unit: '¥',
        description: '单笔交易的最大亏损金额',
        category: 'risk',
        level: getLevel(-Math.abs(stats.maxSingleLoss), [-10000, -20000, -50000]),
      },
      {
        name: '平均持仓天数',
        value: stats.avgHoldingDays,
        benchmark: 7,
        unit: '天',
        description: '平均每笔交易的持仓时间',
        category: 'efficiency',
        level: getLevel(30 - stats.avgHoldingDays, [25, 20, 15]), // 越短越好（短线交易）
      },
      {
        name: '盈亏比',
        value: stats.maxSingleProfit / Math.abs(stats.maxSingleLoss),
        benchmark: 2.0,
        unit: '',
        description: '平均盈利与平均亏损的比值',
        category: 'efficiency',
        level: getLevel(stats.maxSingleProfit / Math.abs(stats.maxSingleLoss), [3, 2, 1.5]),
      },
      {
        name: '年化收益率',
        value: stats.profitLossRatio * (365 / Math.max(1, stats.avgHoldingDays * stats.totalTrades / 365)),
        benchmark: 20,
        unit: '%',
        description: '按当前收益率推算的年化收益',
        category: 'return',
        level: getLevel(stats.profitLossRatio * (365 / Math.max(1, stats.avgHoldingDays * stats.totalTrades / 365)), [30, 20, 10]),
      },
    ];
  };

  // 计算个股绩效
  const calculateStockPerformances = (): StockPerformance[] => {
    const stockStats: Record<string, any> = {};
    
    records.forEach(record => {
      const key = `${record.stock_code}_${record.stock_name}`;
      if (!stockStats[key]) {
        stockStats[key] = {
          stockCode: record.stock_code,
          stockName: record.stock_name,
          records: [],
        };
      }
      stockStats[key].records.push(record);
    });

    return Object.values(stockStats).map((stock: any) => {
      const stockRecords = stock.records;
      const totalTrades = stockRecords.length;
      const totalVolume = stockRecords.reduce((sum: number, r: TradeRecord) => sum + r.amount, 0);
      
      // 模拟盈亏计算
      const profits = stockRecords.filter(() => Math.random() > 0.4);
      const netProfitLoss = stockRecords.reduce((sum: number, r: TradeRecord) => 
        sum + (Math.random() - 0.4) * r.amount * 0.05, 0);
      
      const winRate = profits.length / totalTrades * 100;
      const avgHoldingDays = 2 + Math.random() * 10;
      const maxProfit = Math.max(...stockRecords.map(() => Math.random() * 20000));
      const maxLoss = -Math.max(...stockRecords.map(() => Math.random() * 15000));
      const sharpeRatio = 0.5 + Math.random() * 1.0;
      const profitFactor = 1 + Math.random() * 2;

      return {
        stockCode: stock.stockCode,
        stockName: stock.stockName,
        totalTrades,
        totalVolume,
        netProfitLoss,
        winRate,
        avgHoldingDays,
        maxProfit,
        maxLoss,
        sharpeRatio,
        profitFactor,
      };
    }).sort((a, b) => b.netProfitLoss - a.netProfitLoss);
  };

  useEffect(() => {
    setStockPerformances(calculateStockPerformances());
  }, [records]);

  // 处理绩效雷达图
  useEffect(() => {
    const chartDom = document.getElementById('performance-radar-chart');
    if (!chartDom || loading) return;

    const chart = echarts.init(chartDom);
    const metrics = calculatePerformanceMetrics();

    // 雷达图数据
    const indicators = metrics.map(metric => ({
      name: metric.name,
      max: metric.benchmark ? metric.benchmark * 1.5 : Math.max(metric.value * 1.5, 100),
    }));

    const radarData = metrics.map(metric => {
      let normalizedValue = metric.value;
      if (metric.benchmark) {
        normalizedValue = (metric.value / metric.benchmark) * metric.benchmark;
      }
      return Math.max(0, normalizedValue);
    });

    const benchmarkData = metrics.map(metric => metric.benchmark || metric.value);

    const option: echarts.EChartsOption = {
      title: {
        text: '绩效评估雷达图',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const metric = metrics[params.dataIndex];
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 6px;">${metric.name}</div>
              <div>当前值: ${metric.value.toFixed(2)}${metric.unit}</div>
              ${metric.benchmark ? `<div>基准值: ${metric.benchmark}${metric.unit}</div>` : ''}
              <div style="margin-top: 6px; color: #666; font-size: 12px;">${metric.description}</div>
            </div>
          `;
        },
      },
      legend: {
        data: ['当前表现', '基准水平'],
        top: '30px',
      },
      radar: {
        center: ['50%', '60%'],
        radius: '60%',
        indicator: indicators,
        nameGap: 5,
        name: {
          textStyle: {
            fontSize: 12,
          },
        },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: radarData,
              name: '当前表现',
              areaStyle: {
                color: 'rgba(24, 144, 255, 0.3)',
              },
              lineStyle: {
                color: '#1890ff',
                width: 2,
              },
              itemStyle: {
                color: '#1890ff',
              },
            },
            {
              value: benchmarkData,
              name: '基准水平',
              areaStyle: {
                color: 'rgba(82, 196, 26, 0.3)',
              },
              lineStyle: {
                color: '#52c41a',
                width: 2,
                type: 'dashed',
              },
              itemStyle: {
                color: '#52c41a',
              },
            },
          ],
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
  }, [stats, loading]);

  const metrics = calculatePerformanceMetrics();

  // 个股绩效表格列定义
  const stockColumns: ColumnsType<StockPerformance> = [
    {
      title: '股票',
      key: 'stock',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.stockCode}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.stockName}</div>
        </div>
      ),
    },
    {
      title: '交易笔数',
      dataIndex: 'totalTrades',
      key: 'totalTrades',
      width: 80,
      align: 'right',
      sorter: (a, b) => a.totalTrades - b.totalTrades,
    },
    {
      title: '成交金额',
      dataIndex: 'totalVolume',
      key: 'totalVolume',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.totalVolume - b.totalVolume,
      render: (value) => `¥${(value / 10000).toFixed(2)}万`,
    },
    {
      title: '净盈亏',
      dataIndex: 'netProfitLoss',
      key: 'netProfitLoss',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.netProfitLoss - b.netProfitLoss,
      render: (value) => (
        <span style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {value >= 0 ? '+' : ''}¥{(value / 10000).toFixed(2)}万
        </span>
      ),
    },
    {
      title: '胜率',
      dataIndex: 'winRate',
      key: 'winRate',
      width: 80,
      align: 'right',
      sorter: (a, b) => a.winRate - b.winRate,
      render: (value) => (
        <span style={{ color: value >= 60 ? '#52c41a' : '#ff4d4f' }}>
          {value.toFixed(1)}%
        </span>
      ),
    },
    {
      title: '夏普比率',
      dataIndex: 'sharpeRatio',
      key: 'sharpeRatio',
      width: 80,
      align: 'right',
      sorter: (a, b) => a.sharpeRatio - b.sharpeRatio,
      render: (value) => (
        <span style={{ color: value >= 1 ? '#52c41a' : '#ff4d4f' }}>
          {value.toFixed(3)}
        </span>
      ),
    },
    {
      title: '盈亏比',
      dataIndex: 'profitFactor',
      key: 'profitFactor',
      width: 80,
      align: 'right',
      sorter: (a, b) => a.profitFactor - b.profitFactor,
      render: (value) => (
        <span style={{ color: value >= 2 ? '#52c41a' : '#ff4d4f' }}>
          {value.toFixed(2)}
        </span>
      ),
    },
    {
      title: '评级',
      key: 'rating',
      width: 80,
      align: 'center',
      render: (_, record) => {
        const score = (
          (record.winRate >= 60 ? 25 : 0) +
          (record.sharpeRatio >= 1 ? 25 : 0) +
          (record.profitFactor >= 2 ? 25 : 0) +
          (record.netProfitLoss > 0 ? 25 : 0)
        );
        
        let color = '#ff4d4f';
        let text = 'D';
        
        if (score >= 75) { color = '#52c41a'; text = 'A'; }
        else if (score >= 50) { color = '#faad14'; text = 'B'; }
        else if (score >= 25) { color = '#ff7a45'; text = 'C'; }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <div className="trade-performance">
      {/* 核心绩效指标 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        {metrics.slice(0, 4).map((metric, index) => (
          <Col span={6} key={index}>
            <Card size="small">
              <Statistic
                title={
                  <span>
                    {metric.name}
                    <Tooltip title={metric.description}>
                      <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                }
                value={metric.value}
                precision={metric.unit === '¥' ? 0 : 2}
                suffix={metric.unit !== '¥' ? metric.unit : ''}
                prefix={metric.unit === '¥' ? '¥' : ''}
                valueStyle={{
                  color: metric.level === 'excellent' ? '#52c41a' :
                         metric.level === 'good' ? '#1890ff' :
                         metric.level === 'average' ? '#faad14' : '#ff4d4f'
                }}
                formatter={metric.unit === '¥' ? 
                  (value) => `${(Number(value) / 10000).toFixed(2)}万` : 
                  undefined
                }
              />
              <Progress
                percent={metric.benchmark ? Math.min(100, (metric.value / metric.benchmark) * 100) : 
                         metric.level === 'excellent' ? 100 :
                         metric.level === 'good' ? 75 :
                         metric.level === 'average' ? 50 : 25}
                showInfo={false}
                strokeColor={
                  metric.level === 'excellent' ? '#52c41a' :
                  metric.level === 'good' ? '#1890ff' :
                  metric.level === 'average' ? '#faad14' : '#ff4d4f'
                }
                size="small"
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 绩效评估雷达图 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="绩效评估雷达图">
            <div
              id="performance-radar-chart"
              style={{ width: '100%', height: '300px' }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="绩效等级分布">
            <div style={{ padding: '20px 0' }}>
              {metrics.map((metric, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ width: '100px', fontSize: '12px' }}>{metric.name}</div>
                  <div style={{ flex: 1, marginLeft: 8 }}>
                    <Progress
                      percent={
                        metric.level === 'excellent' ? 100 :
                        metric.level === 'good' ? 75 :
                        metric.level === 'average' ? 50 : 25
                      }
                      strokeColor={
                        metric.level === 'excellent' ? '#52c41a' :
                        metric.level === 'good' ? '#1890ff' :
                        metric.level === 'average' ? '#faad14' : '#ff4d4f'
                      }
                      showInfo={false}
                      size="small"
                    />
                  </div>
                  <Tag
                    color={
                      metric.level === 'excellent' ? 'success' :
                      metric.level === 'good' ? 'processing' :
                      metric.level === 'average' ? 'warning' : 'error'
                    }
                    style={{ marginLeft: 8, minWidth: 50, textAlign: 'center' }}
                  >
                    {metric.level === 'excellent' ? '优秀' :
                     metric.level === 'good' ? '良好' :
                     metric.level === 'average' ? '一般' : '较差'}
                  </Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 个股绩效分析 */}
      <Card
        title="个股绩效排行"
        extra={
          <Space>
            <Select
              value={performanceType}
              onChange={setPerformanceType}
              style={{ width: 120 }}
              size="small"
            >
              <Option value="overall">综合绩效</Option>
              <Option value="stock">个股分析</Option>
              <Option value="strategy">策略分析</Option>
            </Select>
            <Button size="small" icon={<ExportOutlined />} onClick={onExport}>
              导出报告
            </Button>
          </Space>
        }
      >
        <Table
          columns={stockColumns}
          dataSource={stockPerformances.slice(0, 20)}
          rowKey="stockCode"
          size="small"
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 只股票`,
          }}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default TradePerformance;