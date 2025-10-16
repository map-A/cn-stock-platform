/**
 * 期权筛选器页面
 */

import React, { useState } from 'react';
import { Card, Form, Row, Col, InputNumber, Select, Button, Table, Space, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { screenOptions, OptionsContract } from '@/services/options';
import PriceTag from '@/components/PriceTag';

const { Option } = Select;

const OptionsScreener: React.FC = () => {
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<any>({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20 });

  const { data, loading, run } = useRequest(
    () =>
      screenOptions({
        ...filters,
        page: pagination.current,
        pageSize: pagination.pageSize,
      }),
    {
      manual: true,
    },
  );

  const handleSearch = () => {
    const values = form.getFieldsValue();
    setFilters(values);
    setPagination({ current: 1, pageSize: 20 });
    run();
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({});
    setPagination({ current: 1, pageSize: 20 });
  };

  const columns = [
    {
      title: '合约代码',
      dataIndex: 'contractSymbol',
      key: 'contractSymbol',
      width: 180,
      fixed: 'left' as const,
    },
    {
      title: '类型',
      dataIndex: 'inTheMoney',
      key: 'type',
      width: 80,
      render: (_: any, record: OptionsContract) => (
        <Tag color={record.delta > 0 ? 'red' : 'green'}>
          {record.delta > 0 ? 'Call' : 'Put'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'inTheMoney',
      key: 'inTheMoney',
      width: 80,
      render: (val: boolean) => (
        <Tag color={val ? 'success' : 'default'}>{val ? 'ITM' : 'OTM'}</Tag>
      ),
    },
    {
      title: '最新价',
      dataIndex: 'lastPrice',
      key: 'lastPrice',
      width: 100,
      align: 'right' as const,
      render: (val: number) => `$${val.toFixed(2)}`,
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      width: 120,
      align: 'right' as const,
      sorter: (a: any, b: any) => a.volume - b.volume,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '持仓量',
      dataIndex: 'openInterest',
      key: 'openInterest',
      width: 120,
      align: 'right' as const,
      sorter: (a: any, b: any) => a.openInterest - b.openInterest,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '隐含波动率',
      dataIndex: 'impliedVolatility',
      key: 'impliedVolatility',
      width: 120,
      align: 'right' as const,
      sorter: (a: any, b: any) => a.impliedVolatility - b.impliedVolatility,
      render: (val: number) => `${(val * 100).toFixed(2)}%`,
    },
    {
      title: 'Delta',
      dataIndex: 'delta',
      key: 'delta',
      width: 100,
      align: 'right' as const,
      render: (val: number) => val.toFixed(4),
    },
    {
      title: 'Gamma',
      dataIndex: 'gamma',
      key: 'gamma',
      width: 100,
      align: 'right' as const,
      render: (val: number) => val.toFixed(4),
    },
    {
      title: 'Theta',
      dataIndex: 'theta',
      key: 'theta',
      width: 100,
      align: 'right' as const,
      render: (val: number) => <PriceTag value={val} precision={4} />,
    },
    {
      title: '权利金',
      dataIndex: 'lastPrice',
      key: 'premium',
      width: 100,
      align: 'right' as const,
      render: (_: any, record: OptionsContract) =>
        `$${(record.lastPrice * record.volume).toLocaleString()}`,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 筛选条件 */}
      <Card title="筛选条件" style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="期权类型" name="type">
                <Select placeholder="全部" allowClear>
                  <Option value="call">Call</Option>
                  <Option value="put">Put</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="最小成交量" name="minVolume">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="例如: 100"
                  min={0}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="最大成交量" name="maxVolume">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="例如: 10000"
                  min={0}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="最小持仓量" name="minOpenInterest">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="例如: 100"
                  min={0}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="最小IV" name="minIV">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="例如: 0.2"
                  min={0}
                  max={5}
                  step={0.01}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="最大IV" name="maxIV">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="例如: 1.0"
                  min={0}
                  max={5}
                  step={0.01}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="最小Delta" name="minDelta">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="例如: 0.3"
                  min={-1}
                  max={1}
                  step={0.01}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="最大Delta" name="maxDelta">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="例如: 0.7"
                  min={-1}
                  max={1}
                  step={0.01}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="最小权利金" name="minPremium">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="例如: 1000"
                  min={0}
                  prefix="$"
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="最大权利金" name="maxPremium">
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="例如: 100000"
                  min={0}
                  prefix="$"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Space>
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                  筛选
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                  重置
                </Button>
                <Button icon={<SaveOutlined />}>保存策略</Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 筛选结果 */}
      <Card title={`筛选结果 ${data?.total ? `(${data.total})` : ''}`}>
        <Table
          dataSource={data?.list || []}
          columns={columns}
          loading={loading}
          rowKey="contractSymbol"
          scroll={{ x: 1600 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个合约`,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize: pageSize || 20 });
              run();
            },
          }}
        />
      </Card>
    </div>
  );
};

export default OptionsScreener;
