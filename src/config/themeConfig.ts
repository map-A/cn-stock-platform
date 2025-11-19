/**
 * 全局主题配置系统
 * 基于 theme-spec.md v1.1 规范实现
 * 支持 Light/Dark 模式、用户自定义、localStorage 持久化
 */

export type ThemeMode = 'light' | 'dark' | 'auto';
export type AnimationSpeed = 'fast' | 'default' | 'slow' | 'none';

export interface ThemeConfig {
  // 主题模式
  mode: ThemeMode;
  
  // 主题色
  colorPrimary: string;
  
  // 动画速度
  animationSpeed: AnimationSpeed;
  
  // 布局设置
  layout: 'side' | 'top' | 'mix';
  fixedHeader: boolean;
  fixSiderbar: boolean;
}

/**
 * 默认主题配置
 */
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: 'light',
  colorPrimary: '#3B82F6', // Vibrant blue
  animationSpeed: 'default',
  layout: 'mix',
  fixedHeader: false,
  fixSiderbar: true,
};

/**
 * Light 模式 Token
 */
export const LIGHT_MODE_TOKENS = {
  colorBgBase: '#ffffff',
  colorBgContainer: '#ffffff', // Clean white
  colorText: '#212529', // Slightly darker for better readability
  colorTextSecondary: '#495057', // Muted secondary text
  colorTextTertiary: '#8c8c8c',
  colorTextDisabled: '#bfbfbf',
  colorBorder: '#d9d9d9',
  colorBorderSecondary: '#f0f0f0',
  colorBgLayout: '#f8f9fa', // Very light grey for spacious feel
  colorBgElevated: '#ffffff',
  shadowBase: 'rgba(0, 0, 0, 0.05)', // Softer shadow
};

/**
 * Dark 模式 Token
 */
export const DARK_MODE_TOKENS = {
  colorBgBase: '#141414',
  colorBgContainer: '#2c2c2c', // Softer dark background
  colorText: '#f8f9fa', // Brighter text for dark mode
  colorTextSecondary: '#ced4da', // Muted secondary text
  colorTextTertiary: '#8c8c8c',
  colorTextDisabled: '#595959',
  colorBorder: '#434343',
  colorBorderSecondary: '#303030',
  colorBgLayout: '#1a1a1a', // Softer dark background
  colorBgElevated: '#1f1f1f',
  shadowBase: 'rgba(0, 0, 0, 0.5)',
};



/**
 * 动效速度映射
 */
export const MOTION_DURATION_MAP: Record<AnimationSpeed, { fast: number; base: number; slow: number }> = {
  fast: { fast: 100, base: 150, slow: 250 },
  default: { fast: 150, base: 250, slow: 400 },
  slow: { fast: 200, base: 350, slow: 550 },
  none: { fast: 0, base: 0, slow: 0 },
};

/**
 * 动画曲线
 */
export const MOTION_EASE = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeSmooth: 'ease-in-out',
};

/**
 * 预设主题色
 */
export const PRESET_COLORS = [
  { name: '拂晓蓝', color: '#1677ff' },
  { name: '极客蓝', color: '#2f54eb' },
  { name: '薄暮', color: '#722ed1' },
  { name: '青色', color: '#13c2c2' },
  { name: '极光绿', color: '#52c41a' },
  { name: '日暮', color: '#fa8c16' },
  { name: '火山', color: '#f5222d' },
  { name: '金盏花', color: '#faad14' },
  { name: '酱紫', color: '#eb2f96' },
];

/**
 * LocalStorage 键名
 */
export const THEME_STORAGE_KEY = 'quantlab_theme_config';

/**
 * 保存主题配置到 localStorage
 */
export function saveThemeConfig(config: ThemeConfig): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('保存主题配置失败:', error);
  }
}

/**
 * 从 localStorage 加载主题配置
 */
export function loadThemeConfig(): ThemeConfig {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      return { ...DEFAULT_THEME_CONFIG, ...config };
    }
  } catch (error) {
    console.error('加载主题配置失败:', error);
  }
  return DEFAULT_THEME_CONFIG;
}

/**
 * 检测系统主题偏好
 */
export function detectSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return darkModeQuery.matches ? 'dark' : 'light';
}

/**
 * 根据配置解析实际主题模式
 */
export function resolveThemeMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'auto') {
    return detectSystemTheme();
  }
  return mode;
}

/**
 * 生成完整的主题 Token
 */
export function generateThemeToken(config: ThemeConfig) {
  const actualMode = resolveThemeMode(config.mode);
  const baseTokens = actualMode === 'dark' ? DARK_MODE_TOKENS : LIGHT_MODE_TOKENS;
  const motionDuration = MOTION_DURATION_MAP[config.animationSpeed];
  
  return {
    // 颜色 Token
    ...baseTokens,
    colorPrimary: config.colorPrimary,
    
    // 动效 Token
    motionDurationFast: motionDuration.fast,
    motionDurationMid: motionDuration.base,
    motionDurationSlow: motionDuration.slow,
    motionEaseInOut: MOTION_EASE.easeInOut,
    motionEaseSpring: MOTION_EASE.easeSpring,
    motionEaseSmooth: MOTION_EASE.easeSmooth,
    
    // 其他
    borderRadius: 8,
  };
}

/**
 * 将hex颜色转换为RGB
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
  }
  return '22, 119, 255'; // 默认蓝色
}

/**
 * 应用主题到 DOM
 */
export function applyThemeToDOM(config: ThemeConfig): void {
  const token = generateThemeToken(config);
  const root = document.documentElement;
  const actualMode = resolveThemeMode(config.mode);
  
  // 设置 data-theme 属性
  root.setAttribute('data-theme', actualMode);
  
  // 设置 CSS 变量
  Object.entries(token).forEach(([key, value]) => {
    const cssVarName = `--ant-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVarName, String(value));
  });
  
  // 设置主题色的RGB版本（用于透明度）
  root.style.setProperty('--ant-color-primary-rgb', hexToRgb(config.colorPrimary));
  
  // 设置动画类
  if (config.animationSpeed === 'none') {
    document.body.classList.add('no-animations');
  } else {
    document.body.classList.remove('no-animations');
  }
  
  // 平滑过渡
  document.body.style.transition = 'background-color 200ms ease, color 200ms ease';
}
