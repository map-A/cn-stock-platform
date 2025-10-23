/**
 * 风险管理模块类型定义
 * 
 * 依据文档: API_DESIGN_GUIDE.md - 风险管理模块
 * 遵循规范: AI_PROMPT_GUIDE.md - TypeScript接口定义规范
 */

// 基础风险指标
export interface RiskMetrics {
  accountId: string;
  var: number; // Value at Risk
  cvar: number; // Conditional VaR
  beta: number;
  alpha: number;
  sharpeRatio: number;
  informationRatio: number;
  maxDrawdown: number;
  volatility: number;
  correlation: Record<string, number>;
  exposure: {
    sector: Record<string, number>;
    region: Record<string, number>;
    marketCap: Record<string, number>;
  };
  calculatedAt: string;
}

// 风险预警
export interface RiskAlert {
  id: string;
  type: 'market' | 'position' | 'liquidity' | 'operational';
  level: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: number; // 影响程度百分比
  triggeredAt: string;
  status: 'active' | 'handled' | 'ignored';
  accountId?: string;
  relatedAssets?: string[];
  threshold?: number;
  currentValue?: number;
}

// VaR计算结果
export interface VaRResult {
  date: string;
  confidence: number;
  holdingPeriod: number;
  method: 'parametric' | 'historical' | 'monte_carlo';
  value: number;
  portfolioValue: number;
  percentage: number;
  currency: string;
}

// 压力测试场景
export interface StressTestScenario {
  id: string;
  name: string;
  type: 'historical' | 'custom' | 'regulatory';
  description: string;
  parameters: {
    marketShock?: number;
    volatilityMultiplier?: number;
    correlationIncrease?: number;
    liquidityImpact?: number;
    interestRateShock?: number;
    currencyShock?: number;
    sectorShocks?: Record<string, number>;
  };
  baseDate?: string;
  duration: number; // 持续天数
  severity: 'mild' | 'moderate' | 'severe' | 'extreme';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 压力测试结果
export interface StressTestResult {
  id: string;
  scenarioId: string;
  scenarioName: string;
  runDate: string;
  portfolioId: string;
  
  // 投资组合整体影响
  portfolioImpact: {
    initialValue: number;
    stressedValue: number;
    absoluteChange: number;
    percentageChange: number;
    currency: string;
  };
  
  // 风险指标变化
  riskMetrics: {
    var: {
      initial: number;
      stressed: number;
      change: number;
    };
    cvar: {
      initial: number;
      stressed: number;
      change: number;
    };
    volatility: {
      initial: number;
      stressed: number;
      change: number;
    };
    maxDrawdown: {
      initial: number;
      stressed: number;
      change: number;
    };
  };
  
  // 资产级别影响
  assetImpacts: Array<{
    assetId: string;
    assetName: string;
    assetType: string;
    weight: number;
    initialValue: number;
    stressedValue: number;
    absoluteChange: number;
    percentageChange: number;
    contribution: number; // 对总损失的贡献度
  }>;
  
  // 行业/地区影响
  sectorImpacts: Array<{
    sector: string;
    exposure: number;
    impact: number;
    contribution: number;
  }>;
  
  status: 'completed' | 'running' | 'failed';
  duration: number; // 运行时长（秒）
  metadata?: Record<string, any>;
}

// 合规规则定义
export interface ComplianceRule {
  id: string;
  name: string;
  category: 'position_limit' | 'risk_limit' | 'sector_limit' | 'regulatory' | 'internal';
  description: string;
  ruleType: 'threshold' | 'ratio' | 'absolute' | 'relative';
  
  // 规则参数
  parameters: {
    threshold?: number;
    operator: 'lt' | 'le' | 'gt' | 'ge' | 'eq' | 'ne';
    unit: 'percent' | 'amount' | 'ratio' | 'count';
    scope: 'portfolio' | 'asset' | 'sector' | 'region';
    targetField: string; // 检查的字段名
  };
  
  // 当前状态
  currentValue?: number;
  complianceStatus: 'compliant' | 'warning' | 'violation' | 'unknown';
  lastCheckTime?: string;
  nextCheckTime?: string;
  
  // 规则配置
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  warningThreshold?: number; // 预警阈值
  
  // 监管信息
  regulatoryReference?: string;
  effectiveDate: string;
  expiryDate?: string;
  
  createdAt: string;
  updatedAt: string;
}

// 合规检查结果
export interface ComplianceCheckResult {
  id: string;
  ruleId: string;
  ruleName: string;
  checkTime: string;
  portfolioId: string;
  
  status: 'pass' | 'warning' | 'violation';
  actualValue: number;
  thresholdValue: number;
  deviationAmount: number;
  deviationPercentage: number;
  
