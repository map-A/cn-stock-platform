/**
 * 行业概览页面
 * 展示所有板块和行业的表现数据
 */

import React, { useEffect, useState } from 'react';
import { Card, Tabs, Spin, Empty, Tag, Space, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import IndustryTable from './components/IndustryTable';
import SectorOverview from './components/SectorOverview';
import IndustryPerformanceChart from './components/IndustryPerformanceChart';
import { getSectorList, getIndustryPerformance } from '@/services/industry';
import type { Sector, IndustryPerformance } from '@/services/industry';
import styles from './index.less';

const { TabPane } = Tabs;

/**
 * 行业概览页面组件
 */
const IndustryOverview: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [performance, setPerformance] = useState<IndustryPerformance[]>([]);
  const [timeRange, setTimeRange] = useState<'1d' | '5d' | '1m' | '3m' | '6m' | '1y'>('1d');
  const [activeTab, setActiveTab] = useState('overview');

  /**
   * 加载数据
   */
  const loadData = async () => {
    setLoading(true);
    try {
      const [sectorsData, performanceData] = await Promise.all([
        getSectorList(),
        getIndustryPerformance(timeRange),
      ]);
      setSectors(sectorsData);
      setPerformance(performanceData);
    } catch (error) {
      console.error('Failed to load industry data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeRange]);

  /**
   * 计算市场统计数据
   */
  const marketStats = React.useMemo(() => {
    if (performance.length === 0) return null;

    const gainers = performance.filter((item) => item.dayChange > 0);
    const losers = performance.filter((item) => item.dayChange < 0);
    const avgChange =
      performance.reduce((sum, item) => sum + item.dayChange, 0) / performance.length;

    return {
      gainersCount: gainers.length,
      losersCount: losers.length,
      avgChange,
      topGainer: performance.reduce((max, item) =>
        item.dayChange > max.dayChange ? item : max,
      ),
      topLoser: performance.reduce((min, item) => (item.dayChange < min.dayChange ? item : min)),
    };
  }, [performance]);

  /**
   * 渲染市场统计卡片
   */
  const renderMarketStats = () => {
    if (!marketStats) return null;

    return (
      <Row gutter={16} className={styles.statsRow}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="上涨行业"
              value={marketStats.gainersCount}
              suffix="个"
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="下跌行业"
              value={marketStats.losersCount}
              suffix="个"
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="平均涨跌"
              value={marketStats.avgChange.toFixed(2)}
              suffix="%"
              valueStyle={{ color: marketStats.avgChange >= 0 ? '#cf1322' : '#3f8600' }}
              prefix={
                marketStats.avgChange >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div>
                <Tag color="red">领涨</Tag>
                <span>
                  {marketStats.topGainer.name} {marketStats.topGainer.dayChange.toFixed(2)}%
                </span>
              </div>
              <div>
                <Tag color="green">领跌</Tag>
                <span>
                  {marketStats.topLoser.name} {marketStats.topLoser.dayChange.toFixed(2)}%
                </span>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    );
  };

  /**
   * 渲染时间范围选择器
   */
  const renderTimeRangeSelector = () => {
    const ranges = [
      { value: '1d', label: '今日' },
      { value: '5d', label: '5日' },
      { value: '1m', label: '1月' },
      { value: '3m', label: '3月' },
      { value: '6m', label: '6月' },
      { value: '1y', label: '1年' },
    ];

    return (
      <Space>
        {ranges.map((range) => (
          <Tag
            key={range.value}
            color={timeRange === range.value ? 'blue' : 'default'}
            style={{ cursor: 'pointer' }}
            onClick={() => setTimeRange(range.value as any)}
          >
            {range.label}
          </Tag>
        ))}
      </Space>
    );
  };

  return (
    <PageContainer
      title="行业与板块"
      subTitle="深度分析A股各行业和板块的表现、资金流向和投资机会"
      extra={renderTimeRangeSelector()}
    >
      <Spin spinning={loading}>
        {renderMarketStats()}

        <Card style={{ marginTop: 16 }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="行业概览" key="overview">
              {performance.length > 0 ? (
                <IndustryTable
                  data={performance}
                  timeRange={timeRange}
                  onRowClick={(record) => history.push(`/industry/${record.code}`)}
                />
              ) : (
                <Empty description="暂无数据" />
              )}
            </TabPane>

            <TabPane tab="板块分析" key="sectors">
              {sectors.length > 0 ? (
                <SectorOverview
                  data={sectors}
                  onSectorClick={(code) => history.push(`/industry/sector/${code}`)}
                />
              ) : (
                <Empty description="暂无数据" />
              )}
            </TabPane>

            <TabPane tab="涨跌排行" key="ranking">
              <IndustryPerformanceChart data={performance} timeRange={timeRange} />
            </TabPane>
          </Tabs>
        </Card>
      </Spin>
    </PageContainer>
  );
};

export default IndustryOverview;
