/**
 * 系统配置面板组件
 * 
 * 功能特性:
 * - 分类配置管理
 * - 配置参数编辑
 * - 配置验证
 * - 配置重置
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
  Tabs,
  Row,
  Col,
  Typography,
  Tooltip,
  Popconfirm,
} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  ReloadOutlined,
  QuestionCircleOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import {
  getSystemConfigCategories,
  getSystemConfigByCategory,
  updateSystemConfigs,
  resetSystemConfigs,
} from '@/services/system';
import type { SystemConfig, SystemConfigCategory } from '@/types/system';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;
const { TabPane } = Tabs;

const SystemConfigPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<SystemConfigCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 加载配置分类
  const loadCategories = async () => {
    try {
      const data = await getSystemConfigCategories();
      setCategories(data);
      if (data.length > 0 && !activeCategory) {
        setActiveCategory(data[0].category);
      }
    } catch (error) {
      console.error('加载配置分类失败:', error);
      message.error('加载配置分类失败');
    }
  };

  // 加载指定分类的配置
  const loadCategoryConfigs = async (category: string) => {
    try {
      setLoading(true);
      const data = await getSystemConfigByCategory(category);
      setConfigs(data);
    } catch (error) {
      console.error('加载配置失败:', error);
      message.error('加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      loadCategoryConfigs(activeCategory);
    }
  }, [activeCategory]);

  // 编辑配置
  const handleEditConfig = (config: SystemConfig) => {
    setEditingConfig(config);
    form.setFieldsValue({
      key: config.key,
      value: config.value,
      description: config.description,
    });
    setEditModalVisible(true);
  };

  // 保存配置
  const handleSaveConfig = async (values: any) => {
    if (!editingConfig) return;

    try {
      await updateSystemConfigs({
        configs: [{
          key: editingConfig.key,
          value: values.value,
        }],
        comment: '系统配置更新',
      });
      message.success('配置更新成功');
      setEditModalVisible(false);
      loadCategoryConfigs(activeCategory);
    } catch (error) {
      console.error('更新配置失败:', error);
      message.error('更新配置失败');
    }
  };

  // 重置配置
  const handleResetConfig = async (config: SystemConfig) => {
    try {
      await resetSystemConfigs([config.key]);
      message.success('配置重置成功');
      loadCategoryConfigs(activeCategory);
    } catch (error) {
      console.error('重置配置失败:', error);
      message.error('重置配置失败');
    }
  };

  // 渲染配置值
  const renderConfigValue = (config: SystemConfig) => {
    switch (config.dataType) {
      case 'boolean':
        return <Switch checked={config.value} disabled />;
      case 'number':
        return <Text code>{config.value}</Text>;
      case 'array':
      case 'object':
        return <Text code>{JSON.stringify(config.value)}</Text>;
      default:
        return <Text>{config.value}</Text>;
    }
  };

  // 渲染编辑表单控件
  const renderEditControl = (config: SystemConfig) => {
    switch (config.dataType) {
      case 'boolean':
        return <Switch />;
      case 'number':
        return <InputNumber style={{ width: '100%' }} />;
      case 'array':
      case 'object':
        return (
          <TextArea 
            rows={4}
            placeholder="请输入JSON格式数据"
          />
        );
      default:
        return <Input />;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '配置项',
      dataIndex: 'key',
      key: 'key',
      width: 200,
      render: (key: string, record: SystemConfig) => (
        <Space direction="vertical" size="small">
          <Text strong>{key}</Text>
          {record.isRequired && (
            <Text type="danger" style={{ fontSize: '12px' }}>必填项</Text>
          )}
        </Space>
      ),
    },
    {
      title: '当前值',
      dataIndex: 'value',
      key: 'value',
      width: 250,
      render: (_: any, record: SystemConfig) => renderConfigValue(record),
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 150,
      render: (defaultValue: any) => (
        <Text type="secondary" code>{String(defaultValue)}</Text>
      ),
    },
    {
      title: (
        <Space>
          描述
          <Tooltip title="配置项说明">
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'description',
      key: 'description',
      ellipsis: { showTitle: false },
      render: (description: string) => (
        <Tooltip title={description}>
          <Text>{description}</Text>
        </Tooltip>
      ),
    },
    {
      title: '最后修改',
      dataIndex: 'lastModified',
      key: 'lastModified',
      width: 120,
      render: (lastModified: string, record: SystemConfig) => (
        <Space direction="vertical" size="small">
          <Text style={{ fontSize: '12px' }}>
            {new Date(lastModified).toLocaleString()}
          </Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {record.modifiedBy}
          </Text>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: SystemConfig) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditConfig(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认重置到默认值？"
            onConfirm={() => handleResetConfig(record)}
          >
            <Button
              type="link"
              size="small"
              icon={<UndoOutlined />}
              danger
            >
              重置
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Tabs 
          activeKey={activeCategory} 
          onChange={setActiveCategory}
          tabPosition="left"
        >
          {categories.map(category => (
            <TabPane
              tab={
                <Space>
                  {category.icon && <span>{category.icon}</span>}
                  <span>{category.name}</span>
                </Space>
              }
              key={category.category}
            >
              <Card 
                title={category.name}
                extra={
                  <Button 
                    icon={<ReloadOutlined />}
                    onClick={() => loadCategoryConfigs(activeCategory)}
                  >
                    刷新
                  </Button>
                }
              >
                <Text type="secondary">{category.description}</Text>
                
                <Table
                  columns={columns}
                  dataSource={configs}
                  rowKey="id"
                  loading={loading}
                  pagination={false}
                  style={{ marginTop: 16 }}
                  size="small"
                />
              </Card>
            </TabPane>
          ))}
        </Tabs>
      </Card>

      {/* 编辑配置对话框 */}
      <Modal
        title={`编辑配置: ${editingConfig?.key}`}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        {editingConfig && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveConfig}
          >
            <Form.Item
              label="配置项"
              name="key"
            >
              <Input disabled />
            </Form.Item>
            
            <Form.Item
              label="描述"
              name="description"
            >
              <Input disabled />
            </Form.Item>
            
            <Form.Item
              label="配置值"
              name="value"
              rules={[
                { required: editingConfig.isRequired, message: '请输入配置值' },
              ]}
            >
              {renderEditControl(editingConfig)}
            </Form.Item>
            
            {editingConfig.validationRule && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                验证规则: {editingConfig.validationRule}
              </Text>
            )}
            
            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Space>
                <Button onClick={() => setEditModalVisible(false)}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  保存
                </Button>
              </Space>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default SystemConfigPanel;