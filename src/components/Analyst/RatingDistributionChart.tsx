/**
 * 评级分布图表组件
 * 展示分析师评级的分布情况
 */

import React from 'react';
import { Card, Typography, Row, Col, Progress, theme } from 'antd';
import type { RatingDistribution } from '@/services/analyst';

const { Text, Title } = Typography;

export interface RatingDistributionChartProps {
  distribution: RatingDistribution;
  title?: string;
}

const RatingDistributionChart: React.FC<RatingDistributionChartProps> = ({
  distribution,
  title = '评级分布',
}) => {
  const { token } = theme.useToken();
  const total = distribution.total || 1;

  const ratingItems = [
    {
      label: '强烈买入',
      count: distribution.strongBuy,
      color: token.colorSuccess,
    },
    {
      label: '买入',
      count: distribution.buy,
      color: token.colorPrimary,
    },
    {
      label: '持有',
      count: distribution.hold,
      color: token.colorTextSecondary,
    },
    {
      label: '卖出',
      count: distribution.sell,
      color: token.colorWarning,
    },
    {
      label: '强烈卖出',
      count: distribution.strongSell,
      color: token.colorError,
    },
  ];

  return (
    <Card>
      <Title level={5}>{title}</Title>

      {/* 共识评级 */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <Text type="secondary" style={{ color: token.colorTextSecondary }}>共识评级</Text>
        <div>
          <Text
            strong
            style={{ fontSize: 24, color: token.colorPrimary, marginRight: 16 }}
          >
            {distribution.consensus}
          </Text>
          {distribution.avgPriceTarget > 0 && (
            <Text type="secondary" style={{ color: token.colorTextSecondary }}>
              平均目标价: ¥{distribution.avgPriceTarget.toFixed(2)}
            </Text>
          )}
        </div>
      </div>

      {/* 评级分布条 */}
      <div style={{ marginTop: 16 }}>
        {ratingItems.map((item) => {
          const percentage = (item.count / total) * 100;

          return (
            <div key={item.label} style={{ marginBottom: 12 }}>
              <Row justify="space-between" style={{ marginBottom: 4 }}>
                <Col>
                  <Text style={{ color: token.colorText }}>{item.label}</Text>
                </Col>
                <Col>
                  <Text strong style={{ color: token.colorText }}>
                    {item.count} ({percentage.toFixed(1)}%)
                  </Text>
                </Col>
              </Row>
              <Progress
                percent={percentage}
                strokeColor={item.color}
                showInfo={false}
              />
            </div>
          );
        })}
      </div>

      {/* 总计 */}
      <div
        style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Row justify="space-between">
          <Col>
            <Text strong style={{ color: token.colorText }}>总评级数</Text>
          </Col>
          <Col>
            <Text strong style={{ fontSize: 16, color: token.colorPrimary }}>
              {distribution.total}
            </Text>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default RatingDistributionChart;
