import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  InputNumber,
  Select,
  Button,
  Table,
  Space,
  Tag,
  Modal,
  Input,
  message,
} from 'antd';
import {
  SearchOutlined,
  SaveOutlined,
  ReloadOutlined,
  DownloadOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import screenerService, { type ScreenerResult, type ScreenerFilter } from '@/services/screener';
import { useNavigate } from '@umijs/max';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

const { Option } = Select;

const Screener: React.FC = () => {
  const [form] = Form.useForm();
  const [saveForm] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScreenerResult[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [industries, setIndustries] = useState<{ code: string; name: string }[]>([]);
  const [sectors, setSectors] = useState<{ code: string; name: string }[]>([]);

  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    try {
      const [industriesRes, sectorsRes] = await Promise.all([
        screenerService.getIndustries(),
        screenerService.getSectors(),
      ]);

      if (industriesRes.success && industriesRes.data) {
        setIndustries(industriesRes.data);
      }
      if (sectorsRes.success && sectorsRes.data) {
        setSectors(sectorsRes.data);
      }
    } catch (error) {
      console.error('Failed to load metadata:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const filters: ScreenerFilter = {
        ...values,
      };

      const response = await screenerService.screenStocks({
        ...filters,
        page: currentPage,
        pageSize,
      });

      if (response.success && response.data) {
        setResults(response.data.list);
        setTotal(response.data.total);
      }
    } catch (error) {
      message.error('筛选失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setResults([]);
    setTotal(0);
    setCurrentPage(1);
  };

  const handleSaveScreener = async () => {
    try {
      const values = await saveForm.validateFields();
      const filters = form.getFieldsValue();

      const response = await screenerService.saveScreener({
        name: values.name,
        description: values.description,
        filters,
      });

      if (response.success) {
        message.success('保存成功');
        setSaveModalVisible(false);
        saveForm.resetFields();
      }
    } catch (error) {
      message.error('保存失败');
      console.error(error);
    }
  };

  const handleExport = async () => {
    try {
      const filters = form.getFieldsValue();
      await screenerService.exportResults({ ...filters, page: 1, pageSize: 10000 });
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
      console.error(error);
    }
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  const columns: ColumnsType<ScreenerResult> = [
    {
      title: '股票代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 120,
      fixed: 'left',
      render: (symbol: string) => (
        <a onClick={() => handleStockClick(symbol)}>
          <strong>{symbol}</strong>
        </a>
      ),
    },
    {
      title: '股票名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '最新价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.changePercent - b.changePercent,
      render: (percent: number) => (
        <Tag color={percent >= 0 ? 'success' : 'error'}>
          {percent >= 0 ? '+' : ''}
          {percent.toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.volume - b.volume,
      render: (volume: number) => (volume / 10000).toFixed(2) + '万',
    },
    {
      title: '市值',
      dataIndex: 'marketCap',
      key: 'marketCap',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.marketCap - b.marketCap,
      render: (cap: number) => (cap / 100000000).toFixed(2) + '亿',
    },
    {
      title: '市盈率',
      dataIndex: 'peRatio',
      key: 'peRatio',
      width: 100,
      align: 'right',
      sorter: (a, b) => (a.peRatio || 0) - (b.peRatio || 0),
      render: (ratio?: number) => (ratio ? ratio.toFixed(2) : '-'),
    },
    {
      title: '市净率',
      dataIndex: 'pbRatio',
      key: 'pbRatio',
      width: 100,
      align: 'right',
      sorter: (a, b) => (a.pbRatio || 0) - (b.pbRatio || 0),
      render: (ratio?: number) => (ratio ? ratio.toFixed(2) : '-'),
    },
    {
      title: '股息率',
      dataIndex: 'dividendYield',
      key: 'dividendYield',
      width: 100,
      align: 'right',
      sorter: (a, b) => (a.dividendYield || 0) - (b.dividendYield || 0),
      render: (yield_?: number) => (yield_ ? yield_.toFixed(2) + '%' : '-'),
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 120,
      render: (industry: string) => <Tag>{industry}</Tag>,
    },
  ];

  return (
    <PageContainer title="股票筛选器">
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="市值范围（亿元）">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="marketCapMin" noStyle>
                    <InputNumber placeholder="最小" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                  <Form.Item name="marketCapMax" noStyle>
                    <InputNumber placeholder="最大" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="价格范围（元）">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="priceMin" noStyle>
                    <InputNumber placeholder="最小" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                  <Form.Item name="priceMax" noStyle>
                    <InputNumber placeholder="最大" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="市盈率范围">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="peRatioMin" noStyle>
                    <InputNumber placeholder="最小" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                  <Form.Item name="peRatioMax" noStyle>
                    <InputNumber placeholder="最大" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="市净率范围">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="pbRatioMin" noStyle>
                    <InputNumber placeholder="最小" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                  <Form.Item name="pbRatioMax" noStyle>
                    <InputNumber placeholder="最大" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="涨跌幅范围（%）">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="changePercentMin" noStyle>
                    <InputNumber placeholder="最小" style={{ width: '50%' }} />
                  </Form.Item>
                  <Form.Item name="changePercentMax" noStyle>
                    <InputNumber placeholder="最大" style={{ width: '50%' }} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="股息率范围（%）">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="dividendYieldMin" noStyle>
                    <InputNumber placeholder="最小" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                  <Form.Item name="dividendYieldMax" noStyle>
                    <InputNumber placeholder="最大" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="industries" label="行业">
                <Select mode="multiple" placeholder="选择行业" allowClear>
                  {industries.map((item) => (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="sectors" label="板块">
                <Select mode="multiple" placeholder="选择板块" allowClear>
                  {sectors.map((item) => (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  开始筛选
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置条件
                </Button>
                <Button
                  icon={<SaveOutlined />}
                  onClick={() => setSaveModalVisible(true)}
                  disabled={results.length === 0}
                >
                  保存筛选
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={results.length === 0}
                >
                  导出结果
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={results}
          rowKey="symbol"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共筛选出 ${total} 只股票`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title="保存筛选条件"
        open={saveModalVisible}
        onOk={handleSaveScreener}
        onCancel={() => {
          setSaveModalVisible(false);
          saveForm.resetFields();
        }}
        okText="保存"
        cancelText="取消"
      >
        <Form form={saveForm} layout="vertical">
          <Form.Item
            name="name"
            label="筛选器名称"
            rules={[{ required: true, message: '请输入筛选器名称' }]}
          >
            <Input placeholder="例如：高股息蓝筹股" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="输入描述信息（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Screener;
