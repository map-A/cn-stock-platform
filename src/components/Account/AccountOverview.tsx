import React from 'react';
import { Row, Col, Card, Progress, Typography, Tag, Divider, Statistic } from 'antd';
import { 
  DollarOutlined, 
  PieChartOutlined, 
  SafetyOutlined,
  CreditCardOutlined,
  PercentageOutlined,
} from '@ant-design/icons';
import { Pie, Gauge } from '@ant-design/plots';

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

interface AccountStats {
  totalAssets: number;
  availableCash: number;
  marketValue: number;
  totalProfitLoss: number;
  totalProfitLossRatio: number;
  positionCount: number;
  cashRatio: number;
  leverageRatio: number;
}

interface Props {
  accountData: AccountInfo | null;
  stats: AccountStats | null;
}

const AccountOverview: React.FC<Props> = ({ accountData, stats }) => {
  if (!accountData || !stats) {
    return <div>暂无数据</div>;
  }

  // 账户类型映射
  const accountTypeMap = {
    cash: { text: '现金账户', color: 'blue' },
    margin: { text: '融资融券账户', color: 'orange' },
    option: { text: '期权账户', color: 'purple' },
  };

  // 风险等级映射
  const riskLevelMap = {
    conservative: { text: '保守型', color: 'green' },
    moderate: { text: '稳健型', color: 'blue' },
    aggressive: { text: '积极型', color: 'orange' },
    speculative: { text: '投机型', color: 'red' },
  };

  // 资产分布饼图数据
  const assetDistributionData = [
    {
      type: '持仓市值',
      value: stats.marketValue,
    },
    {
      type: '可用资金',
      value: stats.availableCash,
    },
    {
      type: '冻结资金',
      value: (accountData.frozen_cash || 0) / 100,
    },
  ].filter(item => item.value > 0);

  // 饼图配置
  const pieConfig = {
    data: assetDistributionData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}\n{percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    color: ['#1890ff', '#52c41a', '#faad14'],
  };

  // 资金使用率仪表盘配置
  const gaugeConfig = {
    percent: (stats.marketValue / stats.totalAssets),
    range: {
      ticks: [0, 1/3, 2/3, 1],
      color: ['#30BF78', '#FAAD14', '#F4664A'],
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
          fontSize: '24px',
          lineHeight: '24px',
        },
        formatter: () => `${(stats.marketValue / stats.totalAssets * 100).toFixed(1)}%`,
      },
    },
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* 基本信息 */}
        <Col xs={24} lg={12}>
          <Card title="基本信息" size="small">
            <div style={{ marginBottom: 16 }}>
              <Text strong>账户名称：</Text>
              <Text>{accountData.account_name}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>账户ID：</Text>
              <Text code>{accountData.account_id}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>账户类型：</Text>
              <Tag color={accountTypeMap[accountData.account_type]?.color || 'default'}>
                {accountTypeMap[accountData.account_type]?.text || accountData.account_type}
              </Tag>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>券商：</Text>
              <Text>{accountData.broker_name}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>风险等级：</Text>
              <Tag color={riskLevelMap[accountData.risk_level]?.color || 'default'}>
                {riskLevelMap[accountData.risk_level]?.text || accountData.risk_level}
              </Tag>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>账户状态：</Text>
              <Tag color={accountData.status === 'active' ? 'green' : 'red'}>
                {accountData.status === 'active' ? '正常' : '暂停'}
              </Tag>
            </div>
            <div>
              <Text strong>最后更新：</Text>
              <Text>{accountData.last_updated}</Text>
            </div>

            {/* 融资融券信息 */}
            {accountData.account_type === 'margin' && (
              <>
                <Divider />
                <Title level={5}>融资融券信息</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="融资余额"
                      value={(accountData.margin_balance || 0) / 100}
                      precision={2}
                      suffix="元"
                      prefix={<CreditCardOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="信用额度"
                      value={(accountData.credit_limit || 0) / 100}
                      precision={2}
                      suffix="元"
                      prefix={<SafetyOutlined />}
                    />
                  </Col>
                </Row>
                <div style={{ marginTop: 16 }}>
                  <Text strong>杠杆比例：</Text>
                  <Text>{stats.leverageRatio.toFixed(2)}%</Text>
                  <Progress 
                    percent={stats.leverageRatio} 
                    size="small" 
                    status={stats.leverageRatio > 80 ? 'exception' : 'normal'}
                    style={{ marginTop: 8 }}
                  />
                </div>
              </>
            )}
          </Card>
        </Col>

        {/* 资产分布 */}
        <Col xs={24} lg={12}>
          <Card title="资产分布" size="small">
            <Pie {...pieConfig} height={280} />
          </Card>
        </Col>

        {/* 资金使用率 */}
        <Col xs={24} lg={12}>
          <Card title="资金使用率" size="small">
            <Gauge {...gaugeConfig} height={200} />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text type="secondary">
                持仓市值占总资产比例
              </Text>
            </div>
          </Card>
        </Col>

        {/* 关键指标 */}
        <Col xs={24} lg={12}>
          <Card title="关键指标" size="small">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="持仓品种数"
                  value={stats.positionCount}
                  suffix="只"
                  prefix={<PieChartOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="现金比例"
                  value={stats.cashRatio}
                  precision={2}
                  suffix="%"
                  prefix={<PercentageOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="盈亏比例"
                  value={stats.totalProfitLossRatio}
                  precision={2}
                  suffix="%"
                  valueStyle={{ 
                    color: stats.totalProfitLossRatio >= 0 ? '#cf1322' : '#3f8600' 
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="总盈亏"
                  value={stats.totalProfitLoss}
                  precision={2}
                  suffix="元"
                  valueStyle={{ 
                    color: stats.totalProfitLoss >= 0 ? '#cf1322' : '#3f8600' 
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AccountOverview;
