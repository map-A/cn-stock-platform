/**
 * 用户系统类型定义
 * Phase 5: 用户系统
 */

/**
 * 用户信息
 */
export interface UserInfo {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  phone?: string;
  createTime: string;
  lastLoginTime: string;
  membershipLevel: MembershipLevel;
  membershipExpireTime?: string;
}

/**
 * 会员等级
 */
export type MembershipLevel = 'free' | 'pro' | 'premium';

/**
 * 会员计划
 */
export interface MembershipPlan {
  id: string;
  name: string;
  level: MembershipLevel;
  price: number;
  originalPrice?: number;
  duration: number; // 月数
  features: string[];
  popular?: boolean;
  badge?: string;
}

/**
 * 用户设置
 */
export interface UserSettings {
  // 通知设置
  notification: {
    priceAlert: boolean; // 价格提醒
    newsAlert: boolean; // 新闻提醒
    earningsAlert: boolean; // 财报提醒
    marketAlert: boolean; // 市场提醒
    email: boolean; // 邮件通知
    push: boolean; // 推送通知
  };
  // 显示设置
  display: {
    theme: 'light' | 'dark' | 'auto';
    language: 'zh-CN' | 'en-US';
    defaultMarket: 'sh' | 'sz' | 'bj'; // 默认市场
  };
  // 交易设置
  trading: {
    showPreMarket: boolean; // 显示盘前数据
    showAfterMarket: boolean; // 显示盘后数据
    defaultChartPeriod: string; // 默认图表周期
  };
}

/**
 * 通知消息
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  read: boolean;
  createTime: string;
  link?: string;
  icon?: string;
}

/**
 * 通知类型
 */
export type NotificationType = 'price' | 'news' | 'earnings' | 'market' | 'system';

/**
 * 价格提醒
 */
export interface PriceAlert {
  id: string;
  symbol: string;
  stockName: string;
  condition: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  enabled: boolean;
  createTime: string;
  triggerTime?: string;
}

/**
 * 订阅状态
 */
export interface SubscriptionStatus {
  subscribed: boolean;
  level: MembershipLevel;
  expireTime?: string;
  autoRenew: boolean;
  features: string[];
}

/**
 * 支付订单
 */
export interface PaymentOrder {
  id: string;
  planId: string;
  amount: number;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  createTime: string;
  payTime?: string;
  payMethod?: 'alipay' | 'wechat' | 'card';
}

/**
 * 登录表单
 */
export interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * 注册表单
 */
export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeTOS: boolean;
}

/**
 * 重置密码表单
 */
export interface ResetPasswordForm {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 用户统计
 */
export interface UserStats {
  watchlistCount: number; // 自选股数量
  alertCount: number; // 提醒数量
  viewedStockCount: number; // 浏览股票数
  searchCount: number; // 搜索次数
}

/**
 * OAuth 提供商
 */
export type OAuthProvider = 'google' | 'github' | 'wechat';

/**
 * OAuth 登录参数
 */
export interface OAuthLoginParams {
  provider: OAuthProvider;
  code: string;
  state?: string;
}
