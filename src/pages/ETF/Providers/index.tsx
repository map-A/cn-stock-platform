/**
 * ETF提供商页面
 */

import React, { useState } from 'react';
import { Card, Table, Tag, Statistic, Modal } from 'antd';
import { useRequest } from 'ahooks';
import { getETFProviders, getProviderETFs, ETFInfo } from '@/services/etf';
import { BankOutlined } from '@ant-design/icons';
import { history } from 'umi';

const ETFProviders: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: providers, loading } = useRequest(() => getETFProviders());

  const { data: providerETFs, loading: etfsLoading } = useRequest(
    () => (selectedProvider ? getProviderETFs(selectedProvider) : Promise.resolve([])),
    {
      refreshDeps: [selectedProvider],
      ready: !!selectedProvider,
    },
  );

  const columns = [
    {
      title: '基金公司',
      dataIndex: 'providerName',
      key: 'providerName',
      fixed: 'left' as const,
      width: 200,
      render: (text: string) => (
        <span>
          <BankOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: 'ETF数量',
      dataIndex: 'totalETFs',
      key: 'totalETFs',
      width: 120,
      align: 'right' as const,
      sorter: (a: any, b: any) => a.totalETFs - b.totalETFs,
      render: (val: number) => `${val}只`,
    },
    {
      title: '管理规模(亿)',
      dataIndex: 'totalAssets',
      key: 'totalAssets',
      width: 150,
      align: 'right' as const,
      sorter: (a: any, b: any) => a.totalAssets - b.totalAssets,
      render: (val: number) => (val / 100000000).toFixed(2),
    },
    {
      title: '平均管理费率',
      dataIndex: 'avgManagementFee',
      key: 'avgManagementFee',
      width: 130,
      align: 'right' as const,
      render: (val: number) => `${val.toFixed(2)}%`,
    },
    {
      title: '成立年份',
      dataIndex: 'foundedYear',
      key: 'foundedYear',
      width: 120,
    },
    {
      title: '代表产品',
      dataIndex: 'topETFs',
      key: 'topETFs',
      width: 200,
      render: (etfs: string[]) => (
        <div>
          {etfs.slice(0, 3).map((etf) => (
            <Tag key={etf} style={{ marginBottom: 4 }}>
              {etf}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <a
          onClick={() => {
            setSelectedProvider(record.providerId);
            setModalVisible(true);
          }}
        >
          查看旗下产品
        </a>
      ),
    },
  ];

  const etfColumns = [
    {
      title: 'ETF代码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: 'ETF名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '规模(亿)',
      dataIndex: 'totalAssets',
      key: 'totalAssets',
      width: 120,
      align: 'right' as const,
      render: (val: number) => (val / 100000000).toFixed(2),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: ETFInfo) => (
        <a onClick={() => history.push(`/etf/${record.code}`)}>查看详情</a>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 统计信息 */}
      <Card style={{ marginBottom: 16 }}>
        <Statistic
          title="ETF提供商总数"
          value={providers?.length || 0}
          suffix="家"
          prefix={<BankOutlined />}
        />
      </Card>

      {/* 提供商列表 */}
      <Card title="ETF提供商列表">
        <Table
          dataSource={providers || []}
          columns={columns}
          loading={loading}
          rowKey="providerId"
          scroll={{ x: 1200 }}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 家提供商`,
          }}
        />
      </Card>

      {/* 旗下产品弹窗 */}
      <Modal
        title="旗下ETF产品"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedProvider(null);
        }}
        footer={null}
        width={800}
      >
        <Table
          dataSource={providerETFs || []}
          columns={etfColumns}
          loading={etfsLoading}
          rowKey="code"
          pagination={{
            defaultPageSize: 10,
            showTotal: (total) => `共 ${total} 只ETF`,
          }}
        />
      </Modal>
    </div>
  );
};

export default ETFProviders;
