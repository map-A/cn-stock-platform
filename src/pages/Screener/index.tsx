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
import { useNavigate, useIntl } from '@umijs/max';
import type { ColumnsType } from 'antd/es/table';
import styles from './index.less';

const { Option } = Select;

const Screener: React.FC = () => {
  const [form] = Form.useForm();
  const [saveForm] = Form.useForm();
  const navigate = useNavigate();
  const intl = useIntl();
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
      message.error(intl.formatMessage({ id: 'message.filterFailed' }));
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
        message.success(intl.formatMessage({ id: 'message.saveSuccess' }));
        setSaveModalVisible(false);
        saveForm.resetFields();
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'message.saveFailed' }));
      console.error(error);
    }
  };

  const handleExport = async () => {
    try {
      const filters = form.getFieldsValue();
      await screenerService.exportResults({ ...filters, page: 1, pageSize: 10000 });
      message.success(intl.formatMessage({ id: 'message.exportSuccess' }));
    } catch (error) {
      message.error(intl.formatMessage({ id: 'message.exportFailed' }));
      console.error(error);
    }
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  const columns: ColumnsType<ScreenerResult> = [
    {
      title: intl.formatMessage({ id: 'table.columns.symbol' }),
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
      title: intl.formatMessage({ id: 'table.columns.name' }),
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'table.columns.latestPrice' }),
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: intl.formatMessage({ id: 'table.columns.changePercent' }),
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
      title: intl.formatMessage({ id: 'table.columns.volume' }),
      dataIndex: 'volume',
      key: 'volume',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.volume - b.volume,
      render: (volume: number) => (volume / 10000).toFixed(2) + '万',
    },
    {
      title: intl.formatMessage({ id: 'table.columns.marketCap' }),
      dataIndex: 'marketCap',
      key: 'marketCap',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.marketCap - b.marketCap,
      render: (cap: number) => (cap / 100000000).toFixed(2) + '亿',
    },
    {
      title: intl.formatMessage({ id: 'table.columns.peRatio' }),
      dataIndex: 'peRatio',
      key: 'peRatio',
      width: 100,
      align: 'right',
      sorter: (a, b) => (a.peRatio || 0) - (b.peRatio || 0),
      render: (ratio?: number) => (ratio ? ratio.toFixed(2) : '-'),
    },
    {
      title: intl.formatMessage({ id: 'table.columns.pbRatio' }),
      dataIndex: 'pbRatio',
      key: 'pbRatio',
      width: 100,
      align: 'right',
      sorter: (a, b) => (a.pbRatio || 0) - (b.pbRatio || 0),
      render: (ratio?: number) => (ratio ? ratio.toFixed(2) : '-'),
    },
    {
      title: intl.formatMessage({ id: 'table.columns.dividendYield' }),
      dataIndex: 'dividendYield',
      key: 'dividendYield',
      width: 100,
      align: 'right',
      sorter: (a, b) => (a.dividendYield || 0) - (b.dividendYield || 0),
      render: (yield_?: number) => (yield_ ? yield_.toFixed(2) + '%' : '-'),
    },
    {
      title: intl.formatMessage({ id: 'table.columns.industry' }),
      dataIndex: 'industry',
      key: 'industry',
      width: 120,
      render: (industry: string) => <Tag>{industry}</Tag>,
    },
  ];

  return (
    <PageContainer title={intl.formatMessage({ id: 'pages.screener.title' })}>
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label={intl.formatMessage({ id: 'pages.screener.marketCapRange' })}>
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="marketCapMin" noStyle>
                    <InputNumber placeholder={intl.formatMessage({ id: 'pages.screener.min' })} style={{ width: '50%' }} min={0} />
                  </Form.Item>
                  <Form.Item name="marketCapMax" noStyle>
                    <InputNumber placeholder={intl.formatMessage({ id: 'pages.screener.max' })} style={{ width: '50%' }} min={0} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label={intl.formatMessage({ id: 'pages.screener.priceRange' })}>
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="priceMin" noStyle>
                    <InputNumber placeholder={intl.formatMessage({ id: 'pages.screener.min' })} style={{ width: '50%' }} min={0} />
                  </Form.Item>
                  <Form.Item name="priceMax" noStyle>
                    <InputNumber placeholder={intl.formatMessage({ id: 'pages.screener.max' })} style={{ width: '50%' }} min={0} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label={intl.formatMessage({ id: 'pages.screener.peRatioRange' })}>
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="peRatioMin" noStyle>
                    <InputNumber placeholder={intl.formatMessage({ id: 'pages.screener.min' })} style={{ width: '50%' }} min={0} />
                  </Form.Item>
                  <Form.Item name="peRatioMax" noStyle>
                    <InputNumber placeholder={intl.formatMessage({ id: 'pages.screener.max' })} style={{ width: '50%' }} min={0} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label={intl.formatMessage({ id: 'pages.screener.pbRatioRange' })}>
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="pbRatioMin" noStyle>
                    <InputNumber placeholder={intl.formatMessage({ id: 'pages.screener.min' })} style={{ width: '50%' }} min={0} />
                  </Form.Item>
                  <Form.Item name="pbRatioMax" noStyle>
                    <InputNumber placeholder={intl.formatMessage({ id: 'pages.screener.max' })} style={{ width: '50%' }} min={0} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label={intl.formatMessage({ id: 'pages.screener.changePercentRange' })}>
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="changePercentMin" noStyle>
                    <InputNumber placeholder={intl.formatMessage({ id: 'pages.screener.min' })} style={{ width: '50%' }} />
                  </Form.Item>
                  <Form.Item name="changePercentMax" noStyle>
                    <InputNumber placeholder={intl.formatMessage({ id: 'pages.screener.max' })} style={{ width: '50%' }} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label={intl.formatMessage({ id: 'pages.screener.dividendYieldRange' })}>
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="dividendYieldMin" noStyle>
                    <InputNumber placeholder={intl.formatMessage({ id: 'pages.screener.min' })} style={{ width: '50%' }} min={0} />
                  </Form.Item>
                  <Form.Item name="dividendYieldMax" noStyle>
                    <InputNumber placeholder={intl.formatMessage({ id: 'pages.screener.max' })} style={{ width: '50%' }} min={0} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="industries" label={intl.formatMessage({ id: 'table.columns.industry' })}>
                <Select mode="multiple" placeholder={intl.formatMessage({ id: 'pages.screener.selectIndustry' })} allowClear>
                  {industries.map((item) => (
                    <Option key={item.code} value={item.code}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="sectors" label={intl.formatMessage({ id: 'pages.screener.sector' })}>
                <Select mode="multiple" placeholder={intl.formatMessage({ id: 'pages.screener.selectSector' })} allowClear>
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
                  {intl.formatMessage({ id: 'button.search' })}
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  {intl.formatMessage({ id: 'button.reset' })}
                </Button>
                <Button
                  icon={<SaveOutlined />}
                  onClick={() => setSaveModalVisible(true)}
                  disabled={results.length === 0}
                >
                  {intl.formatMessage({ id: 'pages.screener.save' })}
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={results.length === 0}
                >
                  {intl.formatMessage({ id: 'button.export' })}
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
            showTotal: (total) => intl.formatMessage({ id: 'pages.screener.total' }, { total }),
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title={intl.formatMessage({ id: 'pages.screener.saveModal.title' })}
        open={saveModalVisible}
        onOk={handleSaveScreener}
        onCancel={() => {
          setSaveModalVisible(false);
          saveForm.resetFields();
        }}
        okText={intl.formatMessage({ id: 'button.save' })}
        cancelText={intl.formatMessage({ id: 'button.cancel' })}
      >
        <Form form={saveForm} layout="vertical">
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'pages.screener.saveModal.name' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'pages.screener.saveModal.nameRequired' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'pages.screener.saveModal.namePlaceholder' })} />
          </Form.Item>
          <Form.Item name="description" label={intl.formatMessage({ id: 'pages.screener.saveModal.description' })}>
            <Input.TextArea rows={3} placeholder={intl.formatMessage({ id: 'pages.screener.saveModal.descriptionPlaceholder' })} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Screener;
