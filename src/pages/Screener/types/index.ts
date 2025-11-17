/**
 * 股票筛选器类型定义
 */

// 比较运算符
export type ComparisonOperator = 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'neq' | 'between' | 'in';

// 逻辑运算符
export type LogicalOperator = 'AND' | 'OR';

// 技术指标类型
export type TechnicalIndicatorType = 'MA' | 'RSI' | 'MACD' | 'KDJ' | 'BOLL' | 'VOL';

// 财务指标类型
export type FundamentalIndicatorType = 'ROE' | 'PE' | 'PB' | 'EPS' | 'REVENUE' | 'PROFIT_MARGIN' | 'DEBT_RATIO';

// 单个过滤条件
export interface FilterCondition {
  id: string;
  field: string;
  operator: ComparisonOperator;
  value: any;
  logicalOperator?: LogicalOperator; // 与下一个条件的逻辑关系
}

// 基本过滤条件
export interface BasicFilters {
  markets?: string[]; // 市场：沪市、深市、创业板等
  industries?: string[]; // 行业
  sectors?: string[]; // 板块
  marketCapMin?: number; // 最小市值
  marketCapMax?: number; // 最大市值
  priceMin?: number; // 最低价格
  priceMax?: number; // 最高价格
  volumeMin?: number; // 最小成交量
  volumeMax?: number; // 最大成交量
}

// MA均线配置
export interface MAConfig {
  enabled: boolean;
  shortPeriod: number; // 短期均线周期
  longPeriod: number; // 长期均线周期
  condition: 'cross_up' | 'cross_down' | 'above' | 'below'; // 交叉条件
}

// RSI配置
export interface RSIConfig {
  enabled: boolean;
  period: number; // 周期
  condition: 'oversold' | 'overbought' | 'custom'; // 条件
  minValue?: number; // 最小值
  maxValue?: number; // 最大值
}

// MACD配置
export interface MACDConfig {
  enabled: boolean;
  condition: 'golden_cross' | 'death_cross' | 'histogram_positive' | 'histogram_negative';
}

// KDJ配置
export interface KDJConfig {
  enabled: boolean;
  kMin?: number;
  kMax?: number;
  dMin?: number;
  dMax?: number;
  jMin?: number;
  jMax?: number;
}

// 布林带配置
export interface BOLLConfig {
  enabled: boolean;
  period: number;
  condition: 'above_upper' | 'below_lower' | 'in_middle';
}

// 成交量配置
export interface VolumeConfig {
  enabled: boolean;
  condition: 'breakout' | 'above_average' | 'below_average';
  multiplier?: number; // 倍数
}

// 技术指标过滤条件
export interface TechnicalFilters {
  ma?: MAConfig;
  rsi?: RSIConfig;
  macd?: MACDConfig;
  kdj?: KDJConfig;
  boll?: BOLLConfig;
  volume?: VolumeConfig;
  volatility?: 'high' | 'medium' | 'low'; // 波动率
}

// 财务指标过滤条件
export interface FundamentalFilters {
  roeMin?: number; // ROE最小值
  roeMax?: number; // ROE最大值
  peMin?: number; // PE最小值
  peMax?: number; // PE最大值
  peType?: 'ttm' | 'static'; // PE类型
  pbMin?: number; // PB最小值
  pbMax?: number; // PB最大值
  grossProfitMarginMin?: number; // 毛利率最小值
  grossProfitMarginMax?: number; // 毛利率最大值
  netProfitMarginMin?: number; // 净利率最小值
  netProfitMarginMax?: number; // 净利率最大值
  epsGrowthMin?: number; // EPS增长率最小值
  epsGrowthMax?: number; // EPS增长率最大值
  revenueGrowthMin?: number; // 营收增长率最小值
  revenueGrowthMax?: number; // 营收增长率最大值
  debtRatioMin?: number; // 资产负债率最小值
  debtRatioMax?: number; // 资产负债率最大值
}

// 自定义规则
export interface CustomRule {
  id: string;
  field: string; // 字段名
  fieldLabel: string; // 字段显示名称
  operator: ComparisonOperator; // 比较运算符
  value: any; // 值
  logicalOperator?: LogicalOperator; // 与下一个规则的逻辑关系
}

// 所有筛选条件
export interface ScreenerFilters {
  basic?: BasicFilters;
  technical?: TechnicalFilters;
  fundamental?: FundamentalFilters;
  customRules?: CustomRule[];
  expression?: string; // 高级表达式
}

// 筛选结果
export interface ScreenerResult {
  symbol: string; // 股票代码
  name: string; // 股票名称
  market: string; // 市场
  price: number; // 当前价格
  change: number; // 涨跌额
  changePercent: number; // 涨跌幅
  volume: number; // 成交量
  amount: number; // 成交额
  marketCap: number; // 市值
  circulationMarketCap?: number; // 流通市值
  industry: string; // 行业
  sector?: string; // 板块
  
  // 技术指标
  ma5?: number;
  ma10?: number;
  ma20?: number;
  ma60?: number;
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  macdHistogram?: number;
  kdj_k?: number;
  kdj_d?: number;
  kdj_j?: number;
  
  // 财务指标
  peRatio?: number;
  pbRatio?: number;
  roe?: number;
  eps?: number;
  grossProfitMargin?: number;
  netProfitMargin?: number;
  epsGrowth?: number;
  revenueGrowth?: number;
  debtRatio?: number;
  dividendYield?: number;
  
  // 价格区间
  high?: number; // 今日最高
  low?: number; // 今日最低
  high52Week?: number; // 52周最高
  low52Week?: number; // 52周最低
  
  // 资金流向
  mainNetInflow?: number; // 主力净流入（万元）
  mainNetInflowRatio?: number; // 主力净流入占比
  hugeOrderRatio?: number; // 超大单净流入占比
  largeOrderRatio?: number; // 大单净流入占比
  mediumOrderRatio?: number; // 中单净流入占比
  smallOrderRatio?: number; // 小单净流入占比
}

// 保存的筛选器
export interface SavedScreener {
  id: string;
  name: string;
  description?: string;
  filters: ScreenerFilters;
  createdAt: string;
  updatedAt: string;
  isPreset?: boolean; // 是否为预设
  usageCount?: number; // 使用次数
}

// 技术指标配置
export interface IndicatorConfig {
  key: string;
  label: string;
  type: 'technical' | 'fundamental';
  category: string; // 分类
  unit?: string; // 单位
  description?: string; // 描述
  defaultVisible?: boolean; // 默认是否显示
}

// 字段选项
export interface FieldOption {
  value: string;
  label: string;
  type: 'number' | 'string' | 'enum';
  category: 'basic' | 'technical' | 'fundamental';
  unit?: string;
  options?: { label: string; value: string | number }[]; // 枚举类型的选项
}

// 比较运算符选项
export interface OperatorOption {
  value: ComparisonOperator;
  label: string;
  symbol: string; // 符号表示
  applicableTypes: ('number' | 'string' | 'enum')[]; // 适用的数据类型
}

// 列配置
export interface ColumnConfig {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  fixed?: 'left' | 'right';
  visible: boolean;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

// 筛选参数（用于API请求）
export interface ScreenerParams {
  filters: ScreenerFilters;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 图表模式
export type ChartMode = 'single' | 'compare' | 'hidden';

// 图表类型
export type ChartType = 'kline' | 'radar' | 'parallel' | 'scatter';

// 表达式验证结果
export interface ExpressionValidation {
  valid: boolean;
  errors?: Array<{
    line: number;
    column: number;
    message: string;
  }>;
  ast?: any; // 抽象语法树
}
