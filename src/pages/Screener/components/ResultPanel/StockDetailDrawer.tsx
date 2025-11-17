/**
 * 股票详情抽屉组件
 */

import React from 'react';
import { Drawer, Descriptions, Tag, Button, Space, Divider, Progress, Row, Col, Statistic, Card } from 'antd';
import { StarOutlined, BellOutlined, LinkOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { ScreenerResult } from '../../types';
import { useNavigate } from '@umijs/max';

interface StockDetailDrawerProps {
  visible: boolean;
  stock: ScreenerResult | null;
  onClose: () => void;
}

const StockDetailDrawer: React.FC<StockDetailDrawerProps> = ({
  visible,
  stock,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!stock) return null;

  const handleViewDetail = () => {
    navigate(`/stock/${stock.symbol}`);
    onClose();
  };

  return (
    <Drawer
      title={`${stock.symbol} - ${stock.name}`}
      placement="right"
      width={600}
      onClose={onClose}
      open={visible}
      extra={
        <Space>
          <Button icon={<StarOutlined />} size="small">
            加自选
          </Button>
          <Button icon={<BellOutlined />} size="small">
            设提醒
          </Button>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 基本信息 */}
        <div>
          <Descriptions title="基本信息" size="small" column={2} bordered>
            <Descriptions.Item label="市场">{stock.market}</Descriptions.Item>
            <Descriptions.Item label="行业">{stock.industry}</Descriptions.Item>
            <Descriptions.Item label="当前价">¥{stock.price.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="涨跌幅">
              <Tag color={stock.changePercent >= 0 ? 'red' : 'green'}>
                {stock.changePercent >= 0 ? '+' : ''}
                {stock.changePercent.toFixed(2)}%
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="成交量">
              {(stock.volume / 10000).toFixed(2)}万
            </Descriptions.Item>
            <Descriptions.Item label="成交额">
              {(stock.amount / 10000).toFixed(2)}万
            </Descriptions.Item>
            <Descriptions.Item label="市值">
              {(stock.marketCap / 100000000).toFixed(2)}亿
            </Descriptions.Item>
            <Descriptions.Item label="流通市值">
              {stock.circulationMarketCap
                ? `${(stock.circulationMarketCap / 100000000).toFixed(2)}亿`
                : '-'}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider />

        {/* 价格区间 */}
        <div>
          <Descriptions title="价格区间" size="small" column={2} bordered>
            <Descriptions.Item label="今日最高">
              {stock.high ? `¥${stock.high.toFixed(2)}` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="今日最低">
              {stock.low ? `¥${stock.low.toFixed(2)}` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="52周最高">
              {stock.high52Week ? `¥${stock.high52Week.toFixed(2)}` : '暂无数据'}
            </Descriptions.Item>
            <Descriptions.Item label="52周最低">
              {stock.low52Week ? `¥${stock.low52Week.toFixed(2)}` : '暂无数据'}
            </Descriptions.Item>
            <Descriptions.Item label="价格位置" span={2}>
              {stock.high52Week && stock.low52Week ? (
                <div>
                  <Progress
                    percent={
                      ((stock.price - stock.low52Week) / 
                       (stock.high52Week - stock.low52Week)) * 100
                    }
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    format={(percent) => `${percent?.toFixed(1)}%`}
                  />
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                    当前价格在52周区间的位置
                  </div>
                </div>
              ) : (
                '暂无数据'
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider />

        {/* 资金流向 */}
        <div>
          <div style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }}>资金流向</div>
          <Card size="small">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="主力净流入"
                  value={stock.mainNetInflow || 0}
                  precision={2}
                  valueStyle={{ 
                    color: (stock.mainNetInflow || 0) >= 0 ? '#cf1322' : '#3f8600',
                    fontSize: 20
                  }}
                  prefix={
                    (stock.mainNetInflow || 0) >= 0 ? 
                    <ArrowUpOutlined /> : <ArrowDownOutlined />
                  }
                  suffix="万"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="主力净流入占比"
                  value={stock.mainNetInflowRatio || 0}
                  precision={2}
                  valueStyle={{ fontSize: 20 }}
                  suffix="%"
                />
              </Col>
            </Row>
            
            <Divider style={{ margin: '12px 0' }} />
            
            <Space direction="vertical" style={{ width: '100%' }} size="small">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>超大单：</span>
                <Space>
                  <span style={{ 
                    color: (stock.hugeOrderRatio || 0) >= 0 ? '#cf1322' : '#3f8600',
                    fontWeight: 600
                  }}>
                    {(stock.hugeOrderRatio || 0) >= 0 ? '+' : ''}
                    {(stock.hugeOrderRatio || 0).toFixed(2)}%
                  </span>
                  <Progress 
                    percent={Math.abs(stock.hugeOrderRatio || 0)} 
                    size="small" 
                    style={{ width: 100 }}
                    strokeColor={(stock.hugeOrderRatio || 0) >= 0 ? '#cf1322' : '#3f8600'}
                    showInfo={false}
                  />
                </Space>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>大单：</span>
                <Space>
                  <span style={{ 
                    color: (stock.largeOrderRatio || 0) >= 0 ? '#cf1322' : '#3f8600',
                    fontWeight: 600
                  }}>
                    {(stock.largeOrderRatio || 0) >= 0 ? '+' : ''}
                    {(stock.largeOrderRatio || 0).toFixed(2)}%
                  </span>
                  <Progress 
                    percent={Math.abs(stock.largeOrderRatio || 0)} 
                    size="small" 
                    style={{ width: 100 }}
                    strokeColor={(stock.largeOrderRatio || 0) >= 0 ? '#cf1322' : '#3f8600'}
                    showInfo={false}
                  />
                </Space>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>中单：</span>
                <Space>
                  <span style={{ 
                    color: (stock.mediumOrderRatio || 0) >= 0 ? '#cf1322' : '#3f8600',
                    fontWeight: 600
                  }}>
                    {(stock.mediumOrderRatio || 0) >= 0 ? '+' : ''}
                    {(stock.mediumOrderRatio || 0).toFixed(2)}%
                  </span>
                  <Progress 
                    percent={Math.abs(stock.mediumOrderRatio || 0)} 
                    size="small" 
                    style={{ width: 100 }}
                    strokeColor={(stock.mediumOrderRatio || 0) >= 0 ? '#cf1322' : '#3f8600'}
                    showInfo={false}
                  />
                </Space>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>小单：</span>
                <Space>
                  <span style={{ 
                    color: (stock.smallOrderRatio || 0) >= 0 ? '#cf1322' : '#3f8600',
                    fontWeight: 600
                  }}>
                    {(stock.smallOrderRatio || 0) >= 0 ? '+' : ''}
                    {(stock.smallOrderRatio || 0).toFixed(2)}%
                  </span>
                  <Progress 
                    percent={Math.abs(stock.smallOrderRatio || 0)} 
                    size="small" 
                    style={{ width: 100 }}
                    strokeColor={(stock.smallOrderRatio || 0) >= 0 ? '#cf1322' : '#3f8600'}
                    showInfo={false}
                  />
                </Space>
              </div>
            </Space>
            
            <div style={{ 
              marginTop: 12, 
              padding: '8px 12px', 
              background: '#f5f5f5', 
              borderRadius: 4,
              fontSize: 12,
              color: '#8c8c8c'
            }}>
              💡 正值表示净流入，负值表示净流出
            </div>
          </Card>
        </div>

        <Divider />

        {/* 财务指标 */}
        <div>
          <Descriptions title="财务指标" size="small" column={2} bordered>
            <Descriptions.Item label="市盈率PE">
              {stock.peRatio ? stock.peRatio.toFixed(2) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="市净率PB">
              {stock.pbRatio ? stock.pbRatio.toFixed(2) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="ROE">
              {stock.roe ? `${stock.roe.toFixed(2)}%` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="EPS">
              {stock.eps ? `¥${stock.eps.toFixed(2)}` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="毛利率">
              {stock.grossProfitMargin ? `${stock.grossProfitMargin.toFixed(2)}%` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="净利率">
              {stock.netProfitMargin ? `${stock.netProfitMargin.toFixed(2)}%` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="EPS增长率">
              {stock.epsGrowth ? `${stock.epsGrowth.toFixed(2)}%` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="营收增长率">
              {stock.revenueGrowth ? `${stock.revenueGrowth.toFixed(2)}%` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="资产负债率">
              {stock.debtRatio ? `${stock.debtRatio.toFixed(2)}%` : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="股息率">
              {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : '-'}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider />

        {/* 技术指标 */}
        {(stock.ma5 || stock.rsi) && (
          <div>
            <Descriptions title="技术指标" size="small" column={2} bordered>
              {stock.ma5 && (
                <Descriptions.Item label="MA5">¥{stock.ma5.toFixed(2)}</Descriptions.Item>
              )}
              {stock.ma10 && (
                <Descriptions.Item label="MA10">¥{stock.ma10.toFixed(2)}</Descriptions.Item>
              )}
              {stock.ma20 && (
                <Descriptions.Item label="MA20">¥{stock.ma20.toFixed(2)}</Descriptions.Item>
              )}
              {stock.rsi && (
                <Descriptions.Item label="RSI">{stock.rsi.toFixed(2)}</Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}

        <Button
          type="primary"
          icon={<LinkOutlined />}
          onClick={handleViewDetail}
          block
          size="large"
        >
          查看完整详情
        </Button>
      </Space>
    </Drawer>
  );
};

export default StockDetailDrawer;
