import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Select, DatePicker, Tooltip } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  InfoCircleOutlined,
  TrophyOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import type { TradeRecord, TradeStats } from '../index';
import './TradeAnalysis.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

export interface TradeAnalysisProps {
  records: TradeRecord[];
  stats: TradeStats;
  loading?: boolean;
}

const TradeAnalysis: React.FC<TradeAnalysisProps> = ({
  records = [],
  stats,
  loading = false,
}) => {
  const [chartType, setChartType] = useState<'daily' | 'monthly' | 'stock' | 'strategy'>('daily');
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);

  // 处理交易分布图表
  useEffect(() => {
    const chartDom = document.getElementById('trade-analysis-chart');
    if (!chartDom || loading || records.length === 0) return;

    const chart = echarts.init(chartDom);

    let option: echarts.EChartsOption = {};

    switch (chartType) {
      case 'daily': {
        // 按日统计交易
        const dailyStats = records.reduce((acc, record) => {
          const date = dayjs(record.trade_time).format('YYYY-MM-DD');
          if (!acc[date]) {
            acc[date] = { buyCount: 0, sellCount: 0, buyAmount: 0, sellAmount: 0 };
          }
          if (record.trade_type === 'buy') {
            acc[date].buyCount++;
            acc[date].buyAmount += record.amount;
          } else {
            acc[date].sellCount++;
            acc[date].sellAmount += record.amount;
          }
          return acc;
        }, {} as Record<string, any>);

        const dates = Object.keys(dailyStats).sort();
        const buyData = dates.map(date => dailyStats[date].buyCount);
        const sellData = dates.map(date => dailyStats[date].sellCount);

        option = {
          title: {
            text: '每日交易笔数统计',
            left: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
            formatter: (params: any) => {
              const date = params[0].axisValue;
              const buyCount = params[0].value;
              const sellCount = params[1].value;
              const dayData = dailyStats[date];
              return `
                <div style="padding: 8px;">
                  <div style="font-weight: bold; margin-bottom: 6px;">${date}</div>
                  <div style="display: flex; align-items: center; margin: 3px 0;">
                    <span style="display: inline-block; width: 10px; height: 10px; background: #52c41a; border-radius: 50%; margin-right: 6px;"></span>
                    买入: ${buyCount}笔 (¥${(dayData.buyAmount / 10000).toFixed(2)}万)
                  </div>
                  <div style="display: flex; align-items: center; margin: 3px 0;">
                    <span style="display: inline-block; width: 10px; height: 10px; background: #ff4d4f; border-radius: 50%; margin-right: 6px;"></span>
                    卖出: ${sellCount}笔 (¥${(dayData.sellAmount / 10000).toFixed(2)}万)
                  </div>
                </div>
              `;
            },
          },
          legend: {
            data: ['买入', '卖出'],
            top: '30px',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '80px',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: dates.map(date => dayjs(date).format('MM-DD')),
            axisLabel: {
              rotate: 45,
            },
          },
          yAxis: {
            type: 'value',
            name: '交易笔数',
          },
          series: [
            {
              name: '买入',
              type: 'bar',
              data: buyData,
              itemStyle: {
                color: '#52c41a',
              },
            },
            {
              name: '卖出',
              type: 'bar',
              data: sellData,
              itemStyle: {
                color: '#ff4d4f',
              },
            },
          ],
        };
        break;
      }

      case 'stock': {
        // 按股票统计
        const stockStats = records.reduce((acc, record) => {
          const key = `${record.stock_code} ${record.stock_name}`;
          if (!acc[key]) {
            acc[key] = { count: 0, amount: 0 };
          }
          acc[key].count++;
          acc[key].amount += record.amount;
          return acc;
        }, {} as Record<string, any>);

        const stockData = Object.entries(stockStats)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 10)
          .map(([stock, data]) => ({
            name: stock,
            value: data.count,
            amount: data.amount,
          }));

        option = {
          title: {
            text: '交易股票分布 (Top 10)',
            left: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
              const data = stockData[params.dataIndex];
              return `
                <div style="padding: 8px;">
                  <div style="font-weight: bold; margin-bottom: 6px;">${params.name}</div>
                  <div>交易笔数: ${params.value}笔</div>
                  <div>交易金额: ¥${(data.amount / 10000).toFixed(2)}万</div>
                  <div>占比: ${params.percent}%</div>
                </div>
              `;
            },
          },
          series: [
            {
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['50%', '60%'],
              data: stockData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
              label: {
                show: true,
                formatter: '{b}: {c}笔',
                fontSize: 10,
              },
            },
          ],
        };
        break;
      }

      case 'strategy': {
        // 按策略统计
        const strategyStats = records.reduce((acc, record) => {
          const strategy = record.strategy_name || '未分类';
          if (!acc[strategy]) {
            acc[strategy] = { count: 0, amount: 0, profit: 0 };
          }
          acc[strategy].count++;
          acc[strategy].amount += record.amount;
          // 模拟盈亏计算
          acc[strategy].profit += (Math.random() - 0.4) * record.amount * 0.05;
          return acc;
        }, {} as Record<string, any>);

        const strategies = Object.keys(strategyStats);
        const counts = strategies.map(s => strategyStats[s].count);
        const profits = strategies.map(s => strategyStats[s].profit);

        option = {
          title: {
            text: '策略交易分析',
            left: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
            formatter: (params: any) => {
              const strategy = params[0].axisValue;
              const count = params[0].value;
              const profit = params[1].value;
              const data = strategyStats[strategy];
              return `
                <div style="padding: 8px;">
                  <div style="font-weight: bold; margin-bottom: 6px;">${strategy}</div>
                  <div>交易笔数: ${count}笔</div>
                  <div>交易金额: ¥${(data.amount / 10000).toFixed(2)}万</div>
                  <div>盈亏: ¥${(profit / 10000).toFixed(2)}万</div>
                </div>
              `;
            },
          },
          legend: {
            data: ['交易笔数', '盈亏金额'],
            top: '30px',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '80px',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: strategies,
            axisLabel: {
              rotate: 45,
            },
          },
          yAxis: [
            {
              type: 'value',
              name: '交易笔数',
              position: 'left',
            },
            {
              type: 'value',
              name: '盈亏金额 (万元)',
              position: 'right',
            },
          ],
          series: [
            {
              name: '交易笔数',
              type: 'bar',
              yAxisIndex: 0,
              data: counts,
              itemStyle: {
                color: '#1890ff',
              },
            },
            {
              name: '盈亏金额',
              type: 'line',
              yAxisIndex: 1,
              data: profits.map(p => (p / 10000).toFixed(2)),
              itemStyle: {
                color: '#52c41a',
              },
              lineStyle: {
                width: 3,
              },
            },
          ],
        };
        break;
      }

      case 'monthly': {
        // 按月统计
        const monthlyStats = records.reduce((acc, record) => {
          const month = dayjs(record.trade_time).format('YYYY-MM');
          if (!acc[month]) {
            acc[month] = { count: 0, amount: 0 };
          }
          acc[month].count++;
          acc[month].amount += record.amount;
          return acc;
        }, {} as Record<string, any>);

        const months = Object.keys(monthlyStats).sort();
        const monthData = months.map(month => ({
          month: dayjs(month).format('MM月'),
          count: monthlyStats[month].count,
          amount: monthlyStats[month].amount / 10000,
        }));

        option = {
          title: {
            text: '月度交易统计',
            left: 'center',
            textStyle: {
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
            },
            formatter: (params: any) => {
              const month = params[0].axisValue;
              const count = params[0].value;
              const amount = params[1].value;
              return `
                <div style="padding: 8px;">
                  <div style="font-weight: bold; margin-bottom: 6px;">${month}</div>
                  <div>交易笔数: ${count}笔</div>
                  <div>交易金额: ¥${amount}万</div>
                </div>
              `;
            },
          },
          legend: {
            data: ['交易笔数', '交易金额'],
            top: '30px',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '80px',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: monthData.map(d => d.month),
          },
          yAxis: [
            {
              type: 'value',
              name: '交易笔数',
              position: 'left',
            },
            {
              type: 'value',
              name: '交易金额 (万元)',
              position: 'right',
            },
          ],
          series: [
            {
              name: '交易笔数',
              type: 'bar',
              yAxisIndex: 0,
              data: monthData.map(d => d.count),
              itemStyle: {
                color: '#1890ff',
              },
            },
            {
              name: '交易金额',
              type: 'line',
              yAxisIndex: 1,
              data: monthData.map(d => d.amount),
              itemStyle: {
                color: '#52c41a',
              },
              lineStyle: {
                width: 3,
              },
            },
          ],
        };
        break;
      }
    }

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [records, chartType, loading]);

  // 计算高级统计指标
  const calculateAdvancedStats = () => {
    if (records.length === 0) return {};

    const buyRecords = records.filter(r => r.trade_type === 'buy');
    const sellRecords = records.filter(r => r.trade_type === 'sell');
    
    const avgTradeAmount = records.reduce((sum, r) => sum + r.amount, 0) / records.length;
    const maxTradeAmount = Math.max(...records.map(r => r.amount));
    const minTradeAmount = Math.min(...records.map(r => r.amount));
    
    const tradingDays = new Set(records.map(r => dayjs(r.trade_time).format('YYYY-MM-DD'))).size;
    const avgTradesPerDay = records.length / tradingDays;
    
    return {
      avgTradeAmount,
      maxTradeAmount,
      minTradeAmount,
      tradingDays,
      avgTradesPerDay,
      buyCount: buyRecords.length,
      sellCount: sellRecords.length,
      buyRatio: (buyRecords.length / records.length) * 100,
    };
  };

  const advancedStats = calculateAdvancedStats();

  return (
    <div className="trade-analysis">
      {/* 核心统计指标 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span>
                  总盈亏
                  <Tooltip title="所有已完成交易的总盈亏">
                    <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                  </Tooltip>
                </span>
              }
              value={stats.totalProfitLoss}
              precision={2}
              prefix="¥"
              valueStyle={{ color: stats.totalProfitLoss >= 0 ? '#3f8600' : '#cf1322' }}
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
              value={stats.winRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: stats.winRate >= 60 ? '#3f8600' : '#cf1322' }}
            />
            <Progress
              percent={stats.winRate}
              showInfo={false}
              strokeColor={stats.winRate >= 60 ? '#52c41a' : '#ff4d4f'}
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span>
                  夏普比率
                  <Tooltip title="风险调整后收益指标">
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
        <Col span={6}>
          <Card size="small">
            <Statistic
              title={
                <span>
                  平均持仓天数
                  <Tooltip title="平均每笔交易的持仓时间">
                    <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                  </Tooltip>
                </span>
              }
              value={stats.avgHoldingDays}
              precision={1}
              suffix="天"
            />
          </Card>
        </Col>
      </Row>

      {/* 交易构成分析 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card size="small" title="交易类型分布">
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ marginBottom: 16 }}>
                <Tag color="success" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  买入 {advancedStats.buyCount || 0} 笔
                </Tag>
                <Tag color="error" style={{ fontSize: '14px', padding: '4px 12px', marginLeft: 8 }}>
                  卖出 {advancedStats.sellCount || 0} 笔
                </Tag>
              </div>
              <Progress
                type="circle"
                percent={Number((advancedStats.buyRatio || 0).toFixed(1))}
                format={percent => `买入\n${percent}%`}
                width={80}
                strokeColor="#52c41a"
              />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="交易规模分析">
            <div style={{ padding: '8px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>平均金额:</span>
                <span>¥{((advancedStats.avgTradeAmount || 0) / 10000).toFixed(2)}万</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>最大金额:</span>
                <span>¥{((advancedStats.maxTradeAmount || 0) / 10000).toFixed(2)}万</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>最小金额:</span>
                <span>¥{((advancedStats.minTradeAmount || 0) / 10000).toFixed(2)}万</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>日均交易:</span>
                <span>{(advancedStats.avgTradesPerDay || 0).toFixed(1)}笔</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" title="费用统计">
            <div style={{ padding: '8px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>总手续费:</span>
                <span style={{ color: '#ff4d4f' }}>
                  ¥{(stats.totalCommission / 10000).toFixed(2)}万
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>费率占比:</span>
                <span>
                  {((stats.totalCommission / stats.totalVolume) * 100).toFixed(3)}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>平均费用:</span>
                <span>¥{(stats.totalCommission / stats.totalTrades).toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表分析 */}
      <Card
        title="交易分析图表"
        extra={
          <Select
            value={chartType}
            onChange={setChartType}
            style={{ width: 120 }}
            size="small"
          >
            <Option value="daily">按日统计</Option>
            <Option value="monthly">按月统计</Option>
            <Option value="stock">股票分布</Option>
            <Option value="strategy">策略分析</Option>
          </Select>
        }
      >
        <div
          id="trade-analysis-chart"
          style={{ width: '100%', height: '400px' }}
        />
      </Card>
    </div>
  );
};

export default TradeAnalysis;