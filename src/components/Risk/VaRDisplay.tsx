import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Statistic, Progress, Table, DatePicker, Space, Button, Tooltip, Alert } from 'antd';
import {
  InfoCircleOutlined,
  ExportOutlined,
  ReloadOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import './VaRDisplay.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

// VaR数据接口
export interface VaRData {
  date: string;
  parametric: number;
  historical: number;
  monteCarlo: number;
  actual: number;
}

// VaR统计数据接口
export interface VaRStatistics {
  method: 'parametric' | 'historical' | 'monteCarlo';
  confidence: number;
  period: number;
  currentVaR: number;
  avgVaR: number;
  maxVaR: number;
  minVaR: number;
  volatility: number;
  accuracy: number;
  exceedances: number;
  expectedExceedances: number;
}

// 组件属性接口
export interface VaRDisplayProps {
  portfolioId?: string;
  loading?: boolean;
}

const VaRDisplay: React.FC<VaRDisplayProps> = ({
  portfolioId,
  loading = false,
}) => {
  const [varData, setVarData] = useState<VaRData[]>([]);
  const [statistics, setStatistics] = useState<VaRStatistics[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<'parametric' | 'historical' | 'monteCarlo'>('parametric');
  const [confidence, setConfidence] = useState(95);
  const [period, setPeriod] = useState(1);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

  // 生成模拟VaR数据
  const generateVaRData = (): VaRData[] => {
    const data: VaRData[] = [];
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    const days = endDate.diff(startDate, 'day');

    for (let i = 0; i <= days; i++) {
      const date = startDate.add(i, 'day').format('YYYY-MM-DD');
      const baseVaR = 2 + Math.random() * 1.5;
      
      data.push({
        date,
        parametric: baseVaR + (Math.random() - 0.5) * 0.3,
        historical: baseVaR + (Math.random() - 0.5) * 0.4,
        monteCarlo: baseVaR + (Math.random() - 0.5) * 0.2,
        actual: baseVaR + (Math.random() - 0.5) * 0.8,
      });
    }
    
    return data;
  };

  // 生成VaR统计数据
  const generateStatistics = (data: VaRData[]): VaRStatistics[] => {
    const methods: ('parametric' | 'historical' | 'monteCarlo')[] = ['parametric', 'historical', 'monteCarlo'];
    
    return methods.map(method => {
      const values = data.map(d => d[method]);
      const actuals = data.map(d => d.actual);
      
      const currentVaR = values[values.length - 1];
      const avgVaR = values.reduce((a, b) => a + b, 0) / values.length;
      const maxVaR = Math.max(...values);
      const minVaR = Math.min(...values);
      
      // 计算波动率
      const variance = values.reduce((sum, val) => sum + (val - avgVaR) ** 2, 0) / values.length;
      const volatility = Math.sqrt(variance);
      
      // 计算准确性（预测违反次数）
      const exceedances = data.filter((d, i) => Math.abs(actuals[i]) > values[i]).length;
      const expectedExceedances = Math.floor(data.length * (100 - confidence) / 100);
      const accuracy = Math.max(0, 100 - Math.abs(exceedances - expectedExceedances) * 10);
      
      return {
        method,
        confidence,
        period,
        currentVaR,
        avgVaR,
        maxVaR,
        minVaR,
        volatility,
        accuracy,
        exceedances,
        expectedExceedances,
      };
    });
  };

  useEffect(() => {
    const data = generateVaRData();
    const stats = generateStatistics(data);
    
    setVarData(data);
    setStatistics(stats);
  }, [dateRange, confidence, period]);

  // 渲染VaR趋势图
  useEffect(() => {
    const chartDom = document.getElementById('var-trend-chart');
    if (!chartDom || loading || varData.length === 0) return;

    const chart = echarts.init(chartDom);
    setChartInstance(chart);

    const dates = varData.map(d => dayjs(d.date).format('MM-DD'));
    const parametricData = varData.map(d => d.parametric);
    const historicalData = varData.map(d => d.historical);
    const monteCarloData = varData.map(d => d.monteCarlo);
    const actualData = varData.map(d => d.actual);

    const option: echarts.EChartsOption = {
      title: {
        text: `VaR趋势对比 (${confidence}%置信度)`,
        left: 'center',
        textStyle: { fontSize: 14 },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          let content = `<div style="padding: 5px;">`;
          content += `<div style="margin-bottom: 5px; font-weight: bold;">${params[0].name}</div>`;
          params.forEach((param: any) => {
            content += `<div style="margin: 2px 0;">`;
            content += `<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color}; margin-right: 5px;"></span>`;
            content += `${param.seriesName}: ${param.value.toFixed(3)}%`;
            content += `</div>`;
          });
          content += `</div>`;
          return content;
        },
      },
      legend: {
        data: ['参数法VaR', '历史模拟法VaR', '蒙特卡罗VaR', '实际损失'],
        top: '8%',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          interval: Math.floor(dates.length / 8),
        },
      },
      yAxis: {
        type: 'value',
        name: 'VaR值 (%)',
        axisLabel: {
          formatter: '{value}%',
        },
      },
      series: [
        {
          name: '参数法VaR',
          type: 'line',
          data: parametricData,
          smooth: true,
          lineStyle: { color: '#1890ff', width: 2 },
          symbol: 'circle',
          symbolSize: 4,
        },
        {
          name: '历史模拟法VaR',
          type: 'line',
          data: historicalData,
          smooth: true,
          lineStyle: { color: '#52c41a', width: 2 },
          symbol: 'triangle',
          symbolSize: 4,
        },
        {
          name: '蒙特卡罗VaR',
          type: 'line',
          data: monteCarloData,
          smooth: true,
          lineStyle: { color: '#faad14', width: 2 },
          symbol: 'diamond',
          symbolSize: 4,
        },
        {
          name: '实际损失',
          type: 'scatter',
          data: actualData,
          symbolSize: 6,
          itemStyle: { 
            color: '#f5222d',
            borderColor: '#fff',
            borderWidth: 1,
          },
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
  }, [varData, confidence, loading]);

  // VaR方法说明
  const methodDescriptions = {
    parametric: '基于正态分布假设的参数法，计算速度快，适用于正常市场条件',
    historical: '基于历史数据的模拟法，不需要分布假设，能够捕捉尾部风险',
    monteCarlo: '基于蒙特卡罗模拟的方法，能够处理复杂的投资组合和非线性风险',
  };

  // 获取当前方法的统计数据
  const currentStats = statistics.find(s => s.method === selectedMethod);

  // VaR数据表格列定义
  const varDataColumns: ColumnsType<VaRData> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (date) => dayjs(date).format('MM-DD'),
    },
    {
      title: '参数法VaR (%)',
      dataIndex: 'parametric',
      key: 'parametric',
      width: 120,
      render: (value) => value.toFixed(3),
      sorter: (a, b) => a.parametric - b.parametric,
    },
    {
      title: '历史模拟法VaR (%)',
      dataIndex: 'historical',
      key: 'historical',
      width: 140,
      render: (value) => value.toFixed(3),
      sorter: (a, b) => a.historical - b.historical,
    },
    {
      title: '蒙特卡罗VaR (%)',
      dataIndex: 'monteCarlo',
      key: 'monteCarlo',
      width: 130,
      render: (value) => value.toFixed(3),
      sorter: (a, b) => a.monteCarlo - b.monteCarlo,
    },
    {
      title: '实际损失 (%)',
      dataIndex: 'actual',
      key: 'actual',
      width: 120,
      render: (value) => (
        <span style={{ color: value > 0 ? '#f5222d' : '#52c41a' }}>
          {value > 0 ? '+' : ''}{value.toFixed(3)}
        </span>
      ),
      sorter: (a, b) => a.actual - b.actual,
    },
    {
      title: '违反情况',
      key: 'violation',
      width: 100,
      render: (_, record) => {
        const varValue = record[selectedMethod];
        const isViolation = Math.abs(record.actual) > varValue;
        return (
          <span style={{ color: isViolation ? '#f5222d' : '#52c41a' }}>
            {isViolation ? '违反' : '正常'}
          </span>
        );
      },
    },
  ];

  const handleExport = () => {
    // 导出功能实现
    console.log('Exporting VaR data...');
  };

  const handleRefresh = () => {
    const data = generateVaRData();
    const stats = generateStatistics(data);
    setVarData(data);
    setStatistics(stats);
  };

  return (
    <div className="var-display">
      {/* 控制面板 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col span={4}>
            <Space>
              <span>置信度:</span>
              <Select
                value={confidence}
                onChange={setConfidence}
                style={{ width: 80 }}
              >
                <Option value={90}>90%</Option>
                <Option value={95}>95%</Option>
                <Option value={99}>99%</Option>
              </Select>
            </Space>
          </Col>
          
          <Col span={4}>
            <Space>
              <span>持有期:</span>
              <Select
                value={period}
                onChange={setPeriod}
                style={{ width: 80 }}
              >
                <Option value={1}>1天</Option>
                <Option value={5}>5天</Option>
                <Option value={10}>10天</Option>
              </Select>
            </Space>
          </Col>
          
          <Col span={8}>
            <Space>
              <span>日期范围:</span>
              <RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates)}
                format="YYYY-MM-DD"
              />
            </Space>
          </Col>
          
          <Col span={4}>
            <Space>
              <span>计算方法:</span>
              <Select
                value={selectedMethod}
                onChange={setSelectedMethod}
                style={{ width: 120 }}
              >
                <Option value="parametric">参数法</Option>
                <Option value="historical">历史模拟法</Option>
                <Option value="monteCarlo">蒙特卡罗法</Option>
              </Select>
            </Space>
          </Col>
          
          <Col span={4}>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                刷新
              </Button>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 方法说明 */}
      <Alert
        message={`${selectedMethod === 'parametric' ? '参数法' : selectedMethod === 'historical' ? '历史模拟法' : '蒙特卡罗法'}VaR`}
        description={methodDescriptions[selectedMethod]}
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* VaR统计指标 */}
      {currentStats && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={4}>
            <Card size="small">
              <Statistic
                title="当前VaR"
                value={currentStats.currentVaR}
                precision={3}
                suffix="%"
                valueStyle={{ color: '#f5222d' }}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
          
          <Col span={4}>
            <Card size="small">
              <Statistic
                title="平均VaR"
                value={currentStats.avgVaR}
                precision={3}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          
          <Col span={4}>
            <Card size="small">
              <Statistic
                title="最大VaR"
                value={currentStats.maxVaR}
                precision={3}
                suffix="%"
                valueStyle={{ color: '#faad14' }}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>
          
          <Col span={4}>
            <Card size="small">
              <Statistic
                title="VaR波动率"
                value={currentStats.volatility}
                precision={3}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          
          <Col span={4}>
            <Card size="small">
              <div className="accuracy-card">
                <div className="accuracy-title">预测准确性</div>
                <div className="accuracy-content">
                  <Progress
                    type="circle"
                    percent={currentStats.accuracy}
                    size={60}
                    strokeColor={{
                      '0%': '#f5222d',
                      '50%': '#faad14',
                      '100%': '#52c41a',
                    }}
                  />
                </div>
                <div className="exceedances-info">
                  <span>违反次数: {currentStats.exceedances}</span>
                  <span>期望违反: {currentStats.expectedExceedances}</span>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col span={4}>
            <Card size="small">
              <div className="method-comparison">
                <div className="comparison-title">方法对比</div>
                <div className="comparison-content">
                  {statistics.map(stat => (
                    <div key={stat.method} className="method-item">
                      <span className="method-name">
                        {stat.method === 'parametric' ? '参数法' : 
                         stat.method === 'historical' ? '历史法' : '蒙特卡罗'}
                      </span>
                      <span className="method-value">{stat.currentVaR.toFixed(3)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      <Row gutter={16}>
        {/* VaR趋势图 */}
        <Col span={16}>
          <Card 
            title="VaR趋势对比分析"
            extra={
              <Tooltip title="显示不同方法计算的VaR值对比及实际损失情况">
                <InfoCircleOutlined />
              </Tooltip>
            }
          >
            <div
              id="var-trend-chart"
              style={{ width: '100%', height: '400px' }}
            />
          </Card>
        </Col>
        
        {/* VaR数据表格 */}
        <Col span={8}>
          <Card title="VaR数据详情">
            <Table
              columns={varDataColumns}
              dataSource={varData.slice(-20)} // 显示最近20天数据
              rowKey="date"
              size="small"
              scroll={{ y: 320 }}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VaRDisplay;