import React, { useState } from 'react';
import { Card, Form, Input, Select, Button, Space, Row, Col, Statistic, Divider } from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';

/**
 * 期权计算结果
 */
interface CalculationResult {
  /** 理论价格 */
  theoreticalPrice: number;
  /** Delta */
  delta: number;
  /** Gamma */
  gamma: number;
  /** Theta */
  theta: number;
  /** Vega */
  vega: number;
  /** Rho */
  rho: number;
  /** 隐含波动率 */
  impliedVolatility: number;
}

/**
 * Black-Scholes 期权定价公式
 */
const calculateBlackScholes = (
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  optionType: 'call' | 'put'
): number => {
  const d1 = (Math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const normalCDF = (x: number) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  };

  if (optionType === 'call') {
    return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
  } else {
    return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
  }
};

/**
 * 计算希腊字母
 */
const calculateGreeks = (
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number,
  optionType: 'call' | 'put'
): Omit<CalculationResult, 'theoreticalPrice' | 'impliedVolatility'> => {
  const d1 = (Math.log(S / K) + (r + sigma ** 2 / 2) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const normalCDF = (x: number) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  };

  const normalPDF = (x: number) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);

  const delta = optionType === 'call' ? normalCDF(d1) : normalCDF(d1) - 1;
  const gamma = normalPDF(d1) / (S * sigma * Math.sqrt(T));
  const vega = S * normalPDF(d1) * Math.sqrt(T) / 100;
  const theta = optionType === 'call'
    ? (-S * normalPDF(d1) * sigma / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normalCDF(d2)) / 365
    : (-S * normalPDF(d1) * sigma / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * normalCDF(-d2)) / 365;
  const rho = optionType === 'call'
    ? K * T * Math.exp(-r * T) * normalCDF(d2) / 100
    : -K * T * Math.exp(-r * T) * normalCDF(-d2) / 100;

  return { delta, gamma, theta, vega, rho };
};

const OptionsCalculator: React.FC = () => {
  const [form] = Form.useForm();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * 执行计算
   */
  const handleCalculate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const S = parseFloat(values.spotPrice);
      const K = parseFloat(values.strikePrice);
      const T = parseFloat(values.daysToExpiry) / 365;
      const r = parseFloat(values.riskFreeRate) / 100;
      const sigma = parseFloat(values.volatility) / 100;
      const optionType = values.optionType;

      const theoreticalPrice = calculateBlackScholes(S, K, T, r, sigma, optionType);
      const greeks = calculateGreeks(S, K, T, r, sigma, optionType);

      setResult({
        theoreticalPrice,
        impliedVolatility: sigma * 100,
        ...greeks,
      });

      setTimeout(() => setLoading(false), 300);
    } catch (error) {
      console.error('计算失败:', error);
      setLoading(false);
    }
  };

  /**
   * 重置表单
   */
  const handleReset = () => {
    form.resetFields();
    setResult(null);
  };

  return (
    <PageContainer
      title="期权计算器"
      subTitle="基于Black-Scholes模型的期权定价计算"
    >
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="输入参数" bordered={false}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                optionType: 'call',
                spotPrice: '3.000',
                strikePrice: '3.000',
                daysToExpiry: '30',
                volatility: '20',
                riskFreeRate: '2.5',
              }}
            >
              <Form.Item
                name="optionType"
                label="期权类型"
                rules={[{ required: true, message: '请选择期权类型' }]}
              >
                <Select>
                  <Select.Option value="call">认购期权 (Call)</Select.Option>
                  <Select.Option value="put">认沽期权 (Put)</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="spotPrice"
                label="标的现价 (S)"
                rules={[{ required: true, message: '请输入标的现价' }]}
              >
                <Input
                  type="number"
                  step="0.001"
                  addonAfter="元"
                  placeholder="例如: 3.000"
                />
              </Form.Item>

              <Form.Item
                name="strikePrice"
                label="行权价格 (K)"
                rules={[{ required: true, message: '请输入行权价格' }]}
              >
                <Input
                  type="number"
                  step="0.001"
                  addonAfter="元"
                  placeholder="例如: 3.000"
                />
              </Form.Item>

              <Form.Item
                name="daysToExpiry"
                label="距到期天数 (T)"
                rules={[{ required: true, message: '请输入距到期天数' }]}
              >
                <Input
                  type="number"
                  addonAfter="天"
                  placeholder="例如: 30"
                />
              </Form.Item>

              <Form.Item
                name="volatility"
                label="波动率 (σ)"
                rules={[{ required: true, message: '请输入波动率' }]}
              >
                <Input
                  type="number"
                  step="0.1"
                  addonAfter="%"
                  placeholder="例如: 20"
                />
              </Form.Item>

              <Form.Item
                name="riskFreeRate"
                label="无风险利率 (r)"
                rules={[{ required: true, message: '请输入无风险利率' }]}
              >
                <Input
                  type="number"
                  step="0.1"
                  addonAfter="%"
                  placeholder="例如: 2.5"
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    icon={<CalculatorOutlined />}
                    onClick={handleCalculate}
                    loading={loading}
                  >
                    计算
                  </Button>
                  <Button onClick={handleReset}>重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="计算结果" bordered={false}>
            {result ? (
              <>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="理论价格"
                      value={result.theoreticalPrice}
                      precision={4}
                      suffix="元"
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="隐含波动率"
                      value={result.impliedVolatility}
                      precision={2}
                      suffix="%"
                    />
                  </Col>
                </Row>

                <Divider>希腊字母</Divider>

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="Delta (Δ)"
                      value={result.delta}
                      precision={4}
                    />
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      标的价格变动1元时，期权价格变动量
                    </div>
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Gamma (Γ)"
                      value={result.gamma}
                      precision={4}
                    />
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      标的价格变动1元时，Delta的变动量
                    </div>
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Theta (Θ)"
                      value={result.theta}
                      precision={4}
                    />
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      时间流逝1天，期权价格变动量
                    </div>
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Vega (ν)"
                      value={result.vega}
                      precision={4}
                    />
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      波动率变动1%，期权价格变动量
                    </div>
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Rho (ρ)"
                      value={result.rho}
                      precision={4}
                    />
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      利率变动1%，期权价格变动量
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                请输入参数并点击计算按钮
              </div>
            )}
          </Card>

          <Card title="使用说明" bordered={false} style={{ marginTop: 16 }}>
            <div style={{ lineHeight: '1.8' }}>
              <p><strong>Black-Scholes模型</strong>是期权定价的经典模型，适用于欧式期权。</p>
              <p><strong>参数说明：</strong></p>
              <ul style={{ paddingLeft: 20 }}>
                <li><strong>标的现价(S)</strong>：当前标的资产的市场价格</li>
                <li><strong>行权价格(K)</strong>：期权合约约定的执行价格</li>
                <li><strong>距到期天数(T)</strong>：当前日期到期权到期日的天数</li>
                <li><strong>波动率(σ)</strong>：标的资产价格的年化波动率</li>
                <li><strong>无风险利率(r)</strong>：通常使用国债收益率</li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default OptionsCalculator;
