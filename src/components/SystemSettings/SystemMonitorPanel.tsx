/**
 * 系统监控面板组件
 * 
 * 功能特性:
 * - 实时性能监控
 * - 系统资源使用情况
 * - 服务状态监控
 * - 告警规则管理
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Tag,
  Space,
  Button,
  Alert,
  Typography,
  Tabs,
  message,
} from 'antd';
import {
  ReloadOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Line, Gauge } from '@ant-design/plots';
import {
  getSystemStatus,
  getSystemMetrics,
  getSystemHealthCheck,
} from '@/services/system';
import type { SystemStatusResponse } from '@/types/system';

const { Text } = Typography;
const { TabPane } = Tabs;

const SystemMonitorPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatusResponse | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [healthCheck, setHealthCheck] = useState<any>(null);

  // 加载监控数据
  const loadMonitorData = async () => {
    try {
      setLoading(true);
      const [statusData, metricsData, healthData] = await Promise.all([
        getSystemStatus(),
        getSystemMetrics('1h'),
        getSystemHealthCheck(),
      ]);
      setSystemStatus(statusData);
      setMetrics(metricsData);
      setHealthCheck(healthData);
    } catch (error) {
      console.error('加载监控数据失败:', error);
      message.error('加载监控数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonitorData();
    // 定时刷新
    const timer = setInterval(loadMonitorData, 30000);
    return () => clearInterval(timer);
  }, []);

  // CPU使用率仪表盘
  const CPUGauge = () => {
    const cpuUsage = systemStatus?.status.resources.cpu.usage || 0;
    const config = {
      percent: cpuUsage / 100,
      range: {
        ticks: [0, 1 / 3, 2 / 3, 1],
        color: ['#30BF78', '#FAAD14', '#F4664A'],
      },
      indicator: {
        pointer: {
          style: {
            stroke: '#D0D0D0',
          },
        },
        pin: {
          style: {
            stroke: '#D0D0D0',
          },
        },
      },
      statistic: {
        content: {
          style: {
            fontSize: '36px',
            lineHeight: '36px',
          },
        },
      },
    };
    return <Gauge {...config} />;
  };

  // 内存使用率仪表盘
  const MemoryGauge = () => {
    const memoryUsage = systemStatus?.status.resources.memory.usage || 0;
    const config = {
      percent: memoryUsage / 100,
      range: {
        ticks: [0, 1 / 3, 2 / 3, 1],
        color: ['#30BF78', '#FAAD14', '#F4664A'],
      },
      indicator: {
        pointer: {
          style: {
            stroke: '#D0D0D0',
          },
        },
        pin: {
          style: {
            stroke: '#D0D0D0',
          },
        },
      },
      statistic: {
        content: {
          style: {
            fontSize: '36px',
            lineHeight: '36px',
          },
        },
      },
    };
    return <Gauge {...config} />;
  };

  // 性能趋势图
  const PerformanceTrend = () => {
    if (!metrics?.performance) return null;

    const data = metrics.performance.flatMap((item: any) => [
      { time: item.timestamp, value: item.cpu, type: 'CPU使用率' },
      { time: item.timestamp, value: item.memory, type: '内存使用率' },
      { time: item.timestamp, value: item.disk, type: '磁盘使用率' },
    ]);

    const config = {
      data,
      xField: 'time',
      yField: 'value',
      seriesField: 'type',
      smooth: true,
      animation: {
        appear: {
          animation: 'path-in',
          duration: 2000,
        },
      },
    };

    return <Line {...config} />;
  };

  // 服务状态表格
  const ServicesTable = () => {
    const services = systemStatus?.status.services || [];
    
    const columns = [
      {
        title: '服务名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
          const statusConfig = {
            healthy: { color: 'green', icon: <CheckCircleOutlined />, text: '正常' },
            degraded: { color: 'orange', icon: <ExclamationCircleOutlined />, text: '降级' },
            down: { color: 'red', icon: <CloseCircleOutlined />, text: '异常' },
          };
          const config = statusConfig[status as keyof typeof statusConfig];
          return (
            <Tag color={config.color} icon={config.icon}>
              {config.text}
            </Tag>
          );
        },
      },
      {
        title: '响应时间',
        dataIndex: 'responseTime',
        key: 'responseTime',
        render: (time: number) => `${time}ms`,
      },
      {
        title: '错误率',
        dataIndex: 'errorRate',
        key: 'errorRate',
        render: (rate: number) => (
          <Text style={{ color: rate > 5 ? '#f5222d' : '#52c41a' }}>
            {rate.toFixed(2)}%
          </Text>
        ),
      },
      {
        title: '最后检查',
        dataIndex: 'lastCheck',
        key: 'lastCheck',
        render: (time: string) => new Date(time).toLocaleString(),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={services}
        rowKey="name"
        pagination={false}
        size="small"
      />
    );
  };

  // 健康检查表格
  const HealthCheckTable = () => {
    const checks = healthCheck?.checks || [];
    
    const columns = [
      {
        title: '检查项',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
          const statusConfig = {
            pass: { color: 'green', icon: <CheckCircleOutlined />, text: '通过' },
            warn: { color: 'orange', icon: <ExclamationCircleOutlined />, text: '警告' },
            fail: { color: 'red', icon: <CloseCircleOutlined />, text: '失败' },
          };
          const config = statusConfig[status as keyof typeof statusConfig];
          return (
            <Tag color={config.color} icon={config.icon}>
              {config.text}
            </Tag>
          );
        },
      },
      {
        title: '耗时',
        dataIndex: 'duration',
        key: 'duration',
        render: (duration: number) => `${duration}ms`,
      },
      {
        title: '说明',
        dataIndex: 'message',
        key: 'message',
        render: (message: string) => message || '-',
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={checks}
        rowKey="name"
        pagination={false}
        size="small"
      />
    );
  };

  return (
    <div>
      {/* 系统状态概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="系统状态"
              value={healthCheck?.status === 'healthy' ? '正常' : healthCheck?.status === 'degraded' ? '降级' : '异常'}
              valueStyle={{ 
                color: healthCheck?.status === 'healthy' ? '#3f8600' : 
                       healthCheck?.status === 'degraded' ? '#faad14' : '#cf1322' 
              }}
              prefix={
                healthCheck?.status === 'healthy' ? <CheckCircleOutlined /> :
                healthCheck?.status === 'degraded' ? <ExclamationCircleOutlined /> :
                <CloseCircleOutlined />
              }
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="运行时间"
              value={systemStatus ? Math.floor(systemStatus.status.systemInfo.uptime / 3600) : 0}
              suffix="小时"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="活跃告警"
              value={systemStatus?.alerts?.filter(alert => !alert.acknowledged).length || 0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 告警信息 */}
      {systemStatus?.alerts?.some(alert => !alert.acknowledged) && (
        <Alert
          message="系统告警"
          description={
            <div>
              {systemStatus.alerts
                .filter(alert => !alert.acknowledged)
                .slice(0, 3)
                .map(alert => (
                  <div key={alert.id}>
                    <Text type={alert.type === 'critical' ? 'danger' : 'warning'}>
                      {alert.message}
                    </Text>
                  </div>
                ))}
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Tabs defaultActiveKey="performance">
        <TabPane tab="性能监控" key="performance">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card title="CPU使用率" extra={<Text>{systemStatus?.status.resources.cpu.usage.toFixed(1)}%</Text>}>
                <CPUGauge />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="内存使用率" extra={<Text>{systemStatus?.status.resources.memory.usage.toFixed(1)}%</Text>}>
                <MemoryGauge />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="磁盘使用率">
                <Progress
                  type="circle"
                  percent={systemStatus?.status.resources.disk.usage || 0}
                  format={percent => `${percent}%`}
                  strokeColor={
                    (systemStatus?.status.resources.disk.usage || 0) > 80 ? '#ff4d4f' : '#52c41a'
                  }
                />
              </Card>
            </Col>
          </Row>
          
          <Card title="性能趋势" style={{ marginTop: 16 }}>
            <PerformanceTrend />
          </Card>
        </TabPane>

        <TabPane tab="服务状态" key="services">
          <Card 
            title="服务监控"
            extra={
              <Button 
                icon={<ReloadOutlined />}
                onClick={loadMonitorData}
                loading={loading}
              >
                刷新
              </Button>
            }
          >
            <ServicesTable />
          </Card>
        </TabPane>

        <TabPane tab="健康检查" key="health">
          <Card 
            title="系统健康检查"
            extra={
              <Button 
                icon={<ReloadOutlined />}
                onClick={loadMonitorData}
                loading={loading}
              >
                刷新
              </Button>
            }
          >
            <HealthCheckTable />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SystemMonitorPanel;