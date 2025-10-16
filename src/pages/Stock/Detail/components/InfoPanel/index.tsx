/**
 * 信息面板组件
 */
import React from 'react';
import { Card, Descriptions, Tag, Space } from 'antd';
import { formatMarketCap, formatDate, getExchangeName } from '@/utils/format';
import type { StockInfo, StockQuote } from '@/typings/stock';
import styles from './index.less';

interface InfoPanelProps {
  info: StockInfo;
  quote: StockQuote;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ info, quote }) => {
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* 基本信息 */}
      <Card title="基本信息" size="small">
        <Descriptions column={1} size="small">
          <Descriptions.Item label="股票代码">{info.symbol}</Descriptions.Item>
          <Descriptions.Item label="股票名称">{info.name}</Descriptions.Item>
          <Descriptions.Item label="交易所">
            {getExchangeName(info.exchange)}
          </Descriptions.Item>
          {info.industry && (
            <Descriptions.Item label="所属行业">{info.industry}</Descriptions.Item>
          )}
          {info.sector && (
            <Descriptions.Item label="所属板块">{info.sector}</Descriptions.Item>
          )}
          {info.listDate && (
            <Descriptions.Item label="上市日期">
              {formatDate(info.listDate)}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 市场数据 */}
      <Card title="市场数据" size="small">
        <Descriptions column={1} size="small">
          {info.totalMarketCap && (
            <Descriptions.Item label="总市值">
              {formatMarketCap(info.totalMarketCap)}
            </Descriptions.Item>
          )}
          {info.floatMarketCap && (
            <Descriptions.Item label="流通市值">
              {formatMarketCap(info.floatMarketCap)}
            </Descriptions.Item>
          )}
          {info.totalShares && (
            <Descriptions.Item label="总股本">
              {(info.totalShares / 100000000).toFixed(2)}亿股
            </Descriptions.Item>
          )}
          {info.floatShares && (
            <Descriptions.Item label="流通股本">
              {(info.floatShares / 100000000).toFixed(2)}亿股
            </Descriptions.Item>
          )}
          {quote.pe && (
            <Descriptions.Item label="市盈率(TTM)">
              {quote.pe.toFixed(2)}
            </Descriptions.Item>
          )}
          {quote.pb && (
            <Descriptions.Item label="市净率">
              {quote.pb.toFixed(2)}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* 特殊标记 */}
      {info.isST && (
        <Card title="风险提示" size="small">
          <Tag color="warning" style={{ marginBottom: 8 }}>ST股票</Tag>
          <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', margin: 0 }}>
            该股票被特别处理，存在退市风险，请谨慎投资
          </p>
        </Card>
      )}
    </Space>
  );
};

export default InfoPanel;
