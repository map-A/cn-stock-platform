/**
 * 板块概览组件
 * 展示板块卡片和统计信息
 */

import React from 'react';
import { Row, Col, Card, Statistic, Space, Typography, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { Sector } from '@/services/industry';
import { formatNumber, formatPercent } from '@/utils/format';
import styles from '@/styles/global.less';

const { Text, Title } = Typography;

interface SectorOverviewProps {
  /** 板块数据 */
  data: Sector[];
  /** 板块点击事件 */
  onSectorClick?: (code: string) => void;
}

/**
 * 板块概览组件
 */
const SectorOverview: React.FC<SectorOverviewProps> = ({ data, onSectorClick }) => {
  /**
   * 渲染板块卡片
   */
  const renderSectorCard = (sector: Sector) => {
    const isPositive = (sector.changePercent ?? 0) >= 0;

    return (
      <Col xs={24} sm={12} md={8} lg={6} key={sector.code}>
        <Card
          className={styles.industryCard}
          hoverable
          onClick={() => onSectorClick?.(sector.code)}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {sector.name}
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {sector.industries.length} 个行业
              </Text>
            </div>

            <Statistic
              title="涨跌幅"
              value={sector.changePercent ?? 0}
              precision={2}
              suffix="%"
              valueStyle={{
                color: isPositive ? '#cf1322' : '#3f8600',
                fontSize: 24,
              }}
              prefix={isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            />

            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">总市值</Text>
                <Text strong>{formatNumber(sector.totalMarketCap, '亿')}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">股票数量</Text>
                <Text strong>{sector.stockCount} 只</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary">成交额</Text>
                <Text strong>{formatNumber(sector.volume ?? 0, '亿')}</Text>
              </div>
            </Space>

            {sector.description && (
              <Text type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: 12 }}>
                {sector.description}
              </Text>
            )}
          </Space>
        </Card>
      </Col>
    );
  };

  /**
   * 按涨跌幅排序
   */
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => (b.changePercent ?? 0) - (a.changePercent ?? 0));
  }, [data]);

  return (
    <Row gutter={[16, 16]}>
      {sortedData.map((sector) => renderSectorCard(sector))}
    </Row>
  );
};

export default SectorOverview;
