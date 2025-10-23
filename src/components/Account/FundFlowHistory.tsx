import React, { useState, useMemo } from 'react';
import { 
  Card, 
  Table, 
  Tag, 
  Typography, 
  Row, 
  Col, 
  Select, 
  DatePicker,
  Space,
  Button,
  Input,
  Tooltip,
} from 'antd';
import { 
  SearchOutlined,
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Column, Line } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

interface FundFlow {
  flow_id: string;
  flow_time: string;
  flow_type: string;
  amount: number;
  balance_after: number;
  related_code?: string;
  description: string;
}

interface Props {
  fundFlows: FundFlow[];
}

const FundFlowHistory: React.FC<Props> = ({ fundFlows }) => {
  const [searchText, setSearchText] = useState('');
  const [flowTypeFilter, setFlowTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // 流水类型映射
  const flowTypeMap = {
    deposit: { text: '入金', color: 'green' },
    withdraw: { text: '出金', color: 'red' },
    trade_buy: { text: '买入成交', color: 'blue' },
    trade_sell: { text: '卖出成交', color: 'cyan' },
    dividend: { text: '分红', color: 'gold' },
    interest: { text: '利息', color: 'lime' },
    fee: { text: '费用', color: 'orange' },
    margin_in: { text: '融资', color: 'purple' },
    margin_out: { text: '还款', color: 'magenta' },
  };

  // 过滤流水数据
  const filteredFlows = useMemo(() => {
    const filtered = fundFlows.filter(flow => {
      // 类型过滤
      if (flowTypeFilter !== 'all' && flow.flow_type !== flowTypeFilter) {
        return false;
      }
      
      // 时间范围过滤
      if (dateRange) {
        const flowDate = dayjs(flow.flow_time);
        if (flowDate.isBefore(dayjs(dateRange[0])) || flowDate.isAfter(dayjs(dateRange[1]))) {
          return false;
        }
      }
      
      // 搜索过滤
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        return (
          flow.description.toLowerCase().includes(searchLower) ||
          flow.related_code?.toLowerCase().includes(searchLower) ||
          flow.flow_id.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });

    // 按时间倒序排列
    return filtered.sort((a, b) => 
      dayjs(b.flow_time).valueOf() - dayjs(a.flow_time).valueOf()
    );
  }, [fundFlows, searchText, flowTypeFilter, dateRange]);

  // 计算统计数据
  const statistics = useMemo(() => {
    const totalInFlow = filteredFlows
      .filter(flow => flow.amount > 0)
      .reduce((sum, flow) => sum + flow.amount, 0) / 100;
    
    const totalOutFlow = filteredFlows
      .filter(flow => flow.amount < 0)
      .reduce((sum, flow) => sum + Math.abs(flow.amount), 0) / 100;
    
    const netFlow = totalInFlow - totalOutFlow;
    
    const flowsByType = filteredFlows.reduce((acc, flow) => {
      const type = flow.flow_type;
      if (!acc[type]) {
        acc[type] = { count: 0, amount: 0 };
      }
      acc[type].count++;
      acc[type].amount += flow.amount / 100;
      return acc;
    }, {} as Record<string, { count: number; amount: number }>);

    return {
      totalInFlow,
      totalOutFlow,
      netFlow,
      totalTransactions: filteredFlows.length,
      flowsByType,
    };
  }, [filteredFlows]);

  // 每日资金流水趋势数据
  const dailyFlowData = useMemo(() => {
    const dailyData = filteredFlows.reduce((acc, flow) => {
      const date = dayjs(flow.flow_time).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = { date, inFlow: 0, outFlow: 0, netFlow: 0 };
      }
      
      if (flow.amount > 0) {
        acc[date].inFlow += flow.amount / 100;
      } else {
        acc[date].outFlow += Math.abs(flow.amount) / 100;
      }
      acc[date].netFlow += flow.amount / 100;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(dailyData).sort((a: any, b: any) => 
      dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
    );
  }, [filteredFlows]);

  // 流水类型分布数据
  const flowTypeData = Object.entries(statistics.flowsByType).map(([type, data]) => ({
    type: (flowTypeMap as any)[type]?.text || type,
    count: data.count,
    amount: Math.abs(data.amount),
  }));

  // 每日净流水图表配置
  const dailyFlowConfig = {
    data: dailyFlowData,
    xField: 'date',
    yField: 'netFlow',
    color: ({ netFlow }: any) => netFlow >= 0 ? '#52c41a' : '#ff4d4f',
    meta: {
      netFlow: {
        alias: '净流水(元)',
      },
    },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      label: {
        formatter: (v: string) => `¥${Number(v).toFixed(0)}`,
      },
    },
  };

  // 流水类型分布图表配置
  const typeDistributionConfig = {
    data: flowTypeData,
    xField: 'type',
    yField: 'amount',
    meta: {
      amount: {
        alias: '金额(元)',
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `¥${Number(v).toFixed(0)}`,
      },
    },
  };

  // 表格列定义
  const columns = [
    {
      title: '时间',
      dataIndex: 'flow_time',
      key: 'flow_time',
      width: 150,
      render: (time: string) => dayjs(time).format('MM-DD HH:mm'),
    },
    {
      title: '类型',
      dataIndex: 'flow_type',
      key: 'flow_type',
      width: 120,
      render: (type: string) => {
        const typeInfo = (flowTypeMap as any)[type] || { text: type, color: 'default' };
        return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => (
        <Text style={{ color: amount >= 0 ? '#cf1322' : '#3f8600' }}>
          {amount >= 0 ? '+' : ''}¥{(amount / 100).toFixed(2)}
        </Text>
      ),
    },
    {
      title: '余额',
      dataIndex: 'balance_after',
      key: 'balance_after',
      width: 120,
      align: 'right' as const,
      render: (balance: number) => `¥${(balance / 100).toFixed(2)}`,
    },
    {
      title: '关联代码',
      dataIndex: 'related_code',
      key: 'related_code',
      width: 100,
      render: (code?: string) => code ? <Text code>{code}</Text> : '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (description: string) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
    {
      title: '流水号',
      dataIndex: 'flow_id',
      key: 'flow_id',
      width: 120,
      render: (id: string) => <Text code>{id}</Text>,
    },
  ];

  return (
    <div>
      {/* 统计概览 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                ¥{statistics.totalInFlow.toFixed(2)}
              </Title>
              <Text type="secondary">总流入</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: 0, color: '#ff4d4f' }}>
                ¥{statistics.totalOutFlow.toFixed(2)}
              </Title>
              <Text type="secondary">总流出</Text>
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
                  color: statistics.netFlow >= 0 ? '#52c41a' : '#ff4d4f' 
                }}
              >
                {statistics.netFlow >= 0 ? '+' : ''}¥{statistics.netFlow.toFixed(2)}
              </Title>
              <Text type="secondary">净流水</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                {statistics.totalTransactions}
              </Title>
              <Text type="secondary">总笔数</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表展示 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="每日净流水趋势" size="small">
            <Column {...dailyFlowConfig} height={250} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="流水类型分布" size="small">
            <Column {...typeDistributionConfig} height={250} />
          </Card>
        </Col>
      </Row>

      {/* 流水记录表 */}
      <Card 
        title="资金流水记录" 
        size="small"
        extra={
          <Space wrap>
            <Search
              placeholder="搜索描述/代码/流水号"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              value={flowTypeFilter}
              onChange={setFlowTypeFilter}
              style={{ width: 120 }}
              placeholder="流水类型"
            >
              <Option value="all">全部类型</Option>
              {Object.entries(flowTypeMap).map(([key, value]) => (
                <Option key={key} value={key}>{value.text}</Option>
              ))}
            </Select>
            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0], dates[1]]);
                } else {
                  setDateRange(null);
                }
              }}
              placeholder={['开始日期', '结束日期']}
            />
            <Button icon={<FilterOutlined />} onClick={() => {
              setSearchText('');
              setFlowTypeFilter('all');
              setDateRange(null);
            }}>
              清除筛选
            </Button>
            <Button icon={<DownloadOutlined />}>
              导出
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredFlows}
          rowKey="flow_id"
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default FundFlowHistory;
