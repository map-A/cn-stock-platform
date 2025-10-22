/**
 * 风险设置组件
 * 
 * 功能特性:
 * - 风险阈值配置
 * - 预警规则设置
 * - 计算参数调整
 * - 通知设置管理
 * - 合规规则配置
 * 
 * 依据文档: MODULE_PROMPTS.md - 风险管理模块
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  InputNumber,
  Switch,
  Button,
  Select,
  Row,
  Col,
  Divider,
  message,
  Tabs,
  Space,
  Alert,
  TimePicker,
  Input,
  Tooltip,
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  BellOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './RiskSettings.less';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 风险设置接口
export interface RiskSettings {
  // VaR设置
  varConfidence: number;
  varHoldingPeriod: number;
  varMethod: 'parametric' | 'historical' | 'monte_carlo';
  
  // 风险阈值
  maxVaR: number;
  maxDrawdown: number;
  maxVolatility: number;
  maxConcentration: number;
  minLiquidity: number;
  
  // 预警设置
  enableAlerts: boolean;
  alertMethods: string[];
  alertThresholds: {
    var: number;
    drawdown: number;
    concentration: number;
  };
  
  // 通知设置
  emailNotifications: boolean;
  smsNotifications: boolean;
  alertTiming: string;
  notificationEmails: string[];
  
  // 计算设置
  calculationFrequency: 'real_time' | 'hourly' | 'daily';
  dataLookbackPeriod: number;
  correlationWindow: number;
  
  // 合规设置
  enableCompliance: boolean;
  complianceCheckFrequency: 'daily' | 'weekly' | 'monthly';
  autoGenerateReports: boolean;
  reportSchedule: string;
}

export interface RiskSettingsProps {
  onSave: () => void;
}

/**
 * 风险设置组件
 */
