import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, DatePicker } from 'antd';
import { Line, DualAxes } from '@ant-design/plots';
import dayjs, { Dayjs } from 'dayjs';

interface VolatilityData {
  date: string;
  historicalVol: number;
  impliedVol: number;
}

interface OptionsVolatilityProps {
  stockCode: string;
}

/**
 * 波动率分析组件
 */
const OptionsVolatility: React.FC<OptionsVolatilityProps> = ({ stockCode }) => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(3, 'month'));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [volatilityData, setVolatilityData] = useState<VolatilityData[]>([]);
  const [currentIV, setCurrentIV] = useState(0);
  const [currentHV, setCurrentHV] = useState(0);

  useEffect(() => {
    const loadVolatilityData = async () => {
      setLoading(true);
      try {
        // TODO: 调用实际 API
        // const response = await fetch(
        //   `/api/options/volatility?stockCode=${stockCode}&start=${startDate.format('YYYY-MM-DD')}&end=${endDate.format('YYYY-MM-DD')}`
        // );
        // const result = await response.json();
        
        // Mock 数据
        const mockData: VolatilityData[] = [];
        let current = dayjs(startDate);
        while (current.isBefore(endDate)) {
          mockData.push({
            date: current.format('YYYY-MM-DD'),
            historicalVol: 18 + Math.random() * 8,
            impliedVol: 20 + Math.random() * 6,
          });
          current = current.add(1, 'day');
        }

        setVolatilityData(mockData);
        setCurrentIV(mockData[mockData.length - 1]?.impliedVol || 0);
        setCurrentHV(mockData[mockData.length - 1]?.historicalVol || 0);
      } catch (error) {
        console.error('加载波动率数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVolatilityData();
  }, [stockCode, startDate, endDate]);

  const chartData = volatilityData.map(item => ({
    date: item.date,
    value: item.impliedVol,
    type: '隐含波动率',
  })).concat(volatilityData.map(item => ({
    date: item.date,
    value: item.historicalVol,
    type: '历史波动率',
  })));

  const chartConfig = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    point: {
      size: 0,
    },
    legend: {
      position: 'top' as const,
    },
    color: ['#5B8FF9', '#5AD8A6'],
  };

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="当前隐含波动率 (IV)"
              value={currentIV}
              precision={2}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="当前历史波动率 (HV)"
              value={currentHV}
              precision={2}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col span={24}>
          <Card 
            title="波动率走势" 
            extra={
              <DatePicker.RangePicker
                value={[startDate, endDate]}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setStartDate(dates[0]);
                    setEndDate(dates[1]);
                  }
                }}
                format="YYYY-MM-DD"
              />
            }
          >
            <Line {...chartConfig} height={350} />
            <div style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
              <p><strong>说明：</strong></p>
              <ul style={{ paddingLeft: 20 }}>
                <li>
                  <strong>隐含波动率 (Implied Volatility, IV)</strong>：
                  由期权市场价格反推出的波动率，反映市场对未来波动的预期
                </li>
                <li>
                  <strong>历史波动率 (Historical Volatility, HV)</strong>：
                  根据标的资产历史价格计算出的实际波动率
                </li>
                <li>
                  当 IV &gt; HV 时，表示期权价格可能被高估；当 IV &lt; HV 时，表示期权价格可能被低估
                </li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default OptionsVolatility;
