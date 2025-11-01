import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Popconfirm,
  Empty,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  StarFilled,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useWatchlistStore } from '@/stores/watchlist';
import { useNavigate } from '@umijs/max';
import type { ColumnsType } from 'antd/es/table';
import type { WatchlistStock } from '@/services/watchlist';
import styles from './index.less';

const Watchlist: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [addStockForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [addStockModalVisible, setAddStockModalVisible] = useState(false);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<number>();

  const {
    watchlists,
    currentWatchlist,
    loading,
    fetchWatchlists,
    fetchWatchlistDetail,
    createWatchlist,
    deleteWatchlist,
    addStock,
    removeStock,
  } = useWatchlistStore();

  useEffect(() => {
    fetchWatchlists();
  }, []);

  useEffect(() => {
    if (watchlists.length > 0 && !selectedWatchlistId) {
      const firstWatchlist = watchlists[0];
      setSelectedWatchlistId(firstWatchlist.id);
      fetchWatchlistDetail(firstWatchlist.id);
    }
  }, [watchlists]);

  const handleCreateWatchlist = async () => {
    try {
      const values = await form.validateFields();
      const success = await createWatchlist(values.name, values.description);
      if (success) {
        setModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDeleteWatchlist = async (id: number) => {
    const success = await deleteWatchlist(id);
    if (success && selectedWatchlistId === id) {
      setSelectedWatchlistId(undefined);
    }
  };

  const handleSelectWatchlist = (id: number) => {
    setSelectedWatchlistId(id);
    fetchWatchlistDetail(id);
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  const handleAddStock = async () => {
    if (!selectedWatchlistId) {
      return;
    }
    try {
      const values = await addStockForm.validateFields();
      const success = await addStock(selectedWatchlistId, values.symbol);
      if (success) {
        setAddStockModalVisible(false);
        addStockForm.resetFields();
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const columns: ColumnsType<WatchlistStock> = [
    {
      title: '股票代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 120,
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
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '涨跌额',
      dataIndex: 'change',
      key: 'change',
      width: 100,
      align: 'right',
      render: (change: number) => (
        <span className={change >= 0 ? styles.priceUp : styles.priceDown}>
          {change >= 0 ? '+' : ''}
          {change.toFixed(2)}
        </span>
      ),
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      width: 120,
      align: 'right',
      render: (percent: number) => (
        <Tag
          color={percent >= 0 ? 'success' : 'error'}
          icon={percent >= 0 ? <RiseOutlined /> : <FallOutlined />}
        >
          {percent >= 0 ? '+' : ''}
          {percent.toFixed(2)}%
        </Tag>
      ),
    },
    {
      title: '市值',
      dataIndex: 'marketValue',
      key: 'marketValue',
      width: 120,
      align: 'right',
      render: (value?: number) =>
        value ? `${(value / 100000000).toFixed(2)}亿` : '-',
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 120,
    },
    {
      title: '添加时间',
      dataIndex: 'addedAt',
      key: 'addedAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Popconfirm
          title="确定要移除此股票吗？"
          onConfirm={() =>
            selectedWatchlistId && removeStock(selectedWatchlistId, record.symbol)
          }
        >
          <Button type="link" danger size="small">
            移除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <PageContainer
      title="自选股管理"
      extra={[
        <Button
          key="create"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          新建自选股
        </Button>,
      ]}
    >
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Card title="我的自选股" bordered={false} bodyStyle={{ padding: 0 }}>
            {watchlists.length === 0 ? (
              <Empty description="暂无自选股" style={{ padding: '32px 0' }} />
            ) : (
              <div className={styles.watchlistList}>
                {watchlists.map((item) => (
                  <div
                    key={item.id}
                    className={`${styles.watchlistItem} ${
                      selectedWatchlistId === item.id ? styles.active : ''
                    }`}
                    onClick={() => handleSelectWatchlist(item.id)}
                  >
                    <div className={styles.watchlistInfo}>
                      <div className={styles.watchlistName}>
                        <StarFilled style={{ color: '#faad14', marginRight: 8 }} />
                        {item.name}
                      </div>
                      <div className={styles.watchlistMeta}>
                        {item.stockCount} 只股票
                      </div>
                    </div>
                    <Popconfirm
                      title="确定要删除此自选股吗？"
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        handleDeleteWatchlist(item.id);
                      }}
                      onCancel={(e) => e?.stopPropagation()}
                    >
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Popconfirm>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className={styles.content}>
          {currentWatchlist ? (
            <>
              <Card bordered={false} style={{ marginBottom: 16 }}>
                <div className={styles.watchlistHeader}>
                  <div>
                    <h2>{currentWatchlist.name}</h2>
                    {currentWatchlist.description && (
                      <p className={styles.description}>{currentWatchlist.description}</p>
                    )}
                  </div>
                  <Space size="large">
                    <Statistic title="股票数量" value={currentWatchlist.stockCount} />
                    <Statistic
                      title="创建时间"
                      value={new Date(currentWatchlist.createdAt).toLocaleDateString()}
                    />
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setAddStockModalVisible(true)}
                    >
                      添加股票
                    </Button>
                  </Space>
                </div>
              </Card>

              <Card bordered={false}>
                <Table
                  columns={columns}
                  dataSource={currentWatchlist.stocks}
                  rowKey="symbol"
                  loading={loading}
                  pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                  }}
                  scroll={{ x: 1200 }}
                />
              </Card>
            </>
          ) : (
            <Card bordered={false}>
              <Empty
                description="请选择一个自选股或创建新的自选股"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </Card>
          )}
        </div>
      </div>

      <Modal
        title="新建自选股"
        open={modalVisible}
        onOk={handleCreateWatchlist}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        okText="创建"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="自选股名称"
            rules={[
              { required: true, message: '请输入自选股名称' },
              { max: 50, message: '名称不能超过50个字符' },
            ]}
          >
            <Input placeholder="例如：价值投资" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ max: 200, message: '描述不能超过200个字符' }]}
          >
            <Input.TextArea rows={3} placeholder="输入自选股描述（可选）" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="添加股票到自选股"
        open={addStockModalVisible}
        onOk={handleAddStock}
        onCancel={() => {
          setAddStockModalVisible(false);
          addStockForm.resetFields();
        }}
        okText="添加"
        cancelText="取消"
      >
        <Form form={addStockForm} layout="vertical">
          <Form.Item
            name="symbol"
            label="股票代码"
            rules={[
              { required: true, message: '请输入股票代码' },
              { 
                pattern: /^(sh|sz)\d{6}$/i, 
                message: '请输入正确的股票代码格式（如：sh600519, sz000651）' 
              },
            ]}
          >
            <Input placeholder="例如：sh600519（贵州茅台）或 sz000651（格力电器）" />
          </Form.Item>
          <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: '-8px' }}>
            提示：股票代码格式为 sh/sz + 6位数字<br />
            - sh 表示上海证券交易所<br />
            - sz 表示深圳证券交易所
          </div>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Watchlist;
