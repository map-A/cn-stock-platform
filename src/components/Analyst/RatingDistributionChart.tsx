/**
 * 评级分布图表组件
 * 展示分析师评级的分布情况
 */

import React from 'react';
import { Card, Typography, Row, Col, Progress } from 'antd';
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
  const total = distribution.total || 1;

  const ratingItems = [
    {
      label: '强烈买入',
      count: distribution.strongBuy,
      color: '#52c41a',
    },
    {
      label: '买入',
      count: distribution.buy,
      color: '#1890ff',
    },
    {
      label: '持有',
      count: distribution.hold,
      color: '#8c8c8c',
    },
    {
      label: '卖出',
      count: distribution.sell,
      color: '#ff7a45',
    },
    {
      label: '强烈卖出',
      count: distribution.strongSell,
      color: '#ff4d4f',
    },
  ];

  return (
    <Card>
      <Title level={5}>{title}</Title>

      {/* 共识评级 */}
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <Text type="secondary">共识评级</Text>
        <div>
          <Text
            strong
            style={{ fontSize: 24, color: '#1890ff', marginRight: 16 }}
          >
            {distribution.consensus}
          </Text>
          {distribution.avgPriceTarget > 0 && (
            <Text type="secondary">
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
                  <Text>{item.label}</Text>
                </Col>
                <Col>
                  <Text strong>
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
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <Row justify="space-between">
          <Col>
            <Text strong>总评级数</Text>
          </Col>
          <Col>
            <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
              {distribution.total}
            </Text>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default RatingDistributionChart;
