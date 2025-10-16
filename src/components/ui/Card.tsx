/**
 * 通用卡片组件
 * 基于 Ant Design Card 的简单封装
 */

import React from 'react';
import { Card as AntCard } from 'antd';
import type { CardProps as AntCardProps } from 'antd';

export interface CardProps extends AntCardProps {
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <AntCard {...props}>{children}</AntCard>;
};

export default Card;
