import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Space, DatePicker, Select, Statistic, Row, Col, Empty } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { getInsiderTrading, getInsiderStats } from '@/services/insider/insiderTradingService';
import { formatNumber, formatCurrency } from '@/utils/format';
import styles from './index.less';

const { RangePicker } = DatePicker;

interface InsiderTrade {
  id: string;
  reportingName: string;
  position: string;
  transactionType: string;
  transactionDate: string;
  shares: number;
  price: number;
  value: number;
  sharesOwnedAfter: number;
  signalStrength?: number;
}

interface InsiderTradingPanelProps {
  stockCode: string;
}

const InsiderTradingPanel: React.FC<InsiderTradingPanelProps> = ({ stockCode }) => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<InsiderTrade[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(1, 'year'),
    dayjs(),
  ]);
  const [transactionType, setTransactionType] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [stockCode, dateRange, transactionType]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tradesRes, statsRes] = await Promise.all([
        getInsiderTrading({
          stockCode,
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].format('YYYY-MM-DD'),
          transactionType: transactionType === 'all' ? undefined : transactionType,
        }),
        getInsiderStats(stockCode),
      ]);

      if (tradesRes.success) {
        setDataSource(tradesRes.data || []);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('加载内部交易数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
      P: { color: 'green', text: '买入' },
      S: { color: 'red', text: '卖出' },
      A: { color: 'blue', text: '授予' },
      D: { color: 'orange', text: '处置' },
      M: { color: 'purple', text: '行权' },
    };
    const config = typeMap[type] || { color: 'default', text: type };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getSignalStrengthTag = (strength?: number) => {
    if (!strength) return null;
    
    let color = 'default';
    let text = '中性';
    
    if (strength >= 8) {
      color = 'green';
      text = '强烈看多';
    } else if (strength >= 6) {
      color = 'success';
      text = '看多';
    } else if (strength <= 2) {
      color = 'red';
      text = '强烈看空';
    } else if (strength <= 4) {
      color = 'error';
      text = '看空';
    }
    
    return <Tag color={color}>{text} ({strength.toFixed(1)})</Tag>;
  };

  const columns: ColumnsType<InsiderTrade> = [
    {
      title: '交易日期',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.transactionDate).unix() - dayjs(b.transactionDate).unix(),
    },
    {
      title: '交易人',
      dataIndex: 'reportingName',
      key: 'reportingName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
      width: 120,
      ellipsis: true,
    },
    {
      title: '交易类型',
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: 100,
      render: (type: string) => getTransactionTypeTag(type),
    },
    {
      title: '交易股数',
      dataIndex: 'shares',
      key: 'shares',
      width: 120,
      align: 'right',
      render: (shares: number) => formatNumber(shares),
      sorter: (a, b) => a.shares - b.shares,
    },
    {
      title: '交易价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: '交易金额',
      dataIndex: 'value',
      key: 'value',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value),
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: '交易后持股',
      dataIndex: 'sharesOwnedAfter',
      key: 'sharesOwnedAfter',
      width: 120,
      align: 'right',
      render: (shares: number) => formatNumber(shares),
    },
    {
      title: '信号强度',
      dataIndex: 'signalStrength',
      key: 'signalStrength',
      width: 140,
      render: (strength?: number) => getSignalStrengthTag(strength),
    },
  ];

  return (
    <div className={styles.insiderTradingPanel}>
      {stats && (
        <Row gutter={16} className={styles.statsRow}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="近3个月买入金额"
                value={stats.buyAmount3M}
                prefix="¥"
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                suffix={<ArrowUpOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="近3个月卖出金额"
                value={stats.sellAmount3M}
                prefix="¥"
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                suffix={<ArrowDownOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="净买入金额"
                value={stats.netAmount}
                prefix="¥"
                precision={2}
                valueStyle={{ color: stats.netAmount > 0 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="交易次数"
                value={stats.tradeCount}
                suffix="次"
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card className={styles.tableCard}>
        <Space className={styles.filterBar} size="middle">
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            format="YYYY-MM-DD"
          />
          <Select
            value={transactionType}
            onChange={setTransactionType}
            style={{ width: 120 }}
            options={[
              { label: '全部类型', value: 'all' },
              { label: '买入', value: 'P' },
              { label: '卖出', value: 'S' },
              { label: '授予', value: 'A' },
              { label: '处置', value: 'D' },
              { label: '行权', value: 'M' },
            ]}
          />
        </Space>

        <Table
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: <Empty description="暂无内部交易数据" />,
          }}
        />
      </Card>
    </div>
  );
};

export default InsiderTradingPanel;
