/**
 * 风险管理模块主页面
 * 
 * 功能特性:
 * - 风险指标监控面板
 * - VaR 风险度量展示
 * - 风险预警系统
 * - 压力测试分析
 * - 合规检查报告
 * 
 * 依据文档: MODULE_PROMPTS.md - 风险管理模块
 * API规范: API_DESIGN_GUIDE.md - 风险管理模块
 */

import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Tabs, Spin, Alert, Button, Space, Divider } from 'antd';
import {
  DashboardOutlined,
  AlertOutlined,
  BarChartOutlined,
  FileTextOutlined,
  ReloadOutlined,
  ExportOutlined,
  SettingOutlined,
} from '@ant-design/icons';

// 导入风险管理组件
import RiskMonitorDashboard from '@/components/Risk/RiskMonitorDashboard';
import VaRDisplay from '@/components/Risk/VaRDisplay';
import RiskAlertPanel from '@/components/Risk/RiskAlertPanel';
import StressTestAnalysis from '@/components/Risk/StressTestAnalysis';
import ComplianceReport from '@/components/Risk/ComplianceReport';
import RiskSettings from '@/components/Risk/RiskSettings';

import type { RiskMetrics, RiskAlert } from '@/types/risk';
import { getRiskMetrics, getRiskAlerts } from '@/services/risk';

import './index.less';

const { TabPane } = Tabs;

/**
 * 风险管理主页面组件
 */
const RiskManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('');

  /**
   * 加载风险数据
   */
  const loadRiskData = async () => {
    setLoading(true);
    try {
      // 并发加载风险指标和预警数据
      const [metricsRes, alertsRes] = await Promise.all([
        getRiskMetrics(),
        getRiskAlerts(),
      ]);

      setRiskMetrics(metricsRes.data);
      setRiskAlerts(alertsRes.data);
      setLastUpdateTime(new Date().toLocaleString());
    } catch (error) {
      console.error('加载风险数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 刷新数据
   */
  const handleRefresh = () => {
    loadRiskData();
  };

  /**
   * 导出风险报告
   */
  const handleExportReport = () => {
    // TODO: 实现风险报告导出功能
    console.log('导出风险报告');
  };

  /**
   * 组件初始化
   */
  useEffect(() => {
    loadRiskData();
    
    // 设置定时刷新 (每5分钟)
    const interval = setInterval(loadRiskData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  /**
   * 渲染页面头部操作栏
   */
  const renderPageHeader = () => (
    <div className="risk-page-header">
      <Space size="middle">
        <Button 
          type="primary" 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          loading={loading}
        >
          刷新数据
        </Button>
        <Button 
          icon={<ExportOutlined />} 
          onClick={handleExportReport}
        >
          导出报告
        </Button>
        <Button 
          icon={<SettingOutlined />} 
          onClick={() => setActiveTab('settings')}
        >
          风险设置
        </Button>
      </Space>
      {lastUpdateTime && (
        <div className="last-update-time">
          最后更新: {lastUpdateTime}
        </div>
      )}
    </div>
  );

  /**
   * 渲染风险概览卡片
   */
  const renderOverviewCards = () => {
    if (!riskMetrics) return null;

    const { var: varValue, cvar, maxDrawdown, volatility } = riskMetrics;
    const criticalAlerts = riskAlerts.filter(alert => alert.level === 'critical').length;
    const highAlerts = riskAlerts.filter(alert => alert.level === 'high').length;

    return (
      <Row gutter={[16, 16]} className="risk-overview-cards">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className="risk-metric-card">
              <div className="metric-value var-metric">
                {(varValue * 100).toFixed(2)}%
              </div>
              <div className="metric-label">VaR (95%)</div>
              <div className="metric-trend">
                较昨日: -0.15%
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className="risk-metric-card">
              <div className="metric-value cvar-metric">
                {(cvar * 100).toFixed(2)}%
              </div>
              <div className="metric-label">CVaR (95%)</div>
              <div className="metric-trend">
                较昨日: +0.23%
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className="risk-metric-card">
              <div className="metric-value drawdown-metric">
                {(maxDrawdown * 100).toFixed(2)}%
              </div>
              <div className="metric-label">最大回撤</div>
              <div className="metric-trend">
                较历史峰值: -2.1%
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div className="risk-metric-card">
              <div className="metric-value alert-metric">
                {criticalAlerts + highAlerts}
              </div>
              <div className="metric-label">活跃预警</div>
              <div className="metric-breakdown">
                严重: {criticalAlerts} | 高风险: {highAlerts}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <PageContainer
      title="风险管理"
      subTitle="实时监控投资组合风险，预防潜在损失"
      extra={renderPageHeader()}
      loading={loading}
    >
      <Spin spinning={loading}>
        {/* 风险概览卡片 */}
        {renderOverviewCards()}
        
        <Divider />

        {/* 主要内容区域 */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className="risk-management-tabs"
          items={[
            {
              key: 'overview',
              label: (
                <span>
                  <DashboardOutlined />
                  风险概览
                </span>
              ),
              children: (
                <div className="tab-content">
                  <RiskMonitorDashboard 
                    portfolioId="default"
                    loading={loading}
                  />
                </div>
              ),
            },
            {
              key: 'var',
              label: (
                <span>
                  <BarChartOutlined />
                  VaR分析
                </span>
              ),
              children: (
                <div className="tab-content">
                  <VaRDisplay 
                    portfolioId="default"
                    loading={loading}
                  />
                </div>
              ),
            },
            {
              key: 'alerts',
              label: (
                <span>
                  <AlertOutlined />
                  风险预警
                  {riskAlerts.length > 0 && (
                    <span className="alert-badge">{riskAlerts.length}</span>
                  )}
                </span>
              ),
              children: (
                <div className="tab-content">
                  <RiskAlertPanel 
                    alerts={riskAlerts}
                    onRefresh={loadRiskData}
                    loading={loading}
                  />
                </div>
              ),
            },
            {
              key: 'stress',
              label: (
                <span>
                  <BarChartOutlined />
                  压力测试
                </span>
              ),
              children: (
                <div className="tab-content">
                  <StressTestAnalysis 
                    portfolioId="default"
                    loading={loading}
                  />
                </div>
              ),
            },
            {
              key: 'compliance',
              label: (
                <span>
                  <FileTextOutlined />
                  合规报告
                </span>
              ),
              children: (
                <div className="tab-content">
                  <ComplianceReport 
                    portfolioId="default"
                    loading={loading}
                  />
                </div>
              ),
            },
            {
              key: 'settings',
              label: (
                <span>
                  <SettingOutlined />
                  风险设置
                </span>
              ),
              children: (
                <div className="tab-content">
                  <RiskSettings 
                    onSave={loadRiskData}
                  />
                </div>
              ),
            },
          ]}
        />
      </Spin>
    </PageContainer>
  );
};

export default RiskManagement;