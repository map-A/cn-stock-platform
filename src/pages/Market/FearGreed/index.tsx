/**
 * 恐慌贪婪指数页面
 */

import React from 'react';
import { Card, Row, Col, Progress, Space, Tag, Statistic } from 'antd';
import { ThunderboltOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getFearGreedIndex } from '@/services/market';
import { Line, Gauge } from '@ant-design/plots';

const FearGreed: React.FC = () => {
  const { data, loading } = useRequest(() => getFearGreedIndex());

  // 根据数值获取配置
  const getConfig = (value: number) => {
    if (value <= 25) return { color: '#cf1322', text: '极度恐慌', icon: <FallOutlined /> };
    if (value <= 45) return { color: '#fa8c16', text: '恐慌', icon: <FallOutlined /> };
    if (value <= 55) return { color: '#faad14', text: '中性', icon: null };
    if (value <= 75) return { color: '#52c41a', text: '贪婪', icon: <RiseOutlined /> };
    return { color: '#237804', text: '极度贪婪', icon: <RiseOutlined /> };
  };

  const config = data ? getConfig(data.value) : { color: '#999', text: '加载中...', icon: null };

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <Card style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>
          <ThunderboltOutlined style={{ color: '#faad14', marginRight: 12 }} />
          恐慌贪婪指数
        </h1>
        <p style={{ color: '#666', fontSize: 14 }}>
          市场情绪指标，反映投资者的恐慌或贪婪程度
        </p>
      </Card>

      {/* 主指标 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <Card loading={loading}>
            <div style={{ textAlign: 'center' }}>
              <Gauge
                percent={data ? data.value / 100 : 0}
                range={{
                  ticks: [0, 0.25, 0.45, 0.55, 0.75, 1],
                  color: ['#cf1322', '#fa8c16', '#faad14', '#52c41a', '#237804'],
                }}
                indicator={{
                  pointer: {
                    style: {
                      stroke: '#333',
                    },
                  },
                  pin: {
                    style: {
                      fill: '#333',
                    },
                  },
                }}
                statistic={{
                  content: {
                    style: {
                      fontSize: '36px',
                      lineHeight: '36px',
                      color: config.color,
                      fontWeight: 'bold',
                    },
                    formatter: () => data?.value.toString() || '0',
                  },
                }}
                height={300}
              />
              <div style={{ marginTop: 24 }}>
                <Tag
                  color={config.color}
                  icon={config.icon}
                  style={{ fontSize: 20, padding: '8px 20px' }}
                >
                  {config.text}
                </Tag>
                {data && (
                  <div style={{ marginTop: 12, color: '#999' }}>
                    更新时间: {new Date(data.timestamp).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="指标说明" loading={loading}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <h4>什么是恐慌贪婪指数？</h4>
                <p style={{ color: '#666', lineHeight: '1.8' }}>
                  恐慌贪婪指数综合多个市场指标，量化市场情绪。范围从0（极度恐慌）到100（极度贪婪）。
                  该指数帮助投资者判断市场是否过度恐慌（潜在买入机会）或过度贪婪（潜在回调风险）。
                </p>
              </div>

              <div>
                <h4>指数区间:</h4>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 100, textAlign: 'right' }}>0-25:</div>
                    <Tag color="#cf1322">极度恐慌</Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 100, textAlign: 'right' }}>25-45:</div>
                    <Tag color="#fa8c16">恐慌</Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 100, textAlign: 'right' }}>45-55:</div>
                    <Tag color="#faad14">中性</Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 100, textAlign: 'right' }}>55-75:</div>
                    <Tag color="#52c41a">贪婪</Tag>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 100, textAlign: 'right' }}>75-100:</div>
                    <Tag color="#237804">极度贪婪</Tag>
                  </div>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 细分指标 */}
      {data && (
        <Card title="细分指标" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Card size="small">
                <Statistic title="市场动量" value={data.indicators.marketMomentum} suffix="/100" />
                <Progress percent={data.indicators.marketMomentum} showInfo={false} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card size="small">
                <Statistic title="股价广度" value={data.indicators.stockPriceBreadth} suffix="/100" />
                <Progress percent={data.indicators.stockPriceBreadth} showInfo={false} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card size="small">
                <Statistic title="股价强度" value={data.indicators.stockPriceStrength} suffix="/100" />
                <Progress percent={data.indicators.stockPriceStrength} showInfo={false} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card size="small">
                <Statistic title="看跌看涨比率" value={data.indicators.putCallRatio} suffix="/100" />
                <Progress percent={data.indicators.putCallRatio} showInfo={false} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card size="small">
                <Statistic title="市场波动率" value={data.indicators.marketVolatility} suffix="/100" />
                <Progress percent={data.indicators.marketVolatility} showInfo={false} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card size="small">
                <Statistic title="避险需求" value={data.indicators.safeHavenDemand} suffix="/100" />
                <Progress percent={data.indicators.safeHavenDemand} showInfo={false} />
              </Card>
            </Col>
          </Row>
        </Card>
      )}

      {/* 历史趋势 */}
      {data && data.history.length > 0 && (
        <Card title="历史趋势">
          <Line
            data={data.history}
            xField="date"
            yField="value"
            height={350}
            yAxis={{
              min: 0,
              max: 100,
              label: {
                formatter: (v) => `${v}`,
              },
            }}
            xAxis={{
              label: {
                autoRotate: true,
              },
            }}
            annotations={[
              { type: 'line', start: ['min', 25], end: ['max', 25], style: { stroke: '#cf1322', lineDash: [4, 4] } },
              { type: 'line', start: ['min', 45], end: ['max', 45], style: { stroke: '#fa8c16', lineDash: [4, 4] } },
              { type: 'line', start: ['min', 55], end: ['max', 55], style: { stroke: '#52c41a', lineDash: [4, 4] } },
              { type: 'line', start: ['min', 75], end: ['max', 75], style: { stroke: '#237804', lineDash: [4, 4] } },
            ]}
            color={(datum: any) => {
              const val = datum.value;
              if (val <= 25) return '#cf1322';
              if (val <= 45) return '#fa8c16';
              if (val <= 55) return '#faad14';
              if (val <= 75) return '#52c41a';
              return '#237804';
            }}
            point={{
              size: 3,
              shape: 'circle',
            }}
            tooltip={{
              formatter: (datum: any) => ({
                name: datum.rating,
                value: datum.value,
              }),
            }}
          />
        </Card>
      )}
    </div>
  );
};

export default FearGreed;
