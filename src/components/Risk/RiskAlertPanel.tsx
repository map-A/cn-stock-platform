/**
 * 风险预警面板组件
 * 
 * 功能特性:
 * - 实时风险预警展示
 * - 预警级别分类和筛选
 * - 预警处理状态管理
 * - 预警历史记录查询
 * 
 * 依据文档: MODULE_PROMPTS.md - 风险管理模块
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Alert,
  Modal,
  Descriptions,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Statistic,
  Badge,
  Tooltip,
  message,
} from 'antd';
import {
  AlertOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import type { RiskAlert } from '@/types/risk';
import './RiskAlertPanel.less';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export interface RiskAlertPanelProps {
  alerts: RiskAlert[];
  onRefresh: () => void;
  loading?: boolean;
}

/**
 * 风险预警面板组件
 */
const RiskAlertPanel: React.FC<RiskAlertPanelProps> = ({
  alerts,
  onRefresh,
  loading = false,
}) => {
  const [filteredAlerts, setFilteredAlerts] = useState<RiskAlert[]>(alerts);
  const [selectedAlert, setSelectedAlert] = useState<RiskAlert | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [handleModalVisible, setHandleModalVisible] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [handleNote, setHandleNote] = useState<string>('');

  /**
   * 预警级别配置
   */
  const alertLevelConfig = {
    critical: { color: '#ff4d4f', text: '严重', icon: <ExclamationCircleOutlined /> },
    high: { color: '#ff7a45', text: '高风险', icon: <AlertOutlined /> },
    medium: { color: '#faad14', text: '中风险', icon: <InfoCircleOutlined /> },
    low: { color: '#52c41a', text: '低风险', icon: <CheckCircleOutlined /> },
  };

  /**
   * 预警状态配置
   */
  const alertStatusConfig = {
    active: { color: '#ff4d4f', text: '活跃' },
    handled: { color: '#52c41a', text: '已处理' },
    ignored: { color: '#d9d9d9', text: '已忽略' },
  };

  /**
   * 预警类型配置
   */
  const alertTypeConfig = {
    market: { text: '市场风险', color: '#1890ff' },
    position: { text: '持仓风险', color: '#722ed1' },
    liquidity: { text: '流动性风险', color: '#13c2c2' },
    operational: { text: '操作风险', color: '#fa8c16' },
  };

  /**
   * 应用筛选条件
   */
  useEffect(() => {
    let filtered = [...alerts];

    if (filterLevel !== 'all') {
      filtered = filtered.filter(alert => alert.level === filterLevel);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(alert => alert.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(alert => alert.type === filterType);
    }

    setFilteredAlerts(filtered);
  }, [alerts, filterLevel, filterStatus, filterType]);

  /**
   * 处理预警
   */
  const handleAlert = async (alertId: string, action: 'handle' | 'ignore') => {
    try {
      // TODO: 调用API处理预警
      console.log(`处理预警 ${alertId}, 动作: ${action}, 备注: ${handleNote}`);
      
      message.success(`预警已${action === 'handle' ? '处理' : '忽略'}`);
      setHandleModalVisible(false);
      setHandleNote('');
      onRefresh();
    } catch (error) {
      message.error('操作失败');
    }
  };

  /**
   * 查看预警详情
   */
  const viewAlertDetail = (alert: RiskAlert) => {
    setSelectedAlert(alert);
    setDetailModalVisible(true);
  };

  /**
   * 打开处理弹窗
   */
  const openHandleModal = (alert: RiskAlert) => {
    setSelectedAlert(alert);
    setHandleModalVisible(true);
  };

  /**
   * 重置筛选条件
   */
  const resetFilters = () => {
    setFilterLevel('all');
    setFilterStatus('all');
    setFilterType('all');
  };

  /**
   * 表格列配置
   */
  const columns: ColumnsType<RiskAlert> = [
    {
      title: '时间',
      dataIndex: 'triggeredAt',
      key: 'time',
      width: 120,
      render: (time: string) => dayjs(time).format('MM-DD HH:mm'),
      sorter: (a, b) => dayjs(a.triggeredAt).unix() - dayjs(b.triggeredAt).unix(),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: keyof typeof alertLevelConfig) => {
        const config = alertLevelConfig[level];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
      filters: Object.entries(alertLevelConfig).map(([key, config]) => ({
        text: config.text,
        value: key,
      })),
      onFilter: (value, record) => record.level === value,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: keyof typeof alertTypeConfig) => {
        const config = alertTypeConfig[type];
        return (
          <Tag color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '影响程度',
      dataIndex: 'impact',
      key: 'impact',
      width: 100,
      render: (impact: number) => (
        <span className={`impact-score impact-${Math.floor(impact / 25)}`}>
          {impact.toFixed(1)}%
        </span>
      ),
      sorter: (a, b) => a.impact - b.impact,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: keyof typeof alertStatusConfig) => {
        const config = alertStatusConfig[status];
        return (
          <Badge 
            color={config.color} 
            text={config.text}
          />
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => viewAlertDetail(record)}
            />
          </Tooltip>
          {record.status === 'active' && (
            <Tooltip title="处理预警">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => openHandleModal(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  /**
   * 计算统计数据
   */
  const getStatistics = () => {
    const total = alerts.length;
    const active = alerts.filter(alert => alert.status === 'active').length;
    const critical = alerts.filter(alert => alert.level === 'critical').length;
    const high = alerts.filter(alert => alert.level === 'high').length;

    return { total, active, critical, high };
  };

  const statistics = getStatistics();

  return (
    <div className="risk-alert-panel">
      {/* 统计信息 */}
      <Row gutter={16} className="alert-statistics">
        <Col span={6}>
          <Card>
            <Statistic
              title="总预警数"
              value={statistics.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃预警"
              value={statistics.active}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="严重预警"
              value={statistics.critical}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="高风险预警"
              value={statistics.high}
              valueStyle={{ color: '#ff7a45' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选控件 */}
      <Card className="filter-panel">
        <Row gutter={16} align="middle">
          <Col>
            <Space>
              <span>筛选条件:</span>
              <Select
                value={filterLevel}
                onChange={setFilterLevel}
                style={{ width: 120 }}
                placeholder="预警级别"
              >
                <Option value="all">全部级别</Option>
                {Object.entries(alertLevelConfig).map(([key, config]) => (
                  <Option key={key} value={key}>{config.text}</Option>
                ))}
              </Select>
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: 120 }}
                placeholder="预警状态"
              >
                <Option value="all">全部状态</Option>
                {Object.entries(alertStatusConfig).map(([key, config]) => (
                  <Option key={key} value={key}>{config.text}</Option>
                ))}
              </Select>
              <Select
                value={filterType}
                onChange={setFilterType}
                style={{ width: 120 }}
                placeholder="预警类型"
              >
                <Option value="all">全部类型</Option>
                {Object.entries(alertTypeConfig).map(([key, config]) => (
                  <Option key={key} value={key}>{config.text}</Option>
                ))}
              </Select>
              <Button onClick={resetFilters}>重置</Button>
              <Button 
                type="primary"
                icon={<ReloadOutlined />}
                onClick={onRefresh}
                loading={loading}
              >
                刷新
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 预警列表 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredAlerts}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          className="alert-table"
        />
      </Card>

      {/* 预警详情弹窗 */}
      <Modal
        title="预警详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedAlert && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="预警ID">
              {selectedAlert.id}
            </Descriptions.Item>
            <Descriptions.Item label="触发时间">
              {dayjs(selectedAlert.triggeredAt).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="预警级别">
              <Tag color={alertLevelConfig[selectedAlert.level].color}>
                {alertLevelConfig[selectedAlert.level].text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="预警类型">
              <Tag color={alertTypeConfig[selectedAlert.type].color}>
                {alertTypeConfig[selectedAlert.type].text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="预警标题">
              {selectedAlert.title}
            </Descriptions.Item>
            <Descriptions.Item label="详细描述">
              {selectedAlert.description}
            </Descriptions.Item>
            <Descriptions.Item label="影响程度">
              <span className={`impact-score impact-${Math.floor(selectedAlert.impact / 25)}`}>
                {selectedAlert.impact.toFixed(1)}%
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="当前状态">
              <Badge 
                color={alertStatusConfig[selectedAlert.status].color} 
                text={alertStatusConfig[selectedAlert.status].text}
              />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* 处理预警弹窗 */}
      <Modal
        title="处理预警"
        open={handleModalVisible}
        onCancel={() => setHandleModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setHandleModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="ignore" 
            onClick={() => selectedAlert && handleAlert(selectedAlert.id, 'ignore')}
          >
            忽略
          </Button>,
          <Button 
            key="handle" 
            type="primary"
            onClick={() => selectedAlert && handleAlert(selectedAlert.id, 'handle')}
          >
            标记已处理
          </Button>,
        ]}
      >
        <div>
          <p>处理预警: {selectedAlert?.title}</p>
          <TextArea
            rows={4}
            value={handleNote}
            onChange={(e) => setHandleNote(e.target.value)}
            placeholder="请输入处理备注..."
          />
        </div>
      </Modal>
    </div>
  );
};

export default RiskAlertPanel;