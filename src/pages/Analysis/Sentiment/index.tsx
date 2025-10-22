/**
 * 市场情绪追踪页面
 */
import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Tabs,
  Table,
  Tag,
  Space,
  Typography,
} from 'antd';
import {
  SmileOutlined,
  FrownOutlined,
  MehOutlined,
  RiseOutlined,
  FallOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Line } from '@ant-design/plots';
import { history } from 'umi';
import {
  getMarketSentiment,
  getSentimentHistory,
  getTrendingStocks,
  getSentimentRanking,
} from '@/services/analysis';
import { formatPercent, getPriceColor } from '@/utils/format';
import type { StockSentiment, TrendingStock } from '@/typings/analysis';
import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './index.less';

const { Text, Title } = Typography;

const Sentiment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'positive' | 'negative'>('positive');

  // 获取市场情绪
  const { data: marketSentiment, loading: marketLoading } = useRequest(
    () => getMarketSentiment(),
    {
      pollingInterval: 60000, // 1分钟刷新
    }
  );

  // 获取情绪历史
  const { data: sentimentHistory } = useRequest(
    () => getSentimentHistory(30)
  );

  // 获取热搜股票
  const { data: trendingStocks } = useRequest(
    () => getTrendingStocks(20)
  );

  // 获取情绪排行
  const { data: sentimentRanking, loading: rankingLoading } = useRequest(
    () => getSentimentRanking(activeTab, 50),
    {
      refreshDeps: [activeTab],
    }
  );

  // 情绪指数颜色
  const getSentimentColor = (score: number) => {
    if (score >= 70) return '#f5222d'; // 极度乐观
    if (score >= 60) return '#fa8c16'; // 乐观
    if (score >= 40) return '#faad14'; // 中性
    if (score >= 30) return '#52c41a'; // 悲观
    return '#13c2c2'; // 极度悲观
  };

  // 情绪描述
  const getSentimentText = (score: number) => {
    if (score >= 70) return '极度乐观';
    if (score >= 60) return '乐观';
    if (score >= 40) return '中性';
    if (score >= 30) return '悲观';
    return '极度悲观';
  };

  // 恐慌贪婪指数颜色
  const getFearGreedColor = (score: number) => {
    if (score >= 75) return '#f5222d'; // 极度贪婪
    if (score >= 55) return '#fa8c16'; // 贪婪
    if (score >= 45) return '#faad14'; // 中性
    if (score >= 25) return '#52c41a'; // 恐慌
    return '#13c2c2'; // 极度恐慌
  };

  // 热搜股票表格列
  const trendingColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 80,
      render: (rank: number) => (
        <Tag color={rank <= 3 ? 'gold' : 'default'}>{rank}</Tag>
      ),
    },
    {
      title: '股票代码',
      dataIndex: 'symbol',
      width: 120,
    },
    {
      title: '股票名称',
      dataIndex: 'name',
      width: 150,
      render: (name: string, record: TrendingStock) => (
        <a onClick={() => history.push(`/stock/${record.symbol}`)}>
          {name}
        </a>
      ),
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      width: 120,
      align: 'right' as const,
      render: (percent: number) => (
        <Text style={{ color: getPriceColor(percent) }}>
          {formatPercent(percent)}
        </Text>
      ),
    },
    {
      title: '搜索量',
      dataIndex: 'searchVolume',
      width: 120,
      align: 'right' as const,
      render: (vol: number) => vol.toLocaleString(),
    },
    {
      title: '搜索量变化',
      dataIndex: 'searchChange',
      width: 120,
      align: 'right' as const,
      render: (change: number) => (
        <Text style={{ color: getPriceColor(change) }}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </Text>
      ),
    },
  ];

  // 情绪排行表格列
  const rankingColumns = [
    {
      title: '排名',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Tag color={index < 3 ? 'gold' : 'default'}>{index + 1}</Tag>
      ),
    },
    {
      title: '股票代码',
      dataIndex: 'symbol',
      width: 120,
    },
    {
      title: '股票名称',
      dataIndex: 'name',
      width: 150,
      render: (name: string, record: StockSentiment) => (
        <a onClick={() => history.push(`/stock/${record.symbol}`)}>
          {name}
        </a>
      ),
    },
    {
      title: '情绪指数',
      dataIndex: 'sentimentScore',
      width: 150,
      align: 'right' as const,
      render: (score: number) => (
        <Space>
          <Progress
            percent={score}
            size="small"
            strokeColor={getSentimentColor(score)}
            showInfo={false}
            style={{ width: 60 }}
          />
          <Text>{score.toFixed(1)}</Text>
        </Space>
      ),
    },
    {
      title: '关注度',
      dataIndex: 'attention',
      width: 120,
      align: 'right' as const,
    },
    {
      title: '新闻数量',
      dataIndex: 'newsCount',
      width: 100,
      align: 'right' as const,
    },
    {
      title: '正面',
      width: 80,
      align: 'right' as const,
      render: (record: StockSentiment) => 
        `${record.newsSentiment.positive.toFixed(0)}%`,
    },
    {
      title: '负面',
      width: 80,
      align: 'right' as const,
      render: (record: StockSentiment) => 
        `${record.newsSentiment.negative.toFixed(0)}%`,
    },
    {
      title: '周涨跌',
      dataIndex: 'weeklyChange',
      width: 120,
      align: 'right' as const,
      render: (change: number) => (
        <Text style={{ color: getPriceColor(change) }}>
          {formatPercent(change)}
        </Text>
      ),
    },
  ];

  // 情绪历史图表配置
  const historyChartConfig = {
    data: sentimentHistory || [],
    xField: 'date',
    yField: 'sentimentIndex',
    smooth: true,
    color: '#1890ff',
    xAxis: {
      type: 'time' as const,
    },
    yAxis: {
      min: 0,
      max: 100,
    },
    point: {
      size: 3,
    },
  };

  if (marketLoading && !marketSentiment) {
    return <LoadingSpinner fullscreen tip="加载市场情绪数据..." />;
  }

  return (
    <div className={styles.sentiment}>
      {/* 市场情绪指标 */}
      <Card title={<Title level={4}>市场情绪指标</Title>}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card className={styles.sentimentCard}>
              <Statistic
                title="市场情绪指数"
                value={marketSentiment?.sentimentIndex || 0}
                suffix="/ 100"
                valueStyle={{ color: getSentimentColor(marketSentiment?.sentimentIndex || 0) }}
              />
              <div style={{ marginTop: 12 }}>
                <Progress
                  percent={marketSentiment?.sentimentIndex || 0}
                  strokeColor={getSentimentColor(marketSentiment?.sentimentIndex || 0)}
                  showInfo={false}
                />
                <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                  {getSentimentText(marketSentiment?.sentimentIndex || 0)}
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card className={styles.sentimentCard}>
              <Statistic
                title="恐慌贪婪指数"
                value={marketSentiment?.fearGreedIndex || 0}
                suffix="/ 100"
                valueStyle={{ color: getFearGreedColor(marketSentiment?.fearGreedIndex || 0) }}
              />
              <div style={{ marginTop: 12 }}>
                <Progress
                  percent={marketSentiment?.fearGreedIndex || 0}
                  strokeColor={getFearGreedColor(marketSentiment?.fearGreedIndex || 0)}
                  showInfo={false}
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="涨停家数"
                value={marketSentiment?.limitUpCount || 0}
                suffix="家"
                valueStyle={{ color: '#f5222d' }}
                prefix={<RiseOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="跌停家数"
                value={marketSentiment?.limitDownCount || 0}
                suffix="家"
                valueStyle={{ color: '#52c41a' }}
                prefix={<FallOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* 情绪历史趋势 */}
        {sentimentHistory && sentimentHistory.length > 0 && (
          <Card title="30天情绪趋势" style={{ marginTop: 16 }}>
            <Line {...historyChartConfig} height={300} />
          </Card>
        )}
      </Card>

      {/* 热搜股票 */}
      <Card
        title={
          <Space>
            <FireOutlined style={{ color: '#f5222d' }} />
            <Title level={4} style={{ margin: 0 }}>热搜股票</Title>
          </Space>
        }
        style={{ marginTop: 16 }}
      >
        <Table
          dataSource={trendingStocks}
          columns={trendingColumns}
          pagination={false}
          size="middle"
        />
      </Card>

      {/* 情绪排行 */}
      <Card
        title={<Title level={4}>情绪排行</Title>}
        style={{ marginTop: 16 }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as any)}
          items={[
            {
              key: 'positive',
              label: (
                <Space>
                  <SmileOutlined style={{ color: '#f5222d' }} />
                  正面情绪
                </Space>
              ),
            },
            {
              key: 'negative',
              label: (
                <Space>
                  <FrownOutlined style={{ color: '#52c41a' }} />
                  负面情绪
                </Space>
              ),
            },
          ]}
        />

        <Table
          dataSource={sentimentRanking}
          columns={rankingColumns}
          loading={rankingLoading}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 只股票`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default Sentiment;
