/**
 * 价格卡片组件
 */
import React from 'react';
import { Card, Space, Typography, Tag, Button, Row, Col, Statistic } from 'antd';
import { StarOutlined, StarFilled, BellOutlined } from '@ant-design/icons';
import { formatPrice, formatPercent, getPriceColor } from '@/utils/format';
import PriceTag from '@/components/PriceTag';
import type { StockInfo, StockQuote } from '@/typings/stock';
import styles from './index.less';

const { Title, Text } = Typography;

interface PriceCardProps {
  quote: StockQuote;
  info: StockInfo;
}

const PriceCard: React.FC<PriceCardProps> = ({ quote, info }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const isPositive = quote.change >= 0;
  const color = getPriceColor(quote.change);

  return (
    <Card className={styles.priceCard}>
      <div className={styles.header}>
        <Space direction="vertical" size="small">
          <Space size="large" align="baseline">
            <Title level={3} style={{ margin: 0 }}>
              {info.name}
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              {info.symbol}
            </Text>
            {info.isST && <Tag color="warning">ST</Tag>}
            <Tag>{info.exchange}</Tag>
          </Space>
          {info.industry && (
            <Text type="secondary">{info.industry}</Text>
          )}
        </Space>

        <Space>
          <Button
            icon={isFavorite ? <StarFilled /> : <StarOutlined />}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            {isFavorite ? '已收藏' : '加自选'}
          </Button>
          <Button icon={<BellOutlined />}>
            价格提醒
          </Button>
        </Space>
      </div>

      <Row gutter={[32, 16]} className={styles.priceInfo}>
        <Col xs={24} sm={12} md={8}>
          <div className={styles.mainPrice}>
            <Space direction="vertical" size="small">
              <Text type="secondary">当前价格</Text>
              <Space align="baseline">
                <Text
                  style={{
                    fontSize: 48,
                    fontWeight: 600,
                    color,
                    lineHeight: 1,
                  }}
                >
                  ¥{formatPrice(quote.price)}
                </Text>
                <PriceTag
                  change={quote.change}
                  changePercent={quote.changePercent}
                  mode="simple"
                  size="large"
                />
              </Space>
              <Text type="secondary" style={{ fontSize: 12 }}>
                更新时间: {quote.updateTime}
              </Text>
            </Space>
          </div>
        </Col>

        <Col xs={24} sm={12} md={16}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Statistic
                title="开盘"
                value={quote.open}
                precision={2}
                prefix="¥"
                valueStyle={{ fontSize: 16 }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="昨收"
                value={quote.preClose}
                precision={2}
                prefix="¥"
                valueStyle={{ fontSize: 16 }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="最高"
                value={quote.high}
                precision={2}
                prefix="¥"
                valueStyle={{ fontSize: 16, color: '#f5222d' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="最低"
                value={quote.low}
                precision={2}
                prefix="¥"
                valueStyle={{ fontSize: 16, color: '#52c41a' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="成交量"
                value={(quote.volume / 10000).toFixed(2)}
                suffix="万手"
                valueStyle={{ fontSize: 16 }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="成交额"
                value={(quote.amount / 100000000).toFixed(2)}
                suffix="亿"
                valueStyle={{ fontSize: 16 }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="换手率"
                value={quote.turnoverRate || 0}
                precision={2}
                suffix="%"
                valueStyle={{ fontSize: 16 }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="市盈率"
                value={quote.pe || 0}
                precision={2}
                valueStyle={{ fontSize: 16 }}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {/* 涨跌停价格 */}
      {quote.limitUp && quote.limitDown && (
        <div className={styles.limitPrice}>
          <Space size="large">
            <Text type="secondary">
              涨停: <Text style={{ color: '#f5222d' }}>¥{formatPrice(quote.limitUp)}</Text>
            </Text>
            <Text type="secondary">
              跌停: <Text style={{ color: '#52c41a' }}>¥{formatPrice(quote.limitDown)}</Text>
            </Text>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default PriceCard;
