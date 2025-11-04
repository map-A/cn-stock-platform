/**
 * 回测统计组件
 * 展示回测系统的统计信息
 */

import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import {
  RocketOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  TrophyOutlined,
  RiseOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import './index.less';

interface BacktestStatsProps {
  total: number;
  completed: number;
  running: number;
  failed: number;
  avgReturn: string;
  avgSharpe: string;
  totalTrades: number;
  successRate: string;
}

const BacktestStats: React.FC<BacktestStatsProps> = ({
  total,
  completed,
  running,
  failed,
  avgReturn,
  avgSharpe,
  totalTrades,
  successRate,
}) => {
  const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0';

  return (
    <Card className="backtest-stats" bordered={false}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="总回测数"
              value={total}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="已完成"
              value={completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress
              percent={Number(completionRate)}
              size="small"
              showInfo={false}
              strokeColor="#52c41a"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="运行中"
              value={running}
              prefix={<SyncOutlined spin />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="失败"
              value={failed}
              prefix={<span style={{ fontSize: 20 }}>⚠</span>}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="平均收益率"
              value={avgReturn}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{
                color: parseFloat(avgReturn) >= 0 ? '#52c41a' : '#f5222d',
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="平均夏普比率"
              value={avgSharpe}
              prefix={<TrophyOutlined />}
              valueStyle={{
                color: parseFloat(avgSharpe) > 1 ? '#52c41a' : '#faad14',
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="总交易次数"
              value={totalTrades}
              prefix={<RocketOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="成功率"
              value={successRate}
              suffix="%"
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default BacktestStats;
