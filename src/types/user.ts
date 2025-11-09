/**
 * 用户相关类型定义
 */

// ==================== 用户基础信息 ====================

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  nickname?: string;
  avatar?: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
  website?: string;
  location?: string;
  timezone: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  lastLoginTime: string;
  loginCount: number;
  status: 'active' | 'inactive' | 'suspended';
}

// ==================== 认证相关 ====================

export interface LoginRequest {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
  expiresIn: number;
}

// ==================== 用户设置 ====================

export interface UserSettingsResponse {
  profile: UserProfile;
  theme: ThemeSettings;
  notification: NotificationSettings;
  security: SecuritySettings;
  preference: PreferenceSettings;
  devices?: UserDevice[];
}

// ==================== 主题设置 ====================

export interface ThemeSettings {
  // 颜色设置
  primaryColor: string;
  darkMode: boolean;
  
  // 字体设置
  fontSize: 'small' | 'medium' | 'large';
  borderRadius: 'small' | 'medium' | 'large';
  
  // 布局设置
  compactMode: boolean;
  sidebarCollapsed: boolean;
  fixedHeader: boolean;
  fixedSidebar: boolean;
  contentAreaFillHeight: boolean;
  
  // 动画设置
  animationLevel: 'none' | 'basic' | 'advanced';
}

// ==================== 通知设置 ====================

export interface NotificationSettings {
  // 通知开关
  enabled: boolean;
  
  // 通知类型
  priceAlert: boolean;
  newsAlert: boolean;
  earningsAlert: boolean;
  marketAlert: boolean;
  systemAlert: boolean;
  
  // 通知方式
  email: {
    enabled: boolean;
    address?: string;
    frequency: 'instant' | 'daily' | 'weekly';
  };
  
  browser: {
    enabled: boolean;
    sound: boolean;
  };
  
  mobile: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
  };
  
  // 免打扰设置
  doNotDisturb: {
    enabled: boolean;
    startTime?: string;
    endTime?: string;
  };
}

// ==================== 安全设置 ====================

export interface SecuritySettings {
  // 两步验证
  twoFactorAuth: {
    enabled: boolean;
    method?: 'sms' | 'email' | 'authenticator';
    verifiedAt?: string;
  };
  
  // 密码策略
  passwordPolicy: {
    requireChange: boolean;
    changeInterval: number; // days
    lastChanged: string;
  };
  
  // 登录安全
  loginSecurity: {
    allowMultipleDevices: boolean;
    sessionTimeout: number; // minutes
    requireEmailVerification: boolean;
  };
  
  // IP 白名单
  ipWhitelist: {
    enabled: boolean;
    ips: string[];
  };
  
  // 活动监控
  activityMonitoring: {
    enabled: boolean;
    notifyUnusualActivity: boolean;
  };
}

// ==================== 偏好设置 ====================

export interface PreferenceSettings {
  // 语言和地区
  language: 'zh-CN' | 'en-US';
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  
  // 数据显示
  numberFormat: {
    decimalPlaces: number;
    thousandsSeparator: boolean;
    currencySymbol: string;
  };
  
  // 市场偏好
  defaultMarket: 'sh' | 'sz' | 'bj';
  favoriteSymbols: string[];
  
  // 图表偏好
  defaultChartType: 'candlestick' | 'line' | 'bar';
  defaultChartPeriod: '1d' | '1w' | '1m' | '3m' | '1y';
  technicalIndicators: string[];
  
  // 数据刷新
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  
  // 隐私设置
  shareData: boolean;
  allowAnalytics: boolean;
}

// ==================== 设备管理 ====================

export interface UserDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  os: string;
  browser: string;
  ip: string;
  location?: string;
  lastActive: string;
  trusted: boolean;
  current: boolean;
}

// ==================== 活动日志 ====================

export interface UserActivityLog {
  id: string;
  action: string;
  description: string;
  ip: string;
  location?: string;
  device?: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
}

// ==================== 更新请求 ====================

export interface UpdateProfileRequest {
  nickname?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  website?: string;
  location?: string;
  timezone?: string;
  language?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateSettingsRequest {
  theme?: Partial<ThemeSettings>;
  notification?: Partial<NotificationSettings>;
  security?: Partial<SecuritySettings>;
  preference?: Partial<PreferenceSettings>;
}

// ==================== 数据导出 ====================

export interface ExportUserDataRequest {
  includeProfile: boolean;
  includeSettings: boolean;
  includeActivityLog: boolean;
  includeDevices: boolean;
  format: 'json' | 'csv' | 'pdf';
}
