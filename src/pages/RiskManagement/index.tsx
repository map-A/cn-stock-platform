/**
 * 风险管理页面
 */
import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Alert, Table, Tag, Progress, Button } from 'antd';
import {
  WarningOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  FallOutlined,
  RiseOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Column } from '@ant-design/plots';
import styles from './index.less';

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  level: 'safe' | 'warning' | 'danger';
  change: number;
}

const RiskManagementPage: React.FC = () => {
  const intl = useIntl();

  // 模拟风险指标数据
  const [riskMetrics] = useState<RiskMetric[]>([
    {
      id: '1',
      name: 'VaR (95%)',
      value: 2.5,
      threshold: 5.0,
      level: 'safe',
      change: -0.3,
    },
    {
      id: '2',
      name: 'Max Drawdown',
      value: 8.2,
      threshold: 10.0,
      level: 'warning',
      change: 1.5,
    },
    {
      id: '3',
      name: 'Volatility',
      value: 15.6,
      threshold: 20.0,
      level: 'safe',
      change: -2.1,
    },
    {
      id: '4',
      name: 'Beta',
      value: 1.25,
      threshold: 1.5,
      level: 'warning',
      change: 0.08,
    },
  ]);

  const levelMap: Record<string, { color: string; text: string }> = {
    safe: {
      color: 'success',
      text: intl.formatMessage({ id: 'risk.level.safe', defaultMessage: 'Safe' }),
    },
    warning: {
      color: 'warning',
      text: intl.formatMessage({ id: 'risk.level.warning', defaultMessage: 'Warning' }),
    },
    danger: {
      color: 'error',
      text: intl.formatMessage({ id: 'risk.level.danger', defaultMessage: 'Danger' }),
    },
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'risk.metric', defaultMessage: 'Risk Metric' }),
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'risk.currentValue', defaultMessage: 'Current Value' }),
      dataIndex: 'value',
      key: 'value',
      width: 150,
      render: (value: number) => value.toFixed(2),
    },
    {
      title: intl.formatMessage({ id: 'risk.threshold', defaultMessage: 'Threshold' }),
      dataIndex: 'threshold',
      key: 'threshold',
      width: 150,
      render: (value: number) => value.toFixed(2),
    },
    {
      title: intl.formatMessage({ id: 'risk.usage', defaultMessage: 'Usage (%)' }),
      key: 'usage',
      width: 200,
      render: (_, record: RiskMetric) => {
        const usage = (record.value / record.threshold) * 100;
        const status = usage > 80 ? 'exception' : usage > 60 ? 'active' : 'success';
        return <Progress percent={usage} size="small" status={status} />;
      },
    },
    {
      title: intl.formatMessage({ id: 'risk.change', defaultMessage: 'Change' }),
      dataIndex: 'change',
      key: 'change',
      width: 120,
      render: (change: number) => (
        <span style={{ color: change > 0 ? '#ff4d4f' : '#52c41a' }}>
          {change > 0 ? <RiseOutlined /> : <FallOutlined />}
          {' '}{Math.abs(change).toFixed(2)}
        </span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'risk.level', defaultMessage: 'Level' }),
      dataIndex: 'level',
      key: 'level',
      width: 120,
      render: (level: string) => {
        const levelInfo = levelMap[level];
        return <Tag color={levelInfo.color}>{levelInfo.text}</Tag>;
      },
    },
  ];

  // VaR历史数据
  const varData = [
    { date: '10-18', value: 2.8 },
    { date: '10-19', value: 2.6 },
    { date: '10-20', value: 2.9 },
    { date: '10-21', value: 2.7 },
    { date: '10-22', value: 2.5 },
  ];

  const varConfig = {
    data: varData,
    xField: 'date',
    yField: 'value',
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      date: {
        alias: intl.formatMessage({ id: 'common.date', defaultMessage: 'Date' }),
      },
      value: {
        alias: 'VaR (%)',
      },
    },
  };

  // 风险统计
  const safeCount = riskMetrics.filter(m => m.level === 'safe').length;
  const warningCount = riskMetrics.filter(m => m.level === 'warning').length;
  const dangerCount = riskMetrics.filter(m => m.level === 'danger').length;

  return (
    <div className={styles.riskPage}>
      {/* 风险警报 */}
      {warningCount > 0 || dangerCount > 0 ? (
        <Alert
          message={intl.formatMessage({ id: 'risk.alertTitle', defaultMessage: 'Risk Alert' })}
          description={intl.formatMessage(
            { id: 'risk.alertDesc', defaultMessage: '{warning} warnings, {danger} critical risks detected' },
            { warning: warningCount, danger: dangerCount }
          )}
          type={dangerCount > 0 ? 'error' : 'warning'}
          icon={<WarningOutlined />}
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      ) : (
        <Alert
          message={intl.formatMessage({ id: 'risk.safeTitle', defaultMessage: 'System Safe' })}
          description={intl.formatMessage({ id: 'risk.safeDesc', defaultMessage: 'All risk metrics are within safe limits' })}
          type="success"
          icon={<SafetyOutlined />}
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      {/* 风险概览卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'risk.safeMetrics', defaultMessage: 'Safe Metrics' })}
              value={safeCount}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`/ ${riskMetrics.length}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'risk.warningMetrics', defaultMessage: 'Warning Metrics' })}
              value={warningCount}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
              suffix={`/ ${riskMetrics.length}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'risk.criticalMetrics', defaultMessage: 'Critical Metrics' })}
              value={dangerCount}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
              suffix={`/ ${riskMetrics.length}`}
            />
          </Card>
        </Col>
      </Row>

      {/* 风险指标表 */}
      <Card
        title={intl.formatMessage({ id: 'risk.metricsTable', defaultMessage: 'Risk Metrics' })}
        style={{ marginBottom: 24 }}
        extra={
          <Button icon={<DashboardOutlined />}>
            {intl.formatMessage({ id: 'risk.dashboard', defaultMessage: 'Dashboard' })}
          </Button>
        }
      >
        <Table
          dataSource={riskMetrics}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* VaR趋势图 */}
      <Card title={intl.formatMessage({ id: 'risk.varTrend', defaultMessage: 'VaR Trend (5 Days)' })}>
        <Column {...varConfig} />
      </Card>
    </div>
  );
};

export default RiskManagementPage;
