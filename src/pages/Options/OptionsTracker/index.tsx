import React, { useState, useEffect } from 'react';
import { Card, Table, Space, Tag, DatePicker, Button, Select, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

/**
 * 期权交易记录
 */
interface OptionsRecord {
  id: string;
  /** 标的代码 */
  underlying: string;
  /** 标的名称 */
  underlyingName: string;
  /** 期权合约代码 */
  optionCode: string;
  /** 期权类型 */
  optionType: 'call' | 'put';
  /** 行权价 */
  strikePrice: number;
  /** 到期日 */
  expiryDate: string;
  /** 成交量 */
  volume: number;
  /** 成交额 */
  amount: number;
  /** 隐含波动率 */
  impliedVolatility: number;
  /** 涨跌幅 */
  changePercent: number;
  /** 交易时间 */
  tradeTime: string;
}

/**
 * 市场统计数据
 */
interface MarketStats {
  totalVolume: number;
  totalAmount: number;
  callVolume: number;
  putVolume: number;
  putCallRatio: number;
}

const OptionsTracker: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<OptionsRecord[]>([]);
  const [marketStats, setMarketStats] = useState<MarketStats>({
    totalVolume: 0,
    totalAmount: 0,
    callVolume: 0,
    putVolume: 0,
    putCallRatio: 0,
  });
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedUnderlying, setSelectedUnderlying] = useState<string>('all');

  /**
   * 加载期权数据
   */
  const loadOptionsData = async () => {
    setLoading(true);
    try {
      // TODO: 替换为实际的 API 调用
      // const response = await fetch(`/api/options/tracker?date=${selectedDate.format('YYYY-MM-DD')}&underlying=${selectedUnderlying}`);
      // const data = await response.json();
      
      // Mock 数据
      const mockData: OptionsRecord[] = [
        {
          id: '1',
          underlying: '510050',
          underlyingName: '50ETF',
          optionCode: '10004345',
          optionType: 'call',
          strikePrice: 3.0,
          expiryDate: '2025-03-26',
          volume: 125680,
          amount: 3567000,
          impliedVolatility: 18.5,
          changePercent: 5.2,
          tradeTime: '14:35:23',
        },
        {
          id: '2',
          underlying: '510050',
          underlyingName: '50ETF',
          optionCode: '10004346',
          optionType: 'put',
          strikePrice: 2.9,
          expiryDate: '2025-03-26',
          volume: 98450,
          amount: 2145000,
          impliedVolatility: 20.3,
          changePercent: -3.8,
          tradeTime: '14:32:15',
        },
      ];

      setDataSource(mockData);

      // 计算市场统计
      const callVol = mockData.filter(item => item.optionType === 'call').reduce((sum, item) => sum + item.volume, 0);
      const putVol = mockData.filter(item => item.optionType === 'put').reduce((sum, item) => sum + item.volume, 0);
      const totalVol = callVol + putVol;
      const totalAmt = mockData.reduce((sum, item) => sum + item.amount, 0);

      setMarketStats({
        totalVolume: totalVol,
        totalAmount: totalAmt,
        callVolume: callVol,
        putVolume: putVol,
        putCallRatio: putVol / callVol,
      });
    } catch (error) {
      console.error('加载期权数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptionsData();
  }, [selectedDate, selectedUnderlying]);

  const columns: ColumnsType<OptionsRecord> = [
    {
      title: '标的',
      dataIndex: 'underlyingName',
      key: 'underlyingName',
      width: 100,
      fixed: 'left',
    },
    {
      title: '合约代码',
      dataIndex: 'optionCode',
      key: 'optionCode',
      width: 120,
    },
    {
      title: '类型',
      dataIndex: 'optionType',
      key: 'optionType',
      width: 80,
      render: (type: string) => (
        <Tag color={type === 'call' ? 'green' : 'red'}>
          {type === 'call' ? '认购' : '认沽'}
        </Tag>
      ),
    },
    {
      title: '行权价',
      dataIndex: 'strikePrice',
      key: 'strikePrice',
      width: 100,
      align: 'right',
      render: (price: number) => price.toFixed(3),
    },
    {
      title: '到期日',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 120,
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.volume - b.volume,
      render: (vol: number) => vol.toLocaleString(),
    },
    {
      title: '成交额(元)',
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      align: 'right',
      sorter: (a, b) => a.amount - b.amount,
      render: (amt: number) => amt.toLocaleString(),
    },
    {
      title: '隐含波动率',
      dataIndex: 'impliedVolatility',
      key: 'impliedVolatility',
      width: 120,
      align: 'right',
      render: (iv: number) => `${iv.toFixed(2)}%`,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      key: 'changePercent',
      width: 100,
      align: 'right',
      sorter: (a, b) => a.changePercent - b.changePercent,
      render: (change: number) => (
        <span style={{ color: change >= 0 ? '#cf1322' : '#3f8600' }}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
      ),
    },
    {
      title: '交易时间',
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      width: 110,
    },
  ];

  return (
    <PageContainer
      title="期权追踪"
      subTitle="实时追踪期权市场交易数据"
    >
      {/* 市场统计 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总成交量"
              value={marketStats.totalVolume}
              suffix="张"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总成交额"
              value={marketStats.totalAmount / 10000}
              precision={2}
              suffix="万元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="认购成交量"
              value={marketStats.callVolume}
              suffix="张"
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="PCR(认沽/认购)"
              value={marketStats.putCallRatio}
              precision={2}
              valueStyle={{ color: marketStats.putCallRatio > 1 ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选工具栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <DatePicker
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            format="YYYY-MM-DD"
          />
          <Select
            style={{ width: 150 }}
            value={selectedUnderlying}
            onChange={setSelectedUnderlying}
            options={[
              { label: '全部', value: 'all' },
              { label: '50ETF', value: '510050' },
              { label: '300ETF', value: '510300' },
              { label: '500ETF', value: '510500' },
            ]}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={loadOptionsData}
            loading={loading}
          >
            刷新
          </Button>
        </Space>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default OptionsTracker;
