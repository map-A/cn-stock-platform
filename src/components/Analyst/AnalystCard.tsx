/**
 * 分析师卡片组件
 * 展示分析师基本信息和关键指标
 */

import React from 'react';
import { Card, Badge, Typography, Row, Col, Space, Statistic } from 'antd';
import { TrophyOutlined, RiseOutlined } from '@ant-design/icons';
import { history } from 'umi';
import type { AnalystInfo } from '@/services/analyst';

const { Text, Title } = Typography;

export interface AnalystCardProps {
  analyst: AnalystInfo;
  showRank?: boolean;
  onClick?: (analyst: AnalystInfo) => void;
}

const AnalystCard: React.FC<AnalystCardProps> = ({
  analyst,
  showRank = true,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(analyst);
    } else {
      history.push(`/analysts/${analyst.analystId}`);
    }
  };

  const getRatingBadge = (score: number) => {
    if (score >= 4.5) return { color: 'gold', text: '五星分析师' };
    if (score >= 4.0) return { color: 'blue', text: '四星分析师' };
    if (score >= 3.5) return { color: 'green', text: '三星分析师' };
    return { color: 'default', text: '普通分析师' };
  };

  const badge = getRatingBadge(analyst.analystScore);

  return (
    <Card
      hoverable
      onClick={handleClick}
      className="analyst-card"
      styles={{
        body: { padding: '16px' },
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* 头部：排名和评级 */}
        <Row justify="space-between" align="middle">
          {showRank && (
            <Col>
              <Space>
                <TrophyOutlined style={{ fontSize: 20, color: '#faad14' }} />
                <Text strong style={{ fontSize: 18 }}>
                  #{analyst.rank}
                </Text>
              </Space>
            </Col>
          )}
          <Col>
            <Badge
              count={badge.text}
              style={{
                backgroundColor: badge.color === 'gold' ? '#faad14' : undefined,
              }}
            />
          </Col>
        </Row>

        {/* 分析师信息 */}
        <div>
          <Title level={5} style={{ marginBottom: 4 }}>
            {analyst.analystName}
          </Title>
          <Text type="secondary">{analyst.companyName}</Text>
        </div>

        {/* 关键指标 */}
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="成功率"
              value={analyst.successRate}
              precision={1}
              suffix="%"
              valueStyle={{ fontSize: 16, color: '#3f8600' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="平均回报"
              value={analyst.avgReturn}
              precision={1}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{
                fontSize: 16,
                color: analyst.avgReturn >= 0 ? '#cf1322' : '#3f8600',
              }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="评级数"
              value={analyst.totalRatings}
              valueStyle={{ fontSize: 16 }}
            />
          </Col>
        </Row>

        {/* 底部：评分 */}
        <Row justify="space-between" align="middle">
          <Col>
            <Text type="secondary">分析师评分</Text>
          </Col>
          <Col>
            <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
              {analyst.analystScore.toFixed(1)} / 5.0
            </Text>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default AnalystCard;
