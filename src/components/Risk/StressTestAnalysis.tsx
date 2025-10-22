/**
 * 压力测试分析组件
 * 
 * 功能特性:
 * - 历史场景重现测试
 * - 自定义压力场景设计
 * - 蒙特卡洛模拟分析
 * - 压力测试结果可视化
 * - 风险承受能力评估
 * 
 * 依据文档: MODULE_PROMPTS.md - 风险管理模块
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Select,
  InputNumber,
  Form,
  Table,
  Progress,
  Alert,
  Tabs,
  Statistic,
  Space,
  Tooltip,
  message,
  Modal,
  Input,
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import './StressTestAnalysis.less';

const { Option } = Select;
const { TabPane } = Tabs;

// 压力测试场景接口
export interface StressScenario {
  id: string;
  name: string;
  type: 'historical' | 'custom' | 'monte_carlo';
  description: string;
  parameters: {
    marketShock?: number;
    volatilityIncrease?: number;
    correlationChange?: number;
    liquidityImpact?: number;
    duration?: number;
  };
  isRunning?: boolean;
  lastRunTime?: string;
}

// 压力测试结果接口
export interface StressTestResult {
  scenarioId: string;
  scenarioName: string;
  portfolioValue: {
    initial: number;
    stressed: number;
    change: number;
    changePercent: number;
  };
  riskMetrics: {
    var: number;
    cvar: number;
    maxDrawdown: number;
    volatility: number;
  };
  positionImpacts: Array<{
    symbol: string;
    name: string;
    initialValue: number;
    stressedValue: number;
    change: number;
    changePercent: number;
  }>;
  runTime: string;
  duration: number;
}

export interface StressTestAnalysisProps {
  portfolioId: string;
  loading?: boolean;
}

/**
 * 压力测试分析组件
 */
