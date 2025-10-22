/**
 * 任务管理页面
 */
import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Tooltip, Progress, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import {
  PlusOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import styles from './index.less';

const { RangePicker } = DatePicker;

interface Task {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  schedule: string;
  nextRun: string;
  lastRun: string;
  createTime: string;
}

const TaskManagementPage: React.FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟任务数据
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: 'Daily Data Sync',
      type: 'data_sync',
      status: 'running',
      progress: 65,
      schedule: '0 0 * * *',
      nextRun: '2024-10-23 00:00:00',
      lastRun: '2024-10-22 00:00:00',
      createTime: '2024-10-01',
    },
    {
      id: '2',
      name: 'Strategy Backtest',
      type: 'backtest',
      status: 'completed',
      progress: 100,
      schedule: '0 2 * * 0',
      nextRun: '2024-10-27 02:00:00',
      lastRun: '2024-10-20 02:00:00',
      createTime: '2024-09-15',
    },
    {
      id: '3',
      name: 'Risk Assessment',
      type: 'risk_check',
      status: 'pending',
      progress: 0,
      schedule: '0 */6 * * *',
      nextRun: '2024-10-22 12:00:00',
      lastRun: '2024-10-22 06:00:00',
      createTime: '2024-10-10',
    },
  ]);

  const statusMap: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
    pending: {
      color: 'default',
      text: intl.formatMessage({ id: 'task.status.pending', defaultMessage: 'Pending' }),
      icon: <ClockCircleOutlined />,
    },
    running: {
      color: 'processing',
      text: intl.formatMessage({ id: 'task.status.running', defaultMessage: 'Running' }),
      icon: <PlayCircleOutlined />,
    },
    completed: {
      color: 'success',
      text: intl.formatMessage({ id: 'task.status.completed', defaultMessage: 'Completed' }),
      icon: <CheckCircleOutlined />,
    },
    failed: {
      color: 'error',
      text: intl.formatMessage({ id: 'task.status.failed', defaultMessage: 'Failed' }),
      icon: <CloseCircleOutlined />,
    },
    paused: {
      color: 'warning',
      text: intl.formatMessage({ id: 'task.status.paused', defaultMessage: 'Paused' }),
      icon: <PauseCircleOutlined />,
    },
  };

  const typeMap: Record<string, string> = {
    data_sync: intl.formatMessage({ id: 'task.type.dataSync', defaultMessage: 'Data Sync' }),
    backtest: intl.formatMessage({ id: 'task.type.backtest', defaultMessage: 'Backtest' }),
    risk_check: intl.formatMessage({ id: 'task.type.riskCheck', defaultMessage: 'Risk Check' }),
    report: intl.formatMessage({ id: 'task.type.report', defaultMessage: 'Report Generation' }),
    notification: intl.formatMessage({ id: 'task.type.notification', defaultMessage: 'Notification' }),
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'task.name', defaultMessage: 'Task Name' }),
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: intl.formatMessage({ id: 'task.type', defaultMessage: 'Type' }),
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => <Tag color="blue">{typeMap[type] || type}</Tag>,
    },
    {
      title: intl.formatMessage({ id: 'task.status', defaultMessage: 'Status' }),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusInfo = statusMap[status];
        return (
          <Tag icon={statusInfo.icon} color={statusInfo.color}>
            {statusInfo.text}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'task.progress', defaultMessage: 'Progress' }),
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress: number) => <Progress percent={progress} size="small" />,
    },
    {
      title: intl.formatMessage({ id: 'task.schedule', defaultMessage: 'Schedule' }),
      dataIndex: 'schedule',
      key: 'schedule',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'task.nextRun', defaultMessage: 'Next Run' }),
      dataIndex: 'nextRun',
      key: 'nextRun',
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'task.lastRun', defaultMessage: 'Last Run' }),
      dataIndex: 'lastRun',
      key: 'lastRun',
      width: 180,
    },
    {
      title: intl.formatMessage({ id: 'common.actions', defaultMessage: 'Actions' }),
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
      render: (_, record: Task) => (
        <Space size="small">
          {record.status === 'paused' || record.status === 'pending' ? (
            <Tooltip title={intl.formatMessage({ id: 'task.run', defaultMessage: 'Run' })}>
              <Button type="link" size="small" icon={<PlayCircleOutlined />} />
            </Tooltip>
          ) : (
            <Tooltip title={intl.formatMessage({ id: 'task.pause', defaultMessage: 'Pause' })}>
              <Button type="link" size="small" icon={<PauseCircleOutlined />} />
            </Tooltip>
          )}
          <Tooltip title={intl.formatMessage({ id: 'task.restart', defaultMessage: 'Restart' })}>
            <Button type="link" size="small" icon={<ReloadOutlined />} />
          </Tooltip>
          <Tooltip title={intl.formatMessage({ id: 'common.delete', defaultMessage: 'Delete' })}>
            <Button type="link" danger size="small" icon={<DeleteOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleCreateTask = () => {
    form.validateFields().then((values) => {
      console.log('Create task:', values);
      message.success(intl.formatMessage({ id: 'task.createSuccess', defaultMessage: 'Task created successfully' }));
      setCreateModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <div className={styles.taskPage}>
      <Card
        title={intl.formatMessage({ id: 'task.management', defaultMessage: 'Task Management' })}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            {intl.formatMessage({ id: 'task.create', defaultMessage: 'Create Task' })}
          </Button>
        }
      >
        <Table
          dataSource={tasks}
          columns={columns}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
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

      {/* 创建任务模态框 */}
      <Modal
        title={intl.formatMessage({ id: 'task.createNew', defaultMessage: 'Create New Task' })}
        open={createModalVisible}
        onOk={handleCreateTask}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'task.name', defaultMessage: 'Task Name' })}
            rules={[{ required: true }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'task.namePlaceholder', defaultMessage: 'Enter task name' })} />
          </Form.Item>
          <Form.Item
            name="type"
            label={intl.formatMessage({ id: 'task.type', defaultMessage: 'Task Type' })}
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="data_sync">{typeMap.data_sync}</Select.Option>
              <Select.Option value="backtest">{typeMap.backtest}</Select.Option>
              <Select.Option value="risk_check">{typeMap.risk_check}</Select.Option>
              <Select.Option value="report">{typeMap.report}</Select.Option>
              <Select.Option value="notification">{typeMap.notification}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="schedule"
            label={intl.formatMessage({ id: 'task.schedule', defaultMessage: 'Schedule (Cron)' })}
            rules={[{ required: true }]}
          >
            <Input placeholder="0 0 * * *" />
          </Form.Item>
          <Form.Item
            name="timeRange"
            label={intl.formatMessage({ id: 'task.validPeriod', defaultMessage: 'Valid Period' })}
          >
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagementPage;
