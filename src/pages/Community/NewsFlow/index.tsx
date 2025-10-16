/**
 * @file 新闻流页面
 * @description 展示实时市场新闻流，追踪股价变动原因
 */

import React, { useState, useMemo } from 'react';
import { Card, Input, Space, Tag, Typography, Pagination, Spin } from 'antd';
import { SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { newsService } from '@/services/community';
import type { NewsItem } from '@/services/community';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import styles from './index.module.less';

const { Paragraph, Text, Link } = Typography;

/**
 * 新闻流页面组件
 */
const NewsFlow: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // 获取新闻流数据
  const { data, loading } = useRequest(
    () => newsService.getNewsFlow({ page: currentPage, size: pageSize }),
    {
      refreshDeps: [currentPage, pageSize],
    },
  );

  // 搜索过滤
  const filteredNews = useMemo(() => {
    if (!searchValue.trim()) return data?.data || [];
    
    const lowerSearch = searchValue.toLowerCase();
    return (data?.data || []).filter(
      (item) =>
        item.text?.toLowerCase().includes(lowerSearch) ||
        item.symbol?.toLowerCase().includes(lowerSearch) ||
        item.symbolList?.some((s) => s.toLowerCase().includes(lowerSearch)),
    );
  }, [data?.data, searchValue]);

  /**
   * 格式化时间
   */
  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: zhCN,
    });
  };

  /**
   * 获取新闻背景色
   */
  const getNewsBackground = (item: NewsItem): React.CSSProperties => {
    const isPositive =
      item.text?.toLowerCase().includes('上涨') &&
      (item.changesPercentage || 0) > 0;
    const isNegative =
      item.text?.toLowerCase().includes('下跌') &&
      (item.changesPercentage || 0) < 0;

    if (isPositive) {
      return {
        background: 'linear-gradient(90deg, #ffffff 0%, rgba(34, 197, 94, 0.1) 100%)',
      };
    }
    if (isNegative) {
      return {
        background: 'linear-gradient(90deg, #ffffff 0%, rgba(238, 83, 101, 0.1) 100%)',
      };
    }
    return {};
  };

  /**
   * 渲染新闻项
   */
  const renderNewsItem = (item: NewsItem, index: number) => {
    const symbols = item.symbolList || (item.symbol ? [item.symbol] : []);
    
    return (
      <Card
        key={item.id || index}
        className={styles.newsCard}
        style={getNewsBackground(item)}
        bordered={false}
        bodyStyle={{ padding: '16px 20px' }}
      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Space size={16} style={{ width: '100%', justifyContent: 'space-between' }}>
            <Text type="secondary" className={styles.timeText}>
              {formatTime(item.publishedDate)}
            </Text>
            {item.changesPercentage && (
              <Space size={4}>
                {item.changesPercentage > 0 ? (
                  <ArrowUpOutlined style={{ color: '#22c55e' }} />
                ) : (
                  <ArrowDownOutlined style={{ color: '#ee5365' }} />
                )}
                <Text
                  style={{
                    color: item.changesPercentage > 0 ? '#22c55e' : '#ee5365',
                    fontWeight: 500,
                  }}
                >
                  {Math.abs(item.changesPercentage).toFixed(2)}%
                </Text>
              </Space>
            )}
          </Space>

          <Paragraph className={styles.newsText} style={{ marginBottom: 0 }}>
            {item.text}
          </Paragraph>

          {symbols.length > 0 && (
            <Space size={8} wrap>
              {symbols.map((symbol) => (
                <Link
                  key={symbol}
                  href={`/stock/${symbol}`}
                  target="_blank"
                >
                  <Tag color="blue" className={styles.symbolTag}>
                    {symbol}
                  </Tag>
                </Link>
              ))}
            </Space>
          )}
        </Space>
      </Card>
    );
  };

  return (
    <PageContainer
      header={{
        title: '新闻流',
        subTitle: '实时追踪市场动态，了解股价变动原因',
        breadcrumb: {
          items: [
            { title: '首页', path: '/' },
            { title: '新闻流' },
          ],
        },
      }}
    >
      <Card>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {/* 搜索栏 */}
          <div className={styles.header}>
            <Space size={16} style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 18 }}>
                {data?.total?.toLocaleString() || 0} 条新闻
              </Text>
              <Input
                placeholder="搜索股票代码或新闻内容..."
                prefix={<SearchOutlined />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                allowClear
                style={{ maxWidth: 300 }}
              />
            </Space>
          </div>

          {/* 新闻列表 */}
          <Spin spinning={loading}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              {filteredNews.length > 0 ? (
                filteredNews.map(renderNewsItem)
              ) : (
                <Card>
                  <Text type="secondary">暂无新闻数据</Text>
                </Card>
              )}
            </Space>
          </Spin>

          {/* 分页 */}
          {filteredNews.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={data?.total || 0}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size || 20);
                }}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total} 条`}
                pageSizeOptions={[20, 50, 100]}
              />
            </div>
          )}
        </Space>
      </Card>
    </PageContainer>
  );
};

export default NewsFlow;
