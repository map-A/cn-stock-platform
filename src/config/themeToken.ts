/**
 * 主题token配置
 * 根据导航栏主题动态返回对应的token配置
 */

import type { ProLayoutProps } from '@ant-design/pro-components';

/**
 * 深色主题token配置
 */
export const darkThemeToken = {
  // 布局背景色
  colorBgLayout: '#09090B',
  
  // 容器背景色
  colorBgContainer: '#1E222D',
  colorBgElevated: '#2A2E39',
  
  // 文本颜色 - 强制设置
  colorText: '#E5E7EB',
  colorTextSecondary: '#9CA3AF',
  colorTextTertiary: '#6B7280',
  colorTextQuaternary: '#4B5563',
  
  // 标题颜色 - 确保可见
  colorTextHeading: '#E5E7EB',
  colorTextLabel: '#E5E7EB',
  colorTextDescription: '#9CA3AF',
  
  // 边框颜色
  colorBorder: '#2A2E39',
  colorBorderSecondary: '#3A3F4B',
  
  // 侧边栏配置
  sider: {
    colorMenuBackground: '#09090B',
    colorTextMenu: '#E5E7EB',
    colorTextMenuSelected: '#00FC50',
    colorBgMenuItemSelected: '#1A1D23',
    colorBgMenuItemHover: '#1A1D23',
  },
};

/**
 * 浅色主题token配置
 */
export const lightThemeToken = {
  // 布局背景色
  colorBgLayout: '#F0F2F5',
  
  // 容器背景色
  colorBgContainer: '#FFFFFF',
  colorBgElevated: '#FFFFFF',
  
  // 文本颜色 - 强制设置深色
  colorText: 'rgba(0, 0, 0, 0.88)',
  colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
  colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
  colorTextQuaternary: 'rgba(0, 0, 0, 0.25)',
  
  // 标题颜色 - 确保可见
  colorTextHeading: 'rgba(0, 0, 0, 0.88)',
  colorTextLabel: 'rgba(0, 0, 0, 0.88)',
  colorTextDescription: 'rgba(0, 0, 0, 0.65)',
  
  // 边框颜色
  colorBorder: '#D9D9D9',
  colorBorderSecondary: '#F0F0F0',
  
  // 侧边栏配置
  sider: {
    colorMenuBackground: '#FFFFFF',
    colorTextMenu: 'rgba(0, 0, 0, 0.88)',
    colorTextMenuSelected: '#1890FF',
    colorBgMenuItemSelected: '#E6F7FF',
    colorBgMenuItemHover: '#F5F5F5',
  },
};

/**
 * 根据主题名称获取token配置
 * @param navTheme 导航栏主题 'light' | 'dark' | 'realDark'
 * @returns token配置对象
 */
export const getThemeToken = (navTheme: string = 'realDark') => {
  // realDark 和 dark 都使用深色主题
  if (navTheme === 'realDark' || navTheme === 'dark') {
    return darkThemeToken;
  }
  return lightThemeToken;
};

/**
 * 获取完整的ProLayout配置（包含动态token）
 * @param baseSettings 基础设置
 * @returns 完整的ProLayout配置
 */
export const getLayoutSettings = (
  baseSettings: ProLayoutProps,
): ProLayoutProps => {
  const navTheme = baseSettings.navTheme || 'realDark';
  const token = getThemeToken(navTheme);

  return {
    ...baseSettings,
    token,
  };
};

export default {
  darkThemeToken,
  lightThemeToken,
  getThemeToken,
  getLayoutSettings,
};
