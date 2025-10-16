/**
 * 估值分析组件
 */

import React from 'react';
import { Row, Col, Card, Statistic, Progress, Space, Typography } from 'antd';

const { Text } = Typography;

interface ValuationAnalysisProps {
  data: {
    current: {
      pe: number;
      pb: number;
      ps: number;
    };
    historical: {
      pePercentile: number;
      pbPercentile: number;
      psPercentile: number;
    };
    comparison: {
      vsMarket: {
        pe: number;
        pb: number;
      };
      vsSector: {
        pe: number;
        pb: number;
      };
    };
  };
}

const ValuationAnalysis: React.FC<ValuationAnalysisProps> = ({ data }) => {
  /**
   * 获取估值状态
   */
  const getValuationStatus = (percentile: number) => {
    if (percentile < 20) return { text: '极低估', color: '#3f8600' };
    if (percentile < 40) return { text: '低估', color: '#52c41a' };
    if (percentile < 60) return { text: '合理', color: '#1890ff' };
    if (percentile < 80) return { text: '高估', color: '#faad14' };
    return { text: '极高估', color: '#cf1322' };
  };

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="市盈率 (PE)"
              value={data.current.pe}
              precision={2}
              suffix="倍"
            />
            <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
              <div>
                <Text type="secondary">历史分位: </Text>
                <Text strong>
                  {data.historical.pePercentile.toFixed(0)}%
                </Text>
              </div>
              <Progress
                percent={data.historical.pePercentile}
                strokeColor={getValuationStatus(data.historical.pePercentile).color}
                showInfo={false}
              />
              <Text style={{ color: getValuationStatus(data.historical.pePercentile).color }}>
                {getValuationStatus(data.historical.pePercentile).text}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="市净率 (PB)"
              value={data.current.pb}
              precision={2}
              suffix="倍"
            />
            <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
              <div>
                <Text type="secondary">历史分位: </Text>
                <Text strong>
                  {data.historical.pbPercentile.toFixed(0)}%
                </Text>
              </div>
              <Progress
                percent={data.historical.pbPercentile}
                strokeColor={getValuationStatus(data.historical.pbPercentile).color}
                showInfo={false}
              />
              <Text style={{ color: getValuationStatus(data.historical.pbPercentile).color }}>
                {getValuationStatus(data.historical.pbPercentile).text}
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="市销率 (PS)"
              value={data.current.ps}
              precision={2}
              suffix="倍"
            />
            <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
              <div>
                <Text type="secondary">历史分位: </Text>
                <Text strong>
                  {data.historical.psPercentile.toFixed(0)}%
                </Text>
              </div>
              <Progress
                percent={data.historical.psPercentile}
                strokeColor={getValuationStatus(data.historical.psPercentile).color}
                showInfo={false}
              />
              <Text style={{ color: getValuationStatus(data.historical.psPercentile).color }}>
                {getValuationStatus(data.historical.psPercentile).text}
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="相对市场估值">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>市盈率差异</Text>
                <Text strong>
                  {data.comparison.vsMarket.pe > 0 ? '+' : ''}
                  {data.comparison.vsMarket.pe.toFixed(2)}倍
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>市净率差异</Text>
                <Text strong>
                  {data.comparison.vsMarket.pb > 0 ? '+' : ''}
                  {data.comparison.vsMarket.pb.toFixed(2)}倍
                </Text>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="相对板块估值">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>市盈率差异</Text>
                <Text strong>
                  {data.comparison.vsSector.pe > 0 ? '+' : ''}
                  {data.comparison.vsSector.pe.toFixed(2)}倍
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>市净率差异</Text>
                <Text strong>
                  {data.comparison.vsSector.pb > 0 ? '+' : ''}
                  {data.comparison.vsSector.pb.toFixed(2)}倍
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ValuationAnalysis;
