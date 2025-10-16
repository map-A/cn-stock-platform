import React from 'react';
import { Card, Typography, Space } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div style={{ padding: '48px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Title level={1}>
              <RocketOutlined /> 中国A股分析平台
            </Title>
            <Paragraph style={{ fontSize: 16 }}>
              基于 React 18 + Umi 4 + Ant Design 5 + TypeScript 构建的现代化股票分析平台
            </Paragraph>
          </Space>
        </Card>

        <Card title="项目状态">
          <Paragraph>✅ 项目初始化成功</Paragraph>
          <Paragraph>✅ Umi 4 配置完成</Paragraph>
          <Paragraph>✅ Ant Design 5 集成完成</Paragraph>
          <Paragraph>🚀 准备开始开发</Paragraph>
        </Card>

        <Card title="快速开始">
          <Paragraph>
            <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
              {`# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint`}
            </pre>
          </Paragraph>
        </Card>
      </Space>
    </div>
  );
};

export default Home;
