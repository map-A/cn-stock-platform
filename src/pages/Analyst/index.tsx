/**
 * 分析师列表页
 * 展示顶级分析师排行榜
 */

import React, { useState, useEffect } from 'react';
import {
  PageContainer,
  ProCard,
  ProTable,
  type ProColumns,
} from '@ant-design/pro-components';
import { Typography, Space, Tag, message } from 'antd';
import { TrophyOutlined, StarOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { getTopAnalysts } from '@/services/analyst';
import type { AnalystInfo } from '@/services/analyst';
import { AnalystCard } from '@/components/Analyst';

const { Title, Text, Paragraph } = Typography;

const AnalystListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const columns: ProColumns<AnalystInfo>[] = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 80,
      fixed: 'left',
      render: (_, record) => {
        const color =
          record.rank <= 3
            ? 'gold'
            : record.rank <= 10
              ? 'blue'
              : 'default';
        return (
          <Tag icon={<TrophyOutlined />} color={color}>
            #{record.rank}
          </Tag>
        );
      },
    },
    {
      title: '分析师',
      dataIndex: 'analystName',
      width: 200,
      fixed: 'left',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.analystName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.companyName}
          </Text>
        </Space>
      ),
    },
    {
      title: '评分',
      dataIndex: 'analystScore',
      width: 120,
      sorter: true,
      render: (score: number) => {
        const stars = Math.round(score);
        return (
          <Space>
            <Text strong style={{ color: '#faad14' }}>
              {score.toFixed(1)}
            </Text>
            <div>
              {[...Array(5)].map((_, i) => (
                <StarOutlined
                  key={i}
                  style={{
                    color: i < stars ? '#faad14' : '#d9d9d9',
                    fontSize: 14,
                  }}
                />
              ))}
            </div>
          </Space>
        );
      },
    },
    {
      title: '成功率',
      dataIndex: 'successRate',
      width: 120,
      sorter: true,
      render: (rate: number) => (
        <Text style={{ color: rate >= 70 ? '#52c41a' : '#1890ff' }}>
          {rate.toFixed(1)}%
        </Text>
      ),
    },
    {
      title: '平均回报',
      dataIndex: 'avgReturn',
      width: 120,
      sorter: true,
      render: (value: number) => (
        <Text style={{ color: value >= 0 ? '#cf1322' : '#3f8600' }}>
          {value >= 0 ? '+' : ''}
          {value.toFixed(2)}%
        </Text>
      ),
    },
    {
      title: '评级总数',
      dataIndex: 'totalRatings',
      width: 120,
      sorter: true,
    },
    {
      title: '最近评级',
      dataIndex: 'lastRating',
      width: 120,
      valueType: 'date',
    },
    {
      title: '覆盖股票',
      dataIndex: 'coverageCount',
      width: 100,
    },
  ];

  const handleRowClick = (record: AnalystInfo) => {
    history.push(`/analyst/${record.analystId}`);
  };

  return (
    <PageContainer
      header={{
        title: '顶级分析师排行榜',
        subTitle: '基于历史表现和准确率的分析师排名',
        breadcrumb: {
          items: [
            { title: '首页', path: '/' },
            { title: '分析师' },
          ],
        },
      }}
    >
      <ProCard style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Title level={5}>
            <TrophyOutlined style={{ marginRight: 8 }} />
            关于分析师排名
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            我们根据分析师的历史表现、预测准确率、平均回报率等多个维度进行综合评分。
            评分范围为 1-5 星，4 星以上为顶级分析师。
            排名每日更新，帮助您找到最值得关注的分析师。
          </Paragraph>
        </Space>
      </ProCard>

      <ProTable<AnalystInfo>
        columns={columns}
        request={async (params, sort) => {
          setLoading(true);
          try {
            const sortField = Object.keys(sort || {})[0];
            const sortOrder = sort?.[sortField];

            const data = await getTopAnalysts({
              limit: params.pageSize,
              sortBy: sortField as any,
              order: sortOrder === 'ascend' ? 'asc' : 'desc',
            });

            return {
              data: data || [],
              success: true,
              total: data?.length || 0,
            };
          } catch (error) {
            message.error('获取分析师列表失败');
            return { data: [], success: false, total: 0 };
          } finally {
            setLoading(false);
          }
        }}
        rowKey="analystId"
        search={false}
        pagination={{
          defaultPageSize: 50,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        scroll={{ x: 1200 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
        loading={loading}
      />
    </PageContainer>
  );
};

export default AnalystListPage;
