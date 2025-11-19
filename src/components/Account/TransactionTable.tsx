/**
 * 交易记录表格组件
 */
import React from 'react';
import { Table, Tag, Space, Typography, theme } from 'antd';
import { SwapOutlined, ShoppingOutlined, DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import type { AccountTransaction } from '@/services/account';

const { Text } = Typography;

interface TransactionTableProps {
  transactions: AccountTransaction[];
  total?: number;
  current?: number;
  pageSize?: number;
  loading?: boolean;
  onChange?: (page: number, pageSize: number) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  total = 0,
  current = 1,
  pageSize = 20,
  loading,
  onChange,
}) => {
  const { token } = theme.useToken();
  const typeMap: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
    buy: { color: token.colorError, label: '买入', icon: <ShoppingOutlined /> },
    sell: { color: token.colorSuccess, label: '卖出', icon: <DollarOutlined /> },
    dividend: { color: token.colorPrimary, label: '分红', icon: <SwapOutlined /> },
  };

  const columns: ColumnsType<AccountTransaction> = [
    {
      title: '交易时间',
      dataIndex: 'transaction_date',
      key: 'transaction_date',
      width: 180,
      render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => dayjs(a.transaction_date).unix() - dayjs(b.transaction_date).unix(),
    },
    {
      title: '股票代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 120,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: '交易类型',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      width: 100,
      align: 'center',
      render: (type: string) => {
        const config = typeMap[type] || { color: 'default', label: type, icon: null };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
      filters: [
        { text: '买入', value: 'buy' },
        { text: '卖出', value: 'sell' },
        { text: '分红', value: 'dividend' },
      ],
      onFilter: (value, record) => record.transaction_type === value,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right',
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: '成交价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      render: (value: number) => `¥${Number(value).toFixed(4)}`,
    },
    {
      title: '成交额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (value: number) => `¥${Number(value).toFixed(2)}`,
    },
    {
      title: '手续费',
      dataIndex: 'commission',
      key: 'commission',
      width: 100,
      align: 'right',
      render: (value: number, record: AccountTransaction) => {
        const totalFee = Number(value) + Number(record.stamp_duty) + Number(record.transfer_fee);
        return (
          <Space direction="vertical" size={0}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ¥{totalFee.toFixed(2)}
            </Text>
          </Space>
        );
      },
    },
    {
      title: '账户余额',
      dataIndex: 'balance_after',
      key: 'balance_after',
      width: 120,
      align: 'right',
      render: (value: number) => `¥${Number(value).toFixed(2)}`,
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      render: (text?: string) => text || '-',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={transactions}
      rowKey="id"
      loading={loading}
      pagination={{
        current,
        pageSize,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条交易记录`,
        onChange: (page, size) => onChange?.(page, size),
      }}
      scroll={{ x: 1200 }}
      size="small"
    />
  );
};

export default TransactionTable;
