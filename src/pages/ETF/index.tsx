import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { RiseOutlined, FallOutlined, DollarOutlined } from '@ant-design/icons';

const ETFPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total ETFs"
              value={2847}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#00FC50' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Top Gainers"
              value={156}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#00FC50' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Top Losers"
              value={89}
              prefix={<FallOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total AUM"
              value={9.8}
              suffix="T"
              prefix={<DollarOutlined />}
              precision={1}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ETFPage;
