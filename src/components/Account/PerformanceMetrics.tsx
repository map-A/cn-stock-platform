/**
 * 绩效指标组件
 */
import React from 'react';
import { Card, Row, Col, Statistic, Progress, Descriptions, Tag, theme } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  LineChartOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { AccountPerformance } from '@/services/account';

interface PerformanceMetricsProps {
  performance: AccountPerformance | null;
  loading?: boolean;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ performance, loading }) => {
  const { token } = theme.useToken();

  if (!performance) {
    return (
      <Card loading={loading}>
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          暂无绩效数据
        </div>
      </Card>
    );
  }

  const getRating = (sharpeRatio: number) => {
    if (sharpeRatio >= 2) return { text: '优秀', color: 'success' };
    if (sharpeRatio >= 1) return { text: '良好', color: 'processing' };
    if (sharpeRatio >= 0) return { text: '一般', color: 'warning' };
    return { text: '较差', color: 'error' };
  };

  const rating = getRating(performance.sharpe_ratio || 0);
  const winRateColor =
    performance.win_rate >= 60 ? token.colorSuccess : performance.win_rate >= 40 ? token.colorWarning : token.colorError;

  return (
    <Card title="绩效指标" loading={loading}>
      <Row gutter={[16, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} size="small">
            <Statistic
              title="总收益率"
              value={performance.total_return}
              precision={2}
              suffix="%"
              valueStyle={{
                color: performance.total_return >= 0 ? token.colorSuccess : token.colorError,
                fontSize: 24,
              }}
              prefix={performance.total_return >= 0 ? <RiseOutlined style={{ color: token.colorSuccess }} /> : <FallOutlined style={{ color: token.colorError }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} size="small">
            <Statistic
              title="年化收益率"
              value={performance.annual_return}
              precision={2}
              suffix="%"
              valueStyle={{ color: token.colorSuccess, fontSize: 24 }}
              prefix={<LineChartOutlined style={{ color: token.colorPrimary }} />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} size="small">
            <Statistic
              title="夏普比率"
              value={performance.sharpe_ratio || 0}
              precision={2}
              valueStyle={{ fontSize: 24 }}
              prefix={<TrophyOutlined style={{ color: token.colorInfo }} />}
              suffix={
                <Tag color={rating.color} style={{ marginLeft: 8 }}>
                  {rating.text}
                </Tag>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} size="small">
            <Statistic
              title="最大回撤"
              value={performance.max_drawdown}
              precision={2}
              suffix="%"
              valueStyle={{ color: token.colorError, fontSize: 24 }}
              prefix={<FallOutlined style={{ color: token.colorError }} />}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card bordered={false} size="small">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="总交易次数">
                <span style={{ fontWeight: 'bold', fontSize: 16, color: token.colorText }}>
                  {performance.total_trades}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="盈利交易">
                <span style={{ color: token.colorSuccess, fontWeight: 'bold' }}>
                  {performance.winning_trades}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="亏损交易">
                <span style={{ color: token.colorError, fontWeight: 'bold' }}>
                  {performance.losing_trades}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="胜率">
                <Progress
                  percent={Number(performance.win_rate)}
                  strokeColor={winRateColor}
                  format={(percent) => `${percent?.toFixed(1)}%`}
                  style={{ width: 120 }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="盈亏比">
                <Tag color={token.colorPrimary} icon={<BarChartOutlined />}>
                  {Number(performance.profit_factor).toFixed(2)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="索提诺比率">
                <Tag color={token.colorInfo} icon={<ThunderboltOutlined />}>
                  {performance.sortino_ratio ? Number(performance.sortino_ratio).toFixed(2) : '-'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card bordered={false} size="small">
            <Descriptions column={2} size="small">
              <Descriptions.Item label="平均盈利">
                <span style={{ color: token.colorSuccess, fontWeight: 'bold', fontSize: 16 }}>
                  ¥{Number(performance.avg_win).toFixed(2)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="平均亏损">
                <span style={{ color: token.colorError, fontWeight: 'bold', fontSize: 16 }}>
                  ¥{Math.abs(Number(performance.avg_loss)).toFixed(2)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="平均持仓天数" span={2}>
                <span style={{ fontWeight: 'bold', fontSize: 16, color: token.colorText }}>
                  {performance.avg_hold_days ? Number(performance.avg_hold_days).toFixed(1) : '-'} 天
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default PerformanceMetrics;
