/**
 * 账户统计卡片组件
 */
import React from 'react';
import { Row, Col, Statistic, Card, theme } from 'antd';
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
  const { token } = theme.useToken();

  if (!account) return null;

  const profitColor = Number(account.total_profit_loss) >= 0 ? token.colorSuccess : token.colorError;
  const returnPct = Number(account.total_profit_loss_pct) || 0;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <Card loading={loading} bordered={false} hoverable>
          <Statistic
            title="总资产"
            value={Number(account.total_assets)}
            precision={2}
            prefix={<DollarOutlined style={{ color: token.colorPrimary }} />}
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
            prefix={<PieChartOutlined style={{ color: token.colorInfo }} />}
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
            prefix={<BarChartOutlined style={{ color: token.colorWarning }} />}
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
            prefix={returnPct >= 0 ? <RiseOutlined style={{ color: token.colorSuccess }} /> : <FallOutlined style={{ color: token.colorError }} />}
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
                valueStyle={{ color: Number(performance.annual_return) >= 0 ? token.colorSuccess : token.colorError }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card loading={loading} bordered={false} hoverable>
              <Statistic
                title="夏普比率"
                value={Number(performance.sharpe_ratio) || 0}
                precision={2}
                prefix={<TrophyOutlined style={{ color: token.colorInfo }} />}
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
                valueStyle={{ color: token.colorError }}
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
                valueStyle={{ color: token.colorSuccess }}
              />
            </Card>
          </Col>
        </>
      )}
    </Row>
  );
};

export default AccountStats;
