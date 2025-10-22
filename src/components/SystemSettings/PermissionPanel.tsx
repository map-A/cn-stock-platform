/**
 * 权限管理面板组件
 * 
 * 功能特性:
 * - 用户角色管理
 * - 权限配置
 * - 访问控制
 * - 操作审计
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  Button,
  Space,
  message,
  Modal,
  Tag,
  Typography,
  Checkbox,
  Tabs,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  UserOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons';
import {
  getUserPermissionConfigs,
  updateUserPermissionConfig,
} from '@/services/system';
import type { UserPermissionConfig } from '@/types/system';

const { Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const PermissionPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<UserPermissionConfig[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserPermissionConfig | null>(null);
  const [form] = Form.useForm();

  // 模块权限定义
  const modulePermissions = [
    {
      module: 'market_data',
      name: '市场数据',
      actions: [
        { key: 'view', name: '查看' },
        { key: 'export', name: '导出' },
        { key: 'real_time', name: '实时数据' },
      ],
    },
    {
      module: 'portfolio',
      name: '投资组合',
      actions: [
        { key: 'view', name: '查看' },
        { key: 'edit', name: '编辑' },
        { key: 'delete', name: '删除' },
        { key: 'export', name: '导出' },
      ],
    },
    {
      module: 'trading',
      name: '交易管理',
      actions: [
        { key: 'view', name: '查看' },
        { key: 'place_order', name: '下单' },
        { key: 'cancel_order', name: '撤单' },
        { key: 'modify_order', name: '改单' },
      ],
    },
    {
      module: 'strategy',
      name: '策略管理',
      actions: [
        { key: 'view', name: '查看' },
        { key: 'create', name: '创建' },
        { key: 'edit', name: '编辑' },
        { key: 'delete', name: '删除' },
        { key: 'backtest', name: '回测' },
      ],
    },
    {
      module: 'risk',
      name: '风险管理',
      actions: [
        { key: 'view', name: '查看' },
        { key: 'configure', name: '配置' },
        { key: 'override', name: '覆盖' },
      ],
    },
    {
      module: 'system',
      name: '系统设置',
      actions: [
        { key: 'view', name: '查看' },
        { key: 'configure', name: '配置' },
        { key: 'user_management', name: '用户管理' },
      ],
    },
  ];

  // 加载权限配置
  const loadPermissions = async () => {
    try {
      setLoading(true);
      const data = await getUserPermissionConfigs();
      setPermissions(data);
    } catch (error) {
      console.error('加载权限配置失败:', error);
      message.error('加载权限配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  // 编辑角色权限
  const handleEditRole = (role: UserPermissionConfig) => {
    setCurrentRole(role);
    form.setFieldsValue({
      roleName: role.roleName,
      permissions: role.permissions.reduce((acc, perm) => {
        acc[perm.module] = perm.actions;
        return acc;
      }, {} as Record<string, string[]>),
      restrictions: role.restrictions,
    });
    setEditModalVisible(true);
  };

  // 保存角色权限
  const handleSaveRole = async (values: any) => {
    if (!currentRole) return;

    try {
      const updatedRole: UserPermissionConfig = {
        ...currentRole,
        roleName: values.roleName,
        permissions: Object.entries(values.permissions || {}).map(([module, actions]) => ({
          module,
          actions: actions as string[],
        })),
        restrictions: values.restrictions,
      };

      await updateUserPermissionConfig(currentRole.roleId, updatedRole);
      message.success('角色权限更新成功');
      setEditModalVisible(false);
      loadPermissions();
    } catch (error) {
      console.error('更新角色权限失败:', error);
      message.error('更新角色权限失败');
    }
  };

  // 角色权限表格
  const RolePermissionsTable = () => {
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
        render: (name: string) => (
          <Space>
            <UserOutlined />
            <Text strong>{name}</Text>
          </Space>
        ),
      },
      {
        title: '权限模块',
        dataIndex: 'permissions',
        key: 'permissions',
        render: (permissions: any[]) => (
          <Space wrap>
            {permissions.map(perm => (
              <Tag key={perm.module} color="blue">
                {modulePermissions.find(m => m.module === perm.module)?.name || perm.module}
              </Tag>
            ))}
          </Space>
        ),
      },
      {
        title: '限制',
        dataIndex: 'restrictions',
        key: 'restrictions',
        render: (restrictions: any) => (
          <Space direction="vertical" size="small">
            <Text style={{ fontSize: '12px' }}>
              最大会话: {restrictions.maxConcurrentSessions}
            </Text>
            {restrictions.maxOrderAmount && (
              <Text style={{ fontSize: '12px' }}>
                最大订单: ¥{restrictions.maxOrderAmount.toLocaleString()}
              </Text>
            )}
          </Space>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: UserPermissionConfig) => (
          <Space>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditRole(record)}
            >
              编辑
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={permissions}
        rowKey="roleId"
        loading={loading}
        pagination={false}
      />
    );
  };

  // 权限配置表单
  const PermissionConfigForm = () => (
    <Form form={form} onFinish={handleSaveRole} layout="vertical">
      <Form.Item
        name="roleName"
        label="角色名称"
        rules={[{ required: true, message: '请输入角色名称' }]}
      >
        <Input placeholder="输入角色名称" />
      </Form.Item>

      <Card title="模块权限" size="small" style={{ marginBottom: 16 }}>
        {modulePermissions.map(module => (
          <Card key={module.module} type="inner" title={module.name} size="small" style={{ marginBottom: 8 }}>
            <Form.Item
              name={['permissions', module.module]}
              style={{ marginBottom: 0 }}
            >
              <Checkbox.Group>
                <Row>
                  {module.actions.map(action => (
                    <Col span={6} key={action.key}>
                      <Checkbox value={action.key}>
                        {action.name}
                      </Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Card>
        ))}
      </Card>

      <Card title="访问限制" size="small">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['restrictions', 'maxConcurrentSessions']}
              label="最大并发会话数"
            >
              <InputNumber min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['restrictions', 'maxOrderAmount']}
              label="最大单笔订单金额"
            >
              <InputNumber 
                min={1000}
                max={10000000}
                style={{ width: '100%' }}
                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name={['restrictions', 'ipWhitelist']}
          label="IP白名单"
        >
          <Select
            mode="tags"
            placeholder="输入IP地址，支持CIDR格式"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['restrictions', 'allowedTradingHours', 'start']}
              label="允许交易开始时间"
            >
              <Input placeholder="09:30" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['restrictions', 'allowedTradingHours', 'end']}
              label="允许交易结束时间"
            >
              <Input placeholder="15:00" />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </Form>
  );

  return (
    <div>
      <Card
        title="角色权限管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            添加角色
          </Button>
        }
      >
        <RolePermissionsTable />
      </Card>

      {/* 编辑角色权限对话框 */}
      <Modal
        title={`编辑角色权限: ${currentRole?.roleName}`}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <PermissionConfigForm />
        
        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Space>
            <Button onClick={() => setEditModalVisible(false)}>
              取消
            </Button>
            <Button 
              type="primary" 
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
            >
              保存
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default PermissionPanel;