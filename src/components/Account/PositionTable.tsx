/**
 * 持仓列表组件
 */
import React from 'react';
import { Table, Tag, Tooltip, Space } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { AccountPosition } from '@/services/account';

interface PositionTableProps {
  positions: AccountPosition[];
  loading?: boolean;
  onStockClick?: (symbol: string) => void;
}

const PositionTable: React.FC<PositionTableProps> = ({ positions, loading, onStockClick }) => {
  const columns: ColumnsType<AccountPosition> = [
    {
      title: '股票代码',
      dataIndex: 'symbol',
      key: 'symbol',
      width: 120,
      fixed: 'left',
      render: (text: string) => (
        <a onClick={() => onStockClick?.(text)} style={{ fontWeight: 'bold' }}>
          {text}
        </a>
      ),
    },
    {
      title: '持仓数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      align: 'right',
      render: (value: number, record: AccountPosition) => (
        <Tooltip title={`可用: ${record.available_quantity}`}>
          <span>{value.toLocaleString()}</span>
        </Tooltip>
      ),
    },
    {
      title: '成本价',
      dataIndex: 'average_cost',
      key: 'average_cost',
      width: 100,
      align: 'right',
      render: (value: number) => `¥${Number(value).toFixed(2)}`,
    },
    {
      title: '现价',
      dataIndex: 'current_price',
      key: 'current_price',
      width: 100,
      align: 'right',
      render: (value: number) => `¥${Number(value).toFixed(2)}`,
    },
    {
      title: '市值',
      dataIndex: 'market_value',
      key: 'market_value',
      width: 120,
      align: 'right',
      render: (value: number) => `¥${Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`,
      sorter: (a, b) => Number(a.market_value) - Number(b.market_value),
    },
    {
      title: '持仓占比',
      dataIndex: 'position_pct',
      key: 'position_pct',
      width: 100,
      align: 'right',
      render: (value: number) => `${Number(value).toFixed(2)}%`,
      sorter: (a, b) => Number(a.position_pct) - Number(b.position_pct),
    },
    {
      title: '盈亏',
      dataIndex: 'profit_loss',
      key: 'profit_loss',
      width: 120,
      align: 'right',
      render: (value: number, record: AccountPosition) => {
        const numValue = Number(value);
        const isProfit = numValue >= 0;
        return (
          <Space>
            <span style={{ color: isProfit ? '#cf1322' : '#3f8600', fontWeight: 'bold' }}>
              {isProfit ? <RiseOutlined /> : <FallOutlined />}
              ¥{Math.abs(numValue).toFixed(2)}
            </span>
          </Space>
        );
      },
      sorter: (a, b) => Number(a.profit_loss) - Number(b.profit_loss),
    },
    {
      title: '盈亏比例',
      dataIndex: 'profit_loss_pct',
      key: 'profit_loss_pct',
      width: 100,
      align: 'right',
      render: (value: number) => {
        const numValue = Number(value);
        const isProfit = numValue >= 0;
        return (
          <Tag color={isProfit ? 'red' : 'green'}>
            {isProfit ? '+' : ''}
            {numValue.toFixed(2)}%
          </Tag>
        );
      },
      sorter: (a, b) => Number(a.profit_loss_pct) - Number(b.profit_loss_pct),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={positions}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      scroll={{ x: 900 }}
      size="middle"
      summary={(pageData) => {
        const totalMarketValue = pageData.reduce((sum, item) => sum + Number(item.market_value), 0);
        const totalProfitLoss = pageData.reduce((sum, item) => sum + Number(item.profit_loss), 0);

        return (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4}>
                <strong>当前页小计</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="right">
                <strong>¥{totalMarketValue.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}></Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="right">
                <strong style={{ color: totalProfitLoss >= 0 ? '#cf1322' : '#3f8600' }}>
                  ¥{Math.abs(totalProfitLoss).toFixed(2)}
                </strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7}></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
    />
  );
};

export default PositionTable;
