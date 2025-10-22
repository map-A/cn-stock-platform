import React, { useState, useMemo } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Progress, 
  Typography, 
  Row, 
  Col, 
  Select, 
  Space,
  Tooltip,
  Button,
  Input,
} from 'antd';
import { 
  RiseOutlined, 
  FallOutlined, 
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons';
import { Pie, Column } from '@ant-design/plots';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

interface PositionInfo {
  code: string;
  total_shares: number;
  available_shares: number;
  avg_cost_price: number;
  current_price: number;
  market_value: number;
  profit_loss: number;
  profit_loss_ratio: number;
  position_ratio: number;
}

interface Props {
  positions: PositionInfo[];
  totalAssets: number;
}

const PositionAnalysis: React.FC<Props> = ({ positions, totalAssets }) => {
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<string>('market_value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 过滤和排序持仓数据
  const filteredPositions = useMemo(() => {
    let filtered = positions.filter(pos => 
      pos.code.toLowerCase().includes(searchText.toLowerCase())
    );

    // 排序
    filtered.sort((a, b) => {
      const aVal = (a as any)[sortField];
      const bVal = (b as any)[sortField];
      
      if (sortOrder === 'asc') {
        return aVal - bVal;
      } else {
        return bVal - aVal;
      }
    });

    return filtered;
  }, [positions, searchText, sortField, sortOrder]);

  // 计算汇总数据
  const summary = useMemo(() => {
    const totalMarketValue = positions.reduce((sum, pos) => sum + pos.market_value, 0);
    const totalProfitLoss = positions.reduce((sum, pos) => sum + pos.profit_loss, 0);
    const totalCost = totalMarketValue - totalProfitLoss;
    const avgProfitLossRatio = positions.length > 0 ? 
      positions.reduce((sum, pos) => sum + pos.profit_loss_ratio, 0) / positions.length : 0;
    
    const profitableCount = positions.filter(pos => pos.profit_loss > 0).length;
    const lossingCount = positions.filter(pos => pos.profit_loss < 0).length;
    
    return {
      totalMarketValue: totalMarketValue / 100,
      totalProfitLoss: totalProfitLoss / 100,
      totalCost: totalCost / 100,
      avgProfitLossRatio,
      profitableCount,
      lossingCount,
      profitableRatio: positions.length > 0 ? (profitableCount / positions.length) * 100 : 0,
    };
  }, [positions]);

  // 持仓分布数据（按市值）
  const positionDistributionData = positions
    .map(pos => ({
      code: pos.code,
      value: pos.market_value / 100,
      ratio: pos.position_ratio,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // 只显示前10大持仓

  // 盈亏分布数据
  const profitLossData = positions.map(pos => ({
    code: pos.code,
    profit_loss: pos.profit_loss / 100,
    profit_loss_ratio: pos.profit_loss_ratio,
    type: pos.profit_loss >= 0 ? '盈利' : '亏损',
  }));

  // 饼图配置
  const pieConfig = {
    data: positionDistributionData,
    angleField: 'value',
    colorField: 'code',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}\n{percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  // 柱状图配置
  const columnConfig = {
    data: profitLossData,
    xField: 'code',
    yField: 'profit_loss',
    seriesField: 'type',
    color: ({ type }: any) => {
      return type === '盈利' ? '#52c41a' : '#ff4d4f';
    },
    label: {
      position: 'middle' as const,
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      profit_loss: {
        alias: '盈亏金额(元)',
      },
    },
  };

  // 表格列定义
  const columns = [
    {
      title: '股票代码',
      dataIndex: 'code',
      key: 'code',
      fixed: 'left' as const,
      width: 100,
      render: (code: string) => <Text strong>{code}</Text>,
    },
    {
      title: '持股数量',
      dataIndex: 'total_shares',
      key: 'total_shares',
      width: 100,
      align: 'right' as const,
      render: (shares: number) => shares.toLocaleString(),
    },
    {
      title: '可用股数',
      dataIndex: 'available_shares',
      key: 'available_shares',
      width: 100,
      align: 'right' as const,
      render: (shares: number) => shares.toLocaleString(),
    },
    {
      title: '成本价',
      dataIndex: 'avg_cost_price',
      key: 'avg_cost_price',
      width: 100,
      align: 'right' as const,
      render: (price: number) => `¥${(price / 100).toFixed(2)}`,
    },
    {
      title: '现价',
      dataIndex: 'current_price',
      key: 'current_price',
      width: 100,
      align: 'right' as const,
      render: (price: number) => `¥${(price / 100).toFixed(2)}`,
    },
    {
      title: '市值',
      dataIndex: 'market_value',
      key: 'market_value',
      width: 120,
      align: 'right' as const,
      render: (value: number) => `¥${(value / 100).toFixed(2)}`,
      sorter: true,
    },
    {
      title: '盈亏金额',
      dataIndex: 'profit_loss',
      key: 'profit_loss',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => (
        <Text style={{ color: amount >= 0 ? '#cf1322' : '#3f8600' }}>
          {amount >= 0 ? '+' : ''}¥{(amount / 100).toFixed(2)}
        </Text>
      ),
      sorter: true,
    },
    {
      title: '盈亏比例',
      dataIndex: 'profit_loss_ratio',
      key: 'profit_loss_ratio',
      width: 120,
      align: 'right' as const,
      render: (ratio: number) => (
        <Space>
          {ratio >= 0 ? <RiseOutlined style={{ color: '#cf1322' }} /> : <FallOutlined style={{ color: '#3f8600' }} />}
          <Text style={{ color: ratio >= 0 ? '#cf1322' : '#3f8600' }}>
            {ratio >= 0 ? '+' : ''}{ratio.toFixed(2)}%
          </Text>
        </Space>
      ),
      sorter: true,
    },
    {
      title: '仓位比例',
      dataIndex: 'position_ratio',
      key: 'position_ratio',
      width: 140,
      render: (ratio: number) => (
        <div>
          <Text>{ratio.toFixed(2)}%</Text>
          <Progress 
            percent={ratio} 
            size="small" 
            showInfo={false}
            status={ratio > 20 ? 'exception' : ratio > 10 ? 'active' : 'normal'}
          />
        </div>
      ),
      sorter: true,
    },
  ];

  return (
    <div>
      {/* 汇总统计 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                ¥{summary.totalMarketValue.toFixed(2)}
              </Title>
              <Text type="secondary">总市值</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Title 
                level={4} 
                style={{ 
                  margin: 0, 
                  color: summary.totalProfitLoss >= 0 ? '#cf1322' : '#3f8600' 
                }}
              >
                {summary.totalProfitLoss >= 0 ? '+' : ''}¥{summary.totalProfitLoss.toFixed(2)}
              </Title>
              <Text type="secondary">总盈亏</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                {summary.profitableCount}
              </Title>
              <Text type="secondary">盈利品种</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: 0, color: '#ff4d4f' }}>
                {summary.lossingCount}
              </Title>
              <Text type="secondary">亏损品种</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 持仓分布图 */}
        <Col xs={24} lg={12}>
          <Card title="持仓分布（前10大）" size="small">
            <Pie {...pieConfig} height={300} />
          </Card>
        </Col>

        {/* 盈亏分布图 */}
        <Col xs={24} lg={12}>
          <Card title="盈亏分布" size="small">
            <Column {...columnConfig} height={300} />
          </Card>
        </Col>

        {/* 持仓明细表 */}
        <Col xs={24}>
          <Card 
            title="持仓明细" 
            size="small"
            extra={
              <Space>
                <Search
                  placeholder="搜索股票代码"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 200 }}
                />
                <Select
                  value={sortField}
                  onChange={setSortField}
                  style={{ width: 120 }}
                >
                  <Option value="market_value">按市值</Option>
                  <Option value="profit_loss">按盈亏</Option>
                  <Option value="profit_loss_ratio">按盈亏比例</Option>
                  <Option value="position_ratio">按仓位比例</Option>
                </Select>
                <Button
                  icon={sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '升序' : '降序'}
                </Button>
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={filteredPositions}
              rowKey="code"
              scroll={{ x: 1000 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PositionAnalysis;
