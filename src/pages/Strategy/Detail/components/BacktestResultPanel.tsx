/**
 * 回测结果面板 - 在策略页面底部展示
 */

import React, { useState } from 'react';
import { Card, Tabs, Row, Col, Statistic, Table, Button, Space, Spin, Empty, Tag } from 'antd';
import {
  CloseOutlined,
  DownloadOutlined,
  ExpandOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import EquityChart from './Charts/EquityChart';
import DrawdownChart from './Charts/DrawdownChart';
import styles from './BacktestResultPanel.less';

interface BacktestResultPanelProps {
  result: any;
  loading: boolean;
  onClose: () => void;
}

const BacktestResultPanel: React.FC<BacktestResultPanelProps> = ({
  result,
  loading,
  onClose,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className={styles.resultPanel}>
        <div className={styles.header}>
          <span className={styles.title}>回测运行中...</span>
          <Button type="text" size="small" icon={<CloseOutlined />} onClick={onClose} />
        </div>
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <Spin size="large" tip="正在执行回测，请稍候..." />
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={styles.resultPanel}>
        <div className={styles.header}>
          <span className={styles.title}>回测结果</span>
          <Button type="text" size="small" icon={<CloseOutlined />} onClick={onClose} />
        </div>
        <Empty description="暂无回测结果" style={{ padding: '60px' }} />
      </div>
    );
  }

  const { summary, equity, trades, config } = result;

  // 交易列表列定义
  const tradeColumns = [
    {
      title: '#',
      dataIndex: 'id',
      width: 50,
    },
    {
      title: '方向',
      dataIndex: 'side',
      width: 60,
      render: (side: string) => (
        <Tag color={side === 'long' ? 'green' : 'red'}>
          {side === 'long' ? '多' : '空'}
        </Tag>
      ),
    },
    {
      title: '入场日期',
      dataIndex: 'entryDate',
      width: 100,
      render: (date: string) => date.substring(5),
    },
    {
      title: '出场日期',
      dataIndex: 'exitDate',
      width: 100,
      render: (date: string) => date.substring(5),
    },
    {
      title: '入场价',
      dataIndex: 'entryPrice',
      width: 80,
      align: 'right' as const,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '出场价',
      dataIndex: 'exitPrice',
      width: 80,
      align: 'right' as const,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 80,
      align: 'right' as const,
    },
    {
      title: '盈亏',
      dataIndex: 'profit',
      width: 120,
      align: 'right' as const,
      render: (profit: number, record: any) => (
        <Space direction="vertical" size={0} style={{ textAlign: 'right' }}>
          <span style={{ color: profit >= 0 ? '#52c41a' : '#ff4d4f', fontWeight: 600 }}>
            {profit >= 0 ? '+' : ''}¥{profit.toFixed(2)}
          </span>
          <span style={{ fontSize: 11, color: profit >= 0 ? '#52c41a' : '#ff4d4f' }}>
            {profit >= 0 ? '+' : ''}{record.profitPercent.toFixed(2)}%
          </span>
        </Space>
      ),
    },
  ];

  return (
    <div className={`${styles.resultPanel} ${expanded ? styles.expanded : ''}`}>
      {/* 头部 */}
      <div className={styles.header}>
        <span className={styles.title}>回测结果</span>
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => console.log('导出')}
          >
            导出
          </Button>
          <Button
            type="text"
            size="small"
            icon={<ExpandOutlined />}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? '收起' : '展开'}
          </Button>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={onClose}
          />
        </Space>
      </div>

      {/* KPI 横幅 */}
      <div className={styles.kpiBanner}>
        <Row gutter={16}>
          <Col span={4}>
            <Statistic
              title="总收益率"
              value={summary.totalReturn}
              precision={2}
              suffix="%"
              valueStyle={{
                color: summary.totalReturn >= 0 ? '#3f8600' : '#cf1322',
                fontSize: 20,
              }}
              prefix={summary.totalReturn >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="年化收益"
              value={summary.annualizedReturn}
              precision={2}
              suffix="%"
              valueStyle={{ fontSize: 20 }}
            />
          </Col>
          <Col span={4}>
            <Statistic
              title="最大回撤"
              value={Math.abs(summary.maxDrawdown)}
              precision={2}
              suffix="%"
              valueStyle={{ color: '#cf1322', fontSize: 20 }}
            />
          </Col>
          <Col span={3}>
            <Statistic
              title="夏普比率"
              value={summary.sharpeRatio}
              precision={2}
              valueStyle={{ fontSize: 20 }}
            />
          </Col>
          <Col span={3}>
            <Statistic
              title="胜率"
              value={summary.winRate}
              precision={1}
              suffix="%"
              valueStyle={{ fontSize: 20 }}
            />
          </Col>
          <Col span={3}>
            <Statistic
              title="交易次数"
              value={summary.totalTrades}
              valueStyle={{ fontSize: 20 }}
            />
          </Col>
          <Col span={3}>
            <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>配置</div>
            <div style={{ fontSize: 11, color: '#666' }}>
              <div>标的: {config.symbol}</div>
              <div>初始: ¥{config.initialCapital?.toLocaleString()}</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* 主内容区 */}
      <div className={styles.content}>
        <Tabs
          defaultActiveKey="equity"
          items={[
            {
              key: 'equity',
              label: '权益曲线',
              children: (
                <div style={{ padding: '16px 0', height: '400px' }}>
                  <EquityChart data={equity || []} />
                </div>
              ),
            },
            {
              key: 'drawdown',
              label: '回撤分析',
              children: (
                <div style={{ padding: '16px 0', height: '400px' }}>
                  <DrawdownChart data={equity || []} />
                </div>
              ),
            },
            {
              key: 'trades',
              label: `交易明细 (${trades.length})`,
              children: (
                <div style={{ padding: '16px 0' }}>
                  <Table
                    columns={tradeColumns}
                    dataSource={trades}
                    rowKey="id"
                    size="small"
                    pagination={{
                      pageSize: 10,
                      showTotal: (total) => `共 ${total} 笔交易`,
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '20', '50'],
                    }}
                    scroll={{ y: 300 }}
                  />
                </div>
              ),
            },
            {
              key: 'analysis',
              label: '深度分析',
              children: (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <Empty description="深度分析功能开发中" />
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default BacktestResultPanel;
