/**
 * 实时策略执行监控组件
 * 
 * 功能特性:
 * - 实时策略状态监控
 * - 执行信号展示
 * - 持仓状态跟踪
 * - 收益实时更新
 * - 风险指标监控
 * - 执行日志查看
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Progress,
  Alert,
  Tooltip,
  Badge,
  Switch,
  Timeline,
  message,
  Empty,
  Spin,
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  EyeOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { getStrategyExecution, getStrategySignals, getStrategyLogs } from '@/services/strategy';
import type { 
  StrategyExecution, 
  StrategySignal, 
  StrategyLog,
  StrategyStatus 
} from '@/types/strategy';
import { formatCurrency, formatDateTime } from '@/utils/format';
import './StrategyMonitor.less';

const { Title, Text } = Typography;

export interface StrategyMonitorProps {
  strategyId: string;
  visible?: boolean;
  onClose?: () => void;
}

const StrategyMonitor: React.FC<StrategyMonitorProps> = ({
  strategyId,
  visible = true,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [execution, setExecution] = useState<StrategyExecution | null>(null);
  const [signals, setSignals] = useState<StrategySignal[]>([]);
  const [logs, setLogs] = useState<StrategyLog[]>([]);
  const [realtimeData, setRealtimeData] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 获取执行状态
  const fetchExecutionData = async () => {
    try {
      setLoading(true);
      const [executionData, signalsData, logsData] = await Promise.all([
        getStrategyExecution(strategyId),
        getStrategySignals(strategyId, { pageSize: 20 }),
        getStrategyLogs(strategyId, { pageSize: 50 }),
      ]);
      
      setExecution(executionData);
      setSignals(signalsData.items);
      setLogs(logsData.items);
      
      // 更新实时数据
      if (executionData.performance?.equityCurve) {
        setRealtimeData(executionData.performance.equityCurve);
      }
    } catch (error) {
      message.error('获取策略执行数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 自动刷新
  useEffect(() => {
    if (autoRefresh && visible) {
      fetchExecutionData();
      intervalRef.current = setInterval(fetchExecutionData, 5000); // 5秒刷新
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [strategyId, autoRefresh, visible]);

  // 状态颜色映射
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      active: 'green',
      paused: 'orange',
      disabled: 'red',
      testing: 'blue',
      draft: 'default',
      archived: 'gray',
      running: 'green',
      starting: 'blue',
      stopping: 'orange',
      stopped: 'red',
      error: 'red',
    };
    return colorMap[status] || 'default';
  };

  // 信号类型颜色
  const getSignalColor = (signal: string) => {
    const colorMap: Record<string, string> = {
      buy: '#52c41a',
      sell: '#ff4d4f',
      hold: '#faad14',
    };
    return colorMap[signal.toLowerCase()] || '#1890ff';
  };

  // 信号表格列配置
  const signalColumns = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (value: string) => formatDateTime(value),
    },
    {
      title: '标的',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 100,
    },
    {
      title: '信号',
      dataIndex: 'signal',
      key: 'signal',
      width: 80,
      render: (signal: string) => (
        <Tag color={getSignalColor(signal)}>
          {signal.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 100,
      render: (value: number) => (
        <Progress
          percent={value * 100}
          size="small"
          status={value > 0.7 ? 'success' : value > 0.5 ? 'normal' : 'exception'}
          showInfo={false}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          executed: { color: 'success', text: '已执行' },
          pending: { color: 'processing', text: '待执行' },
          cancelled: { color: 'error', text: '已取消' },
          failed: { color: 'error', text: '执行失败' },
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Badge status={config.color as any} text={config.text} />;
      },
    },
  ];

  if (!execution) {
    return (
      <Card>
        <Spin spinning={loading}>
          <Empty description="暂无执行数据" />
        </Spin>
      </Card>
    );
  }

  return (
    <div className="strategy-monitor">
      <Row gutter={[16, 16]}>
        {/* 策略状态概览 */}
        <Col span={24}>
          <Card
            title={
              <Space>
                <Title level={4} style={{ margin: 0 }}>
                  策略监控 - {execution.strategyName}
                </Title>
                <Tag color={getStatusColor(execution.status)}>
                  {execution.status.toUpperCase()}
                </Tag>
                <Switch
                  checkedChildren="自动刷新"
                  unCheckedChildren="手动刷新"
                  checked={autoRefresh}
                  onChange={setAutoRefresh}
                />
              </Space>
            }
            extra={
              <Space>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={fetchExecutionData}
                  loading={loading}
                >
                  刷新
                </Button>
                {onClose && (
                  <Button onClick={onClose}>关闭</Button>
                )}
              </Space>
            }
          >
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="总收益率"
                  value={execution.performance?.totalReturn || 0}
                  precision={2}
                  suffix="%"
                  valueStyle={{
                    color: (execution.performance?.totalReturn || 0) >= 0 ? '#3f8600' : '#cf1322',
                  }}
                  prefix={
                    (execution.performance?.totalReturn || 0) >= 0 ? 
                    <ArrowUpOutlined /> : <ArrowDownOutlined />
                  }
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="今日收益"
                  value={execution.performance?.dailyReturn || 0}
                  precision={2}
                  suffix="%"
                  valueStyle={{
                    color: (execution.performance?.dailyReturn || 0) >= 0 ? '#3f8600' : '#cf1322',
                  }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="最大回撤"
                  value={Math.abs(execution.performance?.maxDrawdown || 0)}
                  precision={2}
                  suffix="%"
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="夏普比率"
                  value={execution.performance?.sharpeRatio || 0}
                  precision={3}
                  valueStyle={{
                    color: (execution.performance?.sharpeRatio || 0) > 1 ? '#3f8600' : '#fa8c16',
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 实时收益曲线 */}
        <Col span={16}>
          <Card title="实时收益曲线" size="small">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {realtimeData.length > 0 ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
                    {((realtimeData[realtimeData.length - 1]?.return || 0) * 100).toFixed(2)}%
                  </div>
                  <div style={{ color: '#8c8c8c' }}>
                    当前收益率
                  </div>
                  <div style={{ marginTop: 16, fontSize: 12, color: '#8c8c8c' }}>
                    数据点: {realtimeData.length}
                  </div>
                </div>
              ) : (
                <Empty description="暂无收益数据" />
              )}
            </div>
          </Card>
        </Col>

        {/* 风险指标 */}
        <Col span={8}>
          <Card title="风险监控" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">持仓集中度</Text>
                <Progress
                  percent={(execution.risk?.concentration || 0) * 100}
                  status={(execution.risk?.concentration || 0) > 0.3 ? 'exception' : 'normal'}
                />
              </div>
              <div>
                <Text type="secondary">杠杆倍数</Text>
                <Progress
                  percent={(execution.risk?.leverage || 0) * 20}
                  status={(execution.risk?.leverage || 0) > 3 ? 'exception' : 'normal'}
                />
              </div>
              <div>
                <Text type="secondary">日内回撤</Text>
                <Progress
                  percent={Math.abs(execution.risk?.intradayDrawdown || 0) * 100}
                  status={Math.abs(execution.risk?.intradayDrawdown || 0) > 0.05 ? 'exception' : 'normal'}
                />
              </div>
              <Alert
                message="风险提示"
                description={execution.risk?.warning || "当前风险水平正常"}
                type={execution.risk?.level === 'high' ? 'error' : 'info'}
                showIcon
                icon={<WarningOutlined />}
              />
            </Space>
          </Card>
        </Col>

        {/* 最近信号 */}
        <Col span={24}>
          <Card title="最近信号" size="small">
            <Table
              columns={signalColumns}
              dataSource={signals}
              rowKey="id"
              size="small"
              pagination={{
                size: 'small',
                pageSize: 10,
                showSizeChanger: false,
                showQuickJumper: true,
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>

        {/* 执行日志 */}
        <Col span={24}>
          <Card title="执行日志" size="small">
            <Timeline mode="left" style={{ maxHeight: 300, overflow: 'auto' }}>
              {logs.map((log) => (
                <Timeline.Item
                  key={log.id}
                  color={log.level === 'error' ? 'red' : log.level === 'warning' ? 'orange' : 'blue'}
                  dot={
                    log.level === 'error' ? <WarningOutlined /> :
                    log.level === 'info' ? <CheckCircleOutlined /> :
                    <ClockCircleOutlined />
                  }
                >
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {formatDateTime(log.timestamp)}
                    </Text>
                    <br />
                    <Text>{log.message}</Text>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StrategyMonitor;