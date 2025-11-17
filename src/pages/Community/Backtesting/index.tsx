/**
 * 回测工具页面
 * 提供策略回测功能
 */

import React, { useState } from 'react';
import './style.css';

// TODO: 待迁移到新的回测系统
// 临时类型定义
interface BacktestStrategy {
  name: string;
  type: string;
  rules: any[];
  initialCapital: number;
  positionSize: number;
  commission: number;
}

interface BacktestResult {
  summary: {
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    totalTrades: number;
  };
  trades: Array<{
    date: string;
    type: 'buy' | 'sell';
    price: number;
    quantity: number;
    profit?: number;
  }>;
}

// 临时模拟服务
const backtestService = {
  runBacktest: async (
    strategy: BacktestStrategy,
    symbol: string,
    startDate: string,
    endDate: string
  ): Promise<BacktestResult> => {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 返回模拟数据
    return {
      summary: {
        totalReturn: 0.15,
        annualizedReturn: 0.12,
        sharpeRatio: 1.5,
        maxDrawdown: -0.08,
        winRate: 0.65,
        totalTrades: 20,
      },
      trades: [
        { date: '2023-01-15', type: 'buy', price: 10.5, quantity: 1000, profit: undefined },
        { date: '2023-02-20', type: 'sell', price: 11.2, quantity: 1000, profit: 700 },
      ],
    };
  },
};

const BacktestingPage: React.FC = () => {
  const [strategy, setStrategy] = useState<BacktestStrategy>({
    name: '新策略',
    type: 'technical',
    rules: [],
    initialCapital: 100000,
    positionSize: 0.1,
    commission: 0.001,
  });
  const [symbol, setSymbol] = useState('');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runBacktest = async () => {
    if (!symbol) return;
    
    setIsRunning(true);
    try {
      const data = await backtestService.runBacktest(strategy, symbol, startDate, endDate);
      setResult(data);
    } catch (error) {
      console.error('Backtest failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="backtesting-page">
      <h1>🔄 策略回测工具</h1>
      
      <div className="backtest-config">
        <div className="config-section">
          <label>股票代码</label>
          <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="600000" />
        </div>
        
        <div className="config-section">
          <label>开始日期</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        
        <div className="config-section">
          <label>结束日期</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        
        <div className="config-section">
          <label>初始资金</label>
          <input type="number" value={strategy.initialCapital} onChange={(e) => setStrategy({...strategy, initialCapital: Number(e.target.value)})} />
        </div>
        
        <button onClick={runBacktest} disabled={isRunning}>
          {isRunning ? '运行中...' : '运行回测'}
        </button>
      </div>

      {result && (
        <div className="backtest-results">
          <h2>回测结果</h2>
          <div className="results-summary">
            <div className="metric">
              <label>总收益率</label>
              <span className={result.summary.totalReturn > 0 ? 'positive' : 'negative'}>
                {(result.summary.totalReturn * 100).toFixed(2)}%
              </span>
            </div>
            <div className="metric">
              <label>年化收益率</label>
              <span>{(result.summary.annualizedReturn * 100).toFixed(2)}%</span>
            </div>
            <div className="metric">
              <label>夏普比率</label>
              <span>{result.summary.sharpeRatio.toFixed(2)}</span>
            </div>
            <div className="metric">
              <label>最大回撤</label>
              <span>{(result.summary.maxDrawdown * 100).toFixed(2)}%</span>
            </div>
            <div className="metric">
              <label>胜率</label>
              <span>{(result.summary.winRate * 100).toFixed(2)}%</span>
            </div>
            <div className="metric">
              <label>交易次数</label>
              <span>{result.summary.totalTrades}</span>
            </div>
          </div>

          <div className="trades-list">
            <h3>交易记录</h3>
            <table>
              <thead>
                <tr>
                  <th>日期</th>
                  <th>类型</th>
                  <th>价格</th>
                  <th>数量</th>
                  <th>盈亏</th>
                </tr>
              </thead>
              <tbody>
                {result.trades.map((trade, idx) => (
                  <tr key={idx}>
                    <td>{trade.date}</td>
                    <td>{trade.type === 'buy' ? '买入' : '卖出'}</td>
                    <td>¥{trade.price.toFixed(2)}</td>
                    <td>{trade.quantity}</td>
                    <td className={trade.profit && trade.profit > 0 ? 'positive' : 'negative'}>
                      {trade.profit ? `¥${trade.profit.toFixed(2)}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BacktestingPage;
