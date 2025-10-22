import React, { useMemo } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Progress, 
  Typography, 
  Alert, 
  Statistic,
  Tag,
  List,
  Space,
} from 'antd';
import { 
  ExclamationCircleOutlined, 
  SafetyOutlined, 
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Gauge, Pie } from '@ant-design/plots';

const { Title, Text } = Typography;

interface AccountInfo {
  account_id: string;
  account_name: string;
  account_type: 'cash' | 'margin' | 'option';
  broker_name: string;
  total_assets: number;
  available_cash: number;
  frozen_cash: number;
  market_value: number;
  margin_balance?: number;
  short_balance?: number;
  credit_limit?: number;
  risk_level: 'conservative' | 'moderate' | 'aggressive' | 'speculative';
  status: 'active' | 'suspended';
  last_updated: string;
}

interface PositionInfo {
  code: string;
  total_shares: number;
  available_shares: number;
  avg_cost_price: number;
  current_price: number;
  market_value: number;
  profit_loss: number;
  profit_loss_ratio: number;
  position_ratio: number;
}

interface RiskAlert {
  level: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  suggestion: string;
}

interface Props {
  accountData: AccountInfo | null;
  positions: PositionInfo[];
}

const RiskAnalysis: React.FC<Props> = ({ accountData, positions }) => {
  // 计算风险指标
  const riskMetrics = useMemo(() => {
    if (!accountData) return null;

    // 集中度风险 - 单一持仓占比
    const maxPositionRatio = Math.max(...positions.map(p => p.position_ratio));
    const top3PositionRatio = positions
      .sort((a, b) => b.position_ratio - a.position_ratio)
      .slice(0, 3)
      .reduce((sum, p) => sum + p.position_ratio, 0);

    // 杠杆风险
    const leverageRatio = accountData.margin_balance ? 
      (accountData.margin_balance / accountData.total_assets) * 100 : 0;

    // 流动性风险 - 现金比例
    const cashRatio = (accountData.available_cash / accountData.total_assets) * 100;

    // 波动风险 - 基于持仓盈亏比例的标准差
    const profitLossRatios = positions.map(p => p.profit_loss_ratio);
    const avgProfitLossRatio = profitLossRatios.reduce((sum, r) => sum + r, 0) / profitLossRatios.length;
    const volatility = Math.sqrt(
      profitLossRatios.reduce((sum, r) => sum + Math.pow(r - avgProfitLossRatio, 2), 0) / profitLossRatios.length
    );

    // 亏损风险 - 亏损持仓比例
    const losingPositions = positions.filter(p => p.profit_loss < 0).length;
    const losingRatio = positions.length > 0 ? (losingPositions / positions.length) * 100 : 0;

    return {
      maxPositionRatio,
      top3PositionRatio,
      leverageRatio,
      cashRatio,
      volatility,
      losingRatio,
      positionCount: positions.length,
    };
  }, [accountData, positions]);

  // 生成风险警告
  const riskAlerts = useMemo((): RiskAlert[] => {
    if (!riskMetrics) return [];

    const alerts: RiskAlert[] = [];

    // 集中度风险
    if (riskMetrics.maxPositionRatio > 30) {
      alerts.push({
        level: 'high',
        type: '集中度风险',
        message: `单一持仓占比过高 (${riskMetrics.maxPositionRatio.toFixed(1)}%)`,
        suggestion: '建议分散投资，单一持仓占比不超过20%',
      });
    } else if (riskMetrics.maxPositionRatio > 20) {
      alerts.push({
        level: 'medium',
        type: '集中度风险',
        message: `单一持仓占比较高 (${riskMetrics.maxPositionRatio.toFixed(1)}%)`,
        suggestion: '建议适当降低单一持仓比例',
      });
    }

    // 杠杆风险
    if (riskMetrics.leverageRatio > 80) {
      alerts.push({
        level: 'critical',
        type: '杠杆风险',
        message: `杠杆比例过高 (${riskMetrics.leverageRatio.toFixed(1)}%)`,
        suggestion: '建议立即降低杠杆比例，避免强制平仓风险',
      });
    } else if (riskMetrics.leverageRatio > 60) {
      alerts.push({
        level: 'high',
        type: '杠杆风险',
        message: `杠杆比例较高 (${riskMetrics.leverageRatio.toFixed(1)}%)`,
        suggestion: '建议谨慎控制杠杆比例',
      });
    }

    // 流动性风险
    if (riskMetrics.cashRatio < 5) {
      alerts.push({
        level: 'high',
        type: '流动性风险',
        message: `现金比例过低 (${riskMetrics.cashRatio.toFixed(1)}%)`,
        suggestion: '建议保持适当的现金储备，以应对市场波动',
      });
    } else if (riskMetrics.cashRatio < 10) {
      alerts.push({
        level: 'medium',
        type: '流动性风险',
        message: `现金比例较低 (${riskMetrics.cashRatio.toFixed(1)}%)`,
        suggestion: '建议适当增加现金比例',
      });
    }

    // 亏损风险
    if (riskMetrics.losingRatio > 70) {
      alerts.push({
        level: 'high',
        type: '亏损风险',
        message: `亏损持仓比例过高 (${riskMetrics.losingRatio.toFixed(1)}%)`,
        suggestion: '建议审视投资策略，考虑止损',
      });
    } else if (riskMetrics.losingRatio > 50) {
      alerts.push({
        level: 'medium',
        type: '亏损风险',
        message: `亏损持仓比例较高 (${riskMetrics.losingRatio.toFixed(1)}%)`,
        suggestion: '建议关注亏损持仓，及时调整',
      });
    }

    // 持仓数量风险
    if (riskMetrics.positionCount > 50) {
      alerts.push({
        level: 'medium',
        type: '持仓数量风险',
        message: `持仓品种过多 (${riskMetrics.positionCount}只)`,
        suggestion: '建议精选优质标的，避免过度分散',
      });
    } else if (riskMetrics.positionCount < 3) {
      alerts.push({
        level: 'medium',
        type: '持仓数量风险',
        message: `持仓品种过少 (${riskMetrics.positionCount}只)`,
        suggestion: '建议适当分散投资，降低单一风险',
      });
    }

    return alerts.sort((a, b) => {
      const levelOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return levelOrder[b.level] - levelOrder[a.level];
    });
  }, [riskMetrics]);

  // 风险等级映射
  const riskLevelConfig = {
    low: { color: '#52c41a', text: '低风险', icon: <SafetyOutlined /> },
    medium: { color: '#faad14', text: '中等风险', icon: <InfoCircleOutlined /> },
    high: { color: '#ff7a45', text: '高风险', icon: <WarningOutlined /> },
    critical: { color: '#ff4d4f', text: '极高风险', icon: <ExclamationCircleOutlined /> },
  };

  // 综合风险评分
  const overallRiskScore = useMemo(() => {
    if (!riskMetrics) return 0;
    
    let score = 0;
    
    // 集中度风险 (0-30分)
    score += Math.min(30, riskMetrics.maxPositionRatio);
    
    // 杠杆风险 (0-30分)
    score += Math.min(30, riskMetrics.leverageRatio);
    
    // 流动性风险 (0-20分)
    score += Math.max(0, 20 - riskMetrics.cashRatio);
    
    // 亏损风险 (0-20分)
    score += Math.min(20, riskMetrics.losingRatio / 5);
    
    return Math.min(100, score);
  }, [riskMetrics]);

  // 风险分布数据
  const riskDistributionData = riskMetrics ? [
    { type: '集中度风险', value: Math.min(100, riskMetrics.maxPositionRatio * 2) },
    { type: '杠杆风险', value: riskMetrics.leverageRatio },
    { type: '流动性风险', value: Math.max(0, 100 - riskMetrics.cashRatio * 5) },
    { type: '亏损风险', value: riskMetrics.losingRatio },
  ] : [];

  // 风险评分仪表盘配置
  const gaugeConfig = {
    percent: overallRiskScore / 100,
    range: {
      ticks: [0, 0.3, 0.6, 0.8, 1],
      color: ['#30BF78', '#FAAD14', '#F4664A', '#CF1322'],
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    statistic: {
      content: {
        style: {
          fontSize: '20px',
          lineHeight: '20px',
        },
        formatter: () => `${overallRiskScore.toFixed(0)}分`,
      },
    },
  };

  // 风险分布饼图配置
  const pieConfig = {
    data: riskDistributionData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}\n{percentage}',
    },
    color: ['#ff7a45', '#ff4d4f', '#faad14', '#52c41a'],
  };

  if (!accountData || !riskMetrics) {
    return <div>暂无数据</div>;
  }

  return (
    <div>
      {/* 风险警告 */}
      {riskAlerts.length > 0 && (
        <Alert
          message="风险提醒"
          description={`检测到 ${riskAlerts.length} 项风险警告，请及时关注`}
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={[16, 16]}>
        {/* 综合风险评分 */}
        <Col xs={24} lg={8}>
          <Card title="综合风险评分" size="small">
            <Gauge {...gaugeConfig} height={200} />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text type="secondary">
                风险评分：{overallRiskScore >= 80 ? '极高' : overallRiskScore >= 60 ? '高' : overallRiskScore >= 30 ? '中等' : '低'}
              </Text>
            </div>
          </Card>
        </Col>

        {/* 风险分布 */}
        <Col xs={24} lg={8}>
          <Card title="风险分布" size="small">
            <Pie {...pieConfig} height={200} />
          </Card>
        </Col>

        {/* 关键风险指标 */}
        <Col xs={24} lg={8}>
          <Card title="关键风险指标" size="small">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>最大持仓占比</Text>
                  <Text strong>{riskMetrics.maxPositionRatio.toFixed(1)}%</Text>
                </div>
                <Progress 
                  percent={riskMetrics.maxPositionRatio > 30 ? 100 : (riskMetrics.maxPositionRatio / 30) * 100}
                  status={riskMetrics.maxPositionRatio > 30 ? 'exception' : riskMetrics.maxPositionRatio > 20 ? 'active' : 'success'}
                  size="small"
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>杠杆比例</Text>
                  <Text strong>{riskMetrics.leverageRatio.toFixed(1)}%</Text>
                </div>
                <Progress 
                  percent={riskMetrics.leverageRatio}
                  status={riskMetrics.leverageRatio > 80 ? 'exception' : riskMetrics.leverageRatio > 60 ? 'active' : 'success'}
                  size="small"
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>现金比例</Text>
                  <Text strong>{riskMetrics.cashRatio.toFixed(1)}%</Text>
                </div>
                <Progress 
                  percent={riskMetrics.cashRatio < 5 ? 100 : riskMetrics.cashRatio < 10 ? 50 : 0}
                  status={riskMetrics.cashRatio < 5 ? 'exception' : riskMetrics.cashRatio < 10 ? 'active' : 'success'}
                  size="small"
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text>亏损持仓比例</Text>
                  <Text strong>{riskMetrics.losingRatio.toFixed(1)}%</Text>
                </div>
                <Progress 
                  percent={riskMetrics.losingRatio}
                  status={riskMetrics.losingRatio > 70 ? 'exception' : riskMetrics.losingRatio > 50 ? 'active' : 'success'}
                  size="small"
                />
              </div>
            </Space>
          </Card>
        </Col>

        {/* 风险警告列表 */}
        <Col xs={24}>
          <Card title="风险警告" size="small">
            {riskAlerts.length === 0 ? (
              <Alert
                message="当前无风险警告"
                description="账户风险控制良好，请继续保持"
                type="success"
                showIcon
              />
            ) : (
              <List
                dataSource={riskAlerts}
                renderItem={(alert) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Tag 
                          color={riskLevelConfig[alert.level].color}
                          icon={riskLevelConfig[alert.level].icon}
                        >
                          {riskLevelConfig[alert.level].text}
                        </Tag>
                      }
                      title={alert.type}
                      description={
                        <div>
                          <div style={{ marginBottom: 4 }}>
                            <Text>{alert.message}</Text>
                          </div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            建议：{alert.suggestion}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RiskAnalysis;
