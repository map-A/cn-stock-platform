/**
 * 创建策略模态框组件
 * 支持多种策略类型的创建
 */

import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Button,
  Row,
  Col,
  Space,
  Tabs,
  Card,
  Tag,
  message,
  Divider,
  Tooltip,
  Alert,
} from 'antd';
import {
  RocketOutlined,
  ExperimentOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  CloseOutlined,
  ThunderboltOutlined,
  LineChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { createStrategy } from '@/services/strategy';
import type { StrategyInfo, StrategyType } from '@/typings/strategy';
import './index.less';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface CreateStrategyModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: (strategy: StrategyInfo) => void;
}

const CreateStrategyModal: React.FC<CreateStrategyModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<StrategyType>('trend_following');
  const [activeTab, setActiveTab] = useState('basic');

  // 策略类型配置
  const strategyTypes = [
    {
      value: 'trend_following',
      label: '趋势跟踪',
      icon: '📈',
      description: '捕捉市场趋势，顺势交易',
      color: '#1890ff',
    },
    {
      value: 'mean_reversion',
      label: '均值回归',
      icon: '↩️',
      description: '利用价格回归均值的特性',
      color: '#52c41a',
    },
    {
      value: 'momentum',
      label: '动量策略',
      icon: '⚡',
      description: '追随价格动量和加速度',
      color: '#faad14',
    },
    {
      value: 'grid',
      label: '网格策略',
      icon: '⊞',
      description: '在价格区间内网格交易',
      color: '#13c2c2',
    },
    {
      value: 'arbitrage',
      label: '套利策略',
      icon: '⚖️',
      description: '利用市场价差获利',
      color: '#eb2f96',
    },
    {
      value: 'quantitative',
      label: '量化策略',
      icon: '🔢',
      description: '基于量化模型的策略',
      color: '#722ed1',
    },
    {
      value: 'ai_ml',
      label: 'AI/ML策略',
      icon: '🤖',
      description: '基于机器学习的智能策略',
      color: '#2f54eb',
    },
    {
      value: 'custom',
      label: '自定义',
      icon: '🔧',
      description: '自定义策略逻辑',
      color: '#8c8c8c',
    },
  ];

  // 时间周期选项
  const timeFrames = [
    { value: '1min', label: '1分钟' },
    { value: '5min', label: '5分钟' },
    { value: '15min', label: '15分钟' },
    { value: '30min', label: '30分钟' },
    { value: '1hour', label: '1小时' },
    { value: '4hour', label: '4小时' },
    { value: '1day', label: '日线' },
    { value: '1week', label: '周线' },
  ];

  // 技术指标选项
  const indicators = [
    { value: 'ma', label: '移动平均线(MA)' },
    { value: 'ema', label: '指数移动平均(EMA)' },
    { value: 'rsi', label: '相对强弱指标(RSI)' },
    { value: 'macd', label: 'MACD' },
    { value: 'bollinger', label: '布林带' },
    { value: 'kdj', label: 'KDJ' },
    { value: 'atr', label: 'ATR' },
    { value: 'volume', label: '成交量' },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 构建策略配置
      const strategyData = {
        name: values.name,
        description: values.description || '',
        type: selectedType,
        status: 'draft' as const,
        tags: values.tags || [],
        isPublic: values.isPublic || false,
        config: {
          parameters: {
            symbol: values.symbol || 'BTCUSDT',
            timeFrame: values.timeFrame || '1hour',
            capital: values.capital || 10000,
            maxPositionSize: values.maxPositionSize || 0.1,
            stopLoss: values.stopLoss || 0.02,
            takeProfit: values.takeProfit || 0.04,
            maxDrawdown: values.maxDrawdown || 0.1,
            maxDailyLoss: values.maxDailyLoss || 0.05,
            indicators: values.indicators
              ? Object.fromEntries(
                  values.indicators.map((ind: string) => [
                    ind,
                    { enabled: true, parameters: {} },
                  ])
                )
              : {},
            customParameters: values.customParameters || {},
          },
        },
      };

      const result = await createStrategy(strategyData);
      message.success('策略创建成功！');
      form.resetFields();
      onSuccess?.(result);
      onCancel();
    } catch (error: any) {
      console.error('创建策略失败:', error);
      message.error(error.message || '创建策略失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const getTypeInfo = (type: StrategyType) => {
    return strategyTypes.find((t) => t.value === type) || strategyTypes[0];
  };

  return (
    <Modal
      title={
        <Space>
          <RocketOutlined style={{ color: '#1890ff' }} />
          <span>创建新策略</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      width={900}
      footer={[
        <Button key="cancel" onClick={handleCancel} icon={<CloseOutlined />}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          icon={<SaveOutlined />}
        >
          创建策略
        </Button>,
      ]}
      destroyOnClose
      className="create-strategy-modal"
    >
      <Form form={form} layout="vertical" initialValues={{ isPublic: false }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 基础信息 */}
          <TabPane
            tab={
              <span>
                <InfoCircleOutlined />
                基础信息
              </span>
            }
            key="basic"
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="策略名称"
                  rules={[
                    { required: true, message: '请输入策略名称' },
                    { min: 2, max: 50, message: '名称长度为2-50个字符' },
                  ]}
                >
                  <Input
                    placeholder="例如：趋势追踪策略 V1.0"
                    prefix={<ThunderboltOutlined />}
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="description" label="策略描述">
                  <TextArea
                    rows={3}
                    placeholder="请描述策略的核心逻辑、适用场景等..."
                    showCount
                    maxLength={500}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="策略类型" required>
                  <div className="strategy-type-grid">
                    {strategyTypes.map((type) => (
                      <Card
                        key={type.value}
                        hoverable
                        className={`strategy-type-card ${
                          selectedType === type.value ? 'selected' : ''
                        }`}
                        onClick={() => {
                          setSelectedType(type.value as StrategyType);
                          form.setFieldValue('type', type.value);
                        }}
                        style={{ borderColor: selectedType === type.value ? type.color : undefined }}
                      >
                        <div className="type-icon">{type.icon}</div>
                        <div className="type-name">{type.label}</div>
                        <div className="type-desc">{type.description}</div>
                      </Card>
                    ))}
                  </div>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="tags" label="标签">
                  <Select
                    mode="tags"
                    placeholder="添加标签，按回车确认"
                    style={{ width: '100%' }}
                  >
                    <Option value="高频">高频</Option>
                    <Option value="低风险">低风险</Option>
                    <Option value="长期">长期</Option>
                    <Option value="短期">短期</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="isPublic" label="公开策略" valuePropName="checked">
                  <Switch checkedChildren="公开" unCheckedChildren="私有" />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          {/* 交易参数 */}
          <TabPane
            tab={
              <span>
                <LineChartOutlined />
                交易参数
              </span>
            }
            key="trading"
          >
            <Alert
              message="交易参数配置"
              description="设置策略的基础交易参数，包括交易标的、周期、资金等"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="symbol"
                  label="交易标的"
                  rules={[{ required: true, message: '请输入交易标的' }]}
                  initialValue="BTCUSDT"
                >
                  <Input placeholder="例如：BTCUSDT" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="timeFrame"
                  label="时间周期"
                  rules={[{ required: true, message: '请选择时间周期' }]}
                  initialValue="1hour"
                >
                  <Select placeholder="选择时间周期">
                    {timeFrames.map((tf) => (
                      <Option key={tf.value} value={tf.value}>
                        {tf.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="capital"
                  label={
                    <span>
                      初始资金
                      <Tooltip title="策略运行的初始资金量">
                        <InfoCircleOutlined style={{ marginLeft: 4 }} />
                      </Tooltip>
                    </span>
                  }
                  rules={[{ required: true, message: '请输入初始资金' }]}
                  initialValue={10000}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={1000}
                    max={10000000}
                    step={1000}
                    formatter={(value) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="maxPositionSize"
                  label={
                    <span>
                      最大仓位
                      <Tooltip title="单次交易最大仓位占比">
                        <InfoCircleOutlined style={{ marginLeft: 4 }} />
                      </Tooltip>
                    </span>
                  }
                  initialValue={0.1}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0.01}
                    max={1}
                    step={0.01}
                    formatter={(value) => `${(Number(value) * 100).toFixed(0)}%`}
                    parser={(value) => (Number(value!.replace('%', '')) / 100).toString()}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">风险控制</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="stopLoss"
                  label="止损比例"
                  initialValue={0.02}
                  rules={[{ required: true, message: '请设置止损比例' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0.001}
                    max={0.5}
                    step={0.001}
                    formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                    parser={(value) => (Number(value!.replace('%', '')) / 100).toString()}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="takeProfit"
                  label="止盈比例"
                  initialValue={0.04}
                  rules={[{ required: true, message: '请设置止盈比例' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0.001}
                    max={1}
                    step={0.001}
                    formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                    parser={(value) => (Number(value!.replace('%', '')) / 100).toString()}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="maxDrawdown"
                  label="最大回撤"
                  initialValue={0.1}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0.01}
                    max={0.5}
                    step={0.01}
                    formatter={(value) => `${(Number(value) * 100).toFixed(0)}%`}
                    parser={(value) => (Number(value!.replace('%', '')) / 100).toString()}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="maxDailyLoss"
                  label="单日最大亏损"
                  initialValue={0.05}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0.01}
                    max={0.3}
                    step={0.01}
                    formatter={(value) => `${(Number(value) * 100).toFixed(0)}%`}
                    parser={(value) => (Number(value!.replace('%', '')) / 100).toString()}
                  />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          {/* 技术指标 */}
          <TabPane
            tab={
              <span>
                <SettingOutlined />
                技术指标
              </span>
            }
            key="indicators"
          >
            <Alert
              message="技术指标配置"
              description="选择策略使用的技术指标，可在策略运行后进一步调整参数"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Form.Item name="indicators" label="选择技术指标">
              <Select
                mode="multiple"
                placeholder="选择需要使用的技术指标"
                style={{ width: '100%' }}
              >
                {indicators.map((ind) => (
                  <Option key={ind.value} value={ind.value}>
                    {ind.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Alert
              message="提示"
              description="技术指标的详细参数可在策略创建后，在策略配置页面进行设置"
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default CreateStrategyModal;
