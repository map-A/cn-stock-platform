/**
 * AI策略模块类型定义
 * 
 * 依据文档: MODULE_PROMPTS.md - 策略管理模块
 */

// 策略类型
export type StrategyType = 
  | 'trend_following'
  | 'mean_reversion' 
  | 'momentum'
  | 'arbitrage'
  | 'grid'
  | 'scalping'
  | 'swing'
  | 'quantitative'
  | 'ai_ml'
  | 'custom';

// 策略状态
export type StrategyStatus = 
  | 'draft'
  | 'testing'
  | 'active'
  | 'paused'
  | 'disabled'
  | 'archived';

// 时间框架
export type TimeFrame = 
  | 'tick'
  | '1min'
  | '5min'
  | '15min'
  | '30min'
  | '1hour'
  | '4hour'
  | '1day'
  | '1week'
  | '1month';

// 策略基础信息
export interface StrategyInfo {
  id: string;
  name: string;
  description: string;
  type: StrategyType;
  status: StrategyStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  version: string;
  tags: string[];
  isPublic: boolean;
  configId?: string;
  lastBacktestId?: string;
  performance?: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
}

// 策略参数配置
export interface StrategyParameters {
  // 基础参数
  symbol: string;
  timeFrame: TimeFrame;
  capital: number;
  maxPositionSize: number;
  
  // 风险控制
  stopLoss: number;
  takeProfit: number;
  maxDrawdown: number;
  maxDailyLoss: number;
  
  // 技术指标参数
  indicators: {
    [key: string]: {
      enabled: boolean;
      parameters: Record<string, any>;
    };
  };
  
  // AI/ML参数
  mlParameters?: {
    modelType: 'lstm' | 'random_forest' | 'svm' | 'linear_regression';
    features: string[];
    lookbackPeriod: number;
    predictionHorizon: number;
    retrainFrequency: number;
    confidenceThreshold: number;
  };
  
  // 自定义参数
  customParameters: Record<string, any>;
}

// 策略配置
export interface StrategyConfig {
  id: string;
  strategyId: string;
  name: string;
  parameters: StrategyParameters;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// 回测配置
export interface BacktestConfig {
  strategyId: string;
  configId: string;
  startDate: string;
  endDate: string;
  symbols: string[];
  initialCapital: number;
  commission: number;
  slippage: number;
  benchmark?: string;
}

// 回测结果
export interface BacktestResult {
  id: string;
  strategyId: string;
  configId: string;
  config: BacktestConfig;
  
  // 基础指标
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  
  // 详细指标
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWinAmount: number;
  avgLossAmount: number;
  profitFactor: number;
  
  // 风险指标
  var95: number;
  var99: number;
  expectedShortfall: number;
  beta: number;
  alpha: number;
  informationRatio: number;
  
  // 时间序列数据
  equityCurve: Array<{
    timestamp: string;
    value: number;
    return: number;
    drawdown: number;
  }>;
  
  // 交易记录
  trades: Array<{
    id: string;
    symbol: string;
    side: 'buy' | 'sell';
    quantity: number;
    price: number;
    timestamp: string;
    pnl: number;
    commission: number;
  }>;
  
  createdAt: string;
  status: 'running' | 'completed' | 'failed';
}

// 策略执行状态
export interface StrategyExecution {
  id: string;
  strategyId: string;
  strategyName: string;
  status: 'starting' | 'running' | 'stopping' | 'stopped' | 'error';
  startTime: string;
  endTime?: string;
  
  // 实时性能指标
  performance?: {
    totalReturn: number;
    dailyReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
    totalTrades: number;
    winRate: number;
    equityCurve: Array<{
      timestamp: string;
      value: number;
      return: number;
    }>;
  };
  
  // 风险指标
  risk?: {
    concentration: number;
    leverage: number;
    intradayDrawdown: number;
    level: 'low' | 'medium' | 'high';
    warning?: string;
  };
  
  // 当前持仓
  positions?: Array<{
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    pnl: number;
    pnlPercent: number;
  }>;
}

// 策略信号
export interface StrategySignal {
  id: string;
  strategyId: string;
  symbol: string;
  signal: 'buy' | 'sell' | 'hold';
  price: number;
  quantity: number;
  confidence: number;
  timestamp: string;
  status: 'pending' | 'executed' | 'cancelled' | 'failed';
  reason?: string;
}

// 策略日志
export interface StrategyLog {
  id: string;
  strategyId: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

// 回测交易记录
export interface BacktestTrade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  commission: number;
  timestamp: string;
  pnl: number;
  cumulativePnl: number;
  signal: string;
  confidence?: number;
}

// 策略持仓
export interface StrategyPosition {
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  openTime: string;
}

// 策略绩效分析
export interface StrategyPerformance {
  strategyId: string;
  period: {
    startDate: string;
    endDate: string;
  };
  metrics: {
    totalReturn: number;
    annualizedReturn: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    calmarRatio: number;
    sortinoRatio: number;
    informationRatio: number;
    beta: number;
    alpha: number;
    trackingError: number;
  };
  monthlyReturns: Array<{
    month: string;
    return: number;
    benchmark?: number;
  }>;
  drawdownPeriods: Array<{
    start: string;
    end: string;
    maxDrawdown: number;
    duration: number;
  }>;
}

// 多因子模型
export interface MultiFactorModel {
  id: string;
  strategyId: string;
  name: string;
  description: string;
  factors: Array<{
    name: string;
    category: 'fundamental' | 'technical' | 'macro' | 'sentiment' | 'quality' | 'growth' | 'value';
    weight: number;
    ic: number;
    tStat: number;
    significance: number;
    description: string;
  }>;
  statistics: {
    rSquared: number;
    adjustedRSquared: number;
    fStat: number;
    pValue: number;
    residualStd: number;
  };
  createdAt: string;
  updatedAt: string;
}

// 因子分析
export interface FactorAnalysis {
  strategyId: string;
  contributions: Array<{
    factorName: string;
    contribution: number;
    riskContribution: number;
  }>;
  riskAttribution: {
    factorRisk: number;
    specificRisk: number;
    totalRisk: number;
  };
  factorExposure: Array<{
    factorName: string;
    exposure: number;
    percentile: number;
  }>;
}

// 策略部署配置
export interface StrategyDeployment {
  id: string;
  strategyId: string;
  configId: string;
  name: string;
  environment: 'paper' | 'live';
  
  // 资金配置
  allocatedCapital: number;
  maxPositionSize: number;
  
  // 风险控制
  dailyLossLimit: number;
  maxDrawdownLimit: number;
  
  // 监控设置
  notificationEnabled: boolean;
  alertThresholds: {
    drawdown: number;
    dailyLoss: number;
    errorCount: number;
  };
  
  // 部署状态
  status: 'pending' | 'deploying' | 'active' | 'stopped' | 'error';
  deployedAt?: string;
  stoppedAt?: string;
  lastHealthCheck: string;
}

// 策略模板
export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  type: StrategyType;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // 模板配置
  defaultParameters: StrategyParameters;
  requiredIndicators: string[];
  supportedTimeframes: TimeFrame[];
  minCapital: number;
  
  // 元数据
  author: string;
  version: string;
  rating: number;
  downloads: number;
  lastUpdated: string;
  tags: string[];
  
  // 示例结果
  sampleBacktest?: {
    period: string;
    return: number;
    sharpe: number;
    maxDrawdown: number;
  };
}