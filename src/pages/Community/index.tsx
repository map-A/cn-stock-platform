import React from 'react';
import { Card, Tabs, List, Avatar, Typography, Space, Tag } from 'antd';
import { UserOutlined, MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const CommunityPage: React.FC = () => {
  const discussions = [
    {
      title: 'Market Analysis: Tech Sector Outlook for Q4',
      author: 'John Trader',
      replies: 23,
      likes: 45,
      tags: ['Analysis', 'Tech', 'Q4'],
    },
    {
      title: 'Best Dividend Stocks for Long-term Investment',
      author: 'Sarah Investor',
      replies: 67,
      likes: 89,
      tags: ['Dividends', 'Long-term', 'Strategy'],
    },
    {
      title: 'Options Trading Strategy: Covered Calls',
      author: 'Mike Options',
      replies: 34,
      likes: 56,
      tags: ['Options', 'Strategy', 'Income'],
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Community</Title>
      <Paragraph>
        Connect with traders and investors. Share insights, discuss strategies, and learn from the community.
      </Paragraph>

      <Tabs
        defaultActiveKey="discussions"
        items={[
          {
            key: 'discussions',
            label: 'Discussions',
            children: (
              <List
                itemLayout="vertical"
                dataSource={discussions}
                renderItem={(item) => (
                  <List.Item
                    key={item.title}
                    actions={[
                      <Space key="replies">
                        <MessageOutlined />
                        <Text>{item.replies} replies</Text>
                      </Space>,
                      <Space key="likes">
                        <LikeOutlined />
                        <Text>{item.likes} likes</Text>
                      </Space>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={<a href="#">{item.title}</a>}
                      description={
                        <Space>
                          <Text type="secondary">by {item.author}</Text>
                          {item.tags.map((tag) => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'trending',
            label: 'Trending Topics',
            children: (
              <Card>
                <List
                  dataSource={['AI Stock Analysis', 'Crypto ETFs', 'Fed Rate Decision', 'Earnings Season']}
                  renderItem={(item) => (
                    <List.Item>
                      <Space>
                        <StarOutlined style={{ color: '#00FC50' }} />
                        <Text>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default CommunityPage;
