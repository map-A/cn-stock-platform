/**
 * ETF资金流向Tab
 */

import React, { useState } from 'react';
import { Card, DatePicker, Space, Statistic, Row, Col } from 'antd';
import { useRequest } from 'ahooks';
import { getETFFlowHistory } from '@/services/etf';
import { Line } from '@ant-design/plots';
import dayjs from 'dayjs';
import PriceTag from '@/components/PriceTag';

const { RangePicker } = DatePicker;

interface FlowTabProps {
  code: string;
}

const FlowTab: React.FC<FlowTabProps> = ({ code }) => {
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);

  const { data: flowData, loading } = useRequest(
    () =>
      getETFFlowHistory(code, {
        startDate: dateRange[0],
        endDate: dateRange[1],
      }),
    { refreshDeps: [code, dateRange] },
  );

  // 计算统计数据
  const stats = flowData
    ? flowData.reduce(
        (acc, item) => ({
          totalInflow: acc.totalInflow + item.inflow,
          totalOutflow: acc.totalOutflow + item.outflow,
          totalNetFlow: acc.totalNetFlow + item.netFlow,
        }),
        { totalInflow: 0, totalOutflow: 0, totalNetFlow: 0 },
      )
    : { totalInflow: 0, totalOutflow: 0, totalNetFlow: 0 };

  // 准备图表数据
  const chartData = flowData
    ? flowData.flatMap((item) => [
        { date: item.date, type: '流入', value: item.inflow / 100000000 },
        { date: item.date, type: '流出', value: -item.outflow / 100000000 },
        { date: item.date, type: '净流入', value: item.netFlow / 100000000 },
      ])
    : [];

  return (
    <div>
      {/* 筛选器 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>日期范围:</span>
          <RangePicker
            value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
            onChange={(dates) => {
              if (dates) {
                setDateRange([
                  dates[0]!.format('YYYY-MM-DD'),
                  dates[1]!.format('YYYY-MM-DD'),
                ]);
              }
            }}
            presets={[
              { label: '近1月', value: [dayjs().subtract(1, 'month'), dayjs()] },
              { label: '近3月', value: [dayjs().subtract(3, 'month'), dayjs()] },
              { label: '近6月', value: [dayjs().subtract(6, 'month'), dayjs()] },
              { label: '近1年', value: [dayjs().subtract(1, 'year'), dayjs()] },
            ]}
          />
        </Space>
      </Card>

      {/* 统计卡片 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="累计流入(亿)"
              value={stats.totalInflow / 100000000}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="累计流出(亿)"
              value={stats.totalOutflow / 100000000}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={8}>
            <div>
              <div style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 14, marginBottom: 8 }}>
                累计净流入(亿)
              </div>
              <PriceTag
                value={stats.totalNetFlow / 100000000}
                precision={2}
                showIcon
                style={{ fontSize: 24, fontWeight: 600 }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* 资金流向图表 */}
      <Card title="资金流向趋势" loading={loading}>
        {chartData.length > 0 ? (
          <Line
            data={chartData}
            xField="date"
            yField="value"
            seriesField="type"
            height={400}
            legend={{ position: 'top' }}
            yAxis={{
              label: {
                formatter: (v) => `${v}亿`,
              },
            }}
            color={['#ff4d4f', '#52c41a', '#1890ff']}
            tooltip={{
              formatter: (datum: any) => ({
                name: datum.type,
                value: `${datum.value > 0 ? '+' : ''}${datum.value.toFixed(2)}亿`,
              }),
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            暂无数据
          </div>
        )}
      </Card>
    </div>
  );
};

export default FlowTab;
