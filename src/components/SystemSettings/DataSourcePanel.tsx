/**
 * 数据源配置面板组件
 * 
 * 功能特性:
 * - 行情数据源配置
 * - 新闻数据源配置
 * - 基础数据源配置
 * - 数据源测试连接
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  Button,
  Space,
  message,
  Tabs,
  Row,
  Col,
  Table,
  Tag,
  Modal,
  List,
  Typography,
} from 'antd';
import {
  SaveOutlined,
  ApiOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import {
  getDataSourceConfig,
  updateDataSourceConfig,
} from '@/services/system';
import type { DataSourceConfig } from '@/types/system';

const { Option } = Select;
const { Text } = Typography;
const { TabPane } = Tabs;

const DataSourcePanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<DataSourceConfig | null>(null);
  const [form] = Form.useForm();
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  // 加载数据源配置
  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await getDataSourceConfig();
      setConfig(data);
      form.setFieldsValue(data);
    } catch (error) {
      console.error('加载数据源配置失败:', error);
      message.error('加载数据源配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // 保存配置
  const handleSave = async (values: DataSourceConfig) => {
    try {
      await updateDataSourceConfig(values);
      message.success('数据源配置保存成功');
      setConfig(values);
    } catch (error) {
      console.error('保存数据源配置失败:', error);
      message.error('保存数据源配置失败');
    }
  };

  // 测试数据源连接
  const handleTestConnection = async () => {
    // 模拟测试结果
    const mockResults = [
      { name: '主数据源', status: 'success', latency: 45, message: '连接正常' },
      { name: '备用数据源1', status: 'success', latency: 68, message: '连接正常' },
      { name: '备用数据源2', status: 'failed', latency: -1, message: '连接超时' },
    ];
    setTestResults(mockResults);
    setTestModalVisible(true);
  };

  // 行情数据源配置表单
  const MarketDataConfig = () => (
    <Card title="行情数据源配置">
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['marketData', 'primarySource']}
              label="主数据源"
              rules={[{ required: true, message: '请选择主数据源' }]}
            >
              <Select placeholder="选择主数据源">
                <Option value="tushare">Tushare</Option>
                <Option value="akshare">AKShare</Option>
                <Option value="eastmoney">东方财富</Option>
                <Option value="sina">新浪财经</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['marketData', 'refreshInterval']}
              label="刷新间隔(毫秒)"
            >
              <InputNumber
                min={100}
                max={10000}
                style={{ width: '100%' }}
                placeholder="1000"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name={['marketData', 'backupSources']}
          label="备用数据源"
        >
          <Select
            mode="multiple"
            placeholder="选择备用数据源"
            style={{ width: '100%' }}
          >
            <Option value="tushare">Tushare</Option>
            <Option value="akshare">AKShare</Option>
            <Option value="eastmoney">东方财富</Option>
            <Option value="sina">新浪财经</Option>
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['marketData', 'enableDataValidation']}
              label="启用数据验证"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['marketData', 'dataRetentionDays']}
              label="数据保留天数"
            >
              <InputNumber
                min={1}
                max={3650}
                style={{ width: '100%' }}
                placeholder="365"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  // 新闻数据源配置表单
  const NewsDataConfig = () => (
    <Card title="新闻数据源配置">
      <Form layout="vertical">
        <Form.Item
          name={['newsData', 'enabledSources']}
          label="启用的新闻源"
        >
          <Select
            mode="multiple"
            placeholder="选择新闻数据源"
            style={{ width: '100%' }}
          >
            <Option value="sina">新浪财经</Option>
            <Option value="eastmoney">东方财富</Option>
            <Option value="cnstock">中国证券网</Option>
            <Option value="stcn">证券时报</Option>
            <Option value="cs">中证网</Option>
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['newsData', 'updateInterval']}
              label="更新间隔(分钟)"
            >
              <InputNumber
                min={1}
                max={1440}
                style={{ width: '100%' }}
                placeholder="5"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['newsData', 'languagePreference']}
              label="语言偏好"
            >
              <Select
                mode="multiple"
                placeholder="选择语言"
                style={{ width: '100%' }}
              >
                <Option value="zh-CN">简体中文</Option>
                <Option value="zh-TW">繁体中文</Option>
                <Option value="en">English</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name={['newsData', 'keywordFilters']}
          label="关键词过滤"
        >
          <Select
            mode="tags"
            placeholder="输入关键词，回车添加"
            style={{ width: '100%' }}
          >
            <Option value="股票">股票</Option>
            <Option value="基金">基金</Option>
            <Option value="债券">债券</Option>
            <Option value="期货">期货</Option>
          </Select>
        </Form.Item>
      </Form>
    </Card>
  );

  // 基础数据源配置表单
  const FundamentalDataConfig = () => (
    <Card title="基础数据源配置">
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['fundamentalData', 'source']}
              label="数据源"
              rules={[{ required: true, message: '请选择数据源' }]}
            >
              <Select placeholder="选择基础数据源">
                <Option value="tushare">Tushare Pro</Option>
                <Option value="wind">Wind</Option>
                <Option value="choice">东方财富Choice</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['fundamentalData', 'updateSchedule']}
              label="更新计划(Cron)"
            >
              <Input placeholder="0 2 * * *" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={['fundamentalData', 'enableCache']}
              label="启用缓存"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['fundamentalData', 'cacheExpiryHours']}
              label="缓存过期时间(小时)"
            >
              <InputNumber
                min={1}
                max={168}
                style={{ width: '100%' }}
                placeholder="24"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );

  // 测试结果表格
  const TestResultsTable = () => {
    const columns = [
      {
        title: '数据源',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
          <Tag 
            color={status === 'success' ? 'green' : 'red'}
            icon={status === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          >
            {status === 'success' ? '连接成功' : '连接失败'}
          </Tag>
        ),
      },
      {
        title: '延迟',
        dataIndex: 'latency',
        key: 'latency',
        render: (latency: number) => latency > 0 ? `${latency}ms` : '-',
      },
      {
        title: '说明',
        dataIndex: 'message',
        key: 'message',
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={testResults}
        pagination={false}
        size="small"
      />
    );
  };

  return (
    <div>
      <Form
        form={form}
        onFinish={handleSave}
        layout="vertical"
      >
        <Tabs defaultActiveKey="market">
          <TabPane tab="行情数据" key="market">
            <MarketDataConfig />
          </TabPane>
          
          <TabPane tab="新闻数据" key="news">
            <NewsDataConfig />
          </TabPane>
          
          <TabPane tab="基础数据" key="fundamental">
            <FundamentalDataConfig />
          </TabPane>
        </Tabs>

        <div style={{ textAlign: 'right', marginTop: 24 }}>
          <Space>
            <Button onClick={loadConfig}>
              重置
            </Button>
            <Button 
              icon={<ApiOutlined />}
              onClick={handleTestConnection}
            >
              测试连接
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              保存配置
            </Button>
          </Space>
        </div>
      </Form>

      {/* 测试连接结果对话框 */}
      <Modal
        title="数据源连接测试"
        open={testModalVisible}
        onCancel={() => setTestModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setTestModalVisible(false)}>
            关闭
          </Button>,
        ]}
        width={600}
      >
        <TestResultsTable />
      </Modal>
    </div>
  );
};

export default DataSourcePanel;