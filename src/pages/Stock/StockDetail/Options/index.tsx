import React, { useState, useEffect } from 'react';
import { Card, Tabs, Spin, Empty } from 'antd';
import type { TabsProps } from 'antd';
import OptionsChain from './components/OptionsChain';
import OptionsAnalysis from './components/OptionsAnalysis';
import OptionsGreeks from './components/OptionsGreeks';
import OptionsVolatility from './components/OptionsVolatility';

interface OptionsPageProps {
  /** 股票代码 */
  stockCode: string;
  /** 股票名称 */
  stockName: string;
}

/**
 * 股票详情 - 期权分析页面
 * 
 * 注意：cn市场目前只有少数ETF有期权，如50ETF、300ETF、500ETF等
 * 大部分个股暂无期权，需要根据实际情况显示相应内容
 */
const StockOptionsPage: React.FC<OptionsPageProps> = ({ stockCode, stockName }) => {
  const [loading, setLoading] = useState(false);
  const [hasOptions, setHasOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('chain');

  /**
   * 检查该股票是否有期权数据
   */
  useEffect(() => {
    const checkOptionsAvailability = async () => {
      setLoading(true);
      try {
        // TODO: 调用 API 检查是否有期权数据
        // const response = await fetch(`/api/options/check?stockCode=${stockCode}`);
        // const data = await response.json();
        // setHasOptions(data.hasOptions);

        // Mock: 只有特定的 ETF 才有期权
        const optionEnabledCodes = ['510050', '510300', '510500', '159915'];
        setHasOptions(optionEnabledCodes.includes(stockCode));
      } catch (error) {
        console.error('检查期权数据失败:', error);
        setHasOptions(false);
      } finally {
        setLoading(false);
      }
    };

    checkOptionsAvailability();
  }, [stockCode]);

  const tabItems: TabsProps['items'] = [
    {
      key: 'chain',
      label: '期权链',
      children: <OptionsChain stockCode={stockCode} />,
    },
    {
      key: 'analysis',
      label: '期权分析',
      children: <OptionsAnalysis stockCode={stockCode} />,
    },
    {
      key: 'greeks',
      label: '希腊字母',
      children: <OptionsGreeks stockCode={stockCode} />,
    },
    {
      key: 'volatility',
      label: '波动率分析',
      children: <OptionsVolatility stockCode={stockCode} />,
    },
  ];

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: '#999' }}>加载中...</div>
        </div>
      </Card>
    );
  }

  if (!hasOptions) {
    return (
      <Card>
        <Empty
          description={
            <div>
              <div style={{ fontSize: 16, marginBottom: 8 }}>
                {stockName} ({stockCode}) 暂无期权数据
              </div>
              <div style={{ color: '#999', fontSize: 14 }}>
                目前仅上证50ETF、沪深300ETF、中证500ETF等少数标的提供期权交易
              </div>
            </div>
          }
        />
      </Card>
    );
  }

  return (
    <Card>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </Card>
  );
};

export default StockOptionsPage;
