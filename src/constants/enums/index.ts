/**
 * 业务枚举值
 * 集中管理项目中使用的枚举值
 */

/** 股票交易状态 */
export enum TradeStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

/** 订单类型 */
export enum OrderType {
  BUY = 'buy',
  SELL = 'sell',
}

/** 订单状态 */
export enum OrderStatus {
  PENDING = 'pending',
  FILLED = 'filled',
  PARTIAL = 'partial',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

/** 风险等级 */
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/** 策略状态 */
export enum StrategyStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  COMPLETED = 'completed',
}

/** 时间周期 */
export enum TimeFrame {
  ONE_MIN = '1m',
  FIVE_MIN = '5m',
  FIFTEEN_MIN = '15m',
  THIRTY_MIN = '30m',
  ONE_HOUR = '1h',
  FOUR_HOUR = '4h',
  ONE_DAY = '1d',
  ONE_WEEK = '1w',
  ONE_MONTH = '1M',
}

/** 用户角色 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export default {
  TradeStatus,
  OrderType,
  OrderStatus,
  RiskLevel,
  StrategyStatus,
  TimeFrame,
  UserRole,
};
