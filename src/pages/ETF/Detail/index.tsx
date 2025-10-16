/**
 * ETF详情页
 */

import React, { useState } from 'react';
import { Card, Descriptions, Tabs, Row, Col, Statistic, Tag, Spin } from 'antd';
import { useParams } from 'umi';
import { useRequest } from 'ahooks';
import { getETFDetail } from '@/services/etf';
import PriceTag from '@/components/PriceTag';
import HoldingsTab from './tabs/Holdings';
import FlowTab from './tabs/Flow';
import PremiumTab from './tabs/Premium';
import DividendTab from './tabs/Dividend';
import styles from './index.module.less';

const ETFDetail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: etfInfo, loading } = useRequest(() => getETFDetail(code));

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!etfInfo) {
    return <div>ETF不存在</div>;
  }

  const typeMap: Record<string, { color: string; text: string }> = {
    stock: { color: 'blue', text: '股票型' },
    bond: { color: 'green', text: '债券型' },
    commodity: { color: 'orange', text: '商品型' },
    hybrid: { color: 'purple', text: '混合型' },
    index: { color: 'cyan', text: '指数型' },
  };

  const typeConfig = typeMap[etfInfo.type] || { color: 'default', text: etfInfo.type };

  return (
    <div className={styles.container}>
      {/* 头部信息卡片 */}
      <Card className={styles.headerCard}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {etfInfo.name} ({etfInfo.code})
            </h1>
            <div className={styles.tags}>
              <Tag color={typeConfig.color}>{typeConfig.text}</Tag>
              <Tag>{etfInfo.manager}</Tag>
            </div>
          </div>
        </div>

        <Row gutter={16} className={styles.stats}>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Statistic
              title="单位净值"
              value={etfInfo.unitNetValue}
              precision={4}
              prefix="¥"
            />
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Statistic
              title="累计净值"
              value={etfInfo.accumulatedNetValue}
              precision={4}
              prefix="¥"
            />
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Statistic
              title="规模(亿)"
              value={(etfInfo.totalAssets / 100000000).toFixed(2)}
              precision={2}
            />
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className={styles.statItem}>
              <div className={styles.statTitle}>溢价率</div>
              <PriceTag value={etfInfo.premium} suffix="%" precision={2} />
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className={styles.statItem}>
              <div className={styles.statTitle}>今年以来</div>
              <PriceTag value={etfInfo.ytd} suffix="%" showIcon />
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <Statistic
              title="股息率"
              value={etfInfo.dividendYield}
              suffix="%"
              precision={2}
            />
          </Col>
        </Row>
      </Card>

      {/* 详情标签页 */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="基本信息" key="overview">
            <Descriptions column={{ xs: 1, sm: 2 }} bordered>
              <Descriptions.Item label="ETF代码">{etfInfo.code}</Descriptions.Item>
              <Descriptions.Item label="ETF名称">{etfInfo.name}</Descriptions.Item>
              <Descriptions.Item label="ETF类型">
                <Tag color={typeConfig.color}>{typeConfig.text}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="基金经理">{etfInfo.manager}</Descriptions.Item>
              <Descriptions.Item label="跟踪指数">
                {etfInfo.trackingIndex || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="跟踪误差">
                {etfInfo.trackingError ? `${etfInfo.trackingError.toFixed(2)}%` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="成立日期">{etfInfo.foundDate}</Descriptions.Item>
              <Descriptions.Item label="上市日期">{etfInfo.listingDate}</Descriptions.Item>
              <Descriptions.Item label="管理费率">
                {etfInfo.managementFee.toFixed(2)}%
              </Descriptions.Item>
              <Descriptions.Item label="托管费率">
                {etfInfo.custodyFee.toFixed(2)}%
              </Descriptions.Item>
              <Descriptions.Item label="市盈率">{etfInfo.pe.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="市净率">{etfInfo.pb.toFixed(2)}</Descriptions.Item>
            </Descriptions>
          </Tabs.TabPane>

          <Tabs.TabPane tab="持仓明细" key="holdings">
            <HoldingsTab code={code} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="资金流向" key="flow">
            <FlowTab code={code} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="溢价折价" key="premium">
            <PremiumTab code={code} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="分红历史" key="dividend">
            <DividendTab code={code} />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ETFDetail;
