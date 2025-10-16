/**
 * 分析师动态页
 * 展示最新的分析师评级变化
 */

import React, { useState } from 'react';
import {
  PageContainer,
  ProCard,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import {
  Typography,
  Space,
  Tag,
  Select,
  message,
  Row,
  Col,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { history } from '@umijs/max';
import {
  getLatestRatingChanges,
  type RatingChange,
} from '@/services/analyst';
import { RatingBadge } from '@/components/Analyst';

const { Title, Text, Paragraph } = Typography;

const AnalystFlowPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [ratingType, setRatingType] = useState<string | undefined>();
  const [minScore, setMinScore] = useState<number>(0);

  const getRatingChangeIcon = (
    previousRating?: string,
    newRating?: string,
  ) => {
    if (!previousRating) {
      return (
        <Tag icon={<PlusCircleOutlined />} color="blue">
          首次评级
        </Tag>
      );
    }

    const ratingValue = (rating: string) => {
      const normalized = rating?.toLowerCase();
      if (normalized?.includes('strong buy')) return 5;
      if (normalized?.includes('buy')) return 4;
      if (normalized?.includes('hold')) return 3;
      if (normalized?.includes('sell')) return 2;
      if (normalized?.includes('strong sell')) return 1;
      return 3;
    };

    const prevValue = ratingValue(previousRating);
    const newValue = ratingValue(newRating || '');

    if (newValue > prevValue) {
      return (
        <Tag icon={<ArrowUpOutlined />} color="success">
          上调
        </Tag>
      );
    } else if (newValue < prevValue) {
      return (
        <Tag icon={<ArrowDownOutlined />} color="error">
          下调
        </Tag>
      );
    }
    return (
      <Tag icon={<MinusCircleOutlined />} color="default">
        维持
      </Tag>
    );
  };

  const columns: ProColumns<RatingChange>[] = [
    {
      title: '日期',
      dataIndex: 'date',
      width: 120,
      valueType: 'date',
      sorter: true,
    },
    {
      title: '股票',
      dataIndex: 'ticker',
      width: 150,
      fixed: 'left',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.ticker}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.stockName}
          </Text>
        </Space>
      ),
    },
    {
      title: '变化类型',
      width: 100,
      render: (_, record) =>
        getRatingChangeIcon(record.previousRating, record.newRating),
    },
    {
      title: '原评级',
      dataIndex: 'previousRating',
      width: 120,
      render: (rating?: string) =>
        rating ? <RatingBadge rating={rating} /> : <Text type="secondary">-</Text>,
    },
    {
      title: '新评级',
      dataIndex: 'newRating',
      width: 120,
      render: (rating: string) => <RatingBadge rating={rating} />,
    },
    {
      title: '目标价变化',
      width: 150,
      render: (_, record) => {
        if (!record.previousTarget) {
          return (
            <Text>
              ¥{record.newTarget.toFixed(2)}
            </Text>
          );
        }
        const change = record.newTarget - record.previousTarget;
        const changePercent = (change / record.previousTarget) * 100;
        return (
          <Space direction="vertical" size={0}>
            <Text>
              ¥{record.previousTarget.toFixed(2)} → ¥
              {record.newTarget.toFixed(2)}
            </Text>
            <Text
              type={change >= 0 ? 'success' : 'danger'}
              style={{ fontSize: 12 }}
            >
              {change >= 0 ? '+' : ''}
              {changePercent.toFixed(2)}%
            </Text>
          </Space>
        );
      },
    },
    {
      title: '当前价格',
      dataIndex: 'currentPrice',
      width: 100,
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '上涨空间',
      dataIndex: 'upside',
      width: 100,
      sorter: true,
      render: (value: number) => (
        <Text style={{ color: value >= 0 ? '#cf1322' : '#3f8600' }}>
          {value >= 0 ? '+' : ''}
          {value.toFixed(2)}%
        </Text>
      ),
    },
    {
      title: '分析师',
      dataIndex: 'analystName',
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.analystName}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.companyName}
          </Text>
        </Space>
      ),
    },
  ];

  const handleRowClick = (record: RatingChange) => {
    history.push(`/stock/${record.ticker}`);
  };

  return (
    <PageContainer
      header={{
        title: '分析师动态',
        subTitle: '最新的分析师评级变化',
        breadcrumb: {
          items: [
            { title: '首页', path: '/' },
            { title: '分析师', path: '/analyst' },
            { title: '动态' },
          ],
        },
      }}
    >
      <ProCard style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={5}>筛选条件</Title>
            <Row gutter={16}>
              <Col span={8}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text type="secondary">变化类型</Text>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="全部类型"
                    allowClear
                    value={ratingType}
                    onChange={setRatingType}
                    options={[
                      { label: '上调评级', value: 'upgrade' },
                      { label: '下调评级', value: 'downgrade' },
                      { label: '首次评级', value: 'initiate' },
                      { label: '维持评级', value: 'maintain' },
                    ]}
                  />
                </Space>
              </Col>
              <Col span={8}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Text type="secondary">分析师评分</Text>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="全部分析师"
                    value={minScore}
                    onChange={setMinScore}
                    options={[
                      { label: '全部分析师', value: 0 },
                      { label: '3星及以上', value: 3.0 },
                      { label: '4星及以上', value: 4.0 },
                      { label: '5星分析师', value: 4.5 },
                    ]}
                  />
                </Space>
              </Col>
            </Row>
          </div>

          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            实时追踪分析师评级变化，包括上调、下调、首次评级等动态。
            帮助您快速把握市场热点和投资机会。
          </Paragraph>
        </Space>
      </ProCard>

      <ProTable<RatingChange>
        columns={columns}
        request={async (params) => {
          setLoading(true);
          try {
            const result = await getLatestRatingChanges({
              page: params.current,
              pageSize: params.pageSize,
              ratingType: ratingType as any,
              minAnalystScore: minScore > 0 ? minScore : undefined,
            });

            return {
              data: result.list || [],
              success: true,
              total: result.total || 0,
            };
          } catch (error) {
            message.error('获取分析师动态失败');
            return { data: [], success: false, total: 0 };
          } finally {
            setLoading(false);
          }
        }}
        rowKey={(record) => `${record.ticker}-${record.date}-${record.analystId}`}
        search={false}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
        }}
        scroll={{ x: 1400 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' },
        })}
        loading={loading}
        params={{ ratingType, minScore }}
      />
    </PageContainer>
  );
};

export default AnalystFlowPage;
