/**
 * 股票对比工具页面
 * 支持多只股票的全面对比分析
 */

import React, { useState, useEffect } from 'react';
import { compareService, type CompareData } from '@/services/compareService';
import StockSelector from '@/components/StockSelector';
import './style.css';

const METRICS_CONFIG = {
  basic: [
    { key: 'price', label: '当前价格', format: 'currency' },
    { key: 'change', label: '涨跌额', format: 'currency' },
    { key: 'changePercent', label: '涨跌幅', format: 'percent' },
    { key: 'marketCap', label: '市值', format: 'number' },
    { key: 'volume', label: '成交量', format: 'number' },
  ],
  valuation: [
    { key: 'pe', label: '市盈率', format: 'number' },
    { key: 'eps', label: 'EPS', format: 'currency' },
    { key: 'dividendYield', label: '股息率', format: 'percent' },
  ],
  financial: [
    { key: 'revenue', label: '营收', format: 'number' },
    { key: 'netIncome', label: '净利润', format: 'number' },
    { key: 'freeCashFlow', label: '自由现金流', format: 'number' },
  ],
  profitability: [
    { key: 'grossMargin', label: '毛利率', format: 'percent' },
    { key: 'operatingMargin', label: '营业利润率', format: 'percent' },
    { key: 'netMargin', label: '净利率', format: 'percent' },
    { key: 'roe', label: 'ROE', format: 'percent' },
    { key: 'roa', label: 'ROA', format: 'percent' },
  ],
};

const CompareStocksPage: React.FC = () => {
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [compareData, setCompareData] = useState<CompareData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof METRICS_CONFIG>('basic');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedSymbols.length > 0) {
      loadCompareData();
    }
  }, [selectedSymbols]);

  const loadCompareData = async () => {
    setIsLoading(true);
    try {
      const data = await compareService.compareStocks(selectedSymbols);
      setCompareData(data);
    } catch (error) {
      console.error('Failed to load compare data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addStock = (symbol: string) => {
    if (selectedSymbols.length < 5 && !selectedSymbols.includes(symbol)) {
      setSelectedSymbols([...selectedSymbols, symbol]);
    }
  };

  const removeStock = (symbol: string) => {
    setSelectedSymbols(selectedSymbols.filter(s => s !== symbol));
    setCompareData(compareData.filter(d => d.symbol !== symbol));
  };

  const formatValue = (value: any, format: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (format) {
      case 'currency':
        return `¥${Number(value).toFixed(2)}`;
      case 'percent':
        return `${(Number(value) * 100).toFixed(2)}%`;
      case 'number':
        return Number(value).toLocaleString();
      default:
        return value;
    }
  };

  return (
    <div className="compare-stocks-page">
      <div className="page-header">
        <h1>📊 股票对比工具</h1>
        <p>全面对比多只股票的关键指标</p>
      </div>

      <div className="stock-selector-section">
        <h3>选择股票 (最多5只)</h3>
        <StockSelector
          onSelect={addStock}
          disabled={selectedSymbols.length >= 5}
        />
        <div className="selected-stocks">
          {selectedSymbols.map(symbol => (
            <div key={symbol} className="selected-stock-chip">
              {symbol}
              <button onClick={() => removeStock(symbol)}>×</button>
            </div>
          ))}
        </div>
      </div>

      {selectedSymbols.length > 0 && (
        <>
          <div className="category-tabs">
            {Object.entries(METRICS_CONFIG).map(([key, _]) => (
              <button
                key={key}
                className={selectedCategory === key ? 'active' : ''}
                onClick={() => setSelectedCategory(key as any)}
              >
                {key === 'basic' && '基本信息'}
                {key === 'valuation' && '估值指标'}
                {key === 'financial' && '财务数据'}
                {key === 'profitability' && '盈利能力'}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="loading">加载中...</div>
          ) : (
            <div className="compare-table">
              <table>
                <thead>
                  <tr>
                    <th>指标</th>
                    {compareData.map(stock => (
                      <th key={stock.symbol}>
                        <div className="stock-header">
                          <strong>{stock.symbol}</strong>
                          <span>{stock.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {METRICS_CONFIG[selectedCategory].map(metric => (
                    <tr key={metric.key}>
                      <td className="metric-label">{metric.label}</td>
                      {compareData.map(stock => (
                        <td key={stock.symbol}>
                          {formatValue(stock[metric.key], metric.format)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompareStocksPage;
