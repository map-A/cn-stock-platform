import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Tag, Select, DatePicker, Tooltip, Button, Space } from 'antd';
import { InfoCircleOutlined, ExportOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import type { TradeRecord } from '../index';
import './ProfitLossReport.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

export interface ProfitLossData {
  period: string;
  totalTrades: number;
  totalVolume: number;
  totalFees: number;
  totalProfit: number;
  totalLoss: number;
  netProfitLoss: number;
  profitTrades: number;
  lossTrades: number;
  winRate: number;
  avgProfit: number;
  avgLoss: number;
  profitFactor: number;
  maxProfit: number;
  maxLoss: number;
}

export interface ProfitLossReportProps {
  records: TradeRecord[];
  dateRange: [string, string];
  loading?: boolean;
  onExport?: (data: ProfitLossData[]) => void;
}

const ProfitLossReport: React.FC<ProfitLossReportProps> = ({
  records = [],
  dateRange,
  loading = false,
  onExport,
}) => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [profitLossData, setProfitLossData] = useState<ProfitLossData[]>([]);

  // 计算盈亏数据
  const calculateProfitLoss = () => {
    if (records.length === 0) return [];

    const groupedData: Record<string, TradeRecord[]> = {};
    
    records.forEach(record => {
      let key: string;
      const date = dayjs(record.trade_time);
      
      switch (reportType) {
        case 'daily':
          key = date.format('YYYY-MM-DD');
          break;
        case 'weekly':
          key = `${date.format('YYYY')}-W${date.week()}`;
          break;
        case 'monthly':
          key = date.format('YYYY-MM');
          break;
        default:
          key = date.format('YYYY-MM-DD');
      }
      
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push(record);
    });

    const result: ProfitLossData[] = Object.entries(groupedData).map(([period, periodRecords]) => {
      // 模拟盈亏计算（实际应该根据买卖配对计算）
      const profitRecords = periodRecords.filter(() => Math.random() > 0.4); // 60% 盈利
      const lossRecords = periodRecords.filter(r => !profitRecords.includes(r));
      
      const totalVolume = periodRecords.reduce((sum, r) => sum + r.amount, 0);
      const totalFees = periodRecords.reduce((sum, r) => sum + r.commission + r.stamp_duty + r.transfer_fee, 0);
      
      const totalProfit = profitRecords.reduce((sum, r) => sum + (r.amount * (0.01 + Math.random() * 0.05)), 0);
      const totalLoss = lossRecords.reduce((sum, r) => sum + (r.amount * (0.01 + Math.random() * 0.03)), 0);
      const netProfitLoss = totalProfit - totalLoss - totalFees;
      
      const avgProfit = profitRecords.length > 0 ? totalProfit / profitRecords.length : 0;
      const avgLoss = lossRecords.length > 0 ? totalLoss / lossRecords.length : 0;
      const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0;
      
      const profits = profitRecords.map(r => r.amount * (0.01 + Math.random() * 0.05));
      const losses = lossRecords.map(r => r.amount * (0.01 + Math.random() * 0.03));
      
      return {
        period,
        totalTrades: periodRecords.length,
        totalVolume,
        totalFees,
        totalProfit,
        totalLoss,
        netProfitLoss,
        profitTrades: profitRecords.length,
        lossTrades: lossRecords.length,
        winRate: periodRecords.length > 0 ? (profitRecords.length / periodRecords.length) * 100 : 0,
        avgProfit,
        avgLoss,
        profitFactor,
        maxProfit: profits.length > 0 ? Math.max(...profits) : 0,
        maxLoss: losses.length > 0 ? Math.max(...losses) : 0,
      };
    }).sort((a, b) => a.period.localeCompare(b.period));

    return result;
  };

  useEffect(() => {
    const data = calculateProfitLoss();
    setProfitLossData(data);
  }, [records, reportType]);

  // 处理盈亏趋势图表
  useEffect(() => {
    const chartDom = document.getElementById('profit-loss-chart');
    if (!chartDom || loading || profitLossData.length === 0) return;

    const chart = echarts.init(chartDom);

    const periods = profitLossData.map(data => {
      switch (reportType) {
        case 'daily':
          return dayjs(data.period).format('MM-DD');
        case 'weekly':
          return data.period.replace(/(\d{4})-W(\d+)/, '$1年第$2周');
        case 'monthly':
          return dayjs(data.period).format('YYYY年MM月');
        default:
          return data.period;
      }
    });

    const profits = profitLossData.map(data => (data.totalProfit / 10000).toFixed(2));
    const losses = profitLossData.map(data => (data.totalLoss / 10000).toFixed(2));
    const netPnL = profitLossData.map(data => (data.netProfitLoss / 10000).toFixed(2));

    const option: echarts.EChartsOption = {
      title: {
        text: '盈亏趋势分析',
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
          const index = params[0].dataIndex;
          const data = profitLossData[index];
          const period = params[0].axisValue;
          
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 6px;">${period}</div>
              <div style="display: flex; align-items: center; margin: 3px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background: #52c41a; border-radius: 50%; margin-right: 6px;"></span>
                总盈利: ¥${(data.totalProfit / 10000).toFixed(2)}万 (${data.profitTrades}笔)
              </div>
              <div style="display: flex; align-items: center; margin: 3px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background: #ff4d4f; border-radius: 50%; margin-right: 6px;"></span>
                总亏损: ¥${(data.totalLoss / 10000).toFixed(2)}万 (${data.lossTrades}笔)
              </div>
              <div style="display: flex; align-items: center; margin: 3px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background: #1890ff; border-radius: 50%; margin-right: 6px;"></span>
                净盈亏: ¥${(data.netProfitLoss / 10000).toFixed(2)}万
              </div>
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #f0f0f0;">
                <div>胜率: ${data.winRate.toFixed(1)}%</div>
                <div>盈亏比: ${data.profitFactor.toFixed(2)}</div>
                <div>手续费: ¥${(data.totalFees / 10000).toFixed(2)}万</div>
              </div>
            </div>
          `;
        },
      },
      legend: {
        data: ['总盈利', '总亏损', '净盈亏'],
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
        data: periods,
        axisLabel: {
          rotate: 45,
          interval: Math.max(0, Math.floor(periods.length / 10)),
        },
      },
      yAxis: {
        type: 'value',
        name: '金额 (万元)',
        axisLabel: {
          formatter: '{value}万',
        },
      },
      series: [
        {
          name: '总盈利',
          type: 'bar',
          data: profits,
          itemStyle: {
            color: '#52c41a',
          },
        },
        {
          name: '总亏损',
          type: 'bar',
          data: losses.map(loss => -Number(loss)),
          itemStyle: {
            color: '#ff4d4f',
          },
        },
        {
          name: '净盈亏',
          type: 'line',
          data: netPnL,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: '#1890ff',
          },
          symbol: 'circle',
          symbolSize: 6,
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
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
  }, [profitLossData, reportType, loading]);

  // 表格列定义
  const columns: ColumnsType<ProfitLossData> = [
    {
      title: '时间周期',
      dataIndex: 'period',
      key: 'period',
      width: 120,
      render: (period) => {
        switch (reportType) {
          case 'daily':
            return dayjs(period).format('MM-DD');
          case 'weekly':
            return period.replace(/(\d{4})-W(\d+)/, '$1年第$2周');
          case 'monthly':
            return dayjs(period).format('YYYY年MM月');
          default:
            return period;
        }
      },
    },
    {
      title: '交易笔数',
      dataIndex: 'totalTrades',
      key: 'totalTrades',
      width: 80,
      align: 'right',
      render: (value) => value.toLocaleString(),
    },
    {
      title: '成交金额',
      dataIndex: 'totalVolume',
      key: 'totalVolume',
      width: 100,
      align: 'right',
      render: (value) => `¥${(value / 10000).toFixed(2)}万`,
    },
    {
      title: '总盈利',
      dataIndex: 'totalProfit',
      key: 'totalProfit',
      width: 100,
      align: 'right',
      render: (value) => (
        <span style={{ color: '#52c41a' }}>
          ¥{(value / 10000).toFixed(2)}万
        </span>
      ),
    },
    {
      title: '总亏损',
      dataIndex: 'totalLoss',
      key: 'totalLoss',
      width: 100,
      align: 'right',
      render: (value) => (
        <span style={{ color: '#ff4d4f' }}>
          -¥{(value / 10000).toFixed(2)}万
        </span>
      ),
    },
    {
      title: '净盈亏',
      dataIndex: 'netProfitLoss',
      key: 'netProfitLoss',
      width: 100,
      align: 'right',
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
      render: (value) => (
        <span style={{ color: value >= 60 ? '#52c41a' : '#ff4d4f' }}>
          {value.toFixed(1)}%
        </span>
      ),
    },
    {
      title: '盈亏比',
      dataIndex: 'profitFactor',
      key: 'profitFactor',
      width: 80,
      align: 'right',
      render: (value) => (
        <span style={{ color: value >= 1.5 ? '#52c41a' : '#ff4d4f' }}>
          {value.toFixed(2)}
        </span>
      ),
    },
    {
      title: '手续费',
      dataIndex: 'totalFees',
      key: 'totalFees',
      width: 80,
      align: 'right',
      render: (value) => (
        <span style={{ color: '#999' }}>
          ¥{(value / 10000).toFixed(2)}万
        </span>
      ),
    },
  ];

  // 计算汇总数据
  const summary = profitLossData.reduce(
    (acc, data) => ({
      totalTrades: acc.totalTrades + data.totalTrades,
      totalVolume: acc.totalVolume + data.totalVolume,
      totalProfit: acc.totalProfit + data.totalProfit,
      totalLoss: acc.totalLoss + data.totalLoss,
      totalFees: acc.totalFees + data.totalFees,
      netProfitLoss: acc.netProfitLoss + data.netProfitLoss,
      profitTrades: acc.profitTrades + data.profitTrades,
      lossTrades: acc.lossTrades + data.lossTrades,
    }),
    {
      totalTrades: 0,
      totalVolume: 0,
      totalProfit: 0,
      totalLoss: 0,
      totalFees: 0,
      netProfitLoss: 0,
      profitTrades: 0,
      lossTrades: 0,
    }
  );

  const summaryWinRate = summary.totalTrades > 0 ? (summary.profitTrades / summary.totalTrades) * 100 : 0;
  const summaryProfitFactor = summary.totalLoss > 0 ? summary.totalProfit / summary.totalLoss : 0;

  return (
    <div className="profit-loss-report">
      {/* 控制面板 */}
      <Card size="small" className="profit-loss-controls">
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Space>
              <span>统计周期:</span>
              <Select
                value={reportType}
                onChange={setReportType}
                style={{ width: 100 }}
                size="small"
              >
                <Option value="daily">按日</Option>
                <Option value="weekly">按周</Option>
                <Option value="monthly">按月</Option>
              </Select>
            </Space>
          </Col>
          <Col span={18}>
            <Space style={{ float: 'right' }}>
              <Button
                size="small"
                icon={<ExportOutlined />}
                onClick={() => onExport?.(profitLossData)}
              >
                导出报表
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 汇总统计 */}
      <Card title="汇总统计" size="small" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col span={4}>
            <div className="summary-item">
              <div className="summary-label">总交易笔数</div>
              <div className="summary-value">{summary.totalTrades}笔</div>
            </div>
          </Col>
          <Col span={4}>
            <div className="summary-item">
              <div className="summary-label">总成交金额</div>
              <div className="summary-value">¥{(summary.totalVolume / 10000).toFixed(2)}万</div>
            </div>
          </Col>
          <Col span={4}>
            <div className="summary-item">
              <div className="summary-label">净盈亏</div>
              <div className={`summary-value ${summary.netProfitLoss >= 0 ? 'profit' : 'loss'}`}>
                {summary.netProfitLoss >= 0 ? '+' : ''}¥{(summary.netProfitLoss / 10000).toFixed(2)}万
              </div>
            </div>
          </Col>
          <Col span={4}>
            <div className="summary-item">
              <div className="summary-label">总胜率</div>
              <div className={`summary-value ${summaryWinRate >= 60 ? 'profit' : 'loss'}`}>
                {summaryWinRate.toFixed(1)}%
              </div>
            </div>
          </Col>
          <Col span={4}>
            <div className="summary-item">
              <div className="summary-label">盈亏比</div>
              <div className={`summary-value ${summaryProfitFactor >= 1.5 ? 'profit' : 'loss'}`}>
                {summaryProfitFactor.toFixed(2)}
              </div>
            </div>
          </Col>
          <Col span={4}>
            <div className="summary-item">
              <div className="summary-label">总手续费</div>
              <div className="summary-value loss">¥{(summary.totalFees / 10000).toFixed(2)}万</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 盈亏趋势图表 */}
      <Card title="盈亏趋势分析" style={{ marginTop: 16 }}>
        <div
          id="profit-loss-chart"
          style={{ width: '100%', height: '400px' }}
        />
      </Card>

      {/* 详细数据表格 */}
      <Card title="盈亏明细表" style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={profitLossData}
          rowKey="period"
          size="small"
          scroll={{ x: 800 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          loading={loading}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <strong>汇总</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <strong>{summary.totalTrades.toLocaleString()}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <strong>¥{(summary.totalVolume / 10000).toFixed(2)}万</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <strong style={{ color: '#52c41a' }}>
                    ¥{(summary.totalProfit / 10000).toFixed(2)}万
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <strong style={{ color: '#ff4d4f' }}>
                    -¥{(summary.totalLoss / 10000).toFixed(2)}万
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <strong style={{ color: summary.netProfitLoss >= 0 ? '#52c41a' : '#ff4d4f' }}>
                    {summary.netProfitLoss >= 0 ? '+' : ''}¥{(summary.netProfitLoss / 10000).toFixed(2)}万
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <strong style={{ color: summaryWinRate >= 60 ? '#52c41a' : '#ff4d4f' }}>
                    {summaryWinRate.toFixed(1)}%
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  <strong style={{ color: summaryProfitFactor >= 1.5 ? '#52c41a' : '#ff4d4f' }}>
                    {summaryProfitFactor.toFixed(2)}
                  </strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  <strong style={{ color: '#999' }}>
                    ¥{(summary.totalFees / 10000).toFixed(2)}万
                  </strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </div>
  );
};

export default ProfitLossReport;