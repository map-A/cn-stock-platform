/**
 * 筛选器卡片组件
 */

import React from 'react';
import { Card, Tag, Space, Button, Tooltip, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ClockCircleOutlined, StarFilled } from '@ant-design/icons';
import type { SavedScreener } from '../../types';
import dayjs from 'dayjs';
import styles from './index.less';

const { Text, Paragraph } = Typography;

interface ScreenerCardProps {
  screener: SavedScreener;
  onLoad: (screener: SavedScreener) => void;
  onEdit?: (screener: SavedScreener) => void;
  onDelete?: (screenerId: string) => void;
}

const ScreenerCard: React.FC<ScreenerCardProps> = ({
  screener,
  onLoad,
  onEdit,
  onDelete,
}) => {
  const getFilterSummary = () => {
    const parts: string[] = [];
    
    if (screener.filters.basic) {
      const { markets, industries, sectors } = screener.filters.basic;
      if (markets && markets.length > 0) {
        parts.push(`市场: ${markets.length}个`);
      }
      if (industries && industries.length > 0) {
        parts.push(`行业: ${industries.length}个`);
      }
      if (sectors && sectors.length > 0) {
        parts.push(`板块: ${sectors.length}个`);
      }
    }

    if (screener.filters.technical) {
      const { ma, rsi, macd } = screener.filters.technical;
      if (ma?.enabled) parts.push('MA均线');
      if (rsi?.enabled) parts.push('RSI');
      if (macd?.enabled) parts.push('MACD');
    }

    if (screener.filters.fundamental) {
      const keys = Object.keys(screener.filters.fundamental);
      if (keys.length > 0) {
        parts.push(`财务指标: ${keys.length}个`);
      }
    }

    if (screener.filters.customRules && screener.filters.customRules.length > 0) {
      parts.push(`自定义规则: ${screener.filters.customRules.length}条`);
    }

    return parts.length > 0 ? parts.join(' | ') : '无筛选条件';
  };

  return (
    <Card
      hoverable
      className={styles.screenerCard}
      onClick={() => onLoad(screener)}
      extra={
        !screener.isPreset && (
          <Space size="small" onClick={e => e.stopPropagation()}>
            {onEdit && (
              <Tooltip title="编辑">
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(screener)}
                />
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="删除">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(screener.id)}
                />
              </Tooltip>
            )}
          </Space>
        )
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {screener.isPreset && <StarFilled style={{ color: '#faad14' }} />}
          <Text strong style={{ fontSize: 16 }}>
            {screener.name}
          </Text>
        </div>

        {screener.description && (
          <Paragraph
            ellipsis={{ rows: 2, tooltip: screener.description }}
            type="secondary"
            style={{ marginBottom: 8 }}
          >
            {screener.description}
          </Paragraph>
        )}

        <Text type="secondary" style={{ fontSize: 12 }}>
          {getFilterSummary()}
        </Text>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size={4}>
            <ClockCircleOutlined style={{ fontSize: 12, color: '#999' }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {dayjs(screener.updatedAt).format('YYYY-MM-DD HH:mm')}
            </Text>
          </Space>

          {screener.usageCount !== undefined && screener.usageCount > 0 && (
            <Tag color="blue" style={{ margin: 0 }}>
              使用 {screener.usageCount} 次
            </Tag>
          )}
        </div>
      </Space>
    </Card>
  );
};

export default ScreenerCard;
