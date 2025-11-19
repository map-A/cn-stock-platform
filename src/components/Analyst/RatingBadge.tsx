/**
 * 评级徽章组件
 * 显示分析师评级的视觉标识
 */

import React from 'react';
import { Tag, theme } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

export interface RatingBadgeProps {
  rating: string;
  showIcon?: boolean;
  size?: 'small' | 'default' | 'large';
}

const RatingBadge: React.FC<RatingBadgeProps> = ({
  rating,
  showIcon = true,
  size = 'default',
}) => {
  const { token } = theme.useToken();

  const getRatingConfig = (ratingValue: string) => {
    const normalizedRating = ratingValue?.toLowerCase();

    if (
      normalizedRating?.includes('strong buy') ||
      normalizedRating?.includes('强烈买入')
    ) {
      return {
        color: 'success',
        icon: <RiseOutlined />,
        text: '强烈买入',
        bgColor: token.colorSuccessBgHover,
        borderColor: token.colorSuccessBorderHover,
        textColor: token.colorSuccess,
      };
    }

    if (normalizedRating?.includes('buy') || normalizedRating?.includes('买入')) {
      return {
        color: 'processing',
        icon: <CheckCircleOutlined />,
        text: '买入',
        bgColor: token.colorPrimaryBgHover,
        borderColor: token.colorPrimaryBorderHover,
        textColor: token.colorPrimary,
      };
    }

    if (normalizedRating?.includes('hold') || normalizedRating?.includes('持有')) {
      return {
        color: 'default',
        icon: <MinusOutlined />,
        text: '持有',
        bgColor: token.colorFillTertiary,
        borderColor: token.colorBorder,
        textColor: token.colorTextSecondary,
      };
    }

    if (normalizedRating?.includes('sell') || normalizedRating?.includes('卖出')) {
      return {
        color: 'error',
        icon: <FallOutlined />,
        text: '卖出',
        bgColor: token.colorErrorBgHover,
        borderColor: token.colorErrorBorderHover,
        textColor: token.colorError,
      };
    }

    if (
      normalizedRating?.includes('strong sell') ||
      normalizedRating?.includes('强烈卖出')
    ) {
      return {
        color: 'error',
        icon: <FallOutlined />,
        text: '强烈卖出',
        bgColor: token.colorErrorBgHover,
        borderColor: token.colorErrorBorderHover,
        textColor: token.colorError,
      };
    }

    return {
      color: 'default',
      icon: <MinusOutlined />,
      text: ratingValue || '未评级',
      bgColor: token.colorFillTertiary,
      borderColor: token.colorBorder,
      textColor: token.colorTextSecondary,
    };
  };

  const config = getRatingConfig(rating);

  const fontSize = size === 'small' ? 12 : size === 'large' ? 16 : 14;

  return (
    <Tag
      color={config.color}
      icon={showIcon ? config.icon : undefined}
      style={{
        fontSize,
        padding: size === 'small' ? '2px 8px' : '4px 12px',
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        color: config.textColor,
      }}
    >
      {config.text}
    </Tag>
  );
};

export default RatingBadge;
