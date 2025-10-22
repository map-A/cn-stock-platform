/**
 * 系统设置主页面
 * 
 * 功能特性:
 * - 系统参数配置
 * - 用户权限管理
 * - 数据源配置
 * - 系统监控
 * - 任务调度管理
 */

import React, { useState, useEffect } from 'react';
import {
  PageContainer,
  ProCard,
} from '@ant-design/pro-components';
import {
  Tabs,
  Card,
  Row,
  Col,
  Statistic,
  Alert,
  Button,
  Space,
  message,
  Spin,
  Tag,
} from 'antd';
import {
  SettingOutlined,
  MonitorOutlined,
  DatabaseOutlined,
  SecurityScanOutlined,
  ScheduleOutlined,
  ReloadOutlined,
  ExportOutlined,
  ImportOutlined,
  ClearOutlined,
} from '@ant-design/icons';

// 组件导入
import {
  SystemConfigPanel,
  SystemMonitorPanel,
  DataSourcePanel,
  PermissionPanel,
  TaskSchedulePanel,
} from '@/components/SystemSettings';

// API和类型导入
import {
  getSystemStatus,
  getSystemHealthCheck,
  restartSystem,
  clearSystemCache,
  exportSystemConfig,
} from '@/services/system';
import type { SystemStatusResponse } from '@/types/system';

const { TabPane } = Tabs;

const SystemSettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStatus, setSystemStatus] = useState<SystemStatusResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  // 加载系统状态
  const loadSystemStatus = async () => {
    try {
      setLoading(true);
      const [statusData, healthData] = await Promise.all([
        getSystemStatus(),
        getSystemHealthCheck(),
      ]);
      setSystemStatus(statusData);
      setHealthStatus(healthData);
    } catch (error) {
      console.error('加载系统状态失败:', error);
      message.error('加载系统状态失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystemStatus();
    // 定时刷新系统状态
    const timer = setInterval(loadSystemStatus, 30000);
    return () => clearInterval(timer);
  }, []);

  // 系统操作处理
  const handleSystemOperation = async (operation: string) => {
    try {
      switch (operation) {
        case 'restart':
          await restartSystem();
          message.success('系统重启命令已发送');
          break;
        case 'clearCache':
          await clearSystemCache();
          message.success('系统缓存已清理');
          break;
        case 'export':
          const blob = await exportSystemConfig();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `system-config-${new Date().toISOString().split('T')[0]}.json`;
          a.click();
          window.URL.revokeObjectURL(url);
          message.success('配置导出成功');
          break;
        case 'refresh':
          await loadSystemStatus();
          message.success('状态已刷新');
          break;
      }
    } catch (error) {
      console.error(`${operation}操作失败:`, error);
      message.error(`${operation}操作失败`);
    }
  };

  // 系统概览内容
  const SystemOverview = () => (
    <div>
      {/* 系统健康状态提示 */}
      {healthStatus && (
        <Alert
          message={`系统状态: ${healthStatus.status === 'healthy' ? '正常' : healthStatus.status === 'degraded' ? '降级' : '异常'}`}
          type={healthStatus.status === 'healthy' ? 'success' : healthStatus.status === 'degraded' ? 'warning' : 'error'}
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" onClick={() => handleSystemOperation('refresh')}>
              刷新
            </Button>
          }
        />
      )}

      {/* 系统操作按钮 */}
      <Card title="系统操作" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={() => handleSystemOperation('refresh')}
          >
            刷新状态
          </Button>
          <Button 
            icon={<ClearOutlined />} 
            onClick={() => handleSystemOperation('clearCache')}
          >
            清理缓存
          </Button>
          <Button 
            icon={<ExportOutlined />} 
            onClick={() => handleSystemOperation('export')}
          >
            导出配置
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            danger
            onClick={() => handleSystemOperation('restart')}
          >
            重启系统
          </Button>
        </Space>
      </Card>

      {/* 系统状态统计 */}
      {systemStatus && (
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="系统版本"
                value={systemStatus.status.systemInfo.version}
                valueStyle={{ fontSize: '16px' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="运行时间"
                value={Math.floor(systemStatus.status.systemInfo.uptime / 3600)}
                suffix="小时"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="CPU使用率"
                value={systemStatus.status.resources.cpu.usage}
                precision={1}
                suffix="%"
                valueStyle={{ 
                  color: systemStatus.status.resources.cpu.usage > 80 ? '#cf1322' : '#3f8600' 
                }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="内存使用率"
                value={systemStatus.status.resources.memory.usage}
                precision={1}
                suffix="%"
                valueStyle={{ 
                  color: systemStatus.status.resources.memory.usage > 80 ? '#cf1322' : '#3f8600' 
                }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 服务状态 */}
      {systemStatus && (
        <Card title="服务状态" style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            {systemStatus.status.services.map((service, index) => (
              <Col span={8} key={index}>
                <Card size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{service.name}</span>
                    <Tag color={
                      service.status === 'healthy' ? 'green' : 
                      service.status === 'degraded' ? 'orange' : 'red'
                    }>
                      {service.status === 'healthy' ? '正常' : 
                       service.status === 'degraded' ? '降级' : '异常'}
                    </Tag>
                  </div>
                  <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                    响应时间: {service.responseTime}ms | 错误率: {service.errorRate}%
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );

  return (
    <PageContainer
      header={{
        title: '系统设置',
        subTitle: '系统配置和管理功能',
        extra: [
          <Button key="refresh" onClick={() => loadSystemStatus()}>
            刷新
          </Button>,
        ],
      }}
    >
      <Spin spinning={loading}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          items={[
            {
              key: 'overview',
              label: (
                <span>
                  <MonitorOutlined />
                  系统概览
                </span>
              ),
              children: <SystemOverview />,
            },
            {
              key: 'config',
              label: (
                <span>
                  <SettingOutlined />
                  参数配置
                </span>
              ),
              children: <SystemConfigPanel />,
            },
            {
              key: 'monitor',
              label: (
                <span>
                  <MonitorOutlined />
                  系统监控
                </span>
              ),
              children: <SystemMonitorPanel />,
            },
            {
              key: 'datasource',
              label: (
                <span>
                  <DatabaseOutlined />
                  数据源配置
                </span>
              ),
              children: <DataSourcePanel />,
            },
            {
              key: 'permission',
              label: (
                <span>
                  <SecurityScanOutlined />
                  权限管理
                </span>
              ),
              children: <PermissionPanel />,
            },
            {
              key: 'schedule',
              label: (
                <span>
                  <ScheduleOutlined />
                  任务调度
                </span>
              ),
              children: <TaskSchedulePanel />,
            },
          ]}
        />
      </Spin>
    </PageContainer>
  );
};

export default SystemSettingsPage;