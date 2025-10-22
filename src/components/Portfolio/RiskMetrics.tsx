import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Space, Typography, Statistic, Progress, Alert, Tag, Tooltip } from 'antd';
import { 
  WarningOutlined,
  SafetyOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import './RiskMetrics.less';

const { Text, Title } = Typography;

interface RiskData {
  /** VaR (风险价值) */
  var: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  /** CVaR (条件风险价值) */
  cvar: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  /** 贝塔系数 */
  beta: number;
  /** 相关性 */
  correlation: number;
  /** 信息比率 */
  informationRatio: number;
  /** 跟踪误差 */
  trackingError: number;
  /** 最大回撤 */
  maxDrawdown: number;
  /** 下行风险 */
  downsideRisk: number;
  /** 索提诺比率 */
  sortinoRatio: number;
  /** 卡尔马比率 */
  calmarRatio: number;
}

interface PositionRisk {
  /** 股票代码 */
  stockCode: string;
  /** 股票名称 */
  stockName: string;
  /** 风险贡献度 */
  riskContribution: number;
  /** 持仓比例 */
  positionPercent: number;
  /** 个股贝塔 */
  stockBeta: number;
  /** 风险等级 */
  riskLevel: 'low' | 'medium' | 'high';
}

interface RiskMetricsProps {
  /** 风险数据 */
  riskData?: RiskData;
  /** 个股风险 */
  positionRisks?: PositionRisk[];
  /** 总资产 */
  totalAssets?: number;
  /** 基准名称 */
  benchmarkName?: string;
  /** 加载状态 */
  loading?: boolean;
}

const RiskMetrics: React.FC<RiskMetricsProps> = ({
  riskData,
  positionRisks = [],
  totalAssets = 0,
  benchmarkName = '沪深300',
  loading = false,
}) => {
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');

  // 计算整体风险等级
  useEffect(() => {
    if (!riskData) return;

    let score = 0;
    
    // VaR评分 (权重30%)
    const dailyVaR = Math.abs(riskData.var.daily);
    if (dailyVaR < 2) score += 30;
    else if (dailyVaR < 4) score += 20;
    else score += 10;

    // 最大回撤评分 (权重25%)
    const maxDD = Math.abs(riskData.maxDrawdown);
    if (maxDD < 10) score += 25;
    else if (maxDD < 20) score += 15;
    else score += 5;

    // 贝塔系数评分 (权重20%)
    const beta = Math.abs(riskData.beta);
    if (beta < 1.2) score += 20;
    else if (beta < 1.5) score += 15;
    else score += 5;

    // 跟踪误差评分 (权重15%)
    if (riskData.trackingError < 5) score += 15;
    else if (riskData.trackingError < 8) score += 10;
    else score += 5;

    // 下行风险评分 (权重10%)
    if (riskData.downsideRisk < 15) score += 10;
    else if (riskData.downsideRisk < 25) score += 5;
    else score += 0;

    if (score >= 80) setRiskLevel('low');
    else if (score >= 60) setRiskLevel('medium');
    else setRiskLevel('high');
  }, [riskData]);

  // 获取风险等级显示
  const getRiskLevelDisplay = (level: 'low' | 'medium' | 'high') => {
    const config = {
      low: { text: '低风险', color: '#52c41a', icon: <SafetyOutlined /> },
      medium: { text: '中等风险', color: '#faad14', icon: <ExclamationCircleOutlined /> },
      high: { text: '高风险', color: '#ff4d4f', icon: <WarningOutlined /> },
    };
    return config[level];
  };

  // 获取VaR风险等级
  const getVaRLevel = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue < 2) return 'low';
    if (absValue < 4) return 'medium';
    return 'high';
  };

  // 获取贝塔风险等级
  const getBetaLevel = (beta: number) => {
    const absBeta = Math.abs(beta);
    if (absBeta < 1.2) return 'low';
    if (absBeta < 1.5) return 'medium';
    return 'high';
  };

  const overallRisk = getRiskLevelDisplay(riskLevel);

  if (!riskData) {
    return (
      <Card title="风险指标" loading={loading}>
        <Alert message="暂无风险数据" type="info" />
      </Card>
    );
  }

  return (
    <div className="risk-metrics">
      <Row gutter={[16, 16]}>
        {/* 风险概览 */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <DashboardOutlined />
                <Text strong>风险概览</Text>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <div className="risk-level-card">
                  <div className="risk-level-content">
                    {overallRisk.icon}
                    <Text strong style={{ color: overallRisk.color, marginLeft: 8 }}>
                      {overallRisk.text}
                    </Text>
                  </div>
                  <Text type="secondary">综合风险评级</Text>
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="组合贝塔"
                  value={riskData.beta}
                  precision={2}
                  valueStyle={{
                    color: getBetaLevel(riskData.beta) === 'low' ? '#52c41a' : 
                           getBetaLevel(riskData.beta) === 'medium' ? '#faad14' : '#ff4d4f'
                  }}
                  suffix={
                    <Tooltip title={`相对${benchmarkName}的系统性风险`}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  }
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="相关性"
                  value={riskData.correlation}
                  precision={2}
                  valueStyle={{
                    color: Math.abs(riskData.correlation) > 0.8 ? '#ff4d4f' : '#52c41a'
                  }}
                  suffix={
                    <Tooltip title={`与${benchmarkName}的相关程度`}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  }
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* VaR风险价值 */}
        <Col xs={24} lg={12}>
          <Card title="VaR风险价值" size="small">
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <Statistic
                    title="日VaR"
                    value={Math.abs(riskData.var.daily)}
                    precision={2}
                    suffix="%"
                    valueStyle={{
                      color: getVaRLevel(riskData.var.daily) === 'low' ? '#52c41a' : 
                             getVaRLevel(riskData.var.daily) === 'medium' ? '#faad14' : '#ff4d4f',
                      fontSize: '14px'
                    }}
                    prefix="-"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="周VaR"
                    value={Math.abs(riskData.var.weekly)}
                    precision={2}
                    suffix="%"
                    valueStyle={{ fontSize: '14px' }}
                    prefix="-"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="月VaR"
                    value={Math.abs(riskData.var.monthly)}
                    precision={2}
                    suffix="%"
                    valueStyle={{ fontSize: '14px' }}
                    prefix="-"
                  />
                </Col>
              </Row>
              <Alert
                message="VaR表示在95%置信水平下的最大可能损失"
                type="info"
                showIcon
                size="small"
              />
            </Space>
          </Card>
        </Col>

        {/* CVaR条件风险价值 */}
        <Col xs={24} lg={12}>
          <Card title="CVaR条件风险价值" size="small">
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <Statistic
                    title="日CVaR"
                    value={Math.abs(riskData.cvar.daily)}
                    precision={2}
                    suffix="%"
                    valueStyle={{ fontSize: '14px' }}
                    prefix="-"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="周CVaR"
                    value={Math.abs(riskData.cvar.weekly)}
                    precision={2}
                    suffix="%"
                    valueStyle={{ fontSize: '14px' }}
                    prefix="-"
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="月CVaR"
                    value={Math.abs(riskData.cvar.monthly)}
                    precision={2}
                    suffix="%"
                    valueStyle={{ fontSize: '14px' }}
                    prefix="-"
                  />
                </Col>
              </Row>
              <Alert
                message="CVaR表示超过VaR时的平均损失"
                type="info"
                showIcon
                size="small"
              />
            </Space>
          </Card>
        </Col>

        {/* 风险调整收益指标 */}
        <Col xs={24} lg={12}>
          <Card title="风险调整收益" size="small">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="信息比率"
                  value={riskData.informationRatio}
                  precision={2}
                  valueStyle={{
                    color: riskData.informationRatio > 0.5 ? '#52c41a' : '#faad14',
                    fontSize: '14px'
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="索提诺比率"
                  value={riskData.sortinoRatio}
                  precision={2}
                  valueStyle={{
                    color: riskData.sortinoRatio > 1 ? '#52c41a' : '#faad14',
                    fontSize: '14px'
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="跟踪误差"
                  value={riskData.trackingError}
                  precision={2}
                  suffix="%"
                  valueStyle={{
                    color: riskData.trackingError < 5 ? '#52c41a' : '#ff4d4f',
                    fontSize: '14px'
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="卡尔马比率"
                  value={riskData.calmarRatio}
                  precision={2}
                  valueStyle={{
                    color: riskData.calmarRatio > 1 ? '#52c41a' : '#faad14',
                    fontSize: '14px'
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 风险敞口分析 */}
        <Col xs={24} lg={12}>
          <Card title="风险敞口" size="small">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="最大回撤"
                  value={Math.abs(riskData.maxDrawdown)}
                  precision={2}
                  suffix="%"
                  valueStyle={{
                    color: Math.abs(riskData.maxDrawdown) < 10 ? '#52c41a' : '#ff4d4f',
                    fontSize: '14px'
                  }}
                  prefix="-"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="下行风险"
                  value={riskData.downsideRisk}
                  precision={2}
                  suffix="%"
                  valueStyle={{
                    color: riskData.downsideRisk < 15 ? '#52c41a' : '#ff4d4f',
                    fontSize: '14px'
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 个股风险贡献 */}
        {positionRisks.length > 0 && (
          <Col span={24}>
            <Card title="个股风险贡献" size="small">
              <Row gutter={[8, 8]}>
                {positionRisks.slice(0, 10).map((risk, index) => {
                  const riskDisplay = getRiskLevelDisplay(risk.riskLevel);
                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={risk.stockCode}>
                      <div className="position-risk-item">
                        <div className="risk-header">
                          <Text strong>{risk.stockCode}</Text>
                          <Tag color={riskDisplay.color} size="small">
                            {riskDisplay.text}
                          </Tag>
                        </div>
                        <div className="risk-content">
                          <Text type="secondary">{risk.stockName}</Text>
                          <div className="risk-metrics">
                            <Text>风险贡献: {risk.riskContribution.toFixed(1)}%</Text>
                            <Text>持仓比例: {risk.positionPercent.toFixed(1)}%</Text>
                            <Text>个股贝塔: {risk.stockBeta.toFixed(2)}</Text>
                          </div>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default RiskMetrics;