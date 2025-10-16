import React, { useState, useEffect } from 'react';
import { Card, Table, Spin, Select, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Line } from '@ant-design/plots';

interface GreeksData {
  strikePrice: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

interface OptionsGreeksProps {
  stockCode: string;
}

/**
 * 希腊字母分析组件
 */
const OptionsGreeks: React.FC<OptionsGreeksProps> = ({ stockCode }) => {
  const [loading, setLoading] = useState(false);
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [greeksData, setGreeksData] = useState<GreeksData[]>([]);

  useEffect(() => {
    const loadGreeksData = async () => {
      setLoading(true);
      try {
        // TODO: 调用实际 API
        // const response = await fetch(`/api/options/greeks?stockCode=${stockCode}&type=${optionType}`);
        // const result = await response.json();
        
        // Mock 数据
        const mockData: GreeksData[] = [
          {
            strikePrice: 2.8,
            delta: 0.7234,
            gamma: 0.0089,
            theta: -0.0234,
            vega: 0.0456,
            rho: 0.0123,
          },
          {
            strikePrice: 2.9,
            delta: 0.6123,
            gamma: 0.0123,
            theta: -0.0289,
            vega: 0.0567,
            rho: 0.0145,
          },
          {
            strikePrice: 3.0,
            delta: 0.5012,
            gamma: 0.0145,
            theta: -0.0312,
            vega: 0.0623,
            rho: 0.0156,
          },
          {
            strikePrice: 3.1,
            delta: 0.3901,
            gamma: 0.0134,
            theta: -0.0298,
            vega: 0.0589,
            rho: 0.0142,
          },
          {
            strikePrice: 3.2,
            delta: 0.2890,
            gamma: 0.0098,
            theta: -0.0245,
            vega: 0.0478,
            rho: 0.0128,
          },
        ];

        setGreeksData(mockData);
      } catch (error) {
        console.error('加载希腊字母数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGreeksData();
  }, [stockCode, optionType]);

  const columns: ColumnsType<GreeksData> = [
    {
      title: '行权价',
      dataIndex: 'strikePrice',
      key: 'strikePrice',
      width: 100,
      fixed: 'left',
      render: (val: number) => val.toFixed(3),
    },
    {
      title: 'Delta (Δ)',
      dataIndex: 'delta',
      key: 'delta',
      width: 120,
      align: 'right',
      render: (val: number) => val.toFixed(4),
    },
    {
      title: 'Gamma (Γ)',
      dataIndex: 'gamma',
      key: 'gamma',
      width: 120,
      align: 'right',
      render: (val: number) => val.toFixed(4),
    },
    {
      title: 'Theta (Θ)',
      dataIndex: 'theta',
      key: 'theta',
      width: 120,
      align: 'right',
      render: (val: number) => (
        <span style={{ color: val < 0 ? '#ff4d4f' : '#52c41a' }}>
          {val.toFixed(4)}
        </span>
      ),
    },
    {
      title: 'Vega (ν)',
      dataIndex: 'vega',
      key: 'vega',
      width: 120,
      align: 'right',
      render: (val: number) => val.toFixed(4),
    },
    {
      title: 'Rho (ρ)',
      dataIndex: 'rho',
      key: 'rho',
      width: 120,
      align: 'right',
      render: (val: number) => val.toFixed(4),
    },
  ];

  // Delta 曲线图数据
  const deltaChartData = greeksData.map(item => ({
    strike: item.strikePrice.toString(),
    value: item.delta,
  }));

  const deltaChartConfig = {
    data: deltaChartData,
    xField: 'strike',
    yField: 'value',
    point: {
      size: 5,
      shape: 'circle',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    smooth: true,
  };

  return (
    <Spin spinning={loading}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <span style={{ marginRight: 8 }}>期权类型：</span>
          <Select
            style={{ width: 120 }}
            value={optionType}
            onChange={setOptionType}
            options={[
              { label: '认购期权', value: 'call' },
              { label: '认沽期权', value: 'put' },
            ]}
          />
        </div>

        <Card title="Delta 曲线">
          <Line {...deltaChartConfig} height={250} />
        </Card>

        <Card title="希腊字母详细数据">
          <Table
            columns={columns}
            dataSource={greeksData}
            rowKey="strikePrice"
            pagination={false}
            scroll={{ x: 700 }}
            size="small"
          />
          <div style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
            <p><strong>说明：</strong></p>
            <ul style={{ paddingLeft: 20 }}>
              <li><strong>Delta (Δ)</strong>：标的价格变动1元时，期权价格的变动量</li>
              <li><strong>Gamma (Γ)</strong>：标的价格变动1元时，Delta的变动量</li>
              <li><strong>Theta (Θ)</strong>：时间流逝1天，期权价格的变动量（通常为负）</li>
              <li><strong>Vega (ν)</strong>：波动率变动1%时，期权价格的变动量</li>
              <li><strong>Rho (ρ)</strong>：利率变动1%时，期权价格的变动量</li>
            </ul>
          </div>
        </Card>
      </Space>
    </Spin>
  );
};

export default OptionsGreeks;
