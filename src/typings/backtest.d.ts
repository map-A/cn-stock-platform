/**
 * 回测相关类型定义
 */

// 回测状态
export type BacktestStatus = 
  | 'pending'       // 等待中
  | 'running'       // 运行中
  | 'completed'     // 已完成
  | 'failed'        // 失败
  | 'cancelled';    // 已取消

// 回测配置
export interface BacktestConfig {
  strategyId: string;
  strategyVersion?: number;
  symbol: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  commission: number;
  slippage: number;
  dataSource: 'primary' | 'alternative';
  timeframe: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d';
  parameters?: Record<string, any>;
}

// 参数扫描配置
export interface ParamSweepConfig {
  parameters: Array<{
    key: string;
    start: number;
    end: number;
    step: number;
  }>;
  metric: 'return' | 'sharpe' | 'maxDrawdown' | 'winRate';
}

// 回测任务
export interface BacktestTask {
  id: string;
  strategyId: string;
  strategyName: string;
  config: BacktestConfig;
  status: BacktestStatus;
  progress?: number;
  startTime?: string;
  endTime?: string;
  error?: string;
  result?: BacktestResult;
  createdAt: string;
  updatedAt: string;
}

// 回测结果
export interface BacktestResult {
  id: string;
  taskId: string;
  strategyId: string;
  config: BacktestConfig;
  summary: BacktestSummary;
  equity: EquityPoint[];
  trades: Trade[];
  orders: Order[];
  metrics: PerformanceMetrics;
  charts: ChartData;
  logs?: string[];
  warnings?: string[];
  createdAt: string;
}

// 回测摘要
export interface BacktestSummary {
  totalReturn: number;
  annualizedReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWin: number;
  avgLoss: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  avgTradeDuration: number;
}

// 权益点
export interface EquityPoint {
  date: string;
  timestamp: number;
  equity: number;
  cash: number;
  position: number;
  drawdown: number;
}

// 交易记录
export interface Trade {
  id: string;
  entryDate: string;
  exitDate: string;
  symbol: string;
  side: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  profit: number;
  profitPercent: number;
  commission: number;
  slippage: number;
  holdingDays: number;
  entryReason?: string;
  exitReason?: string;
}

// 订单记录
export interface Order {
  id: string;
  date: string;
  timestamp: number;
  symbol: string;
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  quantity: number;
  price: number;
  filledPrice?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  commission?: number;
  slippage?: number;
  reason?: string;
}

// 性能指标
export interface PerformanceMetrics {
  returns: {
    daily: number[];
    weekly: number[];
    monthly: number[];
    yearly: number[];
  };
  drawdowns: {
    current: number;
    max: number;
    duration: number;
    maxDuration: number;
    recovery: number;
  };
  risk: {
    volatility: number;
    downsideDeviation: number;
    var95: number;
    cvar95: number;
    beta?: number;
    alpha?: number;
  };
  trades: {
    avgProfit: number;
    avgLoss: number;
    avgReturn: number;
    bestTrade: number;
    worstTrade: number;
    avgHoldingPeriod: number;
  };
}

// 图表数据
export interface ChartData {
  equity: {
    dates: string[];
    values: number[];
  };
  drawdown: {
    dates: string[];
    values: number[];
  };
  returns: {
    dates: string[];
    values: number[];
  };
  positions: {
    dates: string[];
    longExposure: number[];
    shortExposure: number[];
  };
  trades: {
    dates: string[];
    profits: number[];
    sizes: number[];
  };
}

// 回测列表查询参数
export interface BacktestQueryParams {
  page?: number;
  pageSize?: number;
  strategyId?: string;
  status?: BacktestStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'return' | 'sharpe';
  sortOrder?: 'asc' | 'desc';
}

// 回测列表响应
export interface BacktestListResponse {
  data: BacktestTask[];
  total: number;
  page: number;
  pageSize: number;
}

// 创建回测参数
export interface CreateBacktestParams {
  strategyId: string;
  strategyVersion?: number;
  config: BacktestConfig;
  paramSweep?: ParamSweepConfig;
}

// 参数扫描结果
export interface ParamSweepResult {
  id: string;
  backTestId: string;
  results: Array<{
    parameters: Record<string, any>;
    metrics: {
      return: number;
      sharpe: number;
      maxDrawdown: number;
      winRate: number;
    };
  }>;
  best: {
    parameters: Record<string, any>;
    metric: string;
    value: number;
  };
  heatmap?: {
    xParam: string;
    yParam: string;
    values: number[][];
  };
}

// 回测进度
export interface BacktestProgress {
  taskId: string;
  status: BacktestStatus;
  progress: number;
  message: string;
  currentDate?: string;
  totalDays?: number;
  completedDays?: number;
  estimatedTimeLeft?: number;
}
