/**
 * 账户统计卡片组件
 */
import React from 'react';
import { Row, Col, Statistic, Card } from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  PieChartOutlined,
  BarChartOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import type { BacktestAccount, AccountPerformance } from '@/services/account';

interface AccountStatsProps {
  account: BacktestAccount | null;
  performance?: AccountPerformance | null;
  loading?: boolean;
}

const AccountStats: React.FC<AccountStatsProps> = ({ account, performance, loading }) => {
  if (!account) return null;

  const profitColor = Number(account.total_profit_loss) >= 0 ? '#cf1322' : '#3f8600';
  const returnPct = Number(account.total_profit_loss_pct) || 0;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading} bordered={false} hoverable>
          <Statistic
            title="总资产"
            value={Number(account.total_assets)}
            precision={2}
            prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
            suffix="元"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading} bordered={false} hoverable>
          <Statistic
            title="持仓市值"
            value={Number(account.market_value)}
            precision={2}
            prefix={<PieChartOutlined style={{ color: '#52c41a' }} />}
            suffix="元"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading} bordered={false} hoverable>
          <Statistic
            title="可用资金"
            value={Number(account.available_cash)}
            precision={2}
            prefix={<BarChartOutlined style={{ color: '#faad14' }} />}
            suffix="元"
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading} bordered={false} hoverable>
          <Statistic
            title="总盈亏"
            value={Number(account.total_profit_loss)}
            precision={2}
            valueStyle={{ color: profitColor }}
            prefix={returnPct >= 0 ? <RiseOutlined /> : <FallOutlined />}
            suffix={`元 (${returnPct.toFixed(2)}%)`}
          />
        </Card>
      </Col>

      {performance && (
        <>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading} bordered={false} hoverable>
              <Statistic
                title="年化收益"
                value={Number(performance.annual_return)}
                precision={2}
                suffix="%"
                valueStyle={{ color: Number(performance.annual_return) >= 0 ? '#cf1322' : '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading} bordered={false} hoverable>
              <Statistic
                title="夏普比率"
                value={Number(performance.sharpe_ratio) || 0}
                precision={2}
                prefix={<TrophyOutlined style={{ color: '#722ed1' }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading} bordered={false} hoverable>
              <Statistic
                title="最大回撤"
                value={Number(performance.max_drawdown)}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading} bordered={false} hoverable>
              <Statistic
                title="胜率"
                value={Number(performance.win_rate)}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </>
      )}
    </Row>
  );
};

export default AccountStats;
