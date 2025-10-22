/**
 * 多因子模型展示组件
 * 
 * 功能特性:
 * - 因子分析展示
 * - 因子权重可视化
 * - 因子贡献度分析
 * - 因子相关性矩阵
 * - 因子历史表现
 * - 因子风险归因
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Button,
  Space,
  Statistic,
  Progress,
  Typography,
  Tooltip,
  Tabs,
  Alert,
  message,
  Empty,
  Spin,
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TableOutlined,
  DownloadOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { getMultiFactorModel, getFactorAnalysis } from '@/services/strategy';
import { formatPercent, formatNumber } from '@/utils/format';
import './MultiFactorDisplay.less';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export interface MultiFactorDisplayProps {
  strategyId: string;
  visible?: boolean;
  onClose?: () => void;
}

const MultiFactorDisplay: React.FC<MultiFactorDisplayProps> = ({
  strategyId,
  visible = true,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [modelData, setModelData] = useState<any>(null);
  const [factorAnalysis, setFactorAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 获取多因子模型数据
  const fetchModelData = async () => {
    try {
      setLoading(true);
      const [model, analysis] = await Promise.all([
        getMultiFactorModel(strategyId),
        getFactorAnalysis(strategyId),
      ]);
      
      setModelData(model);
      setFactorAnalysis(analysis);
    } catch (error) {
      message.error('获取多因子模型数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && strategyId) {
      fetchModelData();
    }
  }, [strategyId, visible]);

  // 因子权重表格列配置
  const factorWeightColumns = [
    {
      title: '因子名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name: string, record: any) => (
        <Space>
          <Text strong>{name}</Text>
          <Tooltip title={record.description}>
            <QuestionCircleOutlined style={{ color: '#8c8c8c' }} />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '类型',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => {
        const categoryMap: Record<string, { color: string; text: string }> = {
          fundamental: { color: 'blue', text: '基本面' },
          technical: { color: 'green', text: '技术面' },
          macro: { color: 'orange', text: '宏观' },
          sentiment: { color: 'purple', text: '情绪' },
          quality: { color: 'cyan', text: '质量' },
          growth: { color: 'red', text: '成长' },
          value: { color: 'yellow', text: '价值' },
        };
        const config = categoryMap[category] || { color: 'default', text: category };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '权重',
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
      render: (weight: number) => (
        <div>
          <Progress
            percent={Math.abs(weight) * 100}
            size="small"
            status={weight >= 0 ? 'success' : 'exception'}
            showInfo={false}
          />
          <Text style={{ color: weight >= 0 ? '#3f8600' : '#cf1322' }}>
            {weight >= 0 ? '+' : ''}{formatPercent(weight)}
          </Text>
        </div>
      ),
    },
    {
      title: 'IC值',
      dataIndex: 'ic',
      key: 'ic',
      width: 100,
      render: (ic: number) => (
        <Text style={{ color: ic > 0.05 ? '#3f8600' : ic < -0.05 ? '#cf1322' : '#faad14' }}>
          {formatNumber(ic, 3)}
        </Text>
      ),
    },
    {
      title: 'T统计量',
      dataIndex: 'tStat',
      key: 'tStat',
      width: 100,
      render: (tStat: number) => (
        <Text style={{ color: Math.abs(tStat) > 2 ? '#3f8600' : '#8c8c8c' }}>
          {formatNumber(tStat, 2)}
        </Text>
      ),
    },
    {
      title: '显著性',
      dataIndex: 'significance',
      key: 'significance',
      width: 80,
      render: (significance: number) => {
        let status = 'default';
        let text = '不显著';
        if (significance < 0.01) {
          status = 'success';
          text = '高度显著';
        } else if (significance < 0.05) {
          status = 'processing';
          text = '显著';
        } else if (significance < 0.1) {
          status = 'warning';
          text = '弱显著';
        }
        return <Tag color={status}>{text}</Tag>;
      },
    },
  ];

  // 因子贡献度分析
  const renderFactorContribution = () => {
    if (!factorAnalysis?.contributions) return <Empty />;

    return (
      <Row gutter={[16, 16]}>
        {factorAnalysis.contributions.map((contrib: any, index: number) => (
          <Col span={8} key={index}>
            <Card size="small">
              <Statistic
                title={contrib.factorName}
                value={contrib.contribution}
                precision={2}
                suffix="%"
                valueStyle={{
                  color: contrib.contribution >= 0 ? '#3f8600' : '#cf1322',
                }}
              />
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  风险贡献: {formatPercent(contrib.riskContribution)}
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  // 模型统计信息
  const renderModelStats = () => {
    if (!modelData) return <Empty />;

    return (
      <Row gutter={16}>
        <Col span={6}>
          <Statistic
            title="R²"
            value={modelData.statistics.rSquared}
            precision={3}
            valueStyle={{
              color: modelData.statistics.rSquared > 0.3 ? '#3f8600' : '#fa8c16',
            }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="调整R²"
            value={modelData.statistics.adjustedRSquared}
            precision={3}
            valueStyle={{
              color: modelData.statistics.adjustedRSquared > 0.3 ? '#3f8600' : '#fa8c16',
            }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="F统计量"
            value={modelData.statistics.fStat}
            precision={2}
            valueStyle={{
              color: modelData.statistics.fStat > 5 ? '#3f8600' : '#8c8c8c',
            }}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="P值"
            value={modelData.statistics.pValue}
            precision={4}
            valueStyle={{
              color: modelData.statistics.pValue < 0.05 ? '#3f8600' : '#cf1322',
            }}
          />
        </Col>
      </Row>
    );
  };

  if (!visible) return null;

  return (
    <div className="multi-factor-display">
      <Card
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>
              多因子模型分析
            </Title>
            <Tag color="blue">因子个数: {modelData?.factors?.length || 0}</Tag>
          </Space>
        }
        extra={
          <Space>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => message.info('导出功能开发中...')}
            >
              导出报告
            </Button>
            <Button
              type="primary"
              icon={<BarChartOutlined />}
              onClick={fetchModelData}
              loading={loading}
            >
              刷新数据
            </Button>
            {onClose && (
              <Button onClick={onClose}>关闭</Button>
            )}
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane
              tab={
                <span>
                  <TableOutlined />
                  模型概览
                </span>
              }
              key="overview"
            >
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Alert
                  message="模型说明"
                  description={
                    modelData?.description || "基于多因子模型的股票预测，通过分析各类因子对收益率的影响程度来构建投资策略。"
                  }
                  type="info"
                  showIcon
                />

                <Card title="模型统计" size="small">
                  {renderModelStats()}
                </Card>

                <Card title="因子权重分析" size="small">
                  <Table
                    columns={factorWeightColumns}
                    dataSource={modelData?.factors || []}
                    rowKey="name"
                    size="small"
                    pagination={false}
                    scroll={{ x: 800 }}
                  />
                </Card>
              </Space>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <PieChartOutlined />
                  因子贡献
                </span>
              }
              key="contribution"
            >
              <Card title="收益贡献度分解" size="small">
                {renderFactorContribution()}
              </Card>

              <Card title="风险归因分析" size="small" style={{ marginTop: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="因子风险"
                      value={factorAnalysis?.riskAttribution?.factorRisk || 0}
                      precision={2}
                      suffix="%"
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="特质风险"
                      value={factorAnalysis?.riskAttribution?.specificRisk || 0}
                      precision={2}
                      suffix="%"
                    />
                  </Col>
                </Row>
              </Card>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <LineChartOutlined />
                  历史表现
                </span>
              }
              key="performance"
            >
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <Empty description="历史表现图表开发中..." />
                <Button type="link" onClick={() => message.info('图表功能即将上线')}>
                  查看详细分析
                </Button>
              </div>
            </TabPane>
          </Tabs>
        </Spin>
      </Card>
    </div>
  );
};

export default MultiFactorDisplay;