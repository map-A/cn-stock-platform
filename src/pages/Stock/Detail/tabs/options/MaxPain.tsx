/**
 * 最大痛点分析Tab
 */

import React, { useState } from 'react';
import { Card, DatePicker, Space, Alert, Statistic } from 'antd';
import { useRequest } from 'ahooks';
import { getMaxPain } from '@/services/options';
import { Column, Line } from '@ant-design/plots';
import dayjs from 'dayjs';

interface MaxPainProps {
  ticker: string;
}

const MaxPain: React.FC<MaxPainProps> = ({ ticker }) => {
  const [expiryDate, setExpiryDate] = useState<string>();

  const { data: maxPainData, loading } = useRequest(
    () => getMaxPain(ticker, expiryDate),
    { refreshDeps: [ticker, expiryDate] },
  );

  // 准备图表数据
  const chartData = maxPainData
    ? maxPainData.strikes.map((item) => ({
        strike: item.strike,
        totalPain: item.totalPain / 1000000, // 转换为百万
        callPain: item.callPain / 1000000,
        putPain: item.putPain / 1000000,
      }))
    : [];

  const oiData = maxPainData
    ? maxPainData.strikes.flatMap((item) => [
        { strike: item.strike, type: 'Call OI', value: item.callOI },
        { strike: item.strike, type: 'Put OI', value: item.putOI },
      ])
    : [];

  return (
    <div>
      {/* 筛选器 */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <span>到期日:</span>
          <DatePicker
            value={expiryDate ? dayjs(expiryDate) : undefined}
            onChange={(date) => setExpiryDate(date ? date.format('YYYY-MM-DD') : undefined)}
            placeholder="选择到期日"
          />
        </Space>
      </Card>

      {/* 说明 */}
      <Alert
        message="什么是最大痛点(Max Pain)？"
        description="最大痛点是指在到期日时，会让期权买方（包括看涨和看跌）遭受最大损失的股价水平。做市商通常会试图将股价推向这个价位，以最大化自己的收益。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* 最大痛点价格 */}
      {maxPainData && (
        <Card style={{ marginBottom: 16 }}>
          <Statistic
            title={`最大痛点价格 (${maxPainData.expiryDate})`}
            value={maxPainData.maxPainStrike}
            precision={2}
            prefix="$"
            valueStyle={{ color: '#1890ff', fontSize: 32 }}
          />
          <div style={{ marginTop: 16, color: '#999' }}>
            在此价格水平，期权买方的总损失最大
          </div>
        </Card>
      )}

      {/* 痛点分布图 */}
      <Card title="痛点分布" loading={loading} style={{ marginBottom: 16 }}>
        {chartData.length > 0 ? (
          <Line
            data={chartData}
            xField="strike"
            yField="totalPain"
            height={350}
            xAxis={{
              title: { text: '行权价 ($)' },
            }}
            yAxis={{
              title: { text: '总痛点 (百万$)' },
              label: {
                formatter: (v) => `$${v}M`,
              },
            }}
            annotations={
              maxPainData
                ? [
                    {
                      type: 'line',
                      start: [maxPainData.maxPainStrike, 'min'],
                      end: [maxPainData.maxPainStrike, 'max'],
                      style: { stroke: '#ff4d4f', lineWidth: 2, lineDash: [4, 4] },
                      text: {
                        content: `Max Pain: $${maxPainData.maxPainStrike}`,
                        position: 'top',
                        style: { fill: '#ff4d4f' },
                      },
                    },
                  ]
                : []
            }
            tooltip={{
              formatter: (datum: any) => ({
                name: '总痛点',
                value: `$${datum.totalPain.toFixed(2)}M`,
              }),
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            请选择到期日查看数据
          </div>
        )}
      </Card>

      {/* Call vs Put痛点对比 */}
      {chartData.length > 0 && (
        <Card title="Call vs Put 痛点对比" style={{ marginBottom: 16 }}>
          <Column
            data={chartData.flatMap((item) => [
              { strike: item.strike, type: 'Call Pain', value: item.callPain },
              { strike: item.strike, type: 'Put Pain', value: item.putPain },
            ])}
            xField="strike"
            yField="value"
            seriesField="type"
            isStack
            height={300}
            color={['#ff4d4f', '#52c41a']}
            legend={{ position: 'top' }}
            label={{
              position: 'middle',
              formatter: (datum: any) => {
                if (datum.value > 10) {
                  return `$${datum.value.toFixed(0)}M`;
                }
                return '';
              },
            }}
          />
        </Card>
      )}

      {/* 持仓量分布 */}
      {oiData.length > 0 && (
        <Card title="持仓量分布">
          <Column
            data={oiData}
            xField="strike"
            yField="value"
            seriesField="type"
            isGroup
            height={300}
            color={['#ff4d4f', '#52c41a']}
            legend={{ position: 'top' }}
            yAxis={{
              label: {
                formatter: (v) => {
                  if (Number(v) >= 1000) {
                    return `${(Number(v) / 1000).toFixed(0)}K`;
                  }
                  return v;
                },
              },
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default MaxPain;
