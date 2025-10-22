/**
 * 顶级分析师推荐股票页
 * 展示顶级分析师强烈推荐的股票列表
 */

import React, { useState } from 'react';
import {
  PageContainer,
  ProCard,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import { Typography, Space, Tag, message } from 'antd';
import { StarOutlined, RiseOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { getTopAnalystStocks, type TopRatedStock } from '@/services/analyst';
import { RatingBadge } from '@/components/Analyst';

const { Title, Text, Paragraph } = Typography;

const TopStocksPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const columns: ProColumns<TopRatedStock>[] = [
    {
      title: '股票代码',
      dataIndex: 'ticker',
      width: 100,
      fixed: 'left',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.stockName}
          </Text>
        </Space>
      ),
    },
    {
      title: '推荐数',
      dataIndex: 'topAnalystCounter',
      width: 100,
      sorter: true,
      render: (count: number) => (
        <Tag color="gold" icon={<StarOutlined />}>
          {count} 位
        </Tag>
      ),
    },
    {
      title: '共识评级',
      dataIndex: 'topAnalystRating',
      width: 120,
      render: (rating: string) => <RatingBadge rating={rating} />,
    },
    {
      title: '平均目标价',
      dataIndex: 'topAnalystPriceTarget',
      width: 120,
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '当前价格',
      dataIndex: 'currentPrice',
      width: 120,
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '上涨空间',
      dataIndex: 'topAnalystUpside',
      width: 120,
      sorter: true,
      render: (value: number) => (
        <Text
          strong
          style={{
            color: value >= 20 ? '#cf1322' : value >= 10 ? '#1890ff' : '#52c41a',
          }}
        >
          <RiseOutlined style={{ marginRight: 4 }} />
          {value.toFixed(2)}%
        </Text>
      ),
    },
    {
      title: '市值',
      dataIndex: 'marketCap',
      width: 120,
      sorter: true,
      render: (value: number) => {
        const billion = value / 1e9;
        return billion >= 1
          ? `${billion.toFixed(2)}B`
          : `${(value / 1e6).toFixed(2)}M`;
      },
    },
    {
      title: '行业',
      dataIndex: 'sector',
      width: 120,
    },
    {
      title: '顶级分析师',
      dataIndex: 'analysts',
      width: 200,
      render: (analysts: TopRatedStock['analysts']) => (
        <Space direction="vertical" size={2}>
          {analysts?.slice(0, 3).map((analyst, idx) => (
            <Text key={idx} type="secondary" style={{ fontSize: 12 }}>
              {analyst.analystName} ({analyst.analystScore.toFixed(1)}⭐)
            </Text>
          ))}
          {analysts?.length > 3 && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              +{analysts.length - 3} 更多...
            </Text>
          )}
        </Space>
      ),
    },
  ];

  const handleRowClick = (record: TopRatedStock) => {
    history.push(`/stock/${record.ticker}`);
  };

  return (
    <PageContainer
      header={{
        title: '顶级分析师推荐股票',
        subTitle: '4星以上分析师强烈推荐的股票',
        breadcrumb: {
          items: [
            { title: '首页', path: '/' },
            { title: '分析师', path: '/analyst' },
            { title: '推荐股票' },
          ],
        },
      }}
    >
      <ProCard style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Title level={5}>
            <StarOutlined style={{ marginRight: 8, color: '#faad14' }} />
            关于推荐股票
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            精选获得多位顶级分析师（评分4星及以上）强烈买入评级的股票。
            这些股票具有较高的上涨潜力和投资价值，已通过严格的专业分析筛选。
            股票按照推荐分析师数量排序，帮助您发现市场热门标的。
          </Paragraph>
        </Space>
      </ProCard>

      <ProTable<TopRatedStock>
        columns={columns}
        request={async (params, sort) => {
          setLoading(true);
          try {
            const sortField = Object.keys(sort || {})[0];
            const sortOrder = sort?.[sortField];

            const data = await getTopAnalystStocks({
              minScore: 4.0,
              minRatings: 2,
              sortBy: sortField as any,
              order: sortOrder === 'ascend' ? 'asc' : 'desc',
            });

            return {
              data: data || [],
              success: true,
              total: data?.length || 0,
            };
          } catch (error) {
            message.error('获取推荐股票列表失败');
            return { data: [], success: false, total: 0 };
          } finally {
            setLoading(false);
          }
        }}
        rowKey="ticker"
        search={false}
        pagination={{
          defaultPageSize: 50,
          showSizeChanger: true,
        }}
        scroll={{ x: 1400 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
        loading={loading}
      />
    </PageContainer>
  );
};

export default TopStocksPage;
