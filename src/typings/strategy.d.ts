/**
 * 策略相关类型定义
 */

// 策略类型
export type StrategyType = 
  | 'intraday'      // 日内交易
  | 'swing'         // 波段交易
  | 'trend'         // 趋势跟随
  | 'mean_reversion' // 均值回归
  | 'arbitrage'     // 套利
  | 'options'       // 期权策略
  | 'custom';       // 自定义

// 策略状态
export type StrategyStatus = 
  | 'draft'         // 草稿
  | 'active'        // 激活
  | 'testing'       // 测试中
  | 'paused'        // 暂停
  | 'archived';     // 已归档

// 编辑模式
export type EditorMode = 'visual' | 'code' | 'hybrid';

// 节点类型
export type NodeType = 
  | 'indicator'     // 指标节点
  | 'condition'     // 条件节点
  | 'entry'         // 入场节点
  | 'exit'          // 出场节点
  | 'position'      // 仓位管理
  | 'risk'          // 风控节点
  | 'custom';       // 自定义脚本

// 指标类型
export type IndicatorType = 
  | 'MA'            // 移动平均
  | 'EMA'           // 指数移动平均
  | 'RSI'           // 相对强弱指标
  | 'MACD'          // MACD
  | 'BB'            // 布林带
  | 'ATR'           // 平均真实范围
  | 'KDJ'           // KDJ
  | 'BOLL'          // 布林线
  | 'VOL'           // 成交量
  | 'Custom';       // 自定义

// 策略中间表示（IR）
export interface StrategyIR {
  version: string;
  metadata: {
    name: string;
    description: string;
    author: string;
    tags: string[];
    type: StrategyType;
    createdAt: string;
    updatedAt: string;
  };
  nodes: IRNode[];
  connections: IRConnection[];
  parameters: IRParameter[];
}

// IR 节点
export interface IRNode {
  id: string;
  type: NodeType;
  label: string;
  config: Record<string, any>;
  position?: { x: number; y: number };
}

// IR 连接
export interface IRConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

// IR 参数
export interface IRParameter {
  key: string;
  label: string;
  type: 'number' | 'string' | 'boolean' | 'select';
  value: any;
  options?: any[];
  min?: number;
  max?: number;
  step?: number;
}

// 策略信息
export interface Strategy {
  id: string;
  name: string;
  description?: string;
  type: StrategyType;
  status: StrategyStatus;
  author: string;
  tags: string[];
  mode: EditorMode;
  ir?: StrategyIR;
  code?: string;
  files?: StrategyFile[];
  parameters?: StrategyParameter[];
  version: number;
  versions?: StrategyVersion[];
  lastBacktest?: {
    id: string;
    date: string;
    return: number;
    sharpe: number;
  };
  createdAt: string;
  updatedAt: string;
}

// 策略文件
export interface StrategyFile {
  path: string;
  name: string;
  content: string;
  language: 'python' | 'javascript' | 'json';
}

// 策略参数
export interface StrategyParameter {
  key: string;
  label: string;
  type: 'number' | 'string' | 'boolean' | 'select';
  value: any;
  description?: string;
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

// 策略版本
export interface StrategyVersion {
  version: number;
  description?: string;
  ir?: StrategyIR;
  code?: string;
  author: string;
  createdAt: string;
  tags?: string[];
}

// 策略列表查询参数
export interface StrategyQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  type?: StrategyType;
  status?: StrategyStatus;
  tags?: string[];
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

// 策略列表响应
export interface StrategyListResponse {
  data: Strategy[];
  total: number;
  page: number;
  pageSize: number;
}

// 策略创建参数
export interface CreateStrategyParams {
  name: string;
  description?: string;
  type: StrategyType;
  mode: EditorMode;
  template?: string;
  tags?: string[];
}

// 策略更新参数
export interface UpdateStrategyParams {
  name?: string;
  description?: string;
  type?: StrategyType;
  status?: StrategyStatus;
  tags?: string[];
  ir?: StrategyIR;
  code?: string;
  files?: StrategyFile[];
  parameters?: StrategyParameter[];
}

// 快速测试结果
export interface QuickTestResult {
  success: boolean;
  message?: string;
  equity?: number[];
  dates?: string[];
  trades?: number;
  return?: number;
  logs?: string[];
}
