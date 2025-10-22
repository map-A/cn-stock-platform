/**
 * 任务调度面板组件
 * 
 * 功能特性:
 * - 任务调度管理
 * - 任务执行监控
 * - 任务历史记录
 * - 任务配置
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Space,
  message,
  Modal,
  Tag,
  Typography,
  Tabs,
  Row,
  Col,
  Progress,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SaveOutlined,
  HistoryOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import {
  getTaskSchedules,
  createTaskSchedule,
  updateTaskSchedule,
  deleteTaskSchedule,
  executeTask,
  getTaskExecutionHistory,
} from '@/services/system';
import type { TaskScheduleConfig, TaskExecution } from '@/types/system';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

const TaskSchedulePanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskScheduleConfig[]>([]);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskScheduleConfig | null>(null);
  const [executionHistory, setExecutionHistory] = useState<TaskExecution[]>([]);
  const [form] = Form.useForm();

  // 任务类型定义
  const taskTypes = [
    { value: 'data_sync', label: '数据同步', description: '同步外部数据源' },
    { value: 'report_generation', label: '报告生成', description: '定期生成分析报告' },
    { value: 'risk_check', label: '风险检查', description: '风险监控和告警' },
    { value: 'maintenance', label: '系统维护', description: '系统清理和维护' },
  ];

  // 加载任务列表
  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTaskSchedules();
      setTasks(data);
    } catch (error) {
      console.error('加载任务列表失败:', error);
      message.error('加载任务列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // 创建/编辑任务
  const handleSaveTask = async (values: any) => {
    try {
      if (currentTask) {
        // 编辑
        await updateTaskSchedule(currentTask.id, values);
        message.success('任务更新成功');
      } else {
        // 创建
        await createTaskSchedule(values);
        message.success('任务创建成功');
      }
      setTaskModalVisible(false);
      form.resetFields();
      setCurrentTask(null);
      loadTasks();
    } catch (error) {
      console.error('保存任务失败:', error);
      message.error('保存任务失败');
    }
  };

  // 删除任务
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTaskSchedule(id);
      message.success('任务删除成功');
      loadTasks();
    } catch (error) {
      console.error('删除任务失败:', error);
      message.error('删除任务失败');
    }
  };

  // 执行任务
  const handleExecuteTask = async (id: string) => {
    try {
      await executeTask(id);
      message.success('任务执行已启动');
      loadTasks();
    } catch (error) {
      console.error('执行任务失败:', error);
      message.error('执行任务失败');
    }
  };

  // 查看执行历史
  const handleViewHistory = async (task: TaskScheduleConfig) => {
    try {
      const data = await getTaskExecutionHistory(task.id);
      setExecutionHistory(data.items);
      setCurrentTask(task);
      setHistoryModalVisible(true);
    } catch (error) {
      console.error('加载执行历史失败:', error);
      message.error('加载执行历史失败');
    }
  };

  // 编辑任务
  const handleEditTask = (task: TaskScheduleConfig) => {
    setCurrentTask(task);
    form.setFieldsValue(task);
    setTaskModalVisible(true);
  };

  // 任务状态渲染
  const renderTaskStatus = (status: string) => {
    const statusConfig = {
      idle: { color: 'default', text: '空闲' },
      running: { color: 'processing', text: '运行中' },
      failed: { color: 'error', text: '失败' },
      completed: { color: 'success', text: '完成' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 任务列表表格
  const TasksTable = () => {
    const columns = [
      {
        title: '任务名称',
        dataIndex: 'name',
        key: 'name',
        render: (name: string, record: TaskScheduleConfig) => (
          <Space direction="vertical" size="small">
            <Text strong>{name}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.description}
            </Text>
          </Space>
        ),
      },
      {
        title: '类型',
        dataIndex: 'taskType',
        key: 'taskType',
        render: (type: string) => {
          const taskType = taskTypes.find(t => t.value === type);
          return (
            <Tooltip title={taskType?.description}>
              <Tag color="blue">{taskType?.label || type}</Tag>
            </Tooltip>
          );
        },
      },
      {
        title: '调度规则',
        dataIndex: 'schedule',
        key: 'schedule',
        render: (schedule: string) => <Text code>{schedule}</Text>,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: renderTaskStatus,
      },
      {
        title: '启用状态',
        dataIndex: 'enabled',
        key: 'enabled',
        render: (enabled: boolean) => (
          <Switch checked={enabled} disabled />
        ),
      },
      {
        title: '下次执行',
        dataIndex: 'nextExecution',
        key: 'nextExecution',
        render: (time: string) => (
          time ? new Date(time).toLocaleString() : '-'
        ),
      },
      {
        title: '最后执行',
        dataIndex: 'lastExecution',
        key: 'lastExecution',
        render: (time: string) => (
          time ? new Date(time).toLocaleString() : '-'
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: TaskScheduleConfig) => (
          <Space>
            <Button
              type="link"
              size="small"
              icon={<PlayCircleOutlined />}
              onClick={() => handleExecuteTask(record.id)}
              disabled={record.status === 'running'}
            >
              执行
            </Button>
            <Button
              type="link"
              size="small"
              icon={<HistoryOutlined />}
              onClick={() => handleViewHistory(record)}
            >
              历史
            </Button>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditTask(record)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确认删除此任务？"
              onConfirm={() => handleDeleteTask(record.id)}
            >
              <Button
                type="link"
                size="small"
                icon={<DeleteOutlined />}
                danger
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    );
  };

  // 执行历史表格
  const ExecutionHistoryTable = () => {
    const columns = [
      {
        title: '执行ID',
        dataIndex: 'id',
        key: 'id',
        render: (id: string) => <Text code>{id.slice(-8)}</Text>,
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (time: string) => new Date(time).toLocaleString(),
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        render: (time: string) => time ? new Date(time).toLocaleString() : '-',
      },
      {
        title: '耗时',
        dataIndex: 'duration',
        key: 'duration',
        render: (duration: number) => duration ? `${duration}s` : '-',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: renderTaskStatus,
      },
      {
        title: '错误信息',
        dataIndex: 'errorMessage',
        key: 'errorMessage',
        render: (error: string) => (
          error ? (
            <Tooltip title={error}>
              <Text type="danger" ellipsis style={{ maxWidth: 200 }}>
                {error}
              </Text>
            </Tooltip>
          ) : '-'
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={executionHistory}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        size="small"
      />
    );
  };

  return (
    <div>
      <Card
        title="任务调度管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentTask(null);
              form.resetFields();
              setTaskModalVisible(true);
            }}
          >
            创建任务
          </Button>
        }
      >
        <TasksTable />
      </Card>

      {/* 创建/编辑任务对话框 */}
      <Modal
        title={currentTask ? '编辑任务' : '创建任务'}
        open={taskModalVisible}
        onCancel={() => {
          setTaskModalVisible(false);
          setCurrentTask(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveTask}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="任务名称"
                rules={[{ required: true, message: '请输入任务名称' }]}
              >
                <Input placeholder="输入任务名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="taskType"
                label="任务类型"
                rules={[{ required: true, message: '请选择任务类型' }]}
              >
                <Select placeholder="选择任务类型">
                  {taskTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="任务描述"
          >
            <TextArea rows={2} placeholder="输入任务描述" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="schedule"
                label="调度规则(Cron)"
                rules={[{ required: true, message: '请输入Cron表达式' }]}
              >
                <Input placeholder="0 2 * * *" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="enabled"
                label="启用状态"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setTaskModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* 执行历史对话框 */}
      <Modal
        title={`执行历史: ${currentTask?.name}`}
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setHistoryModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        <ExecutionHistoryTable />
      </Modal>
    </div>
  );
};

export default TaskSchedulePanel;