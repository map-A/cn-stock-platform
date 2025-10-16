/**
 * 希腊字母分析Tab
 */

import React, { useState } from 'react';
import { Card, Radio, Space, Statistic, Row, Col, Tabs } from 'antd';
import { useRequest } from 'ahooks';
import { getGreeksByExpiry, getGreeksByStrike } from '@/services/options';
import { Column } from '@ant-design/plots';

interface GreeksProps {
  ticker: string;
}

const Greeks: React.FC<GreeksProps> = ({ ticker }) => {
  const [greek, setGreek] = useState<'delta' | 'gamma'>('delta');
  const [viewType, setViewType] = useState<'expiry' | 'strike'>('expiry');

  const { data: expiryData, loading: expiryLoading } = useRequest(
    () => getGreeksByExpiry(ticker, greek),
    { refreshDeps: [ticker, greek], ready: viewType === 'expiry' },
  );

  const { data: strikeData, loading: strikeLoading } = useRequest(
    () => getGreeksByStrike(ticker, greek),
    { refreshDeps: [ticker, greek], ready: viewType === 'strike' },
  );

  const loading = viewType === 'expiry' ? expiryLoading : strikeLoading;

  // 准备图表数据
  const chartData =
    viewType === 'expiry' && expiryData
      ? expiryData.expiries.flatMap((item) => [
          { date: item.expiryDate, type: 'Call', value: item.totalCall },
          { date: item.expiryDate, type: 'Put', value: item.totalPut },
          { date: item.expiryDate, type: '净暴露', value: item.netExposure },
        ])
      : viewType === 'strike' && strikeData
      ? strikeData.strikes.flatMap((item) => [
          { strike: item.strike, type: 'Call', value: item.totalCall },
          { strike: item.strike, type: 'Put', value: item.totalPut },
          { strike: item.strike, type: '净暴露', value: item.netExposure },
        ])
      : [];

  // 计算统计
  const stats =
    viewType === 'expiry' && expiryData
      ? {
          totalCallGreek: expiryData.expiries.reduce((sum, item) => sum + item.totalCall, 0),
          totalPutGreek: expiryData.expiries.reduce((sum, item) => sum + item.totalPut, 0),
          netExposure: expiryData.expiries.reduce((sum, item) => sum + item.netExposure, 0),
        }
      : viewType === 'strike' && strikeData
      ? {
          totalCallGreek: strikeData.strikes.reduce((sum, item) => sum + item.totalCall, 0),
          totalPutGreek: strikeData.strikes.reduce((sum, item) => sum + item.totalPut, 0),
          netExposure: strikeData.strikes.reduce((sum, item) => sum + item.netExposure, 0),
        }
      : null;

  return (
    <div>
      {/* 控制面板 */}
      <Card style={{ marginBottom: 16 }}>
        <Space size="large">
          <Space>
            <span>希腊字母:</span>
            <Radio.Group value={greek} onChange={(e) => setGreek(e.target.value)}>
              <Radio.Button value="delta">Delta (Δ)</Radio.Button>
              <Radio.Button value="gamma">Gamma (Γ)</Radio.Button>
            </Radio.Group>
          </Space>
          <Space>
            <span>视图:</span>
            <Radio.Group value={viewType} onChange={(e) => setViewType(e.target.value)}>
              <Radio.Button value="expiry">按到期日</Radio.Button>
              <Radio.Button value="strike">按行权价</Radio.Button>
            </Radio.Group>
          </Space>
        </Space>
      </Card>

      {/* 统计信息 */}
      {stats && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Statistic
                title={`总Call ${greek.toUpperCase()}`}
                value={stats.totalCallGreek}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title={`总Put ${greek.toUpperCase()}`}
                value={stats.totalPutGreek}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title={`净${greek.toUpperCase()}暴露`}
                value={stats.netExposure}
                precision={2}
                valueStyle={{ color: stats.netExposure > 0 ? '#cf1322' : '#3f8600' }}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* 图表 */}
      <Card
        title={`${greek.toUpperCase()}暴露分析 - ${
          viewType === 'expiry' ? '按到期日' : '按行权价'
        }`}
        loading={loading}
      >
        {chartData.length > 0 ? (
          <Column
            data={chartData}
            xField={viewType === 'expiry' ? 'date' : 'strike'}
            yField="value"
            seriesField="type"
            isGroup
            height={400}
            color={['#ff4d4f', '#52c41a', '#1890ff']}
            legend={{ position: 'top' }}
            label={{
              position: 'top',
              formatter: (datum: any) => {
                if (Math.abs(datum.value) > 1000) {
                  return (datum.value / 1000).toFixed(1) + 'K';
                }
                return datum.value.toFixed(0);
              },
            }}
            tooltip={{
              formatter: (datum: any) => ({
                name: datum.type,
                value: datum.value.toFixed(2),
              }),
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            暂无数据
          </div>
        )}
      </Card>

      {/* 说明 */}
      <Card title="说明" style={{ marginTop: 16 }}>
        <div style={{ lineHeight: '1.8' }}>
          {greek === 'delta' ? (
            <>
              <p>
                <strong>Delta (Δ)</strong>: 衡量期权价格相对于标的资产价格变化的敏感度。
              </p>
              <ul>
                <li>Call Delta: 0到1之间，标的价格上涨1美元，期权价格上涨Delta美元</li>
                <li>Put Delta: -1到0之间，标的价格上涨1美元，期权价格下跌|Delta|美元</li>
                <li>正Delta表示看涨，负Delta表示看跌</li>
              </ul>
            </>
          ) : (
            <>
              <p>
                <strong>Gamma (Γ)</strong>: 衡量Delta相对于标的资产价格变化的敏感度。
              </p>
              <ul>
                <li>Gamma越大，Delta变化越快，期权风险越大</li>
                <li>ATM期权的Gamma最大，ITM和OTM的Gamma较小</li>
                <li>接近到期时，Gamma会急剧增加</li>
              </ul>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Greeks;
