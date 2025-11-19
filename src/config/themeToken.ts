import type { ProLayoutProps } from '@ant-design/pro-components';
import { generateThemeToken, DEFAULT_THEME_CONFIG, ThemeConfig } from '../config/themeConfig';

/**
 * 根据主题名称获取token配置
 * @param themeConfig 当前的主题配置
 * @param navTheme 导航栏主题 'light' | 'dark' | 'realDark'
 * @returns token配置对象
 */
export const getThemeToken = (
  themeConfig: ThemeConfig,
  navTheme: string = 'light',
) => {
  // For Ant Design ProLayout, 'realDark' and 'dark' map to dark mode.
  // Otherwise, it's light mode.
  const mode = (navTheme === 'realDark' || navTheme === 'dark') ? 'dark' : themeConfig.mode;
  return generateThemeToken({ ...themeConfig, mode });
};

/**
 * 获取完整的ProLayout配置（包含动态token）
 * @param baseSettings 基础设置
 * @param currentThemeConfig 当前的主题配置
 * @returns 完整的ProLayout配置
 */
export const getLayoutSettings = (
  baseSettings: ProLayoutProps,
  currentThemeConfig: ThemeConfig,
): ProLayoutProps => {
  const navTheme = baseSettings.navTheme || currentThemeConfig.mode; // Use current theme config mode as fallback
  const token = getThemeToken(currentThemeConfig, navTheme);

  return {
    ...baseSettings,
    token,
  };
};

export default {
  getThemeToken,
  getLayoutSettings,
};
