/**
 * 波动率分析Tab
 */

import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { useRequest } from 'ahooks';
import { getVolatilityAnalysis } from '@/services/options';
import { Line, Heatmap } from '@ant-design/plots';

interface VolatilityProps {
  ticker: string;
}

const Volatility: React.FC<VolatilityProps> = ({ ticker }) => {
  const { data: volData, loading } = useRequest(() => getVolatilityAnalysis(ticker), {
    refreshDeps: [ticker],
  });

  // 期限结构数据
  const termStructureData = volData
    ? volData.termStructure.map((item) => ({
        date: item.expiryDate,
        days: item.daysToExpiry,
        iv: item.impliedVolatility * 100,
      }))
    : [];

  // 波动率曲面数据
  const surfaceData = volData
    ? volData.surface.map((item) => ({
        strike: item.strike,
        expiry: item.expiryDate,
        iv: item.impliedVolatility * 100,
      }))
    : [];

  return (
    <div>
      {/* 统计卡片 */}
      {volData && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="当前隐含波动率 (IV)"
                value={volData.currentIV * 100}
                precision={2}
                suffix="%"
                valueStyle={{ color: '#1890ff', fontSize: 24 }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="历史波动率 (HV)"
                value={volData.historicalIV * 100}
                precision={2}
                suffix="%"
              />
            </Col>
            <Col span={6}>
              <div>
                <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: 14, marginBottom: 8 }}>
                  IV百分位
                </div>
                <Progress
                  percent={volData.ivPercentile}
                  strokeColor={
                    volData.ivPercentile > 80
                      ? '#cf1322'
                      : volData.ivPercentile > 50
                      ? '#fa8c16'
                      : '#52c41a'
                  }
                  format={(percent) => `${percent}%`}
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                  当前IV在过去一年中的排名
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div>
                <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: 14, marginBottom: 8 }}>
                  IV等级
                </div>
                <Progress
                  percent={volData.ivRank}
                  strokeColor={
                    volData.ivRank > 80 ? '#cf1322' : volData.ivRank > 50 ? '#fa8c16' : '#52c41a'
                  }
                  format={(percent) => `${percent}%`}
                />
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                  当前IV相对历史区间的位置
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* 说明卡片 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, lineHeight: '1.8' }}>
          <strong>波动率分析指标说明：</strong>
          <ul style={{ marginTop: 8, marginBottom: 0 }}>
            <li>
              <strong>隐含波动率(IV)</strong>: 市场对未来波动的预期，IV越高，期权价格越贵
            </li>
            <li>
              <strong>IV百分位</strong>: 当前IV在过去一年中的排名，&gt;80%表示IV处于历史高位
            </li>
            <li>
              <strong>IV等级</strong>: 当前IV在历史最高和最低之间的位置，&gt;50%表示偏高
            </li>
            <li>
              <strong>期限结构</strong>: 不同到期日的IV分布，通常近月合约IV较高
            </li>
          </ul>
        </div>
      </Card>

      {/* IV期限结构 */}
      <Card title="隐含波动率期限结构" loading={loading} style={{ marginBottom: 16 }}>
        {termStructureData.length > 0 ? (
          <Line
            data={termStructureData}
            xField="days"
            yField="iv"
            height={300}
            xAxis={{
              title: { text: '到期天数' },
            }}
            yAxis={{
              title: { text: '隐含波动率 (%)' },
              label: {
                formatter: (v) => `${v}%`,
              },
            }}
            point={{
              size: 5,
              shape: 'circle',
            }}
            tooltip={{
              formatter: (datum: any) => ({
                name: `${datum.date} (${datum.days}天)`,
                value: `${datum.iv.toFixed(2)}%`,
              }),
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            暂无数据
          </div>
        )}
      </Card>

      {/* 波动率曲面 */}
      <Card title="波动率曲面 (IV Surface)" loading={loading}>
        {surfaceData.length > 0 ? (
          <>
            <Heatmap
              data={surfaceData}
              xField="expiry"
              yField="strike"
              colorField="iv"
              height={400}
              color={['#52c41a', '#faad14', '#ff4d4f']}
              meta={{
                strike: { alias: '行权价' },
                expiry: { alias: '到期日' },
                iv: { alias: 'IV (%)' },
              }}
              tooltip={{
                formatter: (datum: any) => ({
                  name: `${datum.expiry} - $${datum.strike}`,
                  value: `${datum.iv.toFixed(2)}%`,
                }),
              }}
            />
            <div style={{ marginTop: 16, fontSize: 12, color: '#999' }}>
              颜色越深表示波动率越高。通常深度虚值和深度实值期权的IV较高。
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            暂无数据
          </div>
        )}
      </Card>
    </div>
  );
};

export default Volatility;
