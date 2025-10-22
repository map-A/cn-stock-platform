import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Progress, Tag, Space, Tooltip } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import './RiskMonitorDashboard.less';

export interface RiskMetric {
  name: string;
  value: number;
  threshold: number;
  status: 'safe' | 'warning' | 'danger';
  description: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface RiskMonitorDashboardProps {
  portfolioId?: string;
  loading?: boolean;
}

const RiskMonitorDashboard: React.FC<RiskMonitorDashboardProps> = ({
  portfolioId,
  loading = false,
}) => {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([]);
  const [overallRiskScore, setOverallRiskScore] = useState(0);
  
  const trendChartRef = useRef<HTMLDivElement>(null);
  const distributionChartRef = useRef<HTMLDivElement>(null);

  const generateRiskMetrics = (): RiskMetric[] => {
    return [
      {
        name: 'VaR (95%)',
        value: 2.35,
        threshold: 3.0,
        status: 'safe',
        description: '95%置信度下的在风价值',
        trend: 'down',
        change: -0.15,
      },
      {
        name: 'CVaR (95%)',
        value: 3.82,
        threshold: 4.5,
        status: 'warning',
        description: '条件在风价值',
        trend: 'up',
        change: 0.23,
      },
      {
        name: '最大回撤',
        value: 8.5,
        threshold: 10.0,
        status: 'warning',
        description: '历史最大回撤比例',
        trend: 'stable',
        change: 0.05,
      },
      {
        name: '波动率',
        value: 18.6,
        threshold: 25.0,
        status: 'safe',
        description: '年化波动率',
        trend: 'down',
        change: -1.2,
      },
    ];
  };

  const initializeData = () => {
    const metrics = generateRiskMetrics();
    setRiskMetrics(metrics);
    
    const avgScore = metrics.reduce((sum, metric) => {
      const score = metric.status === 'safe' ? 100 : metric.status === 'warning' ? 70 : 30;
      return sum + score;
    }, 0) / metrics.length;
    
    setOverallRiskScore(avgScore);
  };

  useEffect(() => {
    initializeData();
  }, [portfolioId]);

  useEffect(() => {
    const initCharts = () => {
      if (trendChartRef.current && distributionChartRef.current) {
        const trendChart = echarts.init(trendChartRef.current);
        const distributionChart = echarts.init(distributionChartRef.current);
        
        const trendOption = {
          title: {
            text: '风险指标趋势',
            textStyle: { fontSize: 14 },
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['VaR', 'CVaR', '波动率'],
            bottom: 0,
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: Array.from({ length: 30 }, (_, i) => 
              dayjs().subtract(29 - i, 'day').format('MM-DD')
            ),
          },
          yAxis: {
            type: 'value',
            name: '百分比 (%)',
          },
          series: [
            {
              name: 'VaR',
              type: 'line',
              data: Array.from({ length: 30 }, () => 2 + Math.random() * 1.5),
              smooth: true,
              itemStyle: { color: '#ff4d4f' },
            },
            {
              name: 'CVaR',
              type: 'line',
              data: Array.from({ length: 30 }, () => 3 + Math.random() * 2),
              smooth: true,
              itemStyle: { color: '#ff7a45' },
            },
            {
              name: '波动率',
              type: 'line',
              data: Array.from({ length: 30 }, () => 15 + Math.random() * 10),
              smooth: true,
              itemStyle: { color: '#1890ff' },
            },
          ],
        };
        
        const distributionOption = {
          title: {
            text: '风险分布',
            textStyle: { fontSize: 14 },
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
          },
          legend: {
            orient: 'vertical',
            left: 10,
            data: ['安全', '警告', '危险'],
          },
          series: [
            {
              name: '风险状态',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['60%', '50%'],
              data: [
                { value: 3, name: '安全', itemStyle: { color: '#52c41a' } },
                { value: 1, name: '警告', itemStyle: { color: '#faad14' } },
                { value: 0, name: '危险', itemStyle: { color: '#ff4d4f' } },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        };
        
        trendChart.setOption(trendOption);
        distributionChart.setOption(distributionOption);
        
        return () => {
          trendChart.dispose();
          distributionChart.dispose();
        };
      }
      
      return undefined;
    };

    const cleanup = initCharts();
    return cleanup;
  }, []);

  const getTrendIcon = (trend: RiskMetric['trend'], change: number) => {
    if (trend === 'up') {
      return <RiseOutlined style={{ color: change > 0 ? '#ff4d4f' : '#52c41a' }} />;
    } else if (trend === 'down') {
      return <FallOutlined style={{ color: change < 0 ? '#52c41a' : '#ff4d4f' }} />;
    }
    return null;
  };

  const getRiskStatusIcon = (status: RiskMetric['status']) => {
    switch (status) {
      case 'safe':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'danger':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  const getOverallRiskLevel = (score: number) => {
    if (score >= 90) {
      return { level: '低风险', color: '#52c41a', icon: <CheckCircleOutlined /> };
    } else if (score >= 70) {
      return { level: '中等风险', color: '#faad14', icon: <ExclamationCircleOutlined /> };
    } else {
      return { level: '高风险', color: '#ff4d4f', icon: <CloseCircleOutlined /> };
    }
  };

  const riskLevel = getOverallRiskLevel(overallRiskScore);

  return (
    <div className="risk-monitor-dashboard">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Card>
            <div className="overall-risk-score">
              <Row align="middle" justify="space-between">
                <Col>
                  <Space size="large">
                    <div className="score-display">
                      <div className="score-number" style={{ color: riskLevel.color }}>
                        {overallRiskScore.toFixed(0)}
                      </div>
                      <div className="score-label">风险评分</div>
                    </div>
                    <div className="risk-level">
                      <Tag color={riskLevel.color} icon={riskLevel.icon}>
                        {riskLevel.level}
                      </Tag>
                    </div>
                  </Space>
                </Col>
                <Col>
                  <Progress
                    type="circle"
                    percent={overallRiskScore}
                    strokeColor={riskLevel.color}
                    size={80}
                    format={(percent) => `${percent?.toFixed(0)}`}
                  />
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {riskMetrics.map((metric, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card size="small">
              <div className="risk-metric-item">
                <div className="metric-header">
                  <Space>
                    {getRiskStatusIcon(metric.status)}
                    <span className="metric-name">{metric.name}</span>
                    <Tooltip title={metric.description}>
                      <span className="metric-info">ⓘ</span>
                    </Tooltip>
                  </Space>
                </div>
                
                <div className="metric-body">
                  <div className="metric-value">
                    {metric.value.toFixed(2)}%
                  </div>
                  <div className="metric-threshold">
                    阈值: {metric.threshold.toFixed(2)}%
                  </div>
                  <Progress
                    percent={(metric.value / metric.threshold) * 100}
                    strokeColor={
                      metric.status === 'safe' ? '#52c41a' : 
                      metric.status === 'warning' ? '#faad14' : '#ff4d4f'
                    }
                    size="small"
                    showInfo={false}
                  />
                </div>

                <div className="metric-footer">
                  <Space>
                    {getTrendIcon(metric.trend, metric.change)}
                    <span className={`metric-change ${metric.change >= 0 ? 'positive' : 'negative'}`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(2)}%
                    </span>
                  </Space>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={14}>
          <Card title="风险趋势分析" size="small">
            <div ref={trendChartRef} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="风险状态分布" size="small">
            <div ref={distributionChartRef} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RiskMonitorDashboard;