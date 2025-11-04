/**
 * 策略卡片组件
 * 展示单个策略的关键信息
 */

import React from 'react';
import { Card, Tag, Space, Button, Tooltip, Badge, Progress, Statistic, Row, Col } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  LineChartOutlined,
  EyeOutlined,
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import './index.less';

interface StrategyCardProps {
  strategy: {
    id: string | number;
    name: string;
    description?: string;
    strategy_type: string;
    status: string;
    config?: any;
    created_at?: string;
  };
  bestBacktest?: {
    return_percent?: number;
    sharpe_ratio?: number;
    win_rate?: number;
    max_drawdown?: number;
  };
  backtestCount?: number;
  onView?: () => void;
  onEdit?: () => void;
  onRun?: () => void;
  onBacktest?: () => void;
  onDelete?: () => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  bestBacktest,
  backtestCount = 0,
  onView,
  onEdit,
  onRun,
  onBacktest,
  onDelete,
}) => {
  const typeMap: Record<string, { color: string; label: string; icon: string }> = {
    trend_following: { color: 'blue', label: '趋势跟踪', icon: '📈' },
    mean_reversion: { color: 'green', label: '均值回归', icon: '↩️' },
    momentum: { color: 'orange', label: '动量策略', icon: '⚡' },
    quantitative: { color: 'purple', label: '量化策略', icon: '🔢' },
    ai_ml: { color: 'geekblue', label: 'AI/ML', icon: '🤖' },
    machine_learning: { color: 'geekblue', label: 'AI/ML', icon: '🤖' },
    grid: { color: 'cyan', label: '网格策略', icon: '⊞' },
    arbitrage: { color: 'magenta', label: '套利策略', icon: '⚖️' },
    custom: { color: 'default', label: '自定义', icon: '🔧' },
  };

  const statusMap: Record<string, { color: string; label: string; status?: any }> = {
    draft: { color: 'default', label: '草稿', status: 'default' },
    testing: { color: 'processing', label: '测试中', status: 'processing' },
    active: { color: 'success', label: '运行中', status: 'success' },
    paused: { color: 'warning', label: '已暂停', status: 'warning' },
    stopped: { color: 'error', label: '已停止', status: 'error' },
    archived: { color: 'default', label: '已归档', status: 'default' },
  };

  const typeInfo = typeMap[strategy.strategy_type] || typeMap.custom;
  const statusInfo = statusMap[strategy.status] || statusMap.draft;
  const description = strategy.description || 
    (strategy.config?.parameters ? JSON.stringify(strategy.config.parameters).slice(0, 50) : '');

  return (
    <Card
      className="strategy-card"
      hoverable
      actions={[
        <Tooltip key="view" title="查看详情">
          <EyeOutlined onClick={onView} />
        </Tooltip>,
        <Tooltip key="edit" title="编辑策略">
          <EditOutlined onClick={onEdit} />
        </Tooltip>,
        <Tooltip key="backtest" title="运行回测">
          <LineChartOutlined onClick={onBacktest} />
        </Tooltip>,
        <Tooltip key="run" title={strategy.status === 'active' ? '暂停' : '运行'}>
          {strategy.status === 'active' ? (
            <PauseCircleOutlined onClick={onRun} />
          ) : (
            <PlayCircleOutlined onClick={onRun} />
          )}
        </Tooltip>,
      ]}
    >
      <div className="strategy-card-header">
        <Space>
          <span className="strategy-icon">{typeInfo.icon}</span>
          <div>
            <div className="strategy-name">{strategy.name}</div>
            <Space size={4}>
              <Tag color={typeInfo.color}>{typeInfo.label}</Tag>
              <Badge status={statusInfo.status} text={statusInfo.label} />
            </Space>
          </div>
        </Space>
        <Badge count={backtestCount} style={{ backgroundColor: '#52c41a' }} />
      </div>

      <div className="strategy-card-description">
        {description ? description.slice(0, 80) + (description.length > 80 ? '...' : '') : '暂无描述'}
      </div>

      {bestBacktest && (
        <div className="strategy-card-stats">
          <Row gutter={8}>
            <Col span={12}>
              <div className="stat-item">
                <div className="stat-label">
                  <ThunderboltOutlined /> 收益率
                </div>
                <div className={`stat-value ${bestBacktest.return_percent! > 0 ? 'positive' : 'negative'}`}>
                  {bestBacktest.return_percent! > 0 ? (
                    <RiseOutlined />
                  ) : (
                    <FallOutlined />
                  )}
                  {bestBacktest.return_percent?.toFixed(2)}%
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="stat-item">
                <div className="stat-label">
                  <TrophyOutlined /> 胜率
                </div>
                <div className="stat-value">
                  {bestBacktest.win_rate?.toFixed(1)}%
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={8} style={{ marginTop: 8 }}>
            <Col span={12}>
              <Tooltip title={`夏普比率: ${bestBacktest.sharpe_ratio?.toFixed(2)}`}>
                <div className="stat-mini">
                  夏普: {bestBacktest.sharpe_ratio?.toFixed(2)}
                </div>
              </Tooltip>
            </Col>
            <Col span={12}>
              <Tooltip title={`最大回撤: ${bestBacktest.max_drawdown?.toFixed(2)}%`}>
                <div className="stat-mini negative">
                  回撤: {bestBacktest.max_drawdown?.toFixed(1)}%
                </div>
              </Tooltip>
            </Col>
          </Row>
        </div>
      )}

      {!bestBacktest && (
        <div className="strategy-card-empty">
          <LineChartOutlined style={{ fontSize: 32, color: '#d9d9d9' }} />
          <div style={{ marginTop: 8, color: '#999' }}>暂无回测数据</div>
        </div>
      )}
    </Card>
  );
};

export default StrategyCard;
