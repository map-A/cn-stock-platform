/**
 * 新闻面板组件
 */
import React from 'react';
import { List, Typography, Tag, Space, Empty } from 'antd';
import { ClockCircleOutlined, LinkOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getStockNews } from '@/services/stock';
import { formatRelativeTime } from '@/utils/format';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './index.less';

const { Text, Paragraph } = Typography;

interface NewsPanelProps {
  symbol: string;
}

const NewsPanel: React.FC<NewsPanelProps> = ({ symbol }) => {
  const { data, loading, loadMore, loadingMore, noMore } = useRequest(
    (params) => getStockNews(symbol, params?.page || 1, 20),
    {
      loadMore: true,
      isNoMore: (data) => !data || data.list.length >= data.total,
    }
  );

  if (loading && !data) {
    return <LoadingSpinner />;
  }

  if (!data || data.list.length === 0) {
    return (
      <Empty
        description="暂无新闻"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div className={styles.newsPanel}>
      <List
        dataSource={data.list}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className={styles.newsItem}
            actions={[
              <a
                key="link"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkOutlined /> 查看详情
              </a>,
            ]}
          >
            <List.Item.Meta
              title={
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.newsTitle}
                >
                  {item.title}
                </a>
              }
              description={
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  {item.summary && (
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{ marginBottom: 8, color: 'rgba(0,0,0,0.65)' }}
                    >
                      {item.summary}
                    </Paragraph>
                  )}
                  <Space size="middle">
                    <Text type="secondary">
                      <ClockCircleOutlined /> {formatRelativeTime(item.publishTime)}
                    </Text>
                    <Text type="secondary">来源: {item.source}</Text>
                    {item.relatedSymbols && item.relatedSymbols.length > 0 && (
                      <Space size={4}>
                        {item.relatedSymbols.map((s) => (
                          <Tag key={s} size="small">{s}</Tag>
                        ))}
                      </Space>
                    )}
                  </Space>
                </Space>
              }
            />
          </List.Item>
        )}
        loadMore={
          !noMore && (
            <div className={styles.loadMore}>
              <a onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? '加载中...' : '加载更多'}
              </a>
            </div>
          )
        }
      />
    </div>
  );
};

export default NewsPanel;