  details: {
    description: string;
    affectedAssets?: Array<{
      assetId: string;
      assetName: string;
      contribution: number;
    }>;
    calculationMethod: string;
    dataSource: string;
  };
  
  recommendations?: string[];
  requiredActions?: string[];
  estimatedImpact?: {
    timeToResolve: number; // 小时
    tradingCost: number;
    marketImpact: number;
  };
  
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

// 风险报告
export interface RiskReport {
  id: string;
  reportType: 'daily' | 'weekly' | 'monthly' | 'ad_hoc';
  portfolioId: string;
  reportDate: string;
  period: {
    startDate: string;
    endDate: string;
  };
  
  // 执行摘要
  executiveSummary: {
    overallRiskRating: 'low' | 'medium' | 'high' | 'critical';
    keyRisks: string[];
    majorChanges: string[];
    recommendations: string[];
  };
  
  // 风险指标
  riskMetrics: RiskMetrics;
  
  // 历史对比
  historicalComparison: {
    varTrend: Array<{ date: string; value: number }>;
    volatilityTrend: Array<{ date: string; value: number }>;
    drawdownTrend: Array<{ date: string; value: number }>;
  };
  
  // 风险分解
  riskDecomposition: {
    byAsset: Array<{
      assetId: string;
      assetName: string;
      riskContribution: number;
      weight: number;
    }>;
    bySector: Array<{
      sector: string;
      riskContribution: number;
      exposure: number;
    }>;
    byRegion: Array<{
      region: string;
      riskContribution: number;
      exposure: number;
    }>;
  };
  
  // 压力测试摘要
  stressTestSummary?: {
    scenariosRun: number;
    worstCaseScenario: string;
    worstCaseLoss: number;
    averageLoss: number;
  };
  
  // 合规状态
  complianceStatus: {
    totalRules: number;
    passedRules: number;
    warningRules: number;
    violatedRules: number;
    majorViolations: string[];
  };
  
  // 预警摘要
  alertSummary: {
    totalAlerts: number;
    criticalAlerts: number;
    activeAlerts: number;
    resolvedAlerts: number;
  };
  
  status: 'draft' | 'review' | 'approved' | 'published';
  generatedBy: string;
  approvedBy?: string;
  publishedAt?: string;
  
  metadata: {
    dataQuality: number; // 数据质量评分 0-100
    modelVersion: string;
    calculationTime: number; // 计算耗时（秒）
    warnings: string[];
  };
}

// 风险配置设置
export interface RiskConfiguration {
  id: string;
  portfolioId: string;
  
  // VaR设置
  varSettings: {
    confidence: number;
    holdingPeriod: number;
    method: 'parametric' | 'historical' | 'monte_carlo';
    lookbackPeriod: number;
    updateFrequency: 'real_time' | 'hourly' | 'daily';
  };
  
  // 风险限额
  riskLimits: {
    maxVar: number;
    maxCVar: number;
    maxDrawdown: number;
    maxVolatility: number;
    maxConcentration: number;
    minLiquidity: number;
  };
  
  // 预警设置
  alertSettings: {
    enabled: boolean;
    methods: ('email' | 'sms' | 'dashboard' | 'webhook')[];
    thresholds: {
      var: number;
      drawdown: number;
      concentration: number;
      volatility: number;
    };
    recipients: string[];
    frequency: 'immediate' | 'hourly' | 'daily';
  };
  
  // 报告设置
  reportSettings: {
    autoGenerate: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    format: 'pdf' | 'excel' | 'html';
    includeStressTest: boolean;
    includeCompliance: boolean;
  };
  
  // 计算设置
  calculationSettings: {
    dataProvider: string;
    correlationWindow: number;
    volatilityWindow: number;
    returnFrequency: 'daily' | 'weekly' | 'monthly';
    adjustForWeekends: boolean;
    adjustForHolidays: boolean;
  };
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API请求/响应类型
export interface GetRiskMetricsRequest {
  portfolioId: string;
  date?: string;
  includeBreakdown?: boolean;
}

export interface GetRiskAlertsRequest {
  portfolioId?: string;
  startDate?: string;
  endDate?: string;
  level?: RiskAlert['level'];
  status?: RiskAlert['status'];
  limit?: number;
  offset?: number;
}

export interface RunStressTestRequest {
  portfolioId: string;
  scenarioId: string;
  customParameters?: StressTestScenario['parameters'];
  saveResults?: boolean;
}

export interface GenerateRiskReportRequest {
  portfolioId: string;
  reportType: RiskReport['reportType'];
  startDate: string;
  endDate: string;
  includeStressTest?: boolean;
  includeCompliance?: boolean;
  format?: 'json' | 'pdf' | 'excel';
}

// API响应基础类型
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}