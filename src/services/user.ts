/**
 * 用户设置相关API服务
 * 
 * 功能覆盖:
 * - 用户认证与登录
 * - 个人信息管理
 * - 设置配置管理
 * - 安全管理
 * - 设备管理
 * - 数据导出
 */

import { request } from '@umijs/max';
import type {
  LoginRequest,
  LoginResponse,
  UserProfile,
  UserSettingsResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UpdateSettingsRequest,
  ThemeSettings,
  NotificationSettings,
  SecuritySettings,
  PreferenceSettings,
  UserDevice,
  UserActivityLog,
  ExportUserDataRequest,
} from '@/types/user';
import DevStorage from '@/utils/devStorage';

// 用户登录
export async function login(data: LoginRequest): Promise<LoginResponse> {
  // 开发环境模拟登录
  if (process.env.NODE_ENV === 'development') {
    // 模拟登录验证
    const { username, password } = data;
    
    // 简单的用户验证逻辑
    const validUsers = [
      { username: 'admin', password: 'admin123', role: 'admin', name: '系统管理员' },
      { username: 'trader', password: 'trader123', role: 'trader', name: '交易员' },
      { username: 'analyst', password: 'analyst123', role: 'analyst', name: '分析师' },
      { username: 'guest', password: 'guest123', role: 'user', name: '访客用户' },
    ];
    
    const user = validUsers.find(u => u.username === username && u.password === password);
    
    if (!user) {
      throw new Error('用户名或密码错误');
    }
    
    // 模拟用户信息
    const mockUserProfile: UserProfile = {
      id: `user_${Date.now()}`,
      username: user.username,
      email: `${user.username}@example.com`,
      nickname: user.name,
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      department: '股票交易部',
      position: user.name,
      timezone: 'Asia/Shanghai',
      language: 'zh-CN',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
      lastLoginTime: new Date().toISOString(),
      loginCount: Math.floor(Math.random() * 100) + 1,
      status: 'active',
    };
    
    const mockToken = `mock_token_${Date.now()}_${user.username}`;
    
    // 保存登录状态到开发环境存储
    DevStorage.saveLoginState(mockToken, {
      ...mockUserProfile,
      role: user.role,
      role_name: user.name,
      display_name: user.name,
      user_id: mockUserProfile.id,
      avatar_url: mockUserProfile.avatar,
    });
    
    return {
      token: mockToken,
      user: mockUserProfile,
      expiresIn: 7 * 24 * 60 * 60, // 7天
    };
  }
  
  // 生产环境调用真实API
  return request('/api/v1/auth/login', {
    method: 'POST',
    data,
  });
}

// 用户登出
export async function logout(): Promise<void> {
  // 清理本地存储
  DevStorage.clearLoginState();
  
  // 如果是生产环境，调用后端登出API
  if (process.env.NODE_ENV !== 'development') {
    return request('/api/v1/auth/logout', {
      method: 'POST',
    });
  }
}

// 获取用户完整设置信息
export async function getUserSettings(): Promise<UserSettingsResponse> {
  return request('/api/v1/user/settings', {
    method: 'GET',
  });
}

// 获取用户个人信息
export async function getUserProfile(): Promise<UserProfile> {
  return request('/api/v1/user/profile', {
    method: 'GET',
  });
}

// 更新用户个人信息
export async function updateUserProfile(data: UpdateProfileRequest): Promise<UserProfile> {
  return request('/api/v1/user/profile', {
    method: 'PUT',
    data,
  });
}

// 上传用户头像
export async function uploadAvatar(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('avatar', file);
  
  return request('/api/v1/user/avatar', {
    method: 'POST',
    data: formData,
  });
}

// 修改密码
export async function changePassword(data: ChangePasswordRequest): Promise<void> {
  return request('/api/v1/user/password', {
    method: 'PUT',
    data,
  });
}

// 获取主题设置
export async function getThemeSettings(): Promise<ThemeSettings> {
  return request('/api/v1/user/settings/theme', {
    method: 'GET',
  });
}

// 更新主题设置
export async function updateThemeSettings(data: Partial<ThemeSettings>): Promise<ThemeSettings> {
  return request('/api/v1/user/settings/theme', {
    method: 'PUT',
    data,
  });
}

// 获取通知设置
export async function getNotificationSettings(): Promise<NotificationSettings> {
  return request('/api/v1/user/settings/notification', {
    method: 'GET',
  });
}