const RiskSettings: React.FC<RiskSettingsProps> = ({ onSave }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('risk');

  // 默认设置
  const defaultSettings: RiskSettings = {
    varConfidence: 95,
    varHoldingPeriod: 1,
    varMethod: 'parametric',
    maxVaR: 5,
    maxDrawdown: 15,
    maxVolatility: 25,
    maxConcentration: 30,
    minLiquidity: 5,
    enableAlerts: true,
    alertMethods: ['email', 'dashboard'],
    alertThresholds: {
      var: 4,
      drawdown: 12,
      concentration: 25,
    },
    emailNotifications: true,
    smsNotifications: false,
    alertTiming: '09:00',
    notificationEmails: [],
    calculationFrequency: 'real_time',
    dataLookbackPeriod: 252,
    correlationWindow: 60,
    enableCompliance: true,
    complianceCheckFrequency: 'daily',
    autoGenerateReports: true,
    reportSchedule: '18:00',
  };

  /**
   * 初始化表单
   */
  useEffect(() => {
    loadSettings();
  }, []);

  /**
   * 加载设置
   */
  const loadSettings = async () => {
    try {
      // TODO: 从API加载设置
      const settings = { ...defaultSettings };
      form.setFieldsValue({
        ...settings,
        alertTiming: dayjs(settings.alertTiming, 'HH:mm'),
        reportSchedule: dayjs(settings.reportSchedule, 'HH:mm'),
      });
    } catch (error) {
      message.error('加载设置失败');
    }
  };

  /**
   * 保存设置
   */
  const saveSettings = async (values: any) => {
    setLoading(true);
    try {
      // 处理时间格式
      const processedValues = {
        ...values,
        alertTiming: values.alertTiming?.format('HH:mm'),
        reportSchedule: values.reportSchedule?.format('HH:mm'),
      };

      // TODO: 调用API保存设置
      console.log('保存风险设置:', processedValues);
      
      message.success('设置保存成功');
      onSave();
    } catch (error) {
      message.error('保存设置失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 重置设置
   */
  const resetSettings = () => {
    form.setFieldsValue({
      ...defaultSettings,
      alertTiming: dayjs(defaultSettings.alertTiming, 'HH:mm'),
      reportSchedule: dayjs(defaultSettings.reportSchedule, 'HH:mm'),
    });
    message.success('设置已重置');
  };

  /**
   * 测试通知
   */
  const testNotification = () => {
    message.success('测试通知已发送');
  };

  return (
    <div className="risk-settings">
      <Form
        form={form}
        layout="vertical"
        onFinish={saveSettings}
        className="settings-form"
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 风险参数设置 */}
          <TabPane tab={
            <span>
              <SecurityScanOutlined />
              风险参数
            </span>
          } key="risk">
            <Row gutter={24}>
              <Col span={12}>
                <Card title="VaR计算参数" size="small">
                  <Form.Item
                    name="varConfidence"
                    label={
                      <span>
                        置信度 (%)
                        <Tooltip title="VaR计算的置信水平，常用95%或99%">
                          <InfoCircleOutlined style={{ marginLeft: 4 }} />
                        </Tooltip>
                      </span>
                    }
                  >
                    <Select>
                      <Option value={90}>90%</Option>
                      <Option value={95}>95%</Option>
                      <Option value={99}>99%</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="varHoldingPeriod"
                    label={
                      <span>
                        持有期 (天)
                        <Tooltip title="VaR计算的时间范围">
                          <InfoCircleOutlined style={{ marginLeft: 4 }} />
                        </Tooltip>
                      </span>
                    }
                  >
                    <Select>
                      <Option value={1}>1天</Option>
                      <Option value={5}>5天</Option>
                      <Option value={10}>10天</Option>
                      <Option value={20}>20天</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="varMethod"
                    label="计算方法"
                  >
                    <Select>
                      <Option value="parametric">参数法</Option>
                      <Option value="historical">历史模拟法</Option>
                      <Option value="monte_carlo">蒙特卡洛法</Option>
                    </Select>
                  </Form.Item>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="风险阈值设置" size="small">
                  <Form.Item
                    name="maxVaR"
                    label="最大VaR (%)"
                  >
                    <InputNumber
                      min={1}
                      max={20}
                      step={0.1}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="maxDrawdown"
                    label="最大回撤 (%)"
                  >
                    <InputNumber
                      min={5}
                      max={50}
                      step={0.5}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="maxVolatility"
                    label="最大波动率 (%)"
                  >
                    <InputNumber
                      min={10}
                      max={100}
                      step={1}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="maxConcentration"
                    label="最大集中度 (%)"
                  >
                    <InputNumber
                      min={10}
                      max={80}
                      step={1}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="minLiquidity"
                    label="最小流动性 (%)"
                  >
                    <InputNumber
                      min={1}
                      max={20}
                      step={0.5}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 预警设置 */}
          <TabPane tab={
            <span>
              <BellOutlined />
              预警设置
            </span>
          } key="alert">
            <Row gutter={24}>
              <Col span={12}>
                <Card title="预警配置" size="small">
                  <Form.Item
                    name="enableAlerts"
                    label="启用预警"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="alertMethods"
                    label="预警方式"
                  >
                    <Select mode="multiple" placeholder="选择预警方式">
                      <Option value="email">邮件</Option>
                      <Option value="sms">短信</Option>
                      <Option value="dashboard">仪表板</Option>
                      <Option value="webhook">Webhook</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="alertTiming"
                    label="预警时间"
                  >
                    <TimePicker 
                      format="HH:mm" 
                      style={{ width: '100%' }}
                      placeholder="选择预警发送时间"
                    />
                  </Form.Item>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="预警阈值" size="small">
                  <Form.Item
                    name={['alertThresholds', 'var']}
                    label="VaR预警阈值 (%)"
                  >
                    <InputNumber
                      min={1}
                      max={10}
                      step={0.1}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    name={['alertThresholds', 'drawdown']}
                    label="回撤预警阈值 (%)"
                  >
                    <InputNumber
                      min={5}
                      max={30}
                      step={0.5}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    name={['alertThresholds', 'concentration']}
                    label="集中度预警阈值 (%)"
                  >
                    <InputNumber
                      min={10}
                      max={50}
                      step={1}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 通知设置 */}
          <TabPane tab={
            <span>
              <BellOutlined />
              通知设置
            </span>
          } key="notification">
            <Row gutter={24}>
              <Col span={12}>
                <Card title="通知方式" size="small">
                  <Form.Item
                    name="emailNotifications"
                    label="邮件通知"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="smsNotifications"
                    label="短信通知"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="notificationEmails"
                    label="通知邮箱"
                  >
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      placeholder="输入邮箱地址"
                      tokenSeparators={[',', ';']}
                    />
                  </Form.Item>

                  <Space>
                    <Button onClick={testNotification}>
                      测试通知
                    </Button>
                  </Space>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="计算设置" size="small">
                  <Form.Item
                    name="calculationFrequency"
                    label="计算频率"
                  >
                    <Select>
                      <Option value="real_time">实时</Option>
                      <Option value="hourly">每小时</Option>
                      <Option value="daily">每日</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="dataLookbackPeriod"
                    label="数据回看期 (天)"
                  >
                    <InputNumber
                      min={30}
                      max={1000}
                      step={10}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="correlationWindow"
                    label="相关性窗口 (天)"
                  >
                    <InputNumber
                      min={20}
                      max={252}
                      step={5}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </TabPane>

          {/* 合规设置 */}
          <TabPane tab={
            <span>
              <SettingOutlined />
              合规设置
            </span>
          } key="compliance">
            <Row gutter={24}>
              <Col span={12}>
                <Card title="合规检查" size="small">
                  <Form.Item
                    name="enableCompliance"
                    label="启用合规检查"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="complianceCheckFrequency"
                    label="检查频率"
                  >
                    <Select>
                      <Option value="daily">每日</Option>
                      <Option value="weekly">每周</Option>
                      <Option value="monthly">每月</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="autoGenerateReports"
                    label="自动生成报告"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item
                    name="reportSchedule"
                    label="报告生成时间"
                  >
                    <TimePicker 
                      format="HH:mm" 
                      style={{ width: '100%' }}
                      placeholder="选择报告生成时间"
                    />
                  </Form.Item>
                </Card>
              </Col>

              <Col span={12}>
                <Card title="监管要求" size="small">
                  <Alert
                    message="监管合规提醒"
                    description="请确保所有风险设置符合相关监管要求，定期更新合规规则以适应监管变化。"
                    type="info"
                    showIcon
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        <Divider />

        {/* 操作按钮 */}
        <div className="form-actions">
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              保存设置
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={resetSettings}
            >
              重置设置
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default RiskSettings;