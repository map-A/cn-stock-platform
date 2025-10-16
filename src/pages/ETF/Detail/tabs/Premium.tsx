/**
 * ETF溢价折价Tab
 */

import React, { useState } from 'react';
import { Card, DatePicker, Space, Statistic, Row, Col, Tag } from 'antd';
import { useRequest } from 'ahooks';
import { getETFPremiumHistory } from '@/services/etf';
import { Line } from '@ant-design/plots';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface PremiumTabProps {
  code: string;
}

const PremiumTab: React.FC<PremiumTabProps> = ({ code }) => {
  const [dateRange, setDateRange] = useState<[string, string]>([
    dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);

  const { data: premiumData, loading } = useRequest(
    () =>
      getETFPremiumHistory(code, {
        startDate: dateRange[0],
        endDate: dateRange[1],
      }),
    { refreshDeps: [code, dateRange] },
  );

  // 计算统计数据
  const stats = premiumData
    ? {
        avgPremium:
          premiumData.reduce((sum, item) => sum + item.premium, 0) / premiumData.length,
        maxPremium: Math.max(...premiumData.map((item) => item.premium)),
        minPremium: Math.min(...premiumData.map((item) => item.premium)),
        current: premiumData[premiumData.length - 1],
      }
    : null;

  // 准备图表数据
  const chartData = premiumData
    ? premiumData.flatMap((item) => [
        { date: item.date, type: '溢价率', value: item.premium },
        { date: item.date, type: '净值', value: item.netValue, axis: 'right' },
        { date: item.date, type: '市价', value: item.marketPrice, axis: 'right' },
      ])
    : [];

  const getPremiumStatus = (premium: number) => {
    if (premium > 2) return { color: 'red', text: '高溢价' };
    if (premium > 0) return { color: 'orange', text: '溢价' };
    if (premium > -2) return { color: 'green', text: '折价' };
    return { color: 'darkgreen', text: '高折价' };
  };

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
      {stats && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="当前溢价率"
                value={stats.current.premium}
                precision={2}
                suffix="%"
                valueStyle={{
                  color: stats.current.premium > 0 ? '#cf1322' : '#3f8600',
                }}
              />
              <Tag color={getPremiumStatus(stats.current.premium).color} style={{ marginTop: 8 }}>
                {getPremiumStatus(stats.current.premium).text}
              </Tag>
            </Col>
            <Col span={6}>
              <Statistic
                title="平均溢价率"
                value={stats.avgPremium}
                precision={2}
                suffix="%"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="最高溢价率"
                value={stats.maxPremium}
                precision={2}
                suffix="%"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="最低溢价率"
                value={stats.minPremium}
                precision={2}
                suffix="%"
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* 溢价折价图表 */}
      <Card title="溢价折价历史" loading={loading}>
        {chartData.length > 0 ? (
          <Line
            data={chartData.filter((item) => item.type === '溢价率')}
            xField="date"
            yField="value"
            height={400}
            yAxis={{
              label: {
                formatter: (v) => `${v}%`,
              },
            }}
            annotations={[
              {
                type: 'line',
                start: ['min', 0],
                end: ['max', 0],
                style: { stroke: '#999', lineDash: [4, 4] },
              },
            ]}
            areaStyle={() => {
              return {
                fill: 'l(270) 0:#ff4d4f 0.5:transparent 1:#52c41a',
                fillOpacity: 0.3,
              };
            }}
            tooltip={{
              formatter: (datum: any) => ({
                name: '溢价率',
                value: `${datum.value > 0 ? '+' : ''}${datum.value.toFixed(2)}%`,
              }),
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            暂无数据
          </div>
        )}
      </Card>

      {/* 净值vs市价对比 */}
      {stats && (
        <Card title="净值与市价对比" style={{ marginTop: 16 }}>
          <Line
            data={chartData.filter((item) => item.type !== '溢价率')}
            xField="date"
            yField="value"
            seriesField="type"
            height={300}
            yAxis={{
              label: {
                formatter: (v) => `¥${v}`,
              },
            }}
            tooltip={{
              formatter: (datum: any) => ({
                name: datum.type,
                value: `¥${datum.value.toFixed(4)}`,
              }),
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default PremiumTab;
