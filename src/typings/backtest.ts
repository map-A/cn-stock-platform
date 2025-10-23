/**
 * 回测系统类型定义
 * 
 * 依据文档: MODULE_PROMPTS.md - 回测系统模块
 */

// 回测状态
export type BacktestStatus = 
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

// 回测类型
export type BacktestType = 
  | 'single_strategy'
  | 'parameter_optimization'
  | 'portfolio'
  | 'walk_forward';

// 回测记录
export interface BacktestRecord {
  id: string;
  name: string;
  description?: string;
  type: BacktestType;
  status: BacktestStatus;
  
  // 策略信息
  strategyId: string;
  strategyName: string;
  
  // 时间配置
  startDate: string;
  endDate: string;
  
  // 资金配置
  initialCapital: number;
  commission: number;
  slippage: number;
  
  // 执行信息
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number; // 执行时长(秒)
  progress?: number; // 执行进度(0-100)
  
  // 结果指标
  totalReturn?: number;
  annualizedReturn?: number;
  volatility?: number;
  sharpeRatio?: number;
  maxDrawdown?: number;
  winRate?: number;
  totalTrades?: number;
  
  // 基准对比
  benchmarkSymbol?: string;
  benchmarkReturn?: number;
  alpha?: number;
  beta?: number;
  
  // 错误信息
  errorMessage?: string;
}

// 回测配置
export interface BacktestConfig {
  name: string;
  description?: string;
  type: BacktestType;
  
  // 策略配置
  strategyId: string;
  parameters: Record<string, any>;
  
  // 时间范围
  startDate: string;
  endDate: string;
  
  // 资金设置
  initialCapital: number;
  commission: number;
  slippage: number;
  
  // 数据设置
  dataFrequency: '1min' | '5min' | '15min' | '30min' | '1hour' | '1day';
  adjustForDividends: boolean;
  adjustForSplits: boolean;
  
  // 基准设置
  benchmarkSymbol?: string;
  
  // 高级选项
  maxPositions?: number;
  positionSizing?: 'equal' | 'risk_parity' | 'volatility_target';
  rebalanceFrequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
}

// 回测结果详情
export interface BacktestResults {
  backtestId: string;
  config: BacktestConfig;
  
  // 基础指标
  performance: {
    totalReturn: number;
    annualizedReturn: number;
    volatility: number;
    sharpeRatio: number;
    sortinoRatio: number;
    calmarRatio: number;
    maxDrawdown: number;
    maxDrawdownDuration: number;
    winRate: number;
    profitFactor: number;
    payoffRatio: number;
  };
  
  // 交易统计
  trades: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    avgTradeDuration: number;
    avgWinAmount: number;
    avgLossAmount: number;
    largestWin: number;
    largestLoss: number;
    consecutiveWins: number;
    consecutiveLosses: number;
  };
  
  // 风险指标
  risk: {
    var95: number;
    var99: number;
    cvar95: number;
    cvar99: number;
    downsideDeviation: number;
    beta?: number;
    alpha?: number;
    informationRatio?: number;
    trackingError?: number;
  };
  
  // 时间序列数据
  timeSeries: {
    equity: Array<{
      date: string;
      value: number;
      return: number;
      drawdown: number;
    }>;
    
    benchmark?: Array<{
      date: string;
      value: number;
      return: number;
    }>;
    
    positions: Array<{
      date: string;
      symbol: string;
      quantity: number;
      price: number;
      value: number;
    }>;
    
    trades: Array<{
      id: string;
      symbol: string;
      side: 'buy' | 'sell';
      quantity: number;
      price: number;
      timestamp: string;
      pnl: number;
      commission: number;
      signal?: string;
    }>;
  };
  
  // 月度/年度统计
  periodicReturns: {
    monthly: Array<{
      period: string;
      return: number;
      benchmark?: number;
    }>;
    
    yearly: Array<{
      year: number;
      return: number;
      volatility: number;
      sharpe: number;
      maxDrawdown: number;
      benchmark?: number;
    }>;
  };
}

// 回测报告
export interface BacktestReport {
  backtestId: string;
  title: string;
  generatedAt: string;
  
  // 执行摘要
  summary: {
    strategyName: string;
    period: string;
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    totalTrades: number;
    winRate: number;
  };
  
  // 详细分析
  analysis: {
    performanceAnalysis: string;
    riskAnalysis: string;
    tradeAnalysis: string;
    conclusions: string[];
    recommendations: string[];
  };
  
  // 图表数据
  charts: {
    equityCurve: any;
    drawdownChart: any;
    monthlyReturns: any;
    tradeDistribution: any;
  };
}

// 参数优化配置
export interface ParameterOptimization {
  parameters: Array<{
    name: string;
    type: 'range' | 'list';
    min?: number;
    max?: number;
    step?: number;
    values?: any[];
  }>;
  
  optimizationTarget: 'total_return' | 'sharpe_ratio' | 'calmar_ratio' | 'sortino_ratio';
  constraints?: Array<{
    metric: string;
    operator: '>' | '<' | '>=' | '<=' | '==';
    value: number;
  }>;
}

// 走势分析配置
export interface WalkForwardConfig {
  inSamplePeriod: number; // 样本内期间(天)
  outSamplePeriod: number; // 样本外期间(天)
  stepSize: number; // 步长(天)
  reoptimizationFrequency: number; // 重新优化频率(天)
}