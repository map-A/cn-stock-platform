import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/plots';

interface OptionsAnalysisProps {
  stockCode: string;
}

interface AnalysisData {
  totalCallVolume: number;
  totalPutVolume: number;
  putCallRatio: number;
  maxPain: number;
  totalCallOI: number;
  totalPutOI: number;
  volumeByStrike: Array<{
    strike: string;
    callVolume: number;
    putVolume: number;
  }>;
}

/**
 * 期权分析组件
 */
const OptionsAnalysis: React.FC<OptionsAnalysisProps> = ({ stockCode }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const loadAnalysisData = async () => {
      setLoading(true);
      try {
        // TODO: 调用实际 API
        // const response = await fetch(`/api/options/analysis?stockCode=${stockCode}`);
        // const result = await response.json();
        
        // Mock 数据
        const mockData: AnalysisData = {
          totalCallVolume: 234567,
          totalPutVolume: 189456,
          putCallRatio: 0.81,
          maxPain: 3.0,
          totalCallOI: 1234567,
          totalPutOI: 987654,
          volumeByStrike: [
            { strike: '2.8', callVolume: 12345, putVolume: 23456 },
            { strike: '2.9', callVolume: 23456, putVolume: 34567 },
            { strike: '3.0', callVolume: 45678, putVolume: 43210 },
            { strike: '3.1', callVolume: 34567, putVolume: 32109 },
            { strike: '3.2', callVolume: 23456, putVolume: 21098 },
          ],
        };

        setData(mockData);
      } catch (error) {
        console.error('加载期权分析数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalysisData();
  }, [stockCode]);

  if (loading || !data) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  const volumeChartData = data.volumeByStrike.flatMap(item => [
    { strike: item.strike, type: '认购', volume: item.callVolume },
    { strike: item.strike, type: '认沽', volume: item.putVolume },
  ]);

  const volumeChartConfig = {
    data: volumeChartData,
    xField: 'strike',
    yField: 'volume',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: ['#52c41a', '#ff4d4f'],
  };

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="认购总成交量"
              value={data.totalCallVolume}
              suffix="张"
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="认沽总成交量"
              value={data.totalPutVolume}
              suffix="张"
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="PCR (认沽/认购)"
              value={data.putCallRatio}
              precision={2}
              valueStyle={{ 
                color: data.putCallRatio > 1 ? '#3f8600' : '#cf1322' 
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="最大痛点"
              value={data.maxPain}
              precision={3}
              suffix="元"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="认购持仓量"
              value={data.totalCallOI}
              suffix="张"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="认沽持仓量"
              value={data.totalPutOI}
              suffix="张"
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="各行权价成交量分布">
            <Column {...volumeChartConfig} height={300} />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default OptionsAnalysis;
