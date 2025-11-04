/**
 * 回测卡片组件
 */
import React from 'react';
import { Card, Tag, Space, Tooltip, Badge, Row, Col, Progress } from 'antd';
import {
  LineChartOutlined,
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
  RiseOutlined,
  FallOutlined,
  ThunderboltOutlined,
  FundOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import './index.less';

interface BacktestCardProps {
  backtest: any;
  strategyName?: string;
  onView?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
}

const BacktestCard: React.FC<BacktestCardProps> = ({
  backtest,
  strategyName,
  onView,
  onDelete,
  onExport,
}) => {
  const statusMap: Record<string, any> = {
    pending: { color: 'default', label: '等待中', status: 'default' },
    running: { color: 'processing', label: '运行中', status: 'processing' },
    completed: { color: 'success', label: '已完成', status: 'success' },
    failed: { color: 'error', label: '失败', status: 'error' },
  };

  const statusInfo = statusMap[backtest.status] || statusMap.pending;
  const isPositive = (backtest.return_percent || 0) > 0;
  const profitLoss = backtest.final_capital
    ? backtest.final_capital - backtest.initial_capital
    : 0;

  return (
    <Card
      className="backtest-card"
      hoverable
      actions={[
        <Tooltip key="view" title="查看详情"><EyeOutlined onClick={onView} /></Tooltip>,
        <Tooltip key="chart" title="查看图表"><LineChartOutlined onClick={onView} /></Tooltip>,
        <Tooltip key="export" title="导出报告"><DownloadOutlined onClick={onExport} /></Tooltip>,
        <Tooltip key="delete" title="删除"><DeleteOutlined onClick={onDelete} /></Tooltip>,
      ]}
    >
      <div className="backtest-card-header">
        <div>
          <div className="backtest-name">{backtest.name || `回测 #${backtest.id}`}</div>
          <div className="backtest-strategy">
            <Tag color="blue">{strategyName || `策略 #${backtest.strategy_id}`}</Tag>
            <Badge status={statusInfo.status} text={statusInfo.label} />
          </div>
        </div>
      </div>

      <div className="backtest-period">
        📅 {backtest.start_date} ~ {backtest.end_date}
      </div>

      {backtest.status === 'completed' && (
        <>
          <div className="backtest-metrics">
            <Row gutter={8}>
              <Col span={12}>
                <div className="metric-item">
                  <div className="metric-label"><ThunderboltOutlined /> 总收益率</div>
                  <div className={`metric-value ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? <RiseOutlined /> : <FallOutlined />}
                    {backtest.return_percent?.toFixed(2)}%
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="metric-item">
                  <div className="metric-label"><FundOutlined /> 盈亏金额</div>
                  <div className={`metric-value ${profitLoss > 0 ? 'positive' : 'negative'}`}>
                    ¥{Math.abs(profitLoss).toLocaleString()}
                  </div>
                </div>
              </Col>
            </Row>
            <Row gutter={8} style={{ marginTop: 12 }}>
              <Col span={12}>
                <div className="metric-mini">
                  <span className="mini-label">夏普比率</span>
                  <span className="mini-value">{backtest.sharpe_ratio?.toFixed(2) || '-'}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className="metric-mini">
                  <span className="mini-label">胜率</span>
                  <span className="mini-value">{backtest.win_rate?.toFixed(1)}%</span>
                </div>
              </Col>
            </Row>
          </div>
          <div className="backtest-capital">
            <div className="capital-label"><DashboardOutlined /> 资金变化</div>
            <div className="capital-info">
              <Space split="→">
                <span>¥{backtest.initial_capital.toLocaleString()}</span>
                <span className={profitLoss > 0 ? 'positive' : 'negative'}>
                  ¥{backtest.final_capital?.toLocaleString()}
                </span>
              </Space>
            </div>
          </div>
        </>
      )}

      {backtest.status === 'running' && (
        <div className="backtest-progress">
          <Progress percent={50} status="active" strokeColor="#1890ff" />
          <div style={{ textAlign: 'center', marginTop: 8, color: '#999' }}>回测进行中...</div>
        </div>
      )}
    </Card>
  );
};

export default BacktestCard;
