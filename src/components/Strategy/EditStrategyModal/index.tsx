import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch, Button, Row, Col, Space, Tabs, Card, message, Divider, Spin } from 'antd';
import { EditOutlined, InfoCircleOutlined, SaveOutlined, CloseOutlined, ThunderboltOutlined, LineChartOutlined, SettingOutlined } from '@ant-design/icons';
import { getStrategy, updateStrategy } from '@/services/strategy';
import type { StrategyInfo, StrategyType } from '@/typings/strategy';
import './index.less';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface EditStrategyModalProps {
  visible: boolean;
  strategyId: string | number;
  onCancel: () => void;
  onSuccess?: (strategy: StrategyInfo) => void;
}

const EditStrategyModal: React.FC<EditStrategyModalProps> = ({ visible, strategyId, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState<StrategyType>('trend_following');
  const [activeTab, setActiveTab] = useState('basic');

  const strategyTypes = [
    { value: 'trend_following', label: '趋势跟踪', icon: '📈', color: '#1890ff' },
    { value: 'mean_reversion', label: '均值回归', icon: '↩️', color: '#52c41a' },
    { value: 'momentum', label: '动量策略', icon: '⚡', color: '#faad14' },
    { value: 'grid', label: '网格策略', icon: '⊞', color: '#13c2c2' },
    { value: 'arbitrage', label: '套利策略', icon: '⚖️', color: '#eb2f96' },
    { value: 'quantitative', label: '量化策略', icon: '🔢', color: '#722ed1' },
    { value: 'ai_ml', label: 'AI/ML策略', icon: '🤖', color: '#2f54eb' },
    { value: 'custom', label: '自定义', icon: '🔧', color: '#8c8c8c' },
  ];

  useEffect(() => {
    if (visible && strategyId) {
      loadStrategy();
    }
  }, [visible, strategyId]);

  const loadStrategy = async () => {
    try {
      setLoading(true);
      const data = await getStrategy(String(strategyId));
      setSelectedType(data.type);
      const config = data.config || {};
      const parameters = config.parameters || {};
      form.setFieldsValue({
        name: data.name,
        description: data.description,
        tags: data.tags || [],
        isPublic: data.isPublic || false,
        symbol: parameters.symbol || 'BTCUSDT',
        timeFrame: parameters.timeFrame || '1hour',
        capital: parameters.capital || 10000,
        maxPositionSize: parameters.maxPositionSize || 0.1,
        stopLoss: parameters.stopLoss || 0.02,
        takeProfit: parameters.takeProfit || 0.04,
        indicators: parameters.indicators ? Object.keys(parameters.indicators).filter((key) => parameters.indicators[key].enabled) : [],
      });
    } catch (error) {
      message.error('加载策略失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const updateData = {
        name: values.name,
        description: values.description || '',
        type: selectedType,
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
            indicators: values.indicators ? Object.fromEntries(values.indicators.map((ind: string) => [ind, { enabled: true, parameters: {} }])) : {},
          },
        },
      };
      const result = await updateStrategy(String(strategyId), updateData);
      message.success('策略更新成功！');
      onSuccess?.(result);
      onCancel();
    } catch (error: any) {
      message.error(error.message || '更新策略失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={<Space><EditOutlined style={{ color: '#1890ff' }} /><span>编辑策略</span></Space>} open={visible} onCancel={onCancel} width={900} footer={[<Button key="cancel" onClick={onCancel} icon={<CloseOutlined />}>取消</Button>, <Button key="submit" type="primary" loading={saving} onClick={handleSubmit} icon={<SaveOutlined />}>保存修改</Button>]} destroyOnClose className="edit-strategy-modal">
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab={<span><InfoCircleOutlined />基础信息</span>} key="basic">
              <Row gutter={16}>
                <Col span={24}><Form.Item name="name" label="策略名称" rules={[{ required: true, message: '请输入策略名称' }]}><Input placeholder="策略名称" prefix={<ThunderboltOutlined />} size="large" /></Form.Item></Col>
                <Col span={24}><Form.Item name="description" label="策略描述"><TextArea rows={3} placeholder="策略描述..." showCount maxLength={500} /></Form.Item></Col>
                <Col span={24}><Form.Item label="策略类型" required><div className="strategy-type-grid">{strategyTypes.map((type) => (<Card key={type.value} hoverable className={`strategy-type-card ${selectedType === type.value ? 'selected' : ''}`} onClick={() => setSelectedType(type.value as StrategyType)} style={{ borderColor: selectedType === type.value ? type.color : undefined }}><div className="type-icon">{type.icon}</div><div className="type-name">{type.label}</div></Card>))}</div></Form.Item></Col>
                <Col span={24}><Form.Item name="tags" label="标签"><Select mode="tags" placeholder="添加标签"><Option value="高频">高频</Option><Option value="低风险">低风险</Option></Select></Form.Item></Col>
                <Col span={12}><Form.Item name="isPublic" label="公开策略" valuePropName="checked"><Switch checkedChildren="公开" unCheckedChildren="私有" /></Form.Item></Col>
              </Row>
            </TabPane>
            <TabPane tab={<span><LineChartOutlined />交易参数</span>} key="trading">
              <Row gutter={16}>
                <Col span={12}><Form.Item name="symbol" label="交易标的" rules={[{ required: true }]}><Input placeholder="BTCUSDT" /></Form.Item></Col>
                <Col span={12}><Form.Item name="timeFrame" label="时间周期" rules={[{ required: true }]}><Select><Option value="1hour">1小时</Option><Option value="4hour">4小时</Option><Option value="1day">日线</Option></Select></Form.Item></Col>
                <Col span={12}><Form.Item name="capital" label="初始资金"><InputNumber style={{ width: '100%' }} min={1000} /></Form.Item></Col>
                <Col span={12}><Form.Item name="maxPositionSize" label="最大仓位"><InputNumber style={{ width: '100%' }} min={0.01} max={1} /></Form.Item></Col>
              </Row>
              <Divider>风险控制</Divider>
              <Row gutter={16}>
                <Col span={12}><Form.Item name="stopLoss" label="止损比例"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
                <Col span={12}><Form.Item name="takeProfit" label="止盈比例"><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
              </Row>
            </TabPane>
            <TabPane tab={<span><SettingOutlined />技术指标</span>} key="indicators">
              <Form.Item name="indicators" label="选择技术指标"><Select mode="multiple"><Option value="ma">MA</Option><Option value="ema">EMA</Option><Option value="rsi">RSI</Option></Select></Form.Item>
            </TabPane>
          </Tabs>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditStrategyModal;
