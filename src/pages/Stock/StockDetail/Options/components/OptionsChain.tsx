import React, { useState, useEffect } from 'react';
import { Table, Select, Space, Tag, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface OptionsChainRecord {
  /** 认购期权 */
  call: {
    code: string;
    bid: number;
    ask: number;
    lastPrice: number;
    volume: number;
    openInterest: number;
    impliedVolatility: number;
    delta: number;
    gamma: number;
  };
  /** 行权价 */
  strikePrice: number;
  /** 认沽期权 */
  put: {
    code: string;
    bid: number;
    ask: number;
    lastPrice: number;
    volume: number;
    openInterest: number;
    impliedVolatility: number;
    delta: number;
    gamma: number;
  };
}

interface OptionsChainProps {
  stockCode: string;
}

/**
 * 期权链展示组件
 */
const OptionsChain: React.FC<OptionsChainProps> = ({ stockCode }) => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<OptionsChainRecord[]>([]);
  const [expiryDates, setExpiryDates] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');

  /**
   * 加载期权链数据
   */
  const loadOptionsChain = async (expiry: string) => {
    setLoading(true);
    try {
      // TODO: 调用实际 API
      // const response = await fetch(`/api/options/chain?stockCode=${stockCode}&expiry=${expiry}`);
      // const data = await response.json();
      
      // Mock 数据
      const mockData: OptionsChainRecord[] = [
        {
          call: {
            code: '10004345',
            bid: 0.1234,
            ask: 0.1256,
            lastPrice: 0.1245,
            volume: 125680,
            openInterest: 456789,
            impliedVolatility: 18.5,
            delta: 0.5234,
            gamma: 0.0123,
          },
          strikePrice: 3.0,
          put: {
            code: '10004346',
            bid: 0.0856,
            ask: 0.0878,
            lastPrice: 0.0867,
            volume: 98450,
            openInterest: 234567,
            impliedVolatility: 20.3,
            delta: -0.4766,
            gamma: 0.0123,
          },
        },
        {
          call: {
            code: '10004347',
            bid: 0.0567,
            ask: 0.0589,
            lastPrice: 0.0578,
            volume: 87650,
            openInterest: 345678,
            impliedVolatility: 19.2,
            delta: 0.3456,
            gamma: 0.0145,
          },
          strikePrice: 3.1,
          put: {
            code: '10004348',
            bid: 0.1456,
            ask: 0.1478,
            lastPrice: 0.1467,
            volume: 112340,
            openInterest: 456789,
            impliedVolatility: 21.8,
            delta: -0.6544,
            gamma: 0.0145,
          },
        },
      ];

      setDataSource(mockData);
    } catch (error) {
      console.error('加载期权链数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 加载到期日列表
   */
  useEffect(() => {
    const loadExpiryDates = async () => {
      try {
        // TODO: 调用实际 API
        // const response = await fetch(`/api/options/expiry-dates?stockCode=${stockCode}`);
        // const data = await response.json();
        
        // Mock 数据
        const dates = ['2025-03-26', '2025-04-23', '2025-05-28'];
        setExpiryDates(dates);
        setSelectedExpiry(dates[0]);
      } catch (error) {
        console.error('加载到期日失败:', error);
      }
    };

    loadExpiryDates();
  }, [stockCode]);

  useEffect(() => {
    if (selectedExpiry) {
      loadOptionsChain(selectedExpiry);
    }
  }, [selectedExpiry]);

  const callColumns: ColumnsType<OptionsChainRecord> = [
    {
      title: '合约代码',
      dataIndex: ['call', 'code'],
      width: 100,
    },
    {
      title: '买价',
      dataIndex: ['call', 'bid'],
      width: 80,
      align: 'right',
      render: (val: number) => val.toFixed(4),
    },
    {
      title: '卖价',
      dataIndex: ['call', 'ask'],
      width: 80,
      align: 'right',
      render: (val: number) => val.toFixed(4),
    },
    {
      title: '最新价',
      dataIndex: ['call', 'lastPrice'],
      width: 80,
      align: 'right',
      render: (val: number) => <strong>{val.toFixed(4)}</strong>,
    },
    {
      title: '成交量',
      dataIndex: ['call', 'volume'],
      width: 90,
      align: 'right',
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Delta',
      dataIndex: ['call', 'delta'],
      width: 80,
      align: 'right',
      render: (val: number) => val.toFixed(4),
    },
  ];

  const strikeColumn: ColumnsType<OptionsChainRecord> = [
    {
      title: '行权价',
      dataIndex: 'strikePrice',
      width: 100,
      align: 'center',
      render: (val: number) => (
        <Tag color="blue" style={{ fontSize: 14, fontWeight: 'bold' }}>
          {val.toFixed(3)}
        </Tag>
      ),
    },
  ];

  const putColumns: ColumnsType<OptionsChainRecord> = [
    {
      title: 'Delta',
      dataIndex: ['put', 'delta'],
      width: 80,
      align: 'right',
      render: (val: number) => val.toFixed(4),
    },
    {
      title: '成交量',
      dataIndex: ['put', 'volume'],
      width: 90,
      align: 'right',
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '最新价',
      dataIndex: ['put', 'lastPrice'],
      width: 80,
      align: 'right',
      render: (val: number) => <strong>{val.toFixed(4)}</strong>,
    },
    {
      title: '卖价',
      dataIndex: ['put', 'ask'],
      width: 80,
      align: 'right',
      render: (val: number) => val.toFixed(4),
    },
    {
      title: '买价',
      dataIndex: ['put', 'bid'],
      width: 80,
      align: 'right',
      render: (val: number) => val.toFixed(4),
    },
    {
      title: '合约代码',
      dataIndex: ['put', 'code'],
      width: 100,
    },
  ];

  const allColumns = [...callColumns, ...strikeColumn, ...putColumns];

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <span style={{ marginRight: 8 }}>到期日：</span>
          <Select
            style={{ width: 150 }}
            value={selectedExpiry}
            onChange={setSelectedExpiry}
            options={expiryDates.map(date => ({ label: date, value: date }))}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <Space size="large">
            <span>
              <Tag color="green">认购期权 (Call)</Tag>
            </span>
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>行权价</span>
            <span>
              <Tag color="red">认沽期权 (Put)</Tag>
            </span>
          </Space>
        </div>

        <Table
          columns={allColumns}
          dataSource={dataSource}
          rowKey={(record) => `${record.strikePrice}`}
          pagination={false}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Space>
    </Spin>
  );
};

export default OptionsChain;
