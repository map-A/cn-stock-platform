import React, { useState } from 'react';
import { Card, Row, Col, Table, Tag, Space, Typography, Statistic, Input, Tabs } from 'antd';
import { FireOutlined, RiseOutlined, FallOutlined, SearchOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { getConceptList, getConceptDetail, getSectorList } from '@/services/china-features';
import { history } from '@umijs/max';
import { formatPercent, formatCurrency } from '@/utils/format';
import type { Concept, ConceptStock, Sector } from '@/typings/china-features';
import styles from './index.less';

const { Title, Text } = Typography;
const { Search } = Input;

/**
 * 概念板块页面
 * 展示热门概念、板块涨跌幅、成分股等
 */
const ConceptSector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('concept');
  const [selectedConcept, setSelectedConcept] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // 获取概念列表
  const { data: conceptData, loading: conceptLoading } = useRequest(
    () => getConceptList({ sortBy: 'changePercent' }),
    {
      ready: activeTab === 'concept',
    },
  );

  // 获取行业板块列表
  const { data: sectorData, loading: sectorLoading } = useRequest(
    () => getSectorList({ sortBy: 'changePercent' }),
    {
      ready: activeTab === 'sector',
    },
  );

  // 获取概念详情
  const { data: detailData, loading: detailLoading } = useRequest(
    () => getConceptDetail(selectedConcept),
    {
      ready: !!selectedConcept,
      refreshDeps: [selectedConcept],
    },
  );

  // 处理概念卡片点击
  const handleConceptClick = (conceptId: string) => {
    setSelectedConcept(conceptId);
  };

  // 处理股票点击
  const handleStockClick = (symbol: string) => {
    history.push(`/stock/${symbol}`);
  };

  // 过滤概念列表
  const filteredConcepts = conceptData?.filter(item =>
    item.name.includes(searchKeyword) || item.code.includes(searchKeyword)
  );

  // 概念卡片渲染
  const renderConceptCard = (concept: Concept) => {
    const isPositive = concept.changePercent >= 0;
    const isHot = concept.hotRank <= 10;

    return (
      <Card
        key={concept.code}
        hoverable
        className={styles.conceptCard}
        onClick={() => handleConceptClick(concept.code)}
        bodyStyle={{ padding: 16 }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          {/* 概念名称 */}
          <div className={styles.conceptHeader}>
            <Space>
              <Text strong style={{ fontSize: 16 }}>
                {concept.name}
              </Text>
              {isHot && <Tag color="red" icon={<FireOutlined />}>热门</Tag>}
            </Space>
          </div>

          {/* 涨跌幅 */}
          <div className={styles.conceptChange}>
            <Space size={4}>
              {isPositive ? <RiseOutlined style={{ color: '#f5222d' }} /> : <FallOutlined style={{ color: '#52c41a' }} />}
              <Text
                style={{
                  color: isPositive ? '#f5222d' : '#52c41a',
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              >
                {formatPercent(concept.changePercent)}
              </Text>
            </Space>
          </div>

          {/* 统计信息 */}
          <div className={styles.conceptStats}>
            <Row gutter={8}>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  成分股: {concept.stockCount}只
                </Text>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  领涨股: {concept.leadingStock}
                </Text>
              </Col>
            </Row>
            <Row gutter={8} style={{ marginTop: 4 }}>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  涨停: {concept.riseLimit}只
                </Text>
              </Col>
              <Col span={12}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  总市值: {formatCurrency(concept.totalMarketCap)}
                </Text>
              </Col>
            </Row>
          </div>

          {/* 资金流向 */}
          <div className={styles.moneyFlow}>
            <Text
              style={{
                fontSize: 12,
                color: concept.netAmount >= 0 ? '#f5222d' : '#52c41a',
              }}
            >
              净流入: {concept.netAmount >= 0 ? '+' : ''}{formatCurrency(concept.netAmount)}
            </Text>
          </div>
        </Space>
      </Card>
    );
  };

  // 成分股表格列定义
  const stockColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 60,
      render: (rank: number) => <Tag color={rank <= 3 ? 'red' : 'default'}>{rank}</Tag>,
    },
    {
      title: '股票',
      dataIndex: 'symbol',
      width: 200,
      render: (_: string, record: ConceptStock) => (
        <Space direction="vertical" size={0}>
          <a onClick={() => handleStockClick(record.symbol)} style={{ fontWeight: 500 }}>
            {record.name}
          </a>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.symbol}
          </Text>
        </Space>
      ),
    },
    {
      title: '最新价',
      dataIndex: 'price',
      width: 100,
      align: 'right' as const,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '涨跌幅',
      dataIndex: 'changePercent',
      width: 100,
      align: 'right' as const,
      sorter: (a: ConceptStock, b: ConceptStock) => a.changePercent - b.changePercent,
      render: (percent: number) => {
        const isPositive = percent >= 0;
        return (
          <Text style={{ color: isPositive ? '#f5222d' : '#52c41a', fontWeight: 500 }}>
            {isPositive ? '+' : ''}{formatPercent(percent)}
          </Text>
        );
      },
    },
    {
      title: '成交额',
      dataIndex: 'amount',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: '换手率',
      dataIndex: 'turnoverRate',
      width: 100,
      align: 'right' as const,
      render: (rate: number) => formatPercent(rate),
    },
    {
      title: '概念关联度',
      dataIndex: 'relevance',
      width: 100,
      align: 'center' as const,
      render: (relevance: number) => (
        <Tag color={relevance >= 80 ? 'red' : relevance >= 60 ? 'orange' : 'default'}>
          {relevance}%
        </Tag>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {/* 页面标题 */}
      <div className={styles.header}>
        <Title level={2}>
          <ThunderboltOutlined style={{ color: '#faad14' }} /> 概念板块
        </Title>
        <Text type="secondary">捕捉市场热点，把握投资机会</Text>
      </div>

      {/* 主内容 */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'concept', label: '热门概念' },
            { key: 'sector', label: '行业板块' },
          ]}
        />

        {/* 搜索框 */}
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder={activeTab === 'concept' ? '搜索概念名称或代码' : '搜索板块名称'}
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={setSearchKeyword}
            style={{ maxWidth: 500 }}
          />
        </div>

        {activeTab === 'concept' && (
          <div>
            {/* 概念列表 */}
            <Row gutter={[16, 16]}>
              {filteredConcepts?.map(concept => (
                <Col xs={24} sm={12} md={8} lg={6} key={concept.code}>
                  {renderConceptCard(concept)}
                </Col>
              ))}
            </Row>

            {/* 成分股详情 */}
            {selectedConcept && (
              <Card
                title={`${detailData?.name || ''} - 成分股详情`}
                style={{ marginTop: 24 }}
                extra={
                  <a onClick={() => setSelectedConcept('')}>关闭</a>
                }
              >
                <Table
                  dataSource={detailData?.stocks}
                  columns={stockColumns}
                  loading={detailLoading}
                  rowKey="symbol"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                  }}
                />
              </Card>
            )}
          </div>
        )}

        {activeTab === 'sector' && (
          <Table
            dataSource={sectorData}
            loading={sectorLoading}
            rowKey="code"
            columns={[
              { title: '排名', dataIndex: 'rank', width: 60 },
              { title: '板块名称', dataIndex: 'name', width: 150 },
              {
                title: '涨跌幅',
                dataIndex: 'changePercent',
                align: 'right' as const,
                sorter: (a: Sector, b: Sector) => a.changePercent - b.changePercent,
                render: (percent: number) => {
                  const isPositive = percent >= 0;
                  return (
                    <Text style={{ color: isPositive ? '#f5222d' : '#52c41a', fontWeight: 500 }}>
                      {isPositive ? '+' : ''}{formatPercent(percent)}
                    </Text>
                  );
                },
              },
              { title: '成分股数', dataIndex: 'stockCount', align: 'center' as const },
              { title: '领涨股', dataIndex: 'leadingStock' },
              {
                title: '总市值',
                dataIndex: 'totalMarketCap',
                align: 'right' as const,
                render: (cap: number) => formatCurrency(cap),
              },
              {
                title: '资金流向',
                dataIndex: 'netAmount',
                align: 'right' as const,
                render: (amount: number) => {
                  const isPositive = amount >= 0;
                  return (
                    <Text style={{ color: isPositive ? '#f5222d' : '#52c41a' }}>
                      {isPositive ? '+' : ''}{formatCurrency(amount)}
                    </Text>
                  );
                },
              },
            ]}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default ConceptSector;
