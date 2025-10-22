/**
 * 股票卡片组件
 */
import React from 'react';
import { Card, Space, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { formatPrice, formatPercent, getPriceColor } from '@/utils/format';
import type { StockInfo } from '@/typings/stock';
import styles from './index.less';

const { Text } = Typography;

interface StockCardProps {
  stock: StockInfo & {
    price?: number;
    change?: number;
    changePercent?: number;
  };
  onClick?: (symbol: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const isPositive = (stock.change || 0) >= 0;
  const color = getPriceColor(stock.change);

  const handleClick = () => {
    if (onClick) {
      onClick(stock.symbol);
    } else {
      history.push(`/stock/${stock.symbol}`);
    }
  };

  return (
    <Card
      hoverable
      className={styles.stockCard}
      onClick={handleClick}
      bodyStyle={{ padding: '16px' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {/* 股票名称和代码 */}
        <div className={styles.header}>
          <Text strong className={styles.name}>
            {stock.name}
          </Text>
          <Text type="secondary" className={styles.symbol}>
            {stock.symbol}
          </Text>
        </div>

        {/* 价格 */}
        {stock.price !== undefined && (
          <div className={styles.price}>
            <Text style={{ fontSize: 24, fontWeight: 500, color }}>
              ¥{formatPrice(stock.price)}
            </Text>
          </div>
        )}

        {/* 涨跌幅 */}
        {stock.change !== undefined && stock.changePercent !== undefined && (
          <div className={styles.change}>
            <Space size="small">
              {isPositive ? (
                <ArrowUpOutlined style={{ color }} />
              ) : (
                <ArrowDownOutlined style={{ color }} />
              )}
              <Text style={{ color }}>
                {formatPrice(stock.change)}
              </Text>
              <Text style={{ color }}>
                ({formatPercent(stock.changePercent)})
              </Text>
            </Space>
          </div>
        )}

        {/* 行业信息 */}
        {stock.industry && (
          <Text type="secondary" className={styles.industry}>
            {stock.industry}
          </Text>
        )}
      </Space>
    </Card>
  );
};

export default StockCard;