// 更新通知设置
export async function updateNotificationSettings(data: Partial<NotificationSettings>): Promise<NotificationSettings> {
  return request('/api/v1/user/settings/notification', {
    method: 'PUT',
    data,
  });
}

// 测试通知设置
export async function testNotification(type: 'email' | 'browser' | 'mobile'): Promise<void> {
  return request('/api/v1/user/settings/notification/test', {
    method: 'POST',
    data: { type },
  });
}

// 获取安全设置
export async function getSecuritySettings(): Promise<SecuritySettings> {
  return request('/api/v1/user/settings/security', {
    method: 'GET',
  });
}

// 更新安全设置
export async function updateSecuritySettings(data: Partial<SecuritySettings>): Promise<SecuritySettings> {
  return request('/api/v1/user/settings/security', {
    method: 'PUT',
    data,
  });
}

// 启用两步验证
export async function enableTwoFactorAuth(method: 'sms' | 'email' | 'authenticator'): Promise<{
  secret?: string;
  qrCode?: string;
  backupCodes: string[];
}> {
  return request('/api/v1/user/security/2fa/enable', {
    method: 'POST',
    data: { method },
  });
}

// 验证两步验证码
export async function verifyTwoFactorAuth(code: string): Promise<void> {
  return request('/api/v1/user/security/2fa/verify', {
    method: 'POST',
    data: { code },
  });
}

// 禁用两步验证
export async function disableTwoFactorAuth(password: string): Promise<void> {
  return request('/api/v1/user/security/2fa/disable', {
    method: 'POST',
    data: { password },
  });
}

// 获取备用验证码
export async function getBackupCodes(): Promise<{ codes: string[] }> {
  return request('/api/v1/user/security/2fa/backup-codes', {
    method: 'GET',
  });
}

// 重新生成备用验证码
export async function regenerateBackupCodes(): Promise<{ codes: string[] }> {
  return request('/api/v1/user/security/2fa/backup-codes', {
    method: 'POST',
  });
}

// 获取偏好设置
export async function getPreferenceSettings(): Promise<PreferenceSettings> {
  return request('/api/v1/user/settings/preference', {
    method: 'GET',
  });
}

// 更新偏好设置
export async function updatePreferenceSettings(data: Partial<PreferenceSettings>): Promise<PreferenceSettings> {
  return request('/api/v1/user/settings/preference', {
    method: 'PUT',
    data,
  });
}

// 获取用户设备列表
export async function getUserDevices(): Promise<UserDevice[]> {
  return request('/api/v1/user/devices', {
    method: 'GET',
  });
}

// 信任设备
export async function trustDevice(deviceId: string): Promise<void> {
  return request(`/api/v1/user/devices/${deviceId}/trust`, {
    method: 'POST',
  });
}

// 移除设备信任
export async function untrustDevice(deviceId: string): Promise<void> {
  return request(`/api/v1/user/devices/${deviceId}/trust`, {
    method: 'DELETE',
  });
}

// 登出指定设备
export async function logoutDevice(deviceId: string): Promise<void> {
  return request(`/api/v1/user/devices/${deviceId}/logout`, {
    method: 'POST',
  });
}

// 登出所有其他设备
export async function logoutAllOtherDevices(): Promise<void> {
  return request('/api/v1/user/devices/logout-others', {
    method: 'POST',
  });
}

// 获取用户活动日志
export async function getUserActivityLog(params: {
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
  action?: string;
}): Promise<{
  list: UserActivityLog[];
  total: number;
  page: number;
  pageSize: number;
}> {
  return request('/api/v1/user/activity-log', {
    method: 'GET',
    params,
  });
}

// 导出用户数据
export async function exportUserData(data: ExportUserDataRequest): Promise<{ downloadUrl: string }> {
  return request('/api/v1/user/export', {
    method: 'POST',
    data,
  });
}

// 删除用户账户
export async function deleteUserAccount(password: string, reason?: string): Promise<void> {
  return request('/api/v1/user/account', {
    method: 'DELETE',
    data: { password, reason },
  });
}

// 重置用户设置到默认值
export async function resetUserSettings(type: 'theme' | 'notification' | 'security' | 'preference' | 'all'): Promise<void> {
  return request('/api/v1/user/settings/reset', {
    method: 'POST',
    data: { type },
  });
}

// 获取账户统计信息
export async function getUserStatistics(): Promise<{
  loginCount: number;
  lastLoginTime: string;
  accountAge: number; // days
  dataUsage: number; // MB
  deviceCount: number;
  securityScore: number; // 0-100
}> {
  return request('/api/v1/user/statistics', {
    method: 'GET',
  });
}