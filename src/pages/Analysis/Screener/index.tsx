/**
 * 选股器页面
 */
import React, { useState } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  InputNumber,
  Button,
  Table,
  Space,
  Select,
  Divider,
  Typography,
  message,
  Modal,
  Input,
} from 'antd';
import {
  SearchOutlined,
  SaveOutlined,
  FolderOpenOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { history } from 'umi';
import {
  screenStock,
  saveScreenerCondition,
  getScreenerConditions,
  getIndustryList,
  getSectorList,
} from '@/services/analysis';
import { formatPrice, formatPercent, formatMarketCap, getPriceColor } from '@/utils/format';
import type { ScreenerParams, ScreenerResult } from '@/typings/analysis';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './index.less';

const { Title, Text } = Typography;
const { Option } = Select;

const Screener: React.FC = () => {
  const [form] = Form.useForm<ScreenerParams>();
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [conditionName, setConditionName] = useState('');

  // 获取筛选结果
  const { data: results, loading, run: runScreen } = useRequest(
    (params) => screenStock(params),
    { manual: true }
  );

  // 获取行业列表
  const { data: industries } = useRequest(() => getIndustryList());

  // 获取板块列表
  const { data: sectors } = useRequest(() => getSectorList());

  // 获取保存的条件
  const { data: savedConditions, refresh: refreshConditions } = useRequest(
    () => getScreenerConditions()
  );

  // 提交筛选
  const handleSubmit = () => {
    const values = form.getFieldsValue();
    runScreen(values);
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
  };

  // 保存筛选条件
  const handleSave = async () => {
    if (!conditionName.trim()) {
      message.error('请输入条件名称');
      return;
    }
    
    try {
      const values = form.getFieldsValue();
      await saveScreenerCondition(conditionName, values);
      message.success('保存成功');
      setSaveModalVisible(false);
      setConditionName('');
      refreshConditions();
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 加载保存的条件
  const handleLoadCondition = (condition: any) => {
    form.setFieldsValue(condition.params);
    message.success(`已加载条件: ${condition.name}`);
  };

  // 表格列定义
  const columns = [
    {
      title: '股票代码',
      dataIndex: 'symbol',
      width: 120,
      fixed: 'left' as const,
    },
    {
      title: '股票名称',
      dataIndex: 'name',
      width: 120,
      fixed: 'left' as const,
      render: (name: string, record: ScreenerResult) => (
        <a onClick={() => history.push(`/stock/${record.symbol}`)}>
          {name}
        </a>
      ),
    },
    {
      title: '最新价',
      dataIndex: 'price',
      width: 100,
      align: 'right' as const,
      render: (price: number) => `¥${formatPrice(price)}`,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      width: 100,
      align: 'right' as const,
      sorter: (a: ScreenerResult, b: ScreenerResult) => a.changePercent - b.changePercent,
      render: (percent: number) => (
        <Text style={{ color: getPriceColor(percent) }}>
          {formatPercent(percent)}
        </Text>
      ),
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      width: 120,
      align: 'right' as const,
      render: (vol: number) => `${(vol / 10000).toFixed(2)}万手`,
    },
    {
      title: '市值',
      dataIndex: 'marketCap',
      width: 120,
      align: 'right' as const,
      render: (cap: number) => formatMarketCap(cap),
    },
    {
      title: '市盈率',
      dataIndex: 'pe',
      width: 100,
      align: 'right' as const,
      render: (pe?: number) => pe ? pe.toFixed(2) : '--',
    },
    {
      title: '市净率',
      dataIndex: 'pb',
      width: 100,
      align: 'right' as const,
      render: (pb?: number) => pb ? pb.toFixed(2) : '--',
    },
    {
      title: 'ROE',
      dataIndex: 'roe',
      width: 100,
      align: 'right' as const,
      render: (roe?: number) => roe ? `${roe.toFixed(2)}%` : '--',
    },
    {
      title: '换手率',
      dataIndex: 'turnoverRate',
      width: 100,
      align: 'right' as const,
      render: (rate: number) => `${rate.toFixed(2)}%`,
    },
    {
      title: '行业',
      dataIndex: 'industry',
      width: 150,
    },
  ];

  return (
    <div className={styles.screener}>
      <Card
        title={<Title level={4}>股票筛选器</Title>}
        extra={
          <Space>
            <Button
              icon={<FolderOpenOutlined />}
              onClick={() => {
                Modal.info({
                  title: '我的筛选条件',
                  width: 600,
                  content: (
                    <div style={{ maxHeight: 400, overflow: 'auto' }}>
                      {savedConditions && savedConditions.length > 0 ? (
                        savedConditions.map((cond) => (
                          <div key={cond.id} className={styles.conditionItem}>
                            <div>
                              <Text strong>{cond.name}</Text>
                              <Text type="secondary" style={{ marginLeft: 16, fontSize: 12 }}>
                                {cond.createTime}
                              </Text>
                            </div>
                            <Button
                              type="link"
                              onClick={() => handleLoadCondition(cond)}
                            >
                              加载
                            </Button>
                          </div>
                        ))
                      ) : (
                        <Text type="secondary">暂无保存的筛选条件</Text>
                      )}
                    </div>
                  ),
                });
              }}
            >
              我的条件
            </Button>
            <Button
              icon={<SaveOutlined />}
              onClick={() => setSaveModalVisible(true)}
            >
              保存条件
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          {/* 价格与市值 */}
          <Divider orientation="left">价格与市值</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="价格区间（元）">
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
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="市值区间（亿）">
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
          </Row>

          {/* 涨跌与成交 */}
          <Divider orientation="left">涨跌与成交</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="涨跌幅（%）">
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
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="成交量（万手）">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="volumeMin" noStyle>
                    <InputNumber placeholder="最小" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                  <Form.Item name="volumeMax" noStyle>
                    <InputNumber placeholder="最大" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="换手率（%）">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="turnoverRateMin" noStyle>
                    <InputNumber placeholder="最小" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                  <Form.Item name="turnoverRateMax" noStyle>
                    <InputNumber placeholder="最大" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>

          {/* 估值指标 */}
          <Divider orientation="left">估值指标</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="市盈率">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="peMin" noStyle>
                    <InputNumber placeholder="最小" style={{ width: '50%' }} />
                  </Form.Item>
                  <Form.Item name="peMax" noStyle>
                    <InputNumber placeholder="最大" style={{ width: '50%' }} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="市净率">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="pbMin" noStyle>
                    <InputNumber placeholder="最小" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                  <Form.Item name="pbMax" noStyle>
                    <InputNumber placeholder="最大" style={{ width: '50%' }} min={0} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="ROE（%）">
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item name="roeMin" noStyle>
                    <InputNumber placeholder="最小" style={{ width: '50%' }} />
                  </Form.Item>
                  <Form.Item name="roeMax" noStyle>
                    <InputNumber placeholder="最大" style={{ width: '50%' }} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>

          {/* 行业板块 */}
          <Divider orientation="left">行业板块</Divider>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="所属行业" name="industry">
                <Select
                  mode="multiple"
                  placeholder="请选择行业"
                  allowClear
                  showSearch
                >
                  {industries?.map((industry) => (
                    <Option key={industry} value={industry}>
                      {industry}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="所属板块" name="sector">
                <Select
                  mode="multiple"
                  placeholder="请选择板块"
                  allowClear
                  showSearch
                >
                  {sectors?.map((sector) => (
                    <Option key={sector} value={sector}>
                      {sector}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="交易所" name="exchange">
                <Select mode="multiple" placeholder="请选择交易所" allowClear>
                  <Option value="SH">上海证券交易所</Option>
                  <Option value="SZ">深圳证券交易所</Option>
                  <Option value="BJ">北京证券交易所</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* 操作按钮 */}
          <Row gutter={16}>
            <Col span={24}>
              <Space>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  onClick={handleSubmit}
                  loading={loading}
                >
                  开始筛选
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置条件
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 筛选结果 */}
      {results && (
        <Card
          title={<Title level={4}>筛选结果</Title>}
          extra={<Text type="secondary">共筛选出 {results.total} 只股票</Text>}
          style={{ marginTop: 16 }}
        >
          <Table
            dataSource={results.list}
            columns={columns}
            rowKey="symbol"
            loading={loading}
            pagination={{
              pageSize: 50,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 只股票`,
            }}
            scroll={{ x: 1400 }}
          />
        </Card>
      )}

      {/* 保存条件Modal */}
      <Modal
        title="保存筛选条件"
        open={saveModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setSaveModalVisible(false);
          setConditionName('');
        }}
      >
        <Form.Item label="条件名称">
          <Input
            placeholder="请输入条件名称"
            value={conditionName}
            onChange={(e) => setConditionName(e.target.value)}
          />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default Screener;