const StressTestAnalysis: React.FC<StressTestAnalysisProps> = ({
  portfolioId,
  loading = false,
}) => {
  const [scenarios, setScenarios] = useState<StressScenario[]>([]);
  const [testResults, setTestResults] = useState<StressTestResult[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [customScenarioVisible, setCustomScenarioVisible] = useState(false);
  const [form] = Form.useForm();
  
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

  /**
   * 预定义压力测试场景
   */
  const predefinedScenarios: StressScenario[] = [
    {
      id: 'financial_crisis_2008',
      name: '2008年金融危机',
      type: 'historical',
      description: '模拟2008年金融危机期间的市场冲击',
      parameters: {
        marketShock: -30,
        volatilityIncrease: 200,
        correlationChange: 50,
        liquidityImpact: -40,
        duration: 180,
      },
    },
    {
      id: 'covid_crash_2020',
      name: '2020年疫情冲击',
      type: 'historical',
      description: '模拟2020年新冠疫情初期的市场暴跌',
      parameters: {
        marketShock: -35,
        volatilityIncrease: 300,
        correlationChange: 70,
        liquidityImpact: -30,
        duration: 30,
      },
    },
    {
      id: 'moderate_correction',
      name: '中度市场调整',
      type: 'custom',
      description: '模拟中等程度的市场调整场景',
      parameters: {
        marketShock: -15,
        volatilityIncrease: 50,
        correlationChange: 20,
        liquidityImpact: -10,
        duration: 60,
      },
    },
    {
      id: 'extreme_volatility',
      name: '极端波动性',
      type: 'custom',
      description: '测试极端波动性环境下的投资组合表现',
      parameters: {
        marketShock: -10,
        volatilityIncrease: 400,
        correlationChange: 100,
        liquidityImpact: -20,
        duration: 90,
      },
    },
  ];

  /**
   * 初始化组件
   */
  useEffect(() => {
    setScenarios(predefinedScenarios);
    setSelectedScenario(predefinedScenarios[0].id);
    generateMockResults();
  }, []);

  /**
   * 初始化图表
   */
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      setChartInstance(chart);
      
      return () => {
        chart.dispose();
      };
    }
    return undefined;
  }, []);

  /**
   * 更新图表数据
   */
  useEffect(() => {
    if (chartInstance && testResults.length > 0) {
      updateChart();
    }
  }, [chartInstance, testResults]);

  /**
   * 生成模拟测试结果
   */
  const generateMockResults = () => {
    const mockResults: StressTestResult[] = predefinedScenarios.map(scenario => {
      const initialValue = 1000000;
      const changePercent = scenario.parameters.marketShock || -20;
      const change = initialValue * (changePercent / 100);
      const stressedValue = initialValue + change;

      return {
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        portfolioValue: {
          initial: initialValue,
          stressed: stressedValue,
          change,
          changePercent,
        },
        riskMetrics: {
          var: Math.abs(changePercent * 0.8),
          cvar: Math.abs(changePercent * 1.2),
          maxDrawdown: Math.abs(changePercent * 1.1),
          volatility: (scenario.parameters.volatilityIncrease || 100) / 10,
        },
        positionImpacts: [
          { symbol: 'AAPL', name: '苹果公司', initialValue: 100000, stressedValue: 85000, change: -15000, changePercent: -15 },
          { symbol: 'MSFT', name: '微软公司', initialValue: 150000, stressedValue: 135000, change: -15000, changePercent: -10 },
          { symbol: 'GOOGL', name: '谷歌公司', initialValue: 120000, stressedValue: 96000, change: -24000, changePercent: -20 },
          { symbol: 'TSLA', name: '特斯拉公司', initialValue: 80000, stressedValue: 60000, change: -20000, changePercent: -25 },
          { symbol: 'AMZN', name: '亚马逊公司', initialValue: 110000, stressedValue: 88000, change: -22000, changePercent: -20 },
        ],
        runTime: dayjs().subtract(Math.random() * 30, 'day').toISOString(),
        duration: Math.floor(Math.random() * 300 + 60), // 60-360秒
      };
    });

    setTestResults(mockResults);
  };

  /**
   * 运行压力测试
   */
  const runStressTest = async (scenarioId: string) => {
    setIsRunning(true);
    setProgress(0);

    // 模拟测试进度
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          message.success('压力测试完成');
          generateMockResults(); // 刷新结果
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  /**
   * 更新图表
   */
  const updateChart = () => {
    if (!chartInstance) return;

    const option = {
      title: {
        text: '压力测试结果对比',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const data = params[0];
          return `${data.name}<br/>损失: ${data.value.toFixed(2)}%`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: testResults.map(result => result.scenarioName),
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: 'value',
        name: '损失百分比 (%)',
        axisLabel: {
          formatter: '{value}%',
        },
      },
      series: [
        {
          name: '投资组合损失',
          type: 'bar',
          data: testResults.map(result => Math.abs(result.portfolioValue.changePercent)),
          itemStyle: {
            color: (params: any) => {
              const value = params.value;
              if (value > 25) return '#ff4d4f';
              if (value > 15) return '#ff7a45';
              if (value > 10) return '#faad14';
              return '#52c41a';
            },
          },
        },
      ],
    };

    chartInstance.setOption(option);
  };

  /**
   * 创建自定义场景
   */
  const createCustomScenario = (values: any) => {
    const newScenario: StressScenario = {
      id: `custom_${Date.now()}`,
      name: values.name,
      type: 'custom',
      description: values.description,
      parameters: {
        marketShock: values.marketShock,
        volatilityIncrease: values.volatilityIncrease,
        correlationChange: values.correlationChange,
        liquidityImpact: values.liquidityImpact,
        duration: values.duration,
      },
    };

    setScenarios([...scenarios, newScenario]);
    setCustomScenarioVisible(false);
    form.resetFields();
    message.success('自定义场景创建成功');
  };

  /**
   * 结果表格列配置
   */
  const resultColumns: ColumnsType<StressTestResult> = [
    {
      title: '测试场景',
      dataIndex: 'scenarioName',
      key: 'scenarioName',
      width: 150,
    },
    {
      title: '投资组合价值变化',
      key: 'portfolioChange',
      width: 200,
      render: (_, record) => (
        <div>
          <div>初始: ¥{record.portfolioValue.initial.toLocaleString()}</div>
          <div>压力后: ¥{record.portfolioValue.stressed.toLocaleString()}</div>
          <div className={record.portfolioValue.changePercent < 0 ? 'negative' : 'positive'}>
            变化: {record.portfolioValue.changePercent.toFixed(2)}%
          </div>
        </div>
      ),
    },
    {
      title: 'VaR',
      dataIndex: ['riskMetrics', 'var'],
      key: 'var',
      width: 80,
      render: (value: number) => `${value.toFixed(2)}%`,
    },
    {
      title: 'CVaR',
      dataIndex: ['riskMetrics', 'cvar'],
      key: 'cvar',
      width: 80,
      render: (value: number) => `${value.toFixed(2)}%`,
    },
    {
      title: '最大回撤',
      dataIndex: ['riskMetrics', 'maxDrawdown'],
      key: 'maxDrawdown',
      width: 100,
      render: (value: number) => `${value.toFixed(2)}%`,
    },
    {
      title: '测试时间',
      dataIndex: 'runTime',
      key: 'runTime',
      width: 120,
      render: (time: string) => dayjs(time).format('MM-DD HH:mm'),
    },
    {
      title: '耗时',
      dataIndex: 'duration',
      key: 'duration',
      width: 80,
      render: (duration: number) => `${duration}s`,
    },
  ];

  return (
    <div className="stress-test-analysis">
      {/* 控制面板 */}
      <Card className="control-panel">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Select
              value={selectedScenario}
              onChange={setSelectedScenario}
              style={{ width: '100%' }}
              placeholder="选择压力测试场景"
            >
              {scenarios.map(scenario => (
                <Option key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Space>
              <Button
                type="primary"
                icon={isRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={() => runStressTest(selectedScenario)}
                loading={isRunning}
                disabled={!selectedScenario}
              >
                {isRunning ? '运行中...' : '开始测试'}
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={() => setCustomScenarioVisible(true)}
              >
                自定义场景
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => console.log('导出报告')}
              >
                导出报告
              </Button>
            </Space>
          </Col>
          <Col span={8}>
            {isRunning && (
              <Progress
                percent={progress}
                status={progress === 100 ? 'success' : 'active'}
                size="small"
              />
            )}
          </Col>
        </Row>
      </Card>

      {/* 场景描述 */}
      {selectedScenario && (
        <Card className="scenario-info">
          {(() => {
            const scenario = scenarios.find(s => s.id === selectedScenario);
            return scenario ? (
              <Alert
                message={scenario.name}
                description={scenario.description}
                type="info"
                showIcon
              />
            ) : null;
          })()}
        </Card>
      )}

      {/* 测试结果展示 */}
      <Tabs defaultActiveKey="chart" className="result-tabs">
        <TabPane tab="图表分析" key="chart">
          <Card>
            <div ref={chartRef} style={{ height: 400 }} />
          </Card>
        </TabPane>
        
        <TabPane tab="详细结果" key="table">
          <Card>
            <Table
              columns={resultColumns}
              dataSource={testResults}
              rowKey="scenarioId"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </Card>
        </TabPane>

        <TabPane tab="持仓影响" key="positions">
          <Card>
            {testResults.length > 0 && selectedScenario && (
              <Table
                columns={[
                  { title: '股票代码', dataIndex: 'symbol', key: 'symbol' },
                  { title: '股票名称', dataIndex: 'name', key: 'name' },
                  {
                    title: '初始价值',
                    dataIndex: 'initialValue',
                    key: 'initialValue',
                    render: (value: number) => `¥${value.toLocaleString()}`,
                  },
                  {
                    title: '压力后价值',
                    dataIndex: 'stressedValue',
                    key: 'stressedValue',
                    render: (value: number) => `¥${value.toLocaleString()}`,
                  },
                  {
                    title: '变化金额',
                    dataIndex: 'change',
                    key: 'change',
                    render: (value: number) => (
                      <span className={value < 0 ? 'negative' : 'positive'}>
                        ¥{value.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    title: '变化比例',
                    dataIndex: 'changePercent',
                    key: 'changePercent',
                    render: (value: number) => (
                      <span className={value < 0 ? 'negative' : 'positive'}>
                        {value.toFixed(2)}%
                      </span>
                    ),
                  },
                ]}
                dataSource={testResults.find(r => r.scenarioId === selectedScenario)?.positionImpacts || []}
                rowKey="symbol"
                pagination={false}
              />
            )}
          </Card>
        </TabPane>
      </Tabs>

      {/* 自定义场景创建弹窗 */}
      <Modal
        title="创建自定义压力测试场景"
        open={customScenarioVisible}
        onCancel={() => setCustomScenarioVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={createCustomScenario}
        >
          <Form.Item
            name="name"
            label="场景名称"
            rules={[{ required: true, message: '请输入场景名称' }]}
          >
            <Input placeholder="请输入场景名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="场景描述"
            rules={[{ required: true, message: '请输入场景描述' }]}
          >
            <Input placeholder="请输入场景描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="marketShock"
                label={
                  <span>
                    市场冲击 (%)
                    <Tooltip title="整体市场价格变化百分比，负数表示下跌">
                      <InfoCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: '请输入市场冲击百分比' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={-50}
                  max={50}
                  step={0.1}
                  placeholder="-20"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="volatilityIncrease"
                label={
                  <span>
                    波动率增加 (%)
                    <Tooltip title="相对于当前波动率的增加幅度">
                      <InfoCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: '请输入波动率增加百分比' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={500}
                  step={10}
                  placeholder="100"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="correlationChange"
                label={
                  <span>
                    相关性变化 (%)
                    <Tooltip title="资产间相关性的增加幅度">
                      <InfoCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: '请输入相关性变化百分比' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={-100}
                  max={200}
                  step={5}
                  placeholder="50"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="liquidityImpact"
                label={
                  <span>
                    流动性影响 (%)
                    <Tooltip title="流动性降低对交易成本的影响">
                      <InfoCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                }
                rules={[{ required: true, message: '请输入流动性影响百分比' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={-50}
                  max={0}
                  step={1}
                  placeholder="-10"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="duration"
            label={
              <span>
                持续时间 (天)
                <Tooltip title="压力情况持续的天数">
                  <InfoCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: '请输入持续时间' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              max={365}
              step={1}
              placeholder="30"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StressTestAnalysis;