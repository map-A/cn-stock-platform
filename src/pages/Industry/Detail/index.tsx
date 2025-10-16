/**
 * 行业详情页面
 * 展示单个行业的详细数据和分析
 */

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Statistic, Space, Tag, Tabs, Empty } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import {
  getIndustryDetail,
  getIndustryStocks,
  getIndustryMoneyFlow,
  getIndustryValuation,
} from '@/services/industry';
import type {
  Industry,
  IndustryStock,
  IndustryMoneyFlow,
} from '@/services/industry';
import { formatNumber } from '@/utils/format';
import StockTable from './components/StockTable';
import MoneyFlowChart from './components/MoneyFlowChart';
import ValuationAnalysis from './components/ValuationAnalysis';
import styles from './index.less';

const { TabPane } = Tabs;

/**
 * 行业详情页面组件
 */
const IndustryDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [loading, setLoading] = useState(false);
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [stocks, setStocks] = useState<IndustryStock[]>([]);
  const [moneyFlow, setMoneyFlow] = useState<IndustryMoneyFlow[]>([]);
  const [valuation, setValuation] = useState<any>(null);

  /**
   * 加载数据
   */
  const loadData = async () => {
    if (!code) return;

    setLoading(true);
    try {
      const [industryData, stocksData, moneyFlowData, valuationData] = await Promise.all([
        getIndustryDetail(code),
        getIndustryStocks(code, 'marketCap', 'desc', 1, 50),
        getIndustryMoneyFlow(code),
        getIndustryValuation(code),
      ]);

      setIndustry(industryData);
      setStocks(stocksData.data);
      setMoneyFlow(moneyFlowData);
      setValuation(valuationData);
    } catch (error) {
      console.error('Failed to load industry detail:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [code]);

  /**
   * 渲染行业统计信息
   */
  const renderStats = () => {
    if (!industry) return null;

    const isPositive = (industry.changePercent ?? 0) >= 0;

    return (
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="涨跌幅"
              value={industry.changePercent ?? 0}
              precision={2}
              suffix="%"
              valueStyle={{ color: isPositive ? '#cf1322' : '#3f8600' }}
              prefix={isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总市值"
              value={industry.totalMarketCap}
              formatter={(value) => formatNumber(value as number, '亿')}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="股票数量"
              value={industry.stockCount}
              suffix="只"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="平均市盈率"
              value={industry.avgPE ?? 0}
              precision={2}
              suffix="倍"
            />
          </Card>
        </Col>
      </Row>
    );
  };

  /**
   * 渲染行业信息
   */
  const renderIndustryInfo = () => {
    if (!industry) return null;

    return (
      <Card title="行业信息">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Tag color="blue">{industry.sector}</Tag>
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>{industry.name}</span>
          </div>
          {industry.description && (
            <div>
              <span style={{ color: '#666' }}>{industry.description}</span>
            </div>
          )}
          <div>
            <Space>
              <span>行业代码: {industry.code}</span>
              <span>成交额: {formatNumber(industry.volume ?? 0, '亿')}</span>
              <span>换手率: {industry.turnoverRate?.toFixed(2)}%</span>
            </Space>
          </div>
        </Space>
      </Card>
    );
  };

  return (
    <PageContainer
      title={industry?.name ?? '行业详情'}
      subTitle={industry?.sector}
      loading={loading}
      onBack={() => window.history.back()}
    >
      <Spin spinning={loading}>
        {renderStats()}

        <div style={{ marginTop: 16 }}>
          {renderIndustryInfo()}
        </div>

        <Card style={{ marginTop: 16 }}>
          <Tabs defaultActiveKey="stocks">
            <TabPane tab="成分股" key="stocks">
              {stocks.length > 0 ? (
                <StockTable data={stocks} />
              ) : (
                <Empty description="暂无数据" />
              )}
            </TabPane>

            <TabPane tab="资金流向" key="moneyFlow">
              {moneyFlow.length > 0 ? (
                <MoneyFlowChart data={moneyFlow} />
              ) : (
                <Empty description="暂无数据" />
              )}
            </TabPane>

            <TabPane tab="估值分析" key="valuation">
              {valuation ? (
                <ValuationAnalysis data={valuation} />
              ) : (
                <Empty description="暂无数据" />
              )}
            </TabPane>
          </Tabs>
        </Card>
      </Spin>
    </PageContainer>
  );
};

export default IndustryDetail;
