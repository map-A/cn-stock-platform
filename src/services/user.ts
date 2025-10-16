/**
 * 用户相关API服务
 * Phase 5: 用户系统
 */

import { get, post, put, del } from './request';
import type {
  UserInfo,
  UserSettings,
  Notification,
  PriceAlert,
  SubscriptionStatus,
  PaymentOrder,
  LoginForm,
  RegisterForm,
  ResetPasswordForm,
  UserStats,
  MembershipPlan,
  OAuthLoginParams,
} from '@/typings/user';

// ============= 认证相关 =============

/**
 * 用户登录
 */
export async function login(data: LoginForm): Promise<{ token: string; user: UserInfo }> {
  return post('/auth/login', data);
}

/**
 * 用户注册
 */
export async function register(data: RegisterForm): Promise<{ token: string; user: UserInfo }> {
  return post('/auth/register', data);
}

/**
 * 用户登出
 */
export async function logout(): Promise<void> {
  return post('/auth/logout');
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<UserInfo> {
  return get('/auth/me');
}

/**
 * OAuth 登录
 */
export async function oauthLogin(
  params: OAuthLoginParams,
): Promise<{ token: string; user: UserInfo }> {
  return post('/auth/oauth', params);
}

/**
 * 发送重置密码邮件
 */
export async function sendResetPasswordEmail(email: string): Promise<void> {
  return post('/auth/reset-password/send', { email });
}

/**
 * 重置密码
 */
export async function resetPassword(data: ResetPasswordForm): Promise<void> {
  return post('/auth/reset-password', data);
}

/**
 * 修改密码
 */
export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  return post('/auth/change-password', { oldPassword, newPassword });
}

// ============= 用户信息管理 =============

/**
 * 更新用户信息
 */
export async function updateUserInfo(data: Partial<UserInfo>): Promise<UserInfo> {
  return put('/user/profile', data);
}

/**
 * 上传用户头像
 */
export async function uploadAvatar(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  return post('/user/avatar', formData);
}

/**
 * 获取用户统计
 */
export async function getUserStats(): Promise<UserStats> {
  return get('/user/stats');
}

// ============= 用户设置 =============

/**
 * 获取用户设置
 */
export async function getUserSettings(): Promise<UserSettings> {
  return get('/user/settings');
}

/**
 * 更新用户设置
 */
export async function updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
  return put('/user/settings', settings);
}

// ============= 通知管理 =============

/**
 * 获取通知列表
 */
export async function getNotifications(params?: {
  page?: number;
  pageSize?: number;
  type?: string;
  read?: boolean;
}): Promise<{
  list: Notification[];
  total: number;
}> {
  return get('/user/notifications', params);
}

/**
 * 标记通知为已读
 */
export async function markNotificationRead(id: string): Promise<void> {
  return put(`/user/notifications/${id}/read`);
}

/**
 * 标记所有通知为已读
 */
export async function markAllNotificationsRead(): Promise<void> {
  return put('/user/notifications/read-all');
}

/**
 * 删除通知
 */
export async function deleteNotification(id: string): Promise<void> {
  return del(`/user/notifications/${id}`);
}

/**
 * 获取未读通知数量
 */
export async function getUnreadCount(): Promise<number> {
  return get('/user/notifications/unread-count');
}

// ============= 价格提醒 =============

/**
 * 获取价格提醒列表
 */
export async function getPriceAlerts(): Promise<PriceAlert[]> {
  return get('/user/alerts');
}

/**
 * 创建价格提醒
 */
export async function createPriceAlert(
  data: Omit<PriceAlert, 'id' | 'createTime' | 'triggerTime'>,
): Promise<PriceAlert> {
  return post('/user/alerts', data);
}

/**
 * 更新价格提醒
 */
export async function updatePriceAlert(id: string, data: Partial<PriceAlert>): Promise<PriceAlert> {
  return put(`/user/alerts/${id}`, data);
}

/**
 * 删除价格提醒
 */
export async function deletePriceAlert(id: string): Promise<void> {
  return del(`/user/alerts/${id}`);
}

/**
 * 启用/禁用价格提醒
 */
export async function togglePriceAlert(id: string, enabled: boolean): Promise<void> {
  return put(`/user/alerts/${id}/toggle`, { enabled });
}

// ============= 会员与订阅 =============

/**
 * 获取会员计划列表
 */
export async function getMembershipPlans(): Promise<MembershipPlan[]> {
  return get('/membership/plans');
}

/**
 * 获取订阅状态
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  return get('/membership/status');
}

/**
 * 创建支付订单
 */
export async function createPaymentOrder(planId: string): Promise<PaymentOrder> {
  return post('/membership/order', { planId });
}

/**
 * 查询订单状态
 */
export async function getOrderStatus(orderId: string): Promise<PaymentOrder> {
  return get(`/membership/order/${orderId}`);
}

/**
 * 取消订单
 */
export async function cancelOrder(orderId: string): Promise<void> {
  return post(`/membership/order/${orderId}/cancel`);
}

/**
 * 获取订单历史
 */
export async function getOrderHistory(params?: {
  page?: number;
  pageSize?: number;
}): Promise<{
  list: PaymentOrder[];
  total: number;
}> {
  return get('/membership/orders', params);
}

/**
 * 设置自动续费
 */
export async function setAutoRenew(enabled: boolean): Promise<void> {
  return put('/membership/auto-renew', { enabled });
}

// ============= 推送订阅 =============

/**
 * 订阅推送
 */
export async function subscribePush(subscription: PushSubscription): Promise<{ success: boolean }> {
  return post('/user/push/subscribe', { subscription: subscription.toJSON() });
}

/**
 * 取消推送订阅
 */
export async function unsubscribePush(): Promise<void> {
  return post('/user/push/unsubscribe');
}

/**
 * 检查推送订阅状态
 */
export async function checkPushSubscription(): Promise<boolean> {
  return get('/user/push/status');
}
