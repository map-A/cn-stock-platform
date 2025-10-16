import React from 'react';
import { Badge as AntBadge } from 'antd';
import type { BadgeProps as AntBadgeProps } from 'antd';

export interface BadgeProps extends AntBadgeProps {}

export const Badge: React.FC<BadgeProps> = (props) => {
  return <AntBadge {...props} />;
};

export default Badge;
