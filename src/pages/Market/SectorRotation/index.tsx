/**
 * 板块轮动图页面
 */

import React from 'react';
import { Card, Row, Col, Tag, Alert, Space, Statistic } from 'antml';
import { SyncOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getSectorRotation } from '@/services/market';
import { Column, Radar } from '@ant-design/plots';

const SectorRotation: React.FC = () => {
  const { data, loading } = useRequest(() => getSectorRotation());

  // 准备柱状图数据
  const columnData = data
    ? data.sectors.flatMap((sector) => [
        { sector: sector.name, period: '1周', value: sector.returns1W },
        { sector: sector.name, period: '1月', value: sector.returns1M },
        { sector: sector.name, period: '3月', value: sector.returns3M },
        { sector: sector.name, period: '6月', value: sector.returns6M },
        { sector: sector.name, period: '1年', value: sector.returns1Y },
      ])
    : [];

  // 准备雷达图数据
  const radarData = data
    ? data.sectors.map((sector) => ({
        sector: sector.name,
        动量: sector.momentum,
        强度: sector.strength === 'Strong' ? 100 : sector.strength === 'Moderate' ? 60 : 30,
        '1月收益': sector.returns1M > 0 ? Math.min(sector.returns1M * 5, 100) : 0,
      }))
    : [];

  // 获取周期阶段配置
  const getPhaseConfig = (phase: string) => {
    const configs: Record<string, { color: string; icon: any }> = {
      'Early Cycle': { color: 'green', icon: <RiseOutlined /> },
      'Mid Cycle': { color: 'blue', icon: <RiseOutlined /> },
      'Late Cycle': { color: 'orange', icon: <SyncOutlined /> },
      Recession: { color: 'red', icon: <FallOutlined /> },
    };
    return configs[phase] || configs['Mid Cycle'];
  };

  const phaseConfig = data ? getPhaseConfig(data.rotationPhase) : null;

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 8 }}>
              <SyncOutlined style={{ color: '#1890ff', marginRight: 12 }} />
              板块轮动分析
            </h1>
            <p style={{ color: '#666', fontSize: 14 }}>
              追踪各板块在不同经济周期中的表现，识别投资机会
            </p>
          </div>

          {data && phaseConfig && (
            <Space size="large">
              <div>
                <span style={{ marginRight: 8 }}>当前周期阶段:</span>
                <Tag color={phaseConfig.color} icon={phaseConfig.icon} style={{ fontSize: 16, padding: '4px 12px' }}>
                  {data.rotationPhase}
                </Tag>
              </div>
            </Space>
          )}
        </Space>
      </Card>

      {/* 说明和建议 */}
      {data && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} lg={12}>
            <Alert
              message="板块轮动理论"
              description="板块轮动是指不同行业板块在经济周期的不同阶段表现各异。早期周期：金融、科技；中期周期：工业、材料；晚期周期：能源、必需消费品；衰退期：公用事业、医疗保健。"
              type="info"
              showIcon
            />
          </Col>
          <Col xs={24} lg={12}>
            <Card>
              <h4 style={{ marginBottom: 12 }}>投资建议</h4>
              <p style={{ lineHeight: '1.8', marginBottom: 0 }}>{data.recommendation}</p>
            </Card>
          </Col>
        </Row>
      )}

      {/* 板块表现对比 */}
      <Card title="板块收益率对比" loading={loading} style={{ marginBottom: 16 }}>
        {columnData.length > 0 ? (
          <Column
            data={columnData}
            xField="sector"
            yField="value"
            seriesField="period"
            isGroup
            height={400}
            color={['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E86452']}
            legend={{ position: 'top' }}
            label={{
              position: 'top',
              formatter: (datum: any) => `${datum.value.toFixed(1)}%`,
            }}
            yAxis={{
              label: {
                formatter: (v) => `${v}%`,
              },
            }}
            xAxis={{
              label: {
                autoRotate: true,
                autoHide: false,
              },
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            暂无数据
          </div>
        )}
      </Card>

      {/* 板块强度雷达图 */}
      <Card title="板块强度分析" loading={loading} style={{ marginBottom: 16 }}>
        {radarData.length > 0 ? (
          <Radar
            data={radarData}
            xField="sector"
            yField="value"
            seriesField="type"
            height={400}
            area={{
              visible: true,
            }}
            point={{
              visible: true,
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            暂无数据
          </div>
        )}
      </Card>

      {/* 板块详细数据 */}
      {data && (
        <Card title="板块详细数据">
          <Row gutter={[16, 16]}>
            {data.sectors.map((sector) => (
              <Col xs={24} sm={12} lg={8} key={sector.name}>
                <Card size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0 }}>{sector.name}</h4>
                      <Tag color={
                        sector.strength === 'Strong' ? 'green' :
                        sector.strength === 'Moderate' ? 'blue' : 'default'
                      }>
                        {sector.strength}
                      </Tag>
                    </div>
                    <div style={{ fontSize: 12 }}>
                      <Row gutter={8}>
                        <Col span={12}>
                          <Statistic
                            title="1周"
                            value={sector.returns1W}
                            precision={2}
                            suffix="%"
                            valueStyle={{
                              fontSize: 14,
                              color: sector.returns1W >= 0 ? '#cf1322' : '#3f8600',
                            }}
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="1月"
                            value={sector.returns1M}
                            precision={2}
                            suffix="%"
                            valueStyle={{
                              fontSize: 14,
                              color: sector.returns1M >= 0 ? '#cf1322' : '#3f8600',
                            }}
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="3月"
                            value={sector.returns3M}
                            precision={2}
                            suffix="%"
                            valueStyle={{
                              fontSize: 14,
                              color: sector.returns3M >= 0 ? '#cf1322' : '#3f8600',
                            }}
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="1年"
                            value={sector.returns1Y}
                            precision={2}
                            suffix="%"
                            valueStyle={{
                              fontSize: 14,
                              color: sector.returns1Y >= 0 ? '#cf1322' : '#3f8600',
                            }}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default SectorRotation;
