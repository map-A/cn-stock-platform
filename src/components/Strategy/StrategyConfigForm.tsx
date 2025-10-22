/**
 * 策略配置组件
 * 
 * 功能特性:
 * - 策略参数配置
 * - 风险控制设置
 * - 技术指标配置
 * - AI/ML参数设置
 * - 配置保存和验证
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Row,
  Col,
  Space,
  Divider,
  Tabs,
  Collapse,
  Slider,
  Typography,
  Tooltip,
  Alert,
  message,
} from 'antd';
import {
  SaveOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { getStrategyConfig, createStrategyConfig, updateStrategyConfig } from '@/services/strategy';
import type { StrategyConfig, StrategyParameters, StrategyType, TimeFrame } from '@/types/strategy';
import './StrategyConfigForm.less';

const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Title, Text } = Typography;

export interface StrategyConfigFormProps {
  strategyId: string;
  strategyType: StrategyType;
  configId?: string;
  onSave?: (config: StrategyConfig) => void;
  onCancel?: () => void;
}

const StrategyConfigForm: React.FC<StrategyConfigFormProps> = ({
  strategyId,
  strategyType,
  configId,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<StrategyConfig | null>(null);

  /**
   * 默认参数配置
   */
  const getDefaultParameters = (type: StrategyType): StrategyParameters => {
    const baseParams: StrategyParameters = {
      symbol: 'BTCUSDT',
      timeFrame: '1hour',
      capital: 10000,
      maxPositionSize: 0.1,
      stopLoss: 0.02,
      takeProfit: 0.04,
      maxDrawdown: 0.1,
      maxDailyLoss: 0.05,
      indicators: {},
      customParameters: {},
    };

    switch (type) {
      case 'trend_following':
        return {
          ...baseParams,
          indicators: {
            sma: { enabled: true, parameters: { period: 20 } },
            ema: { enabled: true, parameters: { period: 12 } },
            macd: { enabled: true, parameters: { fast: 12, slow: 26, signal: 9 } },
          },
        };
      
      case 'mean_reversion':
        return {
          ...baseParams,
          indicators: {
            bollinger: { enabled: true, parameters: { period: 20, stdDev: 2 } },
            rsi: { enabled: true, parameters: { period: 14 } },
            stochastic: { enabled: true, parameters: { k: 14, d: 3 } },
          },
        };
      
      case 'ai_ml':
        return {
          ...baseParams,
          mlParameters: {
            modelType: 'lstm',
            features: ['price', 'volume', 'technical_indicators'],
            lookbackPeriod: 60,
            predictionHorizon: 5,
            retrainFrequency: 24,
            confidenceThreshold: 0.7,
          },
          indicators: {
            rsi: { enabled: true, parameters: { period: 14 } },
            macd: { enabled: true, parameters: { fast: 12, slow: 26, signal: 9 } },
            volume: { enabled: true, parameters: {} },
          },
        };
      
      default:
        return baseParams;
    }
  };

  /**
   * 加载配置
   */
  const loadConfig = async () => {
    if (!configId) {
      // 新建配置，使用默认值
      const defaultParams = getDefaultParameters(strategyType);
      form.setFieldsValue(defaultParams);
      return;
    }

    try {
      setLoading(true);
      const configData = await getStrategyConfig(strategyId, configId);
      setConfig(configData);
      form.setFieldsValue(configData.parameters);
    } catch (error) {
      console.error('加载策略配置失败:', error);
      message.error('加载策略配置失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 保存配置
   */
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const configData = {
        name: values.configName || `${strategyType}_config_${Date.now()}`,
        parameters: {
          ...values,
          indicators: values.indicators || {},
          customParameters: values.customParameters || {},
        },
        isDefault: values.isDefault || false,
      };

      let savedConfig: StrategyConfig;
      
      if (configId) {
        savedConfig = await updateStrategyConfig(strategyId, configId, configData);
      } else {
        savedConfig = await createStrategyConfig(strategyId, configData);
      }

      message.success('策略配置保存成功');
      onSave?.(savedConfig);
    } catch (error) {
      console.error('保存策略配置失败:', error);
      message.error('保存策略配置失败');
    } finally {
      setSaving(false);
    }
  };

  /**
   * 重置表单
   */
  const handleReset = () => {
    const defaultParams = getDefaultParameters(strategyType);
    form.setFieldsValue(defaultParams);
  };

  /**
   * 初始化
   */
  useEffect(() => {
    loadConfig();
  }, [strategyId, configId]);

  /**
   * 技术指标配置
   */
  const renderIndicatorConfig = () => {
    const indicators = form.getFieldValue('indicators') || {};
    
    return (
      <Collapse size="small">
        <Panel header="移动平均线 (SMA)" key="sma">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name={['indicators', 'sma', 'enabled']} valuePropName="checked">
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item 
                label="周期" 
                name={['indicators', 'sma', 'parameters', 'period']}
                initialValue={20}
              >
                <InputNumber min={1} max={200} />
              </Form.Item>
            </Col>
          </Row>
        </Panel>
        
        <Panel header="指数移动平均线 (EMA)" key="ema">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name={['indicators', 'ema', 'enabled']} valuePropName="checked">
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item 
                label="周期" 
                name={['indicators', 'ema', 'parameters', 'period']}
                initialValue={12}
              >
                <InputNumber min={1} max={200} />
              </Form.Item>
            </Col>
          </Row>
        </Panel>
        
        <Panel header="MACD" key="macd">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name={['indicators', 'macd', 'enabled']} valuePropName="checked">
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item 
                    label="快线" 
                    name={['indicators', 'macd', 'parameters', 'fast']}
                    initialValue={12}
                  >
                    <InputNumber min={1} max={50} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="慢线" 
                    name={['indicators', 'macd', 'parameters', 'slow']}
                    initialValue={26}
                  >
                    <InputNumber min={1} max={100} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item 
                    label="信号线" 
                    name={['indicators', 'macd', 'parameters', 'signal']}
                    initialValue={9}
                  >
                    <InputNumber min={1} max={50} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Panel>
        
        <Panel header="RSI" key="rsi">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name={['indicators', 'rsi', 'enabled']} valuePropName="checked">
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item 
                label="周期" 
                name={['indicators', 'rsi', 'parameters', 'period']}
                initialValue={14}
              >
                <InputNumber min={1} max={100} />
              </Form.Item>
            </Col>
          </Row>
        </Panel>
        
        <Panel header="布林带 (Bollinger Bands)" key="bollinger">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name={['indicators', 'bollinger', 'enabled']} valuePropName="checked">
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item 
                    label="周期" 
                    name={['indicators', 'bollinger', 'parameters', 'period']}
                    initialValue={20}
                  >
                    <InputNumber min={1} max={100} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    label="标准差倍数" 
                    name={['indicators', 'bollinger', 'parameters', 'stdDev']}
                    initialValue={2}
                  >
                    <InputNumber min={0.5} max={5} step={0.1} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    );
  };

  /**
   * AI/ML参数配置
   */
  const renderMLConfig = () => {
    if (strategyType !== 'ai_ml') return null;

    return (
      <Card size="small" title={<><ExperimentOutlined /> AI/ML 参数配置</>}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label="模型类型" 
              name={['mlParameters', 'modelType']}
              initialValue="lstm"
            >
              <Select>
                <Option value="lstm">LSTM 长短期记忆网络</Option>
                <Option value="random_forest">随机森林</Option>
                <Option value="svm">支持向量机</Option>
                <Option value="linear_regression">线性回归</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item 
              label="特征选择" 
              name={['mlParameters', 'features']}
              initialValue={['price', 'volume', 'technical_indicators']}
            >
              <Select mode="multiple">
                <Option value="price">价格数据</Option>
                <Option value="volume">成交量</Option>
                <Option value="technical_indicators">技术指标</Option>
                <Option value="market_sentiment">市场情绪</Option>
                <Option value="news_sentiment">新闻情绪</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item 
              label="回看周期" 
              name={['mlParameters', 'lookbackPeriod']}
              initialValue={60}
            >
              <InputNumber min={10} max={500} addonAfter="个周期" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item 
              label="预测周期" 
              name={['mlParameters', 'predictionHorizon']}
              initialValue={5}
            >
              <InputNumber min={1} max={50} addonAfter="个周期" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item 
              label="重训练频率" 
              name={['mlParameters', 'retrainFrequency']}
              initialValue={24}
            >
              <InputNumber min={1} max={168} addonAfter="小时" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item 
              label="置信度阈值" 
              name={['mlParameters', 'confidenceThreshold']}
              initialValue={0.7}
            >
              <Slider min={0.1} max={1.0} step={0.1} marks={{ 0.5: '50%', 0.7: '70%', 0.9: '90%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div className="strategy-config-form">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        loading={loading}
      >
        {/* 基础配置 */}
        <Tabs defaultActiveKey="basic">
          <TabPane tab="基础配置" key="basic">
            <Card size="small" title="基础参数">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    label="配置名称" 
                    name="configName"
                    rules={[{ required: true, message: '请输入配置名称' }]}
                  >
                    <Input placeholder="输入配置名称" />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item 
                    label="交易品种" 
                    name="symbol"
                    rules={[{ required: true, message: '请选择交易品种' }]}
                  >
                    <Select showSearch placeholder="选择交易品种">
                      <Option value="BTCUSDT">BTC/USDT</Option>
                      <Option value="ETHUSDT">ETH/USDT</Option>
                      <Option value="ADAUSDT">ADA/USDT</Option>
                      <Option value="DOTUSDT">DOT/USDT</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item 
                    label="时间框架" 
                    name="timeFrame"
                    rules={[{ required: true, message: '请选择时间框架' }]}
                  >
                    <Select>
                      <Option value="1min">1分钟</Option>
                      <Option value="5min">5分钟</Option>
                      <Option value="15min">15分钟</Option>
                      <Option value="30min">30分钟</Option>
                      <Option value="1hour">1小时</Option>
                      <Option value="4hour">4小时</Option>
                      <Option value="1day">1天</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item 
                    label="初始资金" 
                    name="capital"
                    rules={[{ required: true, message: '请输入初始资金' }]}
                  >
                    <InputNumber
                      min={1000}
                      max={10000000}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item 
                    label="最大仓位" 
                    name="maxPositionSize"
                    tooltip="单次交易占总资金的最大比例"
                  >
                    <Slider
                      min={0.01}
                      max={1.0}
                      step={0.01}
                      marks={{ 0.1: '10%', 0.5: '50%', 1.0: '100%' }}
                    />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item name="isDefault" valuePropName="checked">
                    <Switch checkedChildren="默认配置" unCheckedChildren="普通配置" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </TabPane>

          {/* 风险控制 */}
          <TabPane tab="风险控制" key="risk">
            <Card size="small" title="风险控制参数">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    label="止损比例" 
                    name="stopLoss"
                    tooltip="单笔交易的最大亏损比例"
                  >
                    <Slider
                      min={0.005}
                      max={0.1}
                      step={0.005}
                      marks={{ 0.01: '1%', 0.02: '2%', 0.05: '5%' }}
                    />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item 
                    label="止盈比例" 
                    name="takeProfit"
                    tooltip="单笔交易的目标盈利比例"
                  >
                    <Slider
                      min={0.01}
                      max={0.2}
                      step={0.01}
                      marks={{ 0.02: '2%', 0.05: '5%', 0.1: '10%' }}
                    />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item 
                    label="最大回撤" 
                    name="maxDrawdown"
                    tooltip="策略允许的最大回撤比例"
                  >
                    <Slider
                      min={0.05}
                      max={0.5}
                      step={0.05}
                      marks={{ 0.1: '10%', 0.2: '20%', 0.3: '30%' }}
                    />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item 
                    label="日最大亏损" 
                    name="maxDailyLoss"
                    tooltip="单日允许的最大亏损比例"
                  >
                    <Slider
                      min={0.01}
                      max={0.2}
                      step={0.01}
                      marks={{ 0.02: '2%', 0.05: '5%', 0.1: '10%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </TabPane>

          {/* 技术指标 */}
          <TabPane tab="技术指标" key="indicators">
            <Card size="small" title="技术指标配置">
              {renderIndicatorConfig()}
            </Card>
          </TabPane>

          {/* AI/ML配置 */}
          {strategyType === 'ai_ml' && (
            <TabPane tab="AI/ML配置" key="ml">
              {renderMLConfig()}
            </TabPane>
          )}
        </Tabs>

        {/* 操作按钮 */}
        <Divider />
        <Row justify="end">
          <Space>
            <Button onClick={onCancel}>
              取消
            </Button>
            <Button onClick={handleReset} icon={<ReloadOutlined />}>
              重置
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
            >
              保存配置
            </Button>
          </Space>
        </Row>
      </Form>
    </div>
  );
};

export default StrategyConfigForm;