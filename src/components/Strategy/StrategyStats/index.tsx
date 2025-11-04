/**
 * 策略统计面板组件
 * 展示策略概览统计数据
 */

import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  RocketOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  ExperimentOutlined,
  FireOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Column } from '@ant-design/plots';
import './index.less';

interface StrategyStatsProps {
  total: number;
  active: number;
  testing: number;
  draft: number;
  avgWinRate: string;
  avgReturn: string;
  totalBacktests?: number;
  todaySignals?: number;
  strategyTypes?: Record<string, number>;
}

const StrategyStats: React.FC<StrategyStatsProps> = ({
  total,
  active,
  testing,
  draft,
  avgWinRate,
  avgReturn,
  totalBacktests = 0,
  todaySignals = 0,
  strategyTypes = {},
}) => {
  // 准备策略类型分布图表数据
  const typeChartData = Object.entries(strategyTypes).map(([type, count]) => ({
    type,
    count,
  }));

  const typeChartConfig = {
    data: typeChartData,
    xField: 'type',
    yField: 'count',
    seriesField: 'type',
    color: ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E8684A'],
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
    label: {
      position: 'top' as const,
      style: {
        fill: '#000000',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '策略类型',
      },
      count: {
        alias: '数量',
      },
    },
  };

  return (
    <div className="strategy-stats">
      {/* 核心指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card primary">
            <Statistic
              title={
                <span>
                  <DashboardOutlined /> 策略总数
                </span>
              }
              value={total}
              valueStyle={{ color: '#1890ff' }}
            />
            <div className="stat-card-footer">
              <span className="footer-label">草稿</span>
              <span className="footer-value">{draft}</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card success">
            <Statistic
              title={
                <span>
                  <RocketOutlined /> 运行中
                </span>
              }
              value={active}
              valueStyle={{ color: '#3f8600' }}
            />
            <div className="stat-card-footer">
              <span className="footer-label">测试中</span>
              <span className="footer-value">{testing}</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card warning">
            <Statistic
              title={
                <span>
                  <TrophyOutlined /> 平均胜率
                </span>
              }
              value={avgWinRate}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
            <div className="stat-card-footer">
              <span className="footer-label">总回测</span>
              <span className="footer-value">{totalBacktests}</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card danger">
            <Statistic
              title={
                <span>
                  <ThunderboltOutlined /> 平均收益
                </span>
              }
              value={avgReturn}
              suffix="%"
              precision={2}
              valueStyle={{
                color: parseFloat(avgReturn) > 0 ? '#cf1322' : '#3f8600',
              }}
            />
            <div className="stat-card-footer">
              <span className="footer-label">今日信号</span>
              <span className="footer-value">{todaySignals}</span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 次要指标 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={8}>
          <Card className="mini-stat-card">
            <div className="mini-stat-content">
              <ExperimentOutlined className="mini-stat-icon blue" />
              <div>
                <div className="mini-stat-value">{totalBacktests}</div>
                <div className="mini-stat-label">总回测次数</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="mini-stat-card">
            <div className="mini-stat-content">
              <FireOutlined className="mini-stat-icon orange" />
              <div>
                <div className="mini-stat-value">{todaySignals}</div>
                <div className="mini-stat-label">今日信号</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="mini-stat-card">
            <div className="mini-stat-content">
              <CheckCircleOutlined className="mini-stat-icon green" />
              <div>
                <div className="mini-stat-value">{active + testing}</div>
                <div className="mini-stat-label">活跃策略</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 策略类型分布图 */}
      {Object.keys(strategyTypes).length > 0 && (
        <Card
          title={
            <span>
              <DashboardOutlined /> 策略类型分布
            </span>
          }
          style={{ marginTop: 16 }}
          className="chart-card"
        >
          <Column {...typeChartConfig} height={200} />
        </Card>
      )}
    </div>
  );
};

export default StrategyStats;
