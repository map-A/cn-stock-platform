/**
 * 消息通知设置面板组件
 * 
 * 功能特性:
 * - 邮件通知设置
 * - 浏览器通知设置
 * - 手机推送设置
 * - 安静时间设置
 * - 通知测试功能
 */

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Switch,
  Button,
  Space,
  message,
  Divider,
  Typography,
  TimePicker,
  Checkbox,
  Alert,
} from 'antd';
import {
  MailOutlined,
  BellOutlined,
  MobileOutlined,
  ClockCircleOutlined,
  SoundOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  updateNotificationSettings,
  testNotification,
} from '@/services/user';
import type { NotificationSettings } from '@/types/user';

const { Text, Title } = Typography;

interface NotificationPanelProps {
  notification?: NotificationSettings;
  onUpdate?: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notification, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<NotificationSettings | undefined>(notification);

  // 更新通知设置
  const handleUpdateSettings = async (updates: Partial<NotificationSettings>) => {
    if (!currentSettings) return;

    const newSettings = { ...currentSettings, ...updates };
    setCurrentSettings(newSettings);

    try {
      await updateNotificationSettings(updates);
      message.success('通知设置已更新');
      onUpdate?.();
    } catch (error) {
      console.error('更新通知设置失败:', error);
      message.error('更新通知设置失败');
      // 回滚状态
      setCurrentSettings(currentSettings);
    }
  };

  // 测试通知
  const handleTestNotification = async (type: 'email' | 'browser' | 'mobile') => {
    try {
      setLoading(true);
      await testNotification(type);
      message.success(`${type === 'email' ? '邮件' : type === 'browser' ? '浏览器' : '手机'}通知测试成功`);
    } catch (error) {
      console.error('测试通知失败:', error);
      message.error('测试通知失败');
    } finally {
      setLoading(false);
    }
  };

