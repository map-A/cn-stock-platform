/**
 * 分析师详情页
 * 展示分析师的详细信息、评级历史和表现分析
 */

import React, { useState, useEffect } from 'react';
import {
  PageContainer,
  ProCard,
  ProTable,
  ProColumns,
} from '@ant-design/pro-components';
import {
  Descriptions,
  Typography,
  Space,
  Tag,
  Statistic,
  Row,
  Col,
  message,
  Spin,
} from 'antd';
import {
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useParams } from '@umijs/max';
import {
  getAnalystDetail,
  getAnalystAccuracy,
  type AnalystInfo,
  type AnalystRating,
} from '@/services/analyst';
import {
  RatingBadge,
  AnalystPerformanceChart,
} from '@/components/Analyst';

const { Title, Text } = Typography;

const AnalystDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [analystInfo, setAnalystInfo] = useState<AnalystInfo | null>(null);
  const [ratingsList, setRatingsList] = useState<AnalystRating[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<any[]>([]);
  const [accuracyMetrics, setAccuracyMetrics] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadAnalystData();
    }
  }, [id]);

  const loadAnalystData = async () => {
    setLoading(true);
    try {
      const [detailData, accuracyData] = await Promise.all([
        getAnalystDetail(id!),
        getAnalystAccuracy(id!),
      ]);

      setAnalystInfo(detailData.analystInfo);
      setRatingsList(detailData.ratingsList || []);
      setPerformanceHistory(detailData.performanceHistory || []);
      setAccuracyMetrics(accuracyData);
    } catch (error) {
      message.error('获取分析师详情失败');
    } finally {
      setLoading(false);
    }
  };

  const columns: ProColumns<AnalystRating>[] = [
    {
      title: '股票代码',
      dataIndex: 'ticker',
      width: 100,
      fixed: 'left',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: '股票名称',
      dataIndex: 'stockName',
      width: 150,
    },
    {
      title: '评级',
      dataIndex: 'rating',
      width: 120,
      render: (rating: string) => <RatingBadge rating={rating} />,
    },
    {
      title: '目标价',
      dataIndex: 'priceTarget',
      width: 100,
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '当前价',
      dataIndex: 'currentPrice',
      width: 100,
      render: (value: number) => `¥${value.toFixed(2)}`,
    },
    {
      title: '上涨空间',
      dataIndex: 'upside',
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
      title: '评级数',
      dataIndex: 'ratings',
      width: 80,
    },
    {
      title: '日期',
      dataIndex: 'date',
      width: 120,
      valueType: 'date',
    },
  ];

  if (loading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!analystInfo) {
    return <PageContainer>分析师信息未找到</PageContainer>;
  }

  return (
    <PageContainer
      header={{
        title: analystInfo.analystName,
        subTitle: analystInfo.companyName,
        breadcrumb: {
          items: [
            { title: '首页', path: '/' },
            { title: '分析师', path: '/analyst' },
            { title: analystInfo.analystName },
          ],
        },
        tags: [
          <Tag icon={<TrophyOutlined />} color="gold" key="rank">
            排名 #{analystInfo.rank}
          </Tag>,
          <Tag icon={<CheckCircleOutlined />} color="blue" key="score">
            评分 {analystInfo.analystScore.toFixed(1)}
          </Tag>,
        ],
      }}
    >
      {/* 关键指标 */}
      <ProCard style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="成功率"
              value={analystInfo.successRate}
              precision={1}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="平均回报"
              value={analystInfo.avgReturn}
              precision={2}
              suffix="%"
              prefix={
                analystInfo.avgReturn >= 0 ? (
                  <RiseOutlined />
                ) : (
                  <FallOutlined />
                )
              }
              valueStyle={{
                color: analystInfo.avgReturn >= 0 ? '#cf1322' : '#3f8600',
              }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="评级总数"
              value={analystInfo.totalRatings}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="覆盖股票"
              value={analystInfo.coverageCount}
            />
          </Col>
        </Row>
      </ProCard>

      {/* 准确率指标 */}
      {accuracyMetrics && (
        <ProCard title="准确率分析" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="短期准确率 (1个月)"
                value={accuracyMetrics.shortTermAccuracy}
                precision={1}
                suffix="%"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="中期准确率 (3个月)"
                value={accuracyMetrics.mediumTermAccuracy}
                precision={1}
                suffix="%"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="长期准确率 (1年)"
                value={accuracyMetrics.longTermAccuracy}
                precision={1}
                suffix="%"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="目标价准确率"
                value={accuracyMetrics.priceTargetAccuracy}
                precision={1}
                suffix="%"
              />
            </Col>
          </Row>
        </ProCard>
      )}

      {/* 历史表现趋势 */}
      {performanceHistory.length > 0 && (
        <ProCard style={{ marginBottom: 24 }}>
          <AnalystPerformanceChart
            data={performanceHistory}
            title="历史表现趋势"
          />
        </ProCard>
      )}

      {/* 评级列表 */}
      <ProCard title="评级历史">
        <ProTable<AnalystRating>
          columns={columns}
          dataSource={ratingsList}
          rowKey={(record) => `${record.ticker}-${record.date}`}
          search={false}
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
          }}
          scroll={{ x: 1000 }}
        />
      </ProCard>
    </PageContainer>
  );
};

export default AnalystDetailPage;
