/**
 * DCF估值计算器页面
 * 提供现金流折现模型估值功能
 */

import { useState, useEffect } from 'react';
import { Card, Form, InputNumber, Button, Row, Col, Table, Tooltip, message } from 'antd';
import { InfoCircleOutlined, CalculatorOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { useParams } from '@umijs/max';
import { Heatmap } from '@ant-design/plots';
import {
  calculateDCF,
  performSensitivityAnalysis,
  getDefaultDCFInputs,
  calculateMarginOfSafety,
  type DCFInputs,
  type DCFResult,
} from '@/services/financial/dcfService';

const DCFPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [form] = Form.useForm();
  const [result, setResult] = useState<DCFResult | null>(null);
  const [sensitivityData, setSensitivityData] = useState<any[]>([]);
  
  // 获取默认参数
  const { data: defaultInputs, loading } = useRequest(
    () => getDefaultDCFInputs(code!),
    {
      ready: !!code,
      onSuccess: (data) => {
        if (data?.data) {
          form.setFieldsValue(data.data);
        }
      },
    },
  );
  
  // 计算DCF
  const handleCalculate = () => {
    form.validateFields().then((values: DCFInputs) => {
      try {
        const dcfResult = calculateDCF(values);
        setResult(dcfResult);
        
        // 计算敏感性分析
        const sensitivity = performSensitivityAnalysis(
          values,
          [0.06, 0.12, 0.02], // WACC范围
          [0.01, 0.05, 0.01], // 终值增长率范围
        );
        
        // 转换为热力图数据格式
        const heatmapData: any[] = [];
        sensitivity.wacc.forEach((w, i) => {
          sensitivity.terminalGrowthRate.forEach((g, j) => {
            heatmapData.push({
              wacc: `${(w * 100).toFixed(0)}%`,
              terminalGrowth: `${(g * 100).toFixed(0)}%`,
              value: sensitivity.matrix[i][j],
            });
          });
        });
        setSensitivityData(heatmapData);
        
        message.success('计算完成');
      } catch (error) {
        message.error('计算失败，请检查输入参数');
      }
    });
  };
  
  // 重置为默认值
  const handleReset = () => {
    if (defaultInputs?.data) {
      form.setFieldsValue(defaultInputs.data);
    }
  };
  
  // 现金流预测表格
  const cashFlowColumns = [
    { title: '年份', dataIndex: 'year', key: 'year' },
    {
      title: '预测自由现金流',
      dataIndex: 'fcf',
      key: 'fcf',
      render: (val: number) => `¥${(val / 100000000).toFixed(2)}亿`,
    },
    {
      title: '折现系数',
      dataIndex: 'discountFactor',
      key: 'discountFactor',
      render: (val: number) => val.toFixed(4),
    },
    {
      title: '现值',
      dataIndex: 'pv',
      key: 'pv',
      render: (val: number) => `¥${(val / 100000000).toFixed(2)}亿`,
    },
  ];
  
  const cashFlowData = result
    ? result.projectedFCF.map((fcf, i) => ({
        key: i,
        year: `第${i + 1}年`,
        fcf,
        discountFactor: 1 / Math.pow(1 + result.wacc, i + 1),
        pv: result.discountedFCF[i],
      }))
    : [];
  
  return (
    <div className="dcf-page">
      <Row gutter={16}>
        <Col span={12}>
          <Card title="DCF参数设置" loading={loading}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                fcfGrowthRate: [0.15, 0.12, 0.10, 0.08, 0.06],
                terminalGrowthRate: 0.03,
                riskFreeRate: 0.025,
                marketReturn: 0.10,
                beta: 1.0,
                debtWeight: 0.3,
                equityWeight: 0.7,
                costOfDebt: 0.05,
                taxRate: 0.25,
              }}
            >
              <Form.Item
                label={
                  <span>
                    当前自由现金流(元)
                    <Tooltip title="最近一期的自由现金流">
                      <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                }
                name="currentFCF"
                rules={[{ required: true, message: '请输入当前自由现金流' }]}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              
              <Form.Item label="未来5年增长率(%)">
                {[1, 2, 3, 4, 5].map((year) => (
                  <Form.Item
                    key={year}
                    name={['fcfGrowthRate', year - 1]}
                    style={{ display: 'inline-block', width: '18%', marginRight: '2%' }}
                  >
                    <InputNumber
                      min={-1}
                      max={1}
                      step={0.01}
                      formatter={(value) => `${((value as number) * 100).toFixed(0)}`}
                      parser={(value) => Number(value) / 100}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                ))}
              </Form.Item>
              
              <Form.Item
                label={
                  <span>
                    永续增长率(%)
                    <Tooltip title="第5年后的稳定增长率，通常为GDP增速">
                      <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                }
                name="terminalGrowthRate"
              >
                <InputNumber
                  min={0}
                  max={0.1}
                  step={0.01}
                  formatter={(value) => `${((value as number) * 100).toFixed(1)}`}
                  parser={(value) => Number(value) / 100}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="无风险利率(%)" name="riskFreeRate">
                    <InputNumber
                      min={0}
                      max={0.1}
                      step={0.001}
                      formatter={(value) => `${((value as number) * 100).toFixed(1)}`}
                      parser={(value) => Number(value) / 100}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="市场回报率(%)" name="marketReturn">
                    <InputNumber
                      min={0}
                      max={0.3}
                      step={0.01}
                      formatter={(value) => `${((value as number) * 100).toFixed(1)}`}
                      parser={(value) => Number(value) / 100}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                label={
                  <span>
                    贝塔系数(β)
                    <Tooltip title="衡量股票相对市场的波动性">
                      <InfoCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                }
                name="beta"
              >
                <InputNumber min={0} max={3} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="债务成本(%)" name="costOfDebt">
                    <InputNumber
                      min={0}
                      max={0.2}
                      step={0.01}
                      formatter={(value) => `${((value as number) * 100).toFixed(1)}`}
                      parser={(value) => Number(value) / 100}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="税率(%)" name="taxRate">
                    <InputNumber
                      min={0}
                      max={0.5}
                      step={0.01}
                      formatter={(value) => `${((value as number) * 100).toFixed(0)}`}
                      parser={(value) => Number(value) / 100}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="流通股数" name="sharesOutstanding">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="现金及等价物(元)" name="cashAndEquivalents">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="总债务(元)" name="totalDebt">
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Button type="primary" icon={<CalculatorOutlined />} onClick={handleCalculate} block>
                    计算估值
                  </Button>
                </Col>
                <Col span={12}>
                  <Button onClick={handleReset} block>
                    重置默认值
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        
        <Col span={12}>
          {result && (
            <>
              <Card title="估值结果" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: 16, background: '#f0f2f5', borderRadius: 8 }}>
                      <div style={{ color: '#999', fontSize: 14 }}>每股合理价值</div>
                      <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff', marginTop: 8 }}>
                        ¥{result.fairValuePerShare.toFixed(2)}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ padding: 16 }}>
                      <div style={{ marginBottom: 8 }}>
                        <span style={{ color: '#999' }}>WACC: </span>
                        <span style={{ fontWeight: 'bold' }}>{(result.wacc * 100).toFixed(2)}%</span>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <span style={{ color: '#999' }}>企业价值: </span>
                        <span style={{ fontWeight: 'bold' }}>¥{(result.enterpriseValue / 100000000).toFixed(2)}亿</span>
                      </div>
                      <div>
                        <span style={{ color: '#999' }}>股权价值: </span>
                        <span style={{ fontWeight: 'bold' }}>¥{(result.equityValue / 100000000).toFixed(2)}亿</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
              
              <Card title="现金流预测" style={{ marginBottom: 16 }}>
                <Table
                  columns={cashFlowColumns}
                  dataSource={cashFlowData}
                  pagination={false}
                  size="small"
                />
                <div style={{ marginTop: 16, padding: 12, background: '#f0f2f5', borderRadius: 4 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ color: '#999' }}>终值: </span>
                    <span style={{ fontWeight: 'bold' }}>¥{(result.terminalValue / 100000000).toFixed(2)}亿</span>
                  </div>
                  <div>
                    <span style={{ color: '#999' }}>折现后终值: </span>
                    <span style={{ fontWeight: 'bold' }}>¥{(result.discountedTerminalValue / 100000000).toFixed(2)}亿</span>
                  </div>
                </div>
              </Card>
            </>
          )}
        </Col>
      </Row>
      
      {sensitivityData.length > 0 && (
        <Card title="敏感性分析" style={{ marginTop: 16 }}>
          <div style={{ height: 400 }}>
            <Heatmap
              data={sensitivityData}
              xField="terminalGrowth"
              yField="wacc"
              colorField="value"
              color={['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']}
              label={{
                formatter: ({ value }: any) => `¥${value.toFixed(1)}`,
                style: { fill: '#fff' },
              }}
              xAxis={{ title: { text: '终值增长率' } }}
              yAxis={{ title: { text: 'WACC' } }}
            />
          </div>
          <div style={{ marginTop: 8, color: '#999', textAlign: 'center' }}>
            不同WACC和终值增长率组合下的每股估值
          </div>
        </Card>
      )}
    </div>
  );
};

export default DCFPage;
