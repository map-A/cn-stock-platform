import React, { useState, useEffect } from 'react';
import { Card, Table, Space, Typography, Tag, Progress, Button, Tooltip, Statistic, Row, Col } from 'antd';
import { 
  RiseOutlined, 
  FallOutlined, 
  InfoCircleOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './HoldingDetails.less';

const { Text, Title } = Typography;

interface HoldingItem {
  /** 股票代码 */
  stockCode: string;
  /** 股票名称 */
  stockName: string;
  /** 持仓数量 */
  quantity: number;
  /** 可用数量 */
  availableQuantity: number;
  /** 成本价 */
  costPrice: number;
  /** 当前价格 */
  currentPrice: number;
  /** 市值 */
  marketValue: number;
  /** 持仓成本 */
  totalCost: number;
  /** 盈亏金额 */
  profitLoss: number;
  /** 盈亏比例 */
  profitLossPercent: number;
  /** 持仓比例 */
  positionPercent: number;
  /** 今日涨跌 */
  dayChange: number;
  /** 今日涨跌幅 */
  dayChangePercent: number;
  /** 行业 */
  industry?: string;
  /** 最后更新时间 */
  updateTime: string;
}

interface HoldingDetailsProps {
  /** 持仓数据 */
  holdings?: HoldingItem[];
  /** 加载状态 */
  loading?: boolean;
  /** 总资产 */
  totalAssets?: number;
  /** 点击股票回调 */
  onStockClick?: (stockCode: string) => void;
  /** 操作回调 */
  onAction?: (action: string, record: HoldingItem) => void;
}

const HoldingDetails: React.FC<HoldingDetailsProps> = ({
  holdings = [],
  loading = false,
  totalAssets = 0,
  onStockClick,
  onAction,
}) => {
  const [sortedHoldings, setSortedHoldings] = useState<HoldingItem[]>(holdings);

  useEffect(() => {
    setSortedHoldings(holdings);
  }, [holdings]);

  // 获取盈亏颜色和图标
  const getProfitLossDisplay = (profitLoss: number, profitLossPercent: number) => {
    const isProfit = profitLoss > 0;
    const color = isProfit ? '#52c41a' : profitLoss < 0 ? '#ff4d4f' : '#666';
    const icon = isProfit ? <RiseOutlined /> : profitLoss < 0 ? <FallOutlined /> : null;
    
    return {
      color,
      icon,
      text: `${isProfit ? '+' : ''}${profitLoss.toFixed(2)}`,
      percent: `${isProfit ? '+' : ''}${profitLossPercent.toFixed(2)}%`
    };
  };

  // 计算汇总数据
  const getSummaryData = () => {
    const totalMarketValue = holdings.reduce((sum, item) => sum + item.marketValue, 0);
    const totalCost = holdings.reduce((sum, item) => sum + item.totalCost, 0);
    const totalProfitLoss = holdings.reduce((sum, item) => sum + item.profitLoss, 0);
    const totalProfitLossPercent = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;
    const todayProfitLoss = holdings.reduce((sum, item) => 
      sum + (item.quantity * item.currentPrice * item.dayChangePercent / 100), 0);

    return {
      totalMarketValue,
      totalCost,
      totalProfitLoss,
      totalProfitLossPercent,
      todayProfitLoss,
      holdingCount: holdings.length,
    };
  };

  const summary = getSummaryData();

  // 表格列定义
  const columns: ColumnsType<HoldingItem> = [
    {
      title: '股票',
      key: 'stock',
      width: 140,
      fixed: 'left',
      render: (_, record) => (
        <div className="stock-info">
          <Button 
            type="link" 
            onClick={() => onStockClick?.(record.stockCode)}
            className="stock-name"
          >
            <div>
              <Text strong>{record.stockCode}</Text>
              <br />
              <Text className="stock-name-text">{record.stockName}</Text>
            </div>
          </Button>
        </div>
      ),
    },
    {
      title: '持仓数量',
      key: 'quantity',
      width: 100,
      align: 'right',
      render: (_, record) => (
        <div>
          <Text strong>{record.quantity.toLocaleString()}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            可用 {record.availableQuantity.toLocaleString()}
          </Text>
        </div>
      ),
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 80,
      align: 'right',
      render: (value) => `¥${value.toFixed(2)}`,
    },
    {
      title: '现价',
      key: 'currentPrice',
      width: 100,
      align: 'right',
      render: (_, record) => {
        const changeColor = record.dayChange > 0 ? '#52c41a' : record.dayChange < 0 ? '#ff4d4f' : '#666';
        return (
          <div>
            <Text strong style={{ color: changeColor }}>¥{record.currentPrice.toFixed(2)}</Text>
            <br />
            <Text style={{ color: changeColor, fontSize: '12px' }}>
              {record.dayChange > 0 ? '+' : ''}{record.dayChangePercent.toFixed(2)}%
            </Text>
          </div>
        );
      },
    },
    {
      title: '市值',
      dataIndex: 'marketValue',
      key: 'marketValue',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.marketValue - b.marketValue,
      render: (value) => (
        <Text strong>¥{(value / 10000).toFixed(2)}万</Text>
      ),
    },
    {
      title: '持仓成本',
      dataIndex: 'totalCost',
      key: 'totalCost',
      width: 100,
      align: 'right',
      render: (value) => `¥${(value / 10000).toFixed(2)}万`,
    },
    {
      title: '盈亏',
      key: 'profitLoss',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.profitLoss - b.profitLoss,
      render: (_, record) => {
        const display = getProfitLossDisplay(record.profitLoss, record.profitLossPercent);
        return (
          <div>
            <Space>
              {display.icon}
              <Text strong style={{ color: display.color }}>
                ¥{Math.abs(record.profitLoss).toFixed(2)}
              </Text>
            </Space>
            <br />
            <Text style={{ color: display.color, fontSize: '12px' }}>
              {display.percent}
            </Text>
          </div>
        );
      },
    },
    {
      title: () => (
        <Space>
          持仓占比
          <Tooltip title="该股票在总资产中的占比">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      key: 'positionPercent',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.positionPercent - b.positionPercent,
      render: (_, record) => (
        <div>
          <Progress
            percent={record.positionPercent}
            size="small"
            strokeColor={record.profitLoss > 0 ? '#52c41a' : '#ff4d4f'}
            showInfo={false}
          />
          <Text style={{ fontSize: '12px' }}>
            {record.positionPercent.toFixed(1)}%
          </Text>
        </div>
      ),
    },
    {
      title: '行业',
      dataIndex: 'industry',
      key: 'industry',
      width: 100,
      render: (value) => value ? <Tag color="blue">{value}</Tag> : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="text"
          icon={<MoreOutlined />}
          onClick={() => onAction?.('more', record)}
        />
      ),
    },
  ];

  return (
    <div className="holding-details">
      {/* 持仓汇总 */}
      <Card className="summary-card" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Statistic
              title="总市值"
              value={summary.totalMarketValue}
              precision={2}
              prefix="¥"
              formatter={(value) => `${(Number(value) / 10000).toFixed(2)}万`}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="持仓成本"
              value={summary.totalCost}
              precision={2}
              prefix="¥"
              formatter={(value) => `${(Number(value) / 10000).toFixed(2)}万`}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="总盈亏"
              value={summary.totalProfitLoss}
              precision={2}
              prefix={summary.totalProfitLoss >= 0 ? '+¥' : '-¥'}
              valueStyle={{ 
                color: summary.totalProfitLoss > 0 ? '#52c41a' : 
                       summary.totalProfitLoss < 0 ? '#ff4d4f' : '#666' 
              }}
              suffix={`(${summary.totalProfitLossPercent >= 0 ? '+' : ''}${summary.totalProfitLossPercent.toFixed(2)}%)`}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="今日盈亏"
              value={Math.abs(summary.todayProfitLoss)}
              precision={2}
              prefix={summary.todayProfitLoss >= 0 ? '+¥' : '-¥'}
              valueStyle={{ 
                color: summary.todayProfitLoss > 0 ? '#52c41a' : 
                       summary.todayProfitLoss < 0 ? '#ff4d4f' : '#666' 
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* 持仓明细表格 */}
      <Card 
        title={
          <Space>
            <Text strong>持仓明细</Text>
            <Tag>{summary.holdingCount}只股票</Tag>
          </Space>
        }
      >
        <Table<HoldingItem>
          columns={columns}
          dataSource={sortedHoldings}
          rowKey="stockCode"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
          }}
          size="small"
          className="holding-table"
        />
      </Card>
    </div>
  );
};

export default HoldingDetails;