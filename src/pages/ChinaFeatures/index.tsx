import React from 'react';
import { Card, Row, Col, Statistic, List, Typography } from 'antd';
import { StockOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ChinaFeaturesPage: React.FC = () => {
  const features = [
    { title: 'A-Share Market', description: 'Shanghai and Shenzhen Stock Exchanges' },
    { title: 'Hong Kong Stocks', description: 'HKEX listed companies' },
    { title: 'Stock Connect', description: 'Northbound and Southbound trading' },
    { title: 'STAR Market', description: 'Science and Technology Innovation Board' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>China Market Features</Title>
      <Paragraph>
        Comprehensive coverage of Chinese stock markets including A-shares, H-shares, and cross-border trading mechanisms.
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="A-Share Companies"
              value={5200}
              prefix={<StockOutlined />}
              valueStyle={{ color: '#00FC50' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="HK Stocks"
              value={2800}
              prefix={<StockOutlined />}
              valueStyle={{ color: '#00FC50' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Gainers Today"
              value={1245}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#00FC50' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Losers Today"
              value={876}
              prefix={<FallOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Key Features" style={{ marginTop: '24px' }}>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4 }}
          dataSource={features}
          renderItem={(item) => (
            <List.Item>
              <Card>
                <Title level={5}>{item.title}</Title>
                <Paragraph type="secondary">{item.description}</Paragraph>
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ChinaFeaturesPage;
