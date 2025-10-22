/**
 * AI 策略管理页面
 */
import React, { useState } from 'react';
import { Card, Row, Col, Button, Table, Tag, Space, Statistic, Tooltip, message, Modal, Form, Input, Select } from 'antd';
import {
  PlusOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  BarChartOutlined,
  DeleteOutlined,
  ExperimentOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import styles from './index.less';

const { TextArea } = Input;

interface Strategy {
  id: string;
  name: string;
  type: string;
  status: 'draft' | 'testing' | 'active' | 'paused' | 'stopped';
  return: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  createTime: string;
}

const StrategyPage: React.FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟策略数据
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      name: 'MA Cross Strategy',
      type: 'trend_following',
      status: 'active',
      return: 15.6,
      sharpeRatio: 1.85,
      maxDrawdown: -8.5,
      winRate: 62.3,
      createTime: '2024-10-01',
    },
    {
      id: '2',
      name: 'Mean Reversion',
      type: 'mean_reversion',
      status: 'paused',
      return: 8.2,
      sharpeRatio: 1.32,
      maxDrawdown: -12.3,
      winRate: 58.1,
      createTime: '2024-09-15',
    },
  ]);

  const statusMap: Record<string, { color: string; text: string }> = {
    draft: { color: 'default', text: intl.formatMessage({ id: 'strategy.status.draft', defaultMessage: 'Draft' }) },
    testing: { color: 'processing', text: intl.formatMessage({ id: 'strategy.status.testing', defaultMessage: 'Testing' }) },
    active: { color: 'success', text: intl.formatMessage({ id: 'strategy.status.active', defaultMessage: 'Active' }) },
    paused: { color: 'warning', text: intl.formatMessage({ id: 'strategy.status.paused', defaultMessage: 'Paused' }) },
    stopped: { color: 'error', text: intl.formatMessage({ id: 'strategy.status.stopped', defaultMessage: 'Stopped' }) },
  };

  const typeMap: Record<string, string> = {
    trend_following: intl.formatMessage({ id: 'strategy.type.trend', defaultMessage: 'Trend Following' }),
    mean_reversion: intl.formatMessage({ id: 'strategy.type.meanReversion', defaultMessage: 'Mean Reversion' }),
    momentum: intl.formatMessage({ id: 'strategy.type.momentum', defaultMessage: 'Momentum' }),
    arbitrage: intl.formatMessage({ id: 'strategy.type.arbitrage', defaultMessage: 'Arbitrage' }),
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'strategy.name', defaultMessage: 'Strategy Name' }),
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'strategy.type', defaultMessage: 'Type' }),
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => <Tag color="blue">{typeMap[type] || type}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'strategy.status', defaultMessage: 'Status' }),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusInfo = statusMap[status] || { color: 'default', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'strategy.return', defaultMessage: 'Return (%)' }),
      dataIndex: 'return',
      key: 'return',
      width: 120,
      render: (value: number) => (
        <span style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {value >= 0 ? '+' : ''}{value.toFixed(2)}%
        </span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'strategy.sharpe', defaultMessage: 'Sharpe Ratio' }),
      dataIndex: 'sharpeRatio',
      key: 'sharpeRatio',
      width: 120,
      render: (value: number) => value.toFixed(2),
    },
    {
      title: intl.formatMessage({ id: 'strategy.maxDrawdown', defaultMessage: 'Max DD (%)' }),
      dataIndex: 'maxDrawdown',
      key: 'maxDrawdown',
      width: 120,
      render: (value: number) => (
        <span style={{ color: '#ff4d4f' }}>{value.toFixed(2)}%</span>
      ),
    },
    {
      title: intl.formatMessage({ id: 'strategy.winRate', defaultMessage: 'Win Rate (%)' }),
      dataIndex: 'winRate',
      key: 'winRate',
      width: 120,
      render: (value: number) => `${value.toFixed(1)}%`,
    },
    {
      title: intl.formatMessage({ id: 'common.actions', defaultMessage: 'Actions' }),
      key: 'actions',
      width: 200,
      render: (_, record: Strategy) => (
        <Space size="small">
          <Tooltip title={intl.formatMessage({ id: 'strategy.viewDetails', defaultMessage: 'View Details' })}>
            <Button type="link" size="small" icon={<BarChartOutlined />} />
          </Tooltip>
          {record.status === 'paused' ? (
            <Tooltip title={intl.formatMessage({ id: 'strategy.resume', defaultMessage: 'Resume' })}>
              <Button type="link" size="small" icon={<PlayCircleOutlined />} />
            </Tooltip>
          ) : (
            <Tooltip title={intl.formatMessage({ id: 'strategy.pause', defaultMessage: 'Pause' })}>
              <Button type="link" size="small" icon={<PauseCircleOutlined />} />
            </Tooltip>
          )}
          <Tooltip title={intl.formatMessage({ id: 'common.delete', defaultMessage: 'Delete' })}>
            <Button type="link" danger size="small" icon={<DeleteOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleCreateStrategy = () => {
    form.validateFields().then((values) => {
      console.log('Create strategy:', values);
      message.success(intl.formatMessage({ id: 'strategy.createSuccess', defaultMessage: 'Strategy created successfully' }));
      setCreateModalVisible(false);
      form.resetFields();
    });
  };

  // 统计数据
  const statistics = {
    total: strategies.length,
    active: strategies.filter(s => s.status === 'active').length,
    avgReturn: strategies.reduce((sum, s) => sum + s.return, 0) / strategies.length,
    avgSharpe: strategies.reduce((sum, s) => sum + s.sharpeRatio, 0) / strategies.length,
  };

  return (
    <div className={styles.strategyPage}>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'strategy.total', defaultMessage: 'Total Strategies' })}
              value={statistics.total}
              prefix={<ExperimentOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'strategy.activeCount', defaultMessage: 'Active' })}
              value={statistics.active}
              prefix={<RocketOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'strategy.avgReturn', defaultMessage: 'Avg Return' })}
              value={statistics.avgReturn}
              precision={2}
              suffix="%"
              valueStyle={{ color: statistics.avgReturn >= 0 ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title={intl.formatMessage({ id: 'strategy.avgSharpe', defaultMessage: 'Avg Sharpe' })}
              value={statistics.avgSharpe}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 策略列表 */}
      <Card
        title={intl.formatMessage({ id: 'strategy.list', defaultMessage: 'Strategy List' })}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            {intl.formatMessage({ id: 'strategy.create', defaultMessage: 'Create Strategy' })}
          </Button>
        }
      >
        <Table
          dataSource={strategies}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => intl.formatMessage(
              { id: 'common.totalItems', defaultMessage: 'Total {total} items' },
              { total }
            ),
          }}
        />
      </Card>

      {/* 创建策略模态框 */}
      <Modal
        title={intl.formatMessage({ id: 'strategy.createNew', defaultMessage: 'Create New Strategy' })}
        open={createModalVisible}
        onOk={handleCreateStrategy}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'strategy.name', defaultMessage: 'Strategy Name' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'common.required', defaultMessage: 'Required' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'strategy.namePlaceholder', defaultMessage: 'Enter strategy name' })} />
          </Form.Item>
          <Form.Item
            name="type"
            label={intl.formatMessage({ id: 'strategy.type', defaultMessage: 'Strategy Type' })}
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="trend_following">{typeMap.trend_following}</Select.Option>
              <Select.Option value="mean_reversion">{typeMap.mean_reversion}</Select.Option>
              <Select.Option value="momentum">{typeMap.momentum}</Select.Option>
              <Select.Option value="arbitrage">{typeMap.arbitrage}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label={intl.formatMessage({ id: 'common.description', defaultMessage: 'Description' })}
          >
            <TextArea rows={4} placeholder={intl.formatMessage({ id: 'strategy.descPlaceholder', defaultMessage: 'Enter strategy description' })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StrategyPage;
