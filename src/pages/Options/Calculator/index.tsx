/**
 * 期权计算器页面 - Black-Scholes定价模型
 */

import React, { useState } from 'react';
import { Card, Form, InputNumber, Select, Button, Row, Col, Statistic, Divider, Space, Alert } from 'antd';
import { CalculatorOutlined, LineChartOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { calculateOptionPrice } from '@/services/options';
import { Line } from '@ant-design/plots';
import PriceTag from '@/components/PriceTag';

const { Option } = Select;

const OptionsCalculator: React.FC = () => {
  const [form] = Form.useForm();
  const [result, setResult] = useState<any>(null);
  const [profitLossData, setProfitLossData] = useState<any[]>([]);

  const { loading, run: calculate } = useRequest(
    (params) => calculateOptionPrice(params),
    {
      manual: true,
      onSuccess: (data) => {
        setResult(data);
        // 生成盈亏图数据
        generateProfitLossChart(data);
      },
    },
  );

  const generateProfitLossChart = (data: any) => {
    const values = form.getFieldsValue();
    const stockPrice = values.stockPrice;
    const strikePrice = values.strikePrice;
    const optionType = values.optionType;
    const premium = data.price;

    const chartData = [];
    const range = stockPrice * 0.3; // ±30%的价格范围
    const step = range / 50;

    for (let price = stockPrice - range; price <= stockPrice + range; price += step) {
      let pl = 0;
      if (optionType === 'call') {
        pl = Math.max(0, price - strikePrice) - premium;
      } else {
        pl = Math.max(0, strikePrice - price) - premium;
      }
      chartData.push({
        price: price.toFixed(2),
        profitLoss: pl.toFixed(2),
      });
    }
    setProfitLossData(chartData);
  };

  const handleCalculate = () => {
    form.validateFields().then((values) => {
      calculate(values);
    });
  };

  const handleReset = () => {
    form.resetFields();
    setResult(null);
    setProfitLossData([]);
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        {/* 左侧：输入参数 */}
        <Col xs={24} lg={10}>
          <Card title={<span><CalculatorOutlined /> 期权定价参数</span>}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                stockPrice: 100,
                strikePrice: 100,
                timeToExpiry: 0.25,
                riskFreeRate: 0.05,
                volatility: 0.3,
                dividendYield: 0,
                optionType: 'call',
              }}
            >
              <Form.Item
                label="标的股票价格 (S)"
                name="stockPrice"
                rules={[{ required: true, message: '请输入股票价格' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0.01}
                  step={0.01}
                  prefix="$"
                  placeholder="当前股价"
                />
              </Form.Item>

              <Form.Item
                label="行权价格 (K)"
                name="strikePrice"
                rules={[{ required: true, message: '请输入行权价' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0.01}
                  step={0.01}
                  prefix="$"
                  placeholder="行权价"
                />
              </Form.Item>

              <Form.Item
                label="到期时间 (年)"
                name="timeToExpiry"
                rules={[{ required: true, message: '请输入到期时间' }]}
                tooltip="例如: 3个月 = 0.25年"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0.01}
                  max={10}
                  step={0.01}
                  placeholder="年份"
                />
              </Form.Item>

              <Form.Item
                label="无风险利率 (r)"
                name="riskFreeRate"
                rules={[{ required: true, message: '请输入无风险利率' }]}
                tooltip="通常使用国债收益率，如5% = 0.05"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={1}
                  step={0.01}
                  placeholder="利率"
                  formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`}
                  parser={(value) => (Number(value?.replace('%', '')) / 100) as any}
                />
              </Form.Item>

              <Form.Item
                label="波动率 (σ)"
                name="volatility"
                rules={[{ required: true, message: '请输入波动率' }]}
                tooltip="历史波动率或隐含波动率，如30% = 0.3"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0.01}
                  max={3}
                  step={0.01}
                  placeholder="波动率"
                  formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`}
                  parser={(value) => (Number(value?.replace('%', '')) / 100) as any}
                />
              </Form.Item>

              <Form.Item
                label="股息率 (q)"
                name="dividendYield"
                tooltip="年化股息率，如2% = 0.02"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={0.5}
                  step={0.001}
                  placeholder="股息率"
                  formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`}
                  parser={(value) => (Number(value?.replace('%', '')) / 100) as any}
                />
              </Form.Item>

              <Form.Item
                label="期权类型"
                name="optionType"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="call">看涨期权 (Call)</Option>
                  <Option value="put">看跌期权 (Put)</Option>
                </Select>
              </Form.Item>

              <Space>
                <Button type="primary" icon={<CalculatorOutlined />} onClick={handleCalculate} loading={loading}>
                  计算期权价格
                </Button>
                <Button onClick={handleReset}>重置</Button>
              </Space>
            </Form>
          </Card>
        </Col>

        {/* 右侧：计算结果 */}
        <Col xs={24} lg={14}>
          {result ? (
            <>
              <Card title="计算结果" style={{ marginBottom: 16 }}>
                <Alert
                  message="Black-Scholes定价结果"
                  description="基于Black-Scholes期权定价模型计算的理论价格"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="期权理论价格"
                      value={result.price}
                      precision={4}
                      prefix="$"
                      valueStyle={{ color: '#1890ff', fontSize: 28 }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="内在价值"
                      value={result.intrinsicValue}
                      precision={4}
                      prefix="$"
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="时间价值"
                      value={result.timeValue}
                      precision={4}
                      prefix="$"
                    />
                  </Col>
                </Row>

                <Divider>希腊字母</Divider>

                <Row gutter={16}>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="Delta (Δ)"
                        value={result.greeks.delta}
                        precision={4}
                        valueStyle={{ fontSize: 20 }}
                      />
                      <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                        价格敏感度
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="Gamma (Γ)"
                        value={result.greeks.gamma}
                        precision={4}
                        valueStyle={{ fontSize: 20 }}
                      />
                      <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                        Delta变化率
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <div style={{ marginTop: -8 }}>
                        <div style={{ fontSize: 14, color: 'rgba(0,0,0,0.45)' }}>Theta (Θ)</div>
                        <PriceTag
                          value={result.greeks.theta}
                          precision={4}
                          style={{ fontSize: 20, fontWeight: 600 }}
                        />
                      </div>
                      <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                        时间衰减
                      </div>
                    </Card>
                  </Col>
                </Row>

                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="Vega (ν)"
                        value={result.greeks.vega}
                        precision={4}
                        valueStyle={{ fontSize: 20 }}
                      />
                      <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                        波动率敏感度
                      </div>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="Rho (ρ)"
                        value={result.greeks.rho}
                        precision={4}
                        valueStyle={{ fontSize: 20 }}
                      />
                      <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
                        利率敏感度
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>

              {/* 盈亏图表 */}
              {profitLossData.length > 0 && (
                <Card title={<span><LineChartOutlined /> 到期盈亏图</span>}>
                  <Line
                    data={profitLossData}
                    xField="price"
                    yField="profitLoss"
                    height={300}
                    annotations={[
                      {
                        type: 'line',
                        start: ['min', 0],
                        end: ['max', 0],
                        style: { stroke: '#999', lineDash: [4, 4] },
                      },
                    ]}
                    xAxis={{
                      title: { text: '标的价格 ($)' },
                    }}
                    yAxis={{
                      title: { text: '盈亏 ($)' },
                      label: {
                        formatter: (v) => `$${v}`,
                      },
                    }}
                    areaStyle={() => {
                      return {
                        fill: 'l(270) 0:#52c41a 0.5:transparent 1:#ff4d4f',
                        fillOpacity: 0.3,
                      };
                    }}
                    tooltip={{
                      formatter: (datum: any) => ({
                        name: '盈亏',
                        value: `$${Number(datum.profitLoss) > 0 ? '+' : ''}${datum.profitLoss}`,
                      }),
                    }}
                  />
                </Card>
              )}
            </>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                <CalculatorOutlined style={{ fontSize: 64, marginBottom: 16 }} />
                <div style={{ fontSize: 16 }}>请输入参数并点击"计算期权价格"</div>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default OptionsCalculator;
