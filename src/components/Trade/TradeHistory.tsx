import React, { useState, useMemo } from 'react';
import {
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Tooltip,
  Modal,
  Descriptions,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TableProps } from 'antd/es/table';
import dayjs from 'dayjs';
import type { TradeRecord } from '../index';
import './TradeHistory.less';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

export interface TradeHistoryProps {
  records: TradeRecord[];
  loading?: boolean;
  onRefresh?: () => void;
  onEdit?: (record: TradeRecord) => void;
  onDelete?: (tradeId: string) => void;
  onExport?: (records: TradeRecord[]) => void;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({
  records = [],
  loading = false,
  onRefresh,
  onEdit,
  onDelete,
  onExport,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredRecords, setFilteredRecords] = useState<TradeRecord[]>(records);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TradeRecord | null>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    tradeType: 'all',
    status: 'all',
    strategy: 'all',
    amountRange: [0, 1000000],
  });

  // 应用筛选和搜索
  useMemo(() => {
    let filtered = [...records];

    // 搜索筛选
    if (searchText) {
      filtered = filtered.filter(
        record =>
          record.stock_code.toLowerCase().includes(searchText.toLowerCase()) ||
          record.stock_name.toLowerCase().includes(searchText.toLowerCase()) ||
          record.trade_id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 高级筛选
    if (filters.tradeType !== 'all') {
      filtered = filtered.filter(record => record.trade_type === filters.tradeType);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(record => record.status === filters.status);
    }

    if (filters.strategy !== 'all') {
      filtered = filtered.filter(record => record.strategy_name === filters.strategy);
    }

    filtered = filtered.filter(
      record => record.amount >= filters.amountRange[0] && record.amount <= filters.amountRange[1]
    );

    setFilteredRecords(filtered);
  }, [records, searchText, filters]);

  // 表格列定义
  const columns: ColumnsType<TradeRecord> = [
    {
      title: '交易时间',
      dataIndex: 'trade_time',
      key: 'trade_time',
      width: 140,
      sorter: (a, b) => dayjs(a.trade_time).unix() - dayjs(b.trade_time).unix(),
      render: (time) => (
        <div>
          <div>{dayjs(time).format('MM-DD')}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {dayjs(time).format('HH:mm:ss')}
          </div>
        </div>
      ),
    },
    {
      title: '股票',
      key: 'stock',
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.stock_code}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.stock_name}</div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'trade_type',
      key: 'trade_type',
      width: 60,
      filters: [
        { text: '买入', value: 'buy' },
        { text: '卖出', value: 'sell' },
      ],
      onFilter: (value, record) => record.trade_type === value,
      render: (type) => (
        <Tag color={type === 'buy' ? 'green' : 'red'}>
          {type === 'buy' ? '买入' : '卖出'}
        </Tag>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'right',
      sorter: (a, b) => a.quantity - b.quantity,
      render: (quantity) => quantity.toLocaleString(),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 80,
      align: 'right',
      sorter: (a, b) => a.price - b.price,
      render: (price) => `¥${price.toFixed(2)}`,
    },
    {
      title: '成交金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => (
        <div>
          <div>¥{(amount / 10000).toFixed(2)}万</div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            ¥{amount.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      title: '手续费',
      key: 'fees',
      width: 80,
      align: 'right',
      render: (_, record) => {
        const totalFees = record.commission + record.stamp_duty + record.transfer_fee;
        return (
          <Tooltip
            title={
              <div>
                <div>佣金: ¥{record.commission.toFixed(2)}</div>
                <div>印花税: ¥{record.stamp_duty.toFixed(2)}</div>
                <div>过户费: ¥{record.transfer_fee.toFixed(2)}</div>
              </div>
            }
          >
            <span>¥{totalFees.toFixed(2)}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      filters: [
        { text: '已成交', value: 'filled' },
        { text: '部分成交', value: 'partial' },
        { text: '已撤销', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const statusConfig = {
          filled: { color: 'success', text: '已成交' },
          partial: { color: 'warning', text: '部分成交' },
          cancelled: { color: 'default', text: '已撤销' },
        };
        const config = statusConfig[status] || statusConfig.filled;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '策略',
      dataIndex: 'strategy_name',
      key: 'strategy_name',
      width: 100,
      ellipsis: true,
      render: (strategy) => strategy || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          {onEdit && (
            <Tooltip title="编辑">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
              />
            </Tooltip>
          )}
          {onDelete && (
            <Popconfirm
              title="确定要删除这条交易记录吗？"
              onConfirm={() => handleDelete(record.trade_id)}
              okText="确定"
              cancelText="取消"
            >
              <Tooltip title="删除">
                <Button
                  type="text"
                  size="small"
                  icon={<DeleteOutlined />}
                  danger
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 处理查看详情
  const handleViewDetail = (record: TradeRecord) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  // 处理删除
  const handleDelete = (tradeId: string) => {
    onDelete?.(tradeId);
    message.success('删除成功');
  };

  // 处理批量操作
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }
    
    Modal.confirm({
      title: '确定删除选中的记录吗？',
      content: `将删除 ${selectedRowKeys.length} 条记录`,
      onOk: () => {
        selectedRowKeys.forEach(key => onDelete?.(key as string));
        setSelectedRowKeys([]);
        message.success('批量删除成功');
      },
    });
  };

  const handleBatchExport = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要导出的记录');
      return;
    }
    
    const selectedRecords = filteredRecords.filter(record =>
      selectedRowKeys.includes(record.trade_id)
    );
    onExport?.(selectedRecords);
    message.success('导出成功');
  };

  // 表格选择配置
  const rowSelection: TableProps<TradeRecord>['rowSelection'] = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  // 高级筛选面板
  const renderAdvancedFilter = () => (
    <Card
      title="高级筛选"
      size="small"
      extra={
        <Button size="small" onClick={() => setFilterVisible(false)}>
          收起
        </Button>
      }
      style={{ marginBottom: 16 }}
    >
      <Row gutter={16}>
        <Col span={6}>
          <div style={{ marginBottom: 8 }}>交易类型</div>
          <Select
            value={filters.tradeType}
            onChange={(value) => setFilters(prev => ({ ...prev, tradeType: value }))}
            style={{ width: '100%' }}
            size="small"
          >
            <Option value="all">全部</Option>
            <Option value="buy">买入</Option>
            <Option value="sell">卖出</Option>
          </Select>
        </Col>
        <Col span={6}>
          <div style={{ marginBottom: 8 }}>交易状态</div>
          <Select
            value={filters.status}
            onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            style={{ width: '100%' }}
            size="small"
          >
            <Option value="all">全部</Option>
            <Option value="filled">已成交</Option>
            <Option value="partial">部分成交</Option>
            <Option value="cancelled">已撤销</Option>
          </Select>
        </Col>
        <Col span={6}>
          <div style={{ marginBottom: 8 }}>交易策略</div>
          <Select
            value={filters.strategy}
            onChange={(value) => setFilters(prev => ({ ...prev, strategy: value }))}
            style={{ width: '100%' }}
            size="small"
          >
            <Option value="all">全部</Option>
            <Option value="价值投资">价值投资</Option>
            <Option value="技术分析">技术分析</Option>
            <Option value="量化策略">量化策略</Option>
            <Option value="套利策略">套利策略</Option>
            <Option value="手动交易">手动交易</Option>
          </Select>
        </Col>
        <Col span={6}>
          <div style={{ marginBottom: 8 }}>操作</div>
          <Space>
            <Button
              size="small"
              onClick={() => setFilters({
                tradeType: 'all',
                status: 'all',
                strategy: 'all',
                amountRange: [0, 1000000],
              })}
            >
              重置
            </Button>
            <Button size="small" type="primary">
              应用
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );

  return (
    <div className="trade-history">
      {/* 搜索和操作栏 */}
      <Card size="small" className="trade-history-toolbar">
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Search
              placeholder="搜索股票代码、名称或交易ID"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={setSearchText}
              style={{ width: '100%' }}
              size="small"
            />
          </Col>
          <Col span={16}>
            <Space style={{ float: 'right' }}>
              <Button
                size="small"
                icon={<FilterOutlined />}
                onClick={() => setFilterVisible(!filterVisible)}
              >
                {filterVisible ? '收起筛选' : '高级筛选'}
              </Button>
              <Button
                size="small"
                icon={<ExportOutlined />}
                onClick={() => onExport?.(filteredRecords)}
              >
                导出全部
              </Button>
              {selectedRowKeys.length > 0 && (
                <>
                  <Button
                    size="small"
                    onClick={handleBatchExport}
                  >
                    导出选中 ({selectedRowKeys.length})
                  </Button>
                  <Button
                    size="small"
                    danger
                    onClick={handleBatchDelete}
                  >
                    删除选中
                  </Button>
                </>
              )}
              <Button
                size="small"
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

      {/* 高级筛选面板 */}
      {filterVisible && renderAdvancedFilter()}

      {/* 交易记录表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredRecords}
          rowKey="trade_id"
          rowSelection={rowSelection}
          loading={loading}
          size="small"
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="交易详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedRecord && (
          <Descriptions column={2} size="small">
            <Descriptions.Item label="交易ID">{selectedRecord.trade_id}</Descriptions.Item>
            <Descriptions.Item label="订单ID">{selectedRecord.order_id}</Descriptions.Item>
            <Descriptions.Item label="股票代码">{selectedRecord.stock_code}</Descriptions.Item>
            <Descriptions.Item label="股票名称">{selectedRecord.stock_name}</Descriptions.Item>
            <Descriptions.Item label="交易类型">
              <Tag color={selectedRecord.trade_type === 'buy' ? 'green' : 'red'}>
                {selectedRecord.trade_type === 'buy' ? '买入' : '卖出'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="交易状态">
              <Tag color={selectedRecord.status === 'filled' ? 'success' : 'warning'}>
                {selectedRecord.status === 'filled' ? '已成交' : '部分成交'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="数量">{selectedRecord.quantity.toLocaleString()} 股</Descriptions.Item>
            <Descriptions.Item label="价格">¥{selectedRecord.price.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="成交金额">¥{selectedRecord.amount.toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="佣金">¥{selectedRecord.commission.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="印花税">¥{selectedRecord.stamp_duty.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="过户费">¥{selectedRecord.transfer_fee.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="总成本">¥{selectedRecord.total_cost.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="交易时间" span={2}>
              {dayjs(selectedRecord.trade_time).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="账户ID">{selectedRecord.account_id}</Descriptions.Item>
            <Descriptions.Item label="交易策略">{selectedRecord.strategy_name || '-'}</Descriptions.Item>
            {selectedRecord.remarks && (
              <Descriptions.Item label="备注" span={2}>{selectedRecord.remarks}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default TradeHistory;