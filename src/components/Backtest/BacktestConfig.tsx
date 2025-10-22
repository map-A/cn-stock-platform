/**
 * 回测配置组件
 * 
 * 功能特性:
 * - 策略选择
 * - 时间范围设置
 * - 资金配置
 * - 参数调整
 * - 高级选项配置
 */

import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Button,
  Card,
  Row,
  Col,
  Space,
  Divider,
  Typography,
  message,
  Spin,
  Tooltip,
} from 'antd';
import {
  QuestionCircleOutlined,
  PlayCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { getStrategies } from '@/services/strategy';
import { createBacktest } from '@/services/backtest';
import type { BacktestConfig, BacktestType } from '@/types/backtest';
import type { StrategyInfo } from '@/types/strategy';
import moment from 'moment';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface BacktestConfigProps {
  visible?: boolean;
  onSubmit?: (backtestId: string) => void;
  onCancel?: () => void;
  initialConfig?: Partial<BacktestConfig>;
}

const BacktestConfigComponent: React.FC<BacktestConfigProps> = ({
  visible = true,
  onSubmit,
  onCancel,
  initialConfig,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<StrategyInfo[]>([]);
  const [strategiesLoading, setStrategiesLoading] = useState(false);

  // 加载策略列表
  useEffect(() => {
    const loadStrategies = async () => {
      try {
        setStrategiesLoading(true);
        const data = await getStrategies();
        setStrategies(data?.items || []);
      } catch (error) {
        console.error('获取策略列表失败:', error);
        message.error('获取策略列表失败');
      } finally {
        setStrategiesLoading(false);
      }
    };

    if (visible) {
      loadStrategies();
    }
  }, [visible]);

  // 初始化表单
  useEffect(() => {
    if (initialConfig) {
      form.setFieldsValue({
        ...initialConfig,
        dateRange: initialConfig.startDate && initialConfig.endDate
          ? [moment(initialConfig.startDate), moment(initialConfig.endDate)]
          : undefined,
      });
    } else {
      // 设置默认值
      form.setFieldsValue({
        type: 'single',
        dateRange: [moment().subtract(1, 'year'), moment()],
        initialCapital: 100000,
        maxPositions: 10,
        commission: 0.0003,
        slippage: 0.0001,
        enableRiskControl: true,
        maxDrawdown: 0.1,
        maxPositionSize: 0.1,
      });
    }
  }, [initialConfig, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const config: BacktestConfig = {
        name: values.name,
        description: values.description,
        type: values.type,
        strategyId: values.strategyId,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        initialCapital: values.initialCapital,
        commission: values.commission,
        slippage: values.slippage,
        parameters: values.parameters || {},
        dataFrequency: '1day',
        adjustForDividends: true,
        adjustForSplits: true,
        benchmarkSymbol: values.benchmark,
        maxPositions: values.maxPositions,
        positionSizing: 'equal',
        rebalanceFrequency: 'daily',
      };

      const result = await createBacktest(config);
      message.success('回测任务创建成功');
      onSubmit?.(result.id);
    } catch (error) {
      console.error('创建回测失败:', error);
      message.error('创建回测失败');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>回测配置</Title>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: '100%' }}
      >
        {/* 基本信息 */}
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="回测名称"
                rules={[{ required: true, message: '请输入回测名称' }]}
              >
                <Input placeholder="输入回测名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="回测类型"
                rules={[{ required: true, message: '请选择回测类型' }]}
              >
                <Select placeholder="选择回测类型">
                  <Option value="single">单策略回测</Option>
                  <Option value="multi">多策略组合</Option>
                  <Option value="optimization">参数优化</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea 
              rows={3}
              placeholder="回测描述（可选）"
            />
          </Form.Item>
        </Card>

        {/* 策略选择 */}
        <Card title="策略选择" style={{ marginBottom: 16 }}>
          <Form.Item
            name="strategyId"
            label="选择策略"
            rules={[{ required: true, message: '请选择策略' }]}
          >
            <Select
              placeholder="选择要回测的策略"
              loading={strategiesLoading}
              showSearch
              optionFilterProp="children"
            >
              {strategies.map(strategy => (
                <Option key={strategy.id} value={strategy.id}>
                  <Space>
                    <span>{strategy.name}</span>
                    <span style={{ color: '#999' }}>({strategy.type})</span>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Card>

        {/* 时间设置 */}
        <Card title="时间设置" style={{ marginBottom: 16 }}>
          <Form.Item
            name="dateRange"
            label="回测时间范围"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
            />
          </Form.Item>
        </Card>

        {/* 资金设置 */}
        <Card title="资金设置" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="initialCapital"
                label="初始资金"
                rules={[{ required: true, message: '请输入初始资金' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="100000"
                  min={1000}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxPositions"
                label="最大持仓数"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="10"
                  min={1}
                  max={100}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="benchmark"
                label="基准指数"
              >
                <Select placeholder="选择基准">
                  <Option value="000001.SH">上证指数</Option>
                  <Option value="000300.SH">沪深300</Option>
                  <Option value="000905.SH">中证500</Option>
                  <Option value="399006.SZ">创业板指</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 交易成本 */}
        <Card title="交易成本" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="commission"
                label={
                  <Space>
                    手续费率
                    <Tooltip title="买卖双边手续费率">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                }
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.0003"
                  min={0}
                  max={0.01}
                  step={0.0001}
                  formatter={value => `${(Number(value) * 100).toFixed(2)}%`}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="slippage"
                label={
                  <Space>
                    滑点
                    <Tooltip title="执行价格与期望价格的差异">
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </Space>
                }
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.0001"
                  min={0}
                  max={0.01}
                  step={0.0001}
                  formatter={value => `${(Number(value) * 100).toFixed(2)}%`}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 风险控制 */}
        <Card title="风险控制" style={{ marginBottom: 16 }}>
          <Form.Item
            name="enableRiskControl"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            <span style={{ marginLeft: 8 }}>启用风险控制</span>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.enableRiskControl !== curr.enableRiskControl}>
            {({ getFieldValue }) => {
              const enabled = getFieldValue('enableRiskControl');
              return enabled ? (
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item
                      name="maxDrawdown"
                      label="最大回撤"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0.1"
                        min={0.01}
                        max={0.5}
                        step={0.01}
                        formatter={value => `${(Number(value) * 100).toFixed(0)}%`}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="maxPositionSize"
                      label="单仓位上限"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0.1"
                        min={0.01}
                        max={1}
                        step={0.01}
                        formatter={value => `${(Number(value) * 100).toFixed(0)}%`}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="stopLoss"
                      label="止损比例"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0.05"
                        min={0.01}
                        max={0.5}
                        step={0.01}
                        formatter={value => `${(Number(value) * 100).toFixed(0)}%`}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name="takeProfit"
                      label="止盈比例"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0.2"
                        min={0.05}
                        max={2}
                        step={0.05}
                        formatter={value => `${(Number(value) * 100).toFixed(0)}%`}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null;
            }}
          </Form.Item>
        </Card>

        {/* 操作按钮 */}
        <div style={{ textAlign: 'right' }}>
          <Space>
            {onCancel && (
              <Button onClick={onCancel}>
                取消
              </Button>
            )}
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<PlayCircleOutlined />}
            >
              开始回测
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default BacktestConfigComponent;