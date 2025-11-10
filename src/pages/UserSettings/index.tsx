/**
 * 用户设置主页面
 * 
 * 功能特性:
 * - 个人信息管理
 * - 界面主题配置
 * - 消息通知设置
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
  Avatar,
  Typography,
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  HistoryOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

// 组件导入
import {
  ProfilePanel,
  ThemePanel, 
  NotificationPanel,
  ActivityPanel,
} from '@/components/UserSettings';

// API和类型导入
import {
  getUserSettings,
  getUserStatistics,
} from '@/services/user';
import type { UserSettingsResponse } from '@/types/user';

const { TabPane } = Tabs;
const { Text, Title } = Typography;

const UserSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState<UserSettingsResponse | null>(null);
  const [statistics, setStatistics] = useState<any>(null);

  // 加载用户设置数据
  const loadUserSettings = async () => {
    try {
      setLoading(true);
      const [settingsData, statsData] = await Promise.all([
        getUserSettings(),
        getUserStatistics(),
      ]);
      setSettings(settingsData);
      setStatistics(statsData);
    } catch (error) {
      console.error('加载用户设置失败:', error);
      message.error('加载用户设置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserSettings();
  }, []);

  // 刷新数据
  const handleRefresh = () => {
    loadUserSettings();
  };

  // 渲染用户概览卡片
  const renderUserOverview = () => {
    if (!settings || !statistics) return null;

    const { profile } = settings;
    
    return (
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Avatar
              size={80}
              src={profile.avatar}
              icon={<UserOutlined />}
            />
          </Col>
          <Col flex="auto">
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {profile.nickname || profile.username}
              </Title>
              <Text type="secondary">{profile.email}</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color={profile.status === 'active' ? 'green' : 'red'}>
                  {profile.status === 'active' ? '活跃' : '非活跃'}
                </Tag>
                {profile.department && (
                  <Tag color="blue">{profile.department}</Tag>
                )}
              </div>
            </div>
          </Col>
          <Col>
            <Row gutter={16}>
              <Col>
                <Statistic
                  title="安全评分"
                  value={statistics.securityScore}
                  suffix="/100"
                  valueStyle={{ 
                    color: statistics.securityScore >= 80 ? '#3f8600' : 
                           statistics.securityScore >= 60 ? '#faad14' : '#cf1322' 
                  }}
                />
              </Col>
              <Col>
                <Statistic
                  title="登录次数"
                  value={statistics.loginCount}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col>
                <Statistic
                  title="账户天数"
                  value={statistics.accountAge}
                  suffix="天"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    );
  };

  // 渲染安全提醒
  const renderSecurityAlert = () => {
    if (!settings || !statistics) return null;

    const alerts = [];
    
    // 检查安全评分
    if (statistics.securityScore < 60) {
      alerts.push({
        type: 'warning' as const,
        message: '安全评分较低',
        description: '建议启用两步验证并更新密码策略',
      });
    }

    // 检查两步验证
    if (!settings.security.twoFactorAuth.enabled) {
      alerts.push({
        type: 'info' as const,
        message: '建议启用两步验证',
        description: '两步验证可以大大提高账户安全性',
      });
    }

    // 检查设备数量
    if (statistics.deviceCount > 5) {
      alerts.push({
        type: 'warning' as const,
        message: '设备数量较多',
        description: `当前有 ${statistics.deviceCount} 个设备登录，建议检查设备管理`,
      });
    }

    if (alerts.length === 0) return null;

    return (
      <div style={{ marginBottom: 16 }}>
        {alerts.map((alert, index) => (
          <Alert
            key={index}
            type={alert.type}
            message={alert.message}
            description={alert.description}
            showIcon
            style={{ marginBottom: 8 }}
          />
        ))}
      </div>
    );
  };

  if (loading && !settings) {
    return (
      <PageContainer>
        <Spin size="large" style={{ display: 'block', textAlign: 'center', margin: '100px 0' }} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        title: '用户设置',
        subTitle: '管理您的个人信息、安全设置和个性化偏好',
        extra: [
          <Button
            key="refresh"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
          >
            刷新
          </Button>,
        ],
      }}
    >
      {renderUserOverview()}
      {renderSecurityAlert()}
      
      <Card style={{ marginTop: 16 }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="line"
          size="large"
        >
          <TabPane
            tab={
              <Space>
                <UserOutlined />
                个人信息
              </Space>
            }
            key="profile"
          >
            <ProfilePanel 
              profile={settings?.profile}
              onUpdate={loadUserSettings}
            />
          </TabPane>

          <TabPane
            tab={
              <Space>
                <SettingOutlined />
                界面主题
              </Space>
            }
            key="theme"
          >
            <ThemePanel 
              theme={settings?.theme}
              onUpdate={loadUserSettings}
            />
          </TabPane>

          <TabPane
            tab={
              <Space>
                <BellOutlined />
                消息通知
              </Space>
            }
            key="notification"
          >
            <NotificationPanel 
              notification={settings?.notification}
              onUpdate={loadUserSettings}
            />
          </TabPane>

          <TabPane
            tab={
              <Space>
                <HistoryOutlined />
                活动日志
              </Space>
            }
            key="activity"
          >
            <ActivityPanel />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};

export default UserSettings;