/**
 * 价格标签组件 - 显示涨跌的价格标签
 */
import React from 'react';
import { Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { formatPrice, formatPercent, getPriceColor } from '@/utils/format';

interface PriceTagProps {
  /** 当前价格 */
  price?: number;
  /** 涨跌额 */
  change?: number;
  /** 涨跌幅 */
  changePercent?: number;
  /** 显示模式 */
  mode?: 'full' | 'simple' | 'percent-only';
  /** 尺寸 */
  size?: 'small' | 'middle' | 'large';
}

const PriceTag: React.FC<PriceTagProps> = ({
  price,
  change,
  changePercent,
  mode = 'full',
  size = 'middle',
}) => {
  if (change === undefined && changePercent === undefined) {
    return <span>--</span>;
  }

  const isPositive = (change || changePercent || 0) >= 0;
  const color = getPriceColor(change || changePercent);
  const tagColor = isPositive ? '#00FC50' : '#FF2F1F'; // 按COLOR_SCHEME规范
  const icon = isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />;

  // 根据尺寸设置字体大小
  const fontSize = {
    small: 12,
    middle: 14,
    large: 16,
  }[size];

  // 仅显示涨跌幅
  if (mode === 'percent-only' && changePercent !== undefined) {
    return (
      <Tag
        style={{ 
          color: tagColor,
          backgroundColor: 'rgba(0, 252, 80, 0.1)',
          borderColor: tagColor,
          fontSize 
        }}
        icon={icon}
      >
        {formatPercent(changePercent)}
      </Tag>
    );
  }

  // 简单模式
  if (mode === 'simple') {
    return (
      <span style={{ color, fontSize }}>
        {icon} {change !== undefined && formatPrice(change)}
        {change !== undefined && changePercent !== undefined && ' '}
        {changePercent !== undefined && `(${formatPercent(changePercent)})`}
      </span>
    );
  }

  // 完整模式
  return (
    <span style={{ fontSize }}>
      {price !== undefined && (
        <span style={{ marginRight: 8, fontWeight: 500 }}>
          ¥{formatPrice(price)}
        </span>
      )}
      <Tag
        style={{
          color: tagColor,
          backgroundColor: isPositive ? 'rgba(0, 252, 80, 0.1)' : 'rgba(255, 47, 31, 0.1)',
          borderColor: tagColor,
          fontSize
        }}
        icon={icon}
      >
        {change !== undefined && formatPrice(change)}
        {change !== undefined && changePercent !== undefined && ' '}
        {changePercent !== undefined && formatPercent(changePercent)}
      </Tag>
    </span>
  );
};

export default PriceTag;