  if (!currentSettings) {
    return <Card loading />;
  }

  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  return (
    <div>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Card title={
            <Space>
              <MailOutlined />
              邮件通知
            </Space>
          }>
            <div style={{ marginBottom: 16 }}>
              <Row justify="space-between" align="middle">
                <Text strong>启用邮件通知</Text>
                <Switch
                  checked={currentSettings.email.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      email: { ...currentSettings.email, enabled: checked }
                    })
                  }
                />
              </Row>
            </div>

            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
              <Row justify="space-between" align="middle">
                <Text>市场行情提醒</Text>
                <Switch
                  checked={currentSettings.email.marketAlert}
                  disabled={!currentSettings.email.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      email: { ...currentSettings.email, marketAlert: checked }
                    })
                  }
                />
              </Row>

              <Row justify="space-between" align="middle">
                <Text>交易订单通知</Text>
                <Switch
                  checked={currentSettings.email.orderNotification}
                  disabled={!currentSettings.email.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      email: { ...currentSettings.email, orderNotification: checked }
                    })
                  }
                />
              </Row>

              <Row justify="space-between" align="middle">
                <Text>系统公告</Text>
                <Switch
                  checked={currentSettings.email.systemAnnouncement}
                  disabled={!currentSettings.email.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      email: { ...currentSettings.email, systemAnnouncement: checked }
                    })
                  }
                />
              </Row>

              <Row justify="space-between" align="middle">
                <Text>安全提醒</Text>
                <Switch
                  checked={currentSettings.email.securityAlert}
                  disabled={!currentSettings.email.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      email: { ...currentSettings.email, securityAlert: checked }
                    })
                  }
                />
              </Row>

              <Row justify="space-between" align="middle">
                <Text>周报</Text>
                <Switch
                  checked={currentSettings.email.weeklyReport}
                  disabled={!currentSettings.email.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      email: { ...currentSettings.email, weeklyReport: checked }
                    })
                  }
                />
              </Row>
            </Space>

            <div style={{ marginTop: 16 }}>
              <Button
                type="primary"
                size="small"
                icon={<ExperimentOutlined />}
                onClick={() => handleTestNotification('email')}
                disabled={!currentSettings.email.enabled}
                loading={loading}
              >
                测试邮件通知
              </Button>
            </div>
          </Card>

          <Card 
            title={
              <Space>
                <ClockCircleOutlined />
                安静时间
              </Space>
            }
            style={{ marginTop: 16 }}
          >
            <div style={{ marginBottom: 16 }}>
              <Row justify="space-between" align="middle">
                <Text strong>启用安静时间</Text>
                <Switch
                  checked={currentSettings.schedule.quietHours.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      schedule: {
                        ...currentSettings.schedule,
                        quietHours: { ...currentSettings.schedule.quietHours, enabled: checked }
                      }
                    })
                  }
                />
              </Row>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                在安静时间内不发送通知
              </Text>
            </div>

            {currentSettings.schedule.quietHours.enabled && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>时间范围</Text>
                  <div style={{ marginTop: 8 }}>
                    <Space>
                      <TimePicker
                        value={dayjs(currentSettings.schedule.quietHours.startTime, 'HH:mm')}
                        format="HH:mm"
                        placeholder="开始时间"
                        onChange={(time) => {
                          if (time) {
                            handleUpdateSettings({
                              schedule: {
                                ...currentSettings.schedule,
                                quietHours: {
                                  ...currentSettings.schedule.quietHours,
                                  startTime: time.format('HH:mm')
                                }
                              }
                            });
                          }
                        }}
                      />
                      <Text>到</Text>
                      <TimePicker
                        value={dayjs(currentSettings.schedule.quietHours.endTime, 'HH:mm')}
                        format="HH:mm"
                        placeholder="结束时间"
                        onChange={(time) => {
                          if (time) {
                            handleUpdateSettings({
                              schedule: {
                                ...currentSettings.schedule,
                                quietHours: {
                                  ...currentSettings.schedule.quietHours,
                                  endTime: time.format('HH:mm')
                                }
                              }
                            });
                          }
                        }}
                      />
                    </Space>
                  </div>
                </div>

                <div>
                  <Text strong>工作日</Text>
                  <div style={{ marginTop: 8 }}>
                    <Checkbox.Group
                      value={currentSettings.schedule.workdays.map((enabled, index) => enabled ? index : -1).filter(i => i >= 0)}
                      onChange={(checkedValues) => {
                        const newWorkdays = Array(7).fill(false);
                        checkedValues.forEach(index => {
                          if (typeof index === 'number') {
                            newWorkdays[index] = true;
                          }
                        });
                        handleUpdateSettings({
                          schedule: {
                            ...currentSettings.schedule,
                            workdays: newWorkdays
                          }
                        });
                      }}
                    >
                      {weekDays.map((day, index) => (
                        <Checkbox key={index} value={index}>
                          {day}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </div>
                </div>
              </>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card title={
            <Space>
              <BellOutlined />
              浏览器通知
            </Space>
          }>
            <div style={{ marginBottom: 16 }}>
              <Row justify="space-between" align="middle">
                <Text strong>启用浏览器通知</Text>
                <Switch
                  checked={currentSettings.browser.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      browser: { ...currentSettings.browser, enabled: checked }
                    })
                  }
                />
              </Row>
            </div>

            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
              <Row justify="space-between" align="middle">
                <Text>市场行情提醒</Text>
                <Switch
                  checked={currentSettings.browser.marketAlert}
                  disabled={!currentSettings.browser.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      browser: { ...currentSettings.browser, marketAlert: checked }
                    })
                  }
                />
              </Row>

              <Row justify="space-between" align="middle">
                <Text>交易订单通知</Text>
                <Switch
                  checked={currentSettings.browser.orderNotification}
                  disabled={!currentSettings.browser.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      browser: { ...currentSettings.browser, orderNotification: checked }
                    })
                  }
                />
              </Row>

              <Row justify="space-between" align="middle">
                <Text>系统提醒</Text>
                <Switch
                  checked={currentSettings.browser.systemAlert}
                  disabled={!currentSettings.browser.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      browser: { ...currentSettings.browser, systemAlert: checked }
                    })
                  }
                />
              </Row>

              <Row justify="space-between" align="middle">
                <Space>
                  <SoundOutlined />
                  <Text>提示音</Text>
                </Space>
                <Switch
                  checked={currentSettings.browser.soundEnabled}
                  disabled={!currentSettings.browser.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      browser: { ...currentSettings.browser, soundEnabled: checked }
                    })
                  }
                />
              </Row>
            </Space>

            <div style={{ marginTop: 16 }}>
              <Button
                type="primary"
                size="small"
                icon={<ExperimentOutlined />}
                onClick={() => handleTestNotification('browser')}
                disabled={!currentSettings.browser.enabled}
                loading={loading}
              >
                测试浏览器通知
              </Button>
            </div>
          </Card>

          <Card 
            title={
              <Space>
                <MobileOutlined />
                手机推送
              </Space>
            }
            style={{ marginTop: 16 }}
          >
            <div style={{ marginBottom: 16 }}>
              <Row justify="space-between" align="middle">
                <Text strong>启用手机推送</Text>
                <Switch
                  checked={currentSettings.mobile.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      mobile: { ...currentSettings.mobile, enabled: checked }
                    })
                  }
                />
              </Row>
            </div>

            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
              <Row justify="space-between" align="middle">
                <Text>市场行情提醒</Text>
                <Switch
                  checked={currentSettings.mobile.marketAlert}
                  disabled={!currentSettings.mobile.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      mobile: { ...currentSettings.mobile, marketAlert: checked }
                    })
                  }
                />
              </Row>

              <Row justify="space-between" align="middle">
                <Text>交易订单通知</Text>
                <Switch
                  checked={currentSettings.mobile.orderNotification}
                  disabled={!currentSettings.mobile.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      mobile: { ...currentSettings.mobile, orderNotification: checked }
                    })
                  }
                />
              </Row>

              <Row justify="space-between" align="middle">
                <Text>紧急提醒</Text>
                <Switch
                  checked={currentSettings.mobile.emergencyAlert}
                  disabled={!currentSettings.mobile.enabled}
                  onChange={(checked) => 
                    handleUpdateSettings({
                      mobile: { ...currentSettings.mobile, emergencyAlert: checked }
                    })
                  }
                />
              </Row>
            </Space>

            <div style={{ marginTop: 16 }}>
              <Button
                type="primary"
                size="small"
                icon={<ExperimentOutlined />}
                onClick={() => handleTestNotification('mobile')}
                disabled={!currentSettings.mobile.enabled}
                loading={loading}
              >
                测试手机推送
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Alert
        message="通知权限提醒"
        description="为了正常接收浏览器通知，请确保已授予本网站通知权限。您可以在浏览器设置中管理通知权限。"
        type="info"
        showIcon
        style={{ marginTop: 24 }}
      />
    </div>
  );
};

export default NotificationPanel;