/**
 * 主题上下文
 * 用于全局主题管理和实时应用
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import type { ThemeSettings } from '@/types/user';
import { getUserSettings, updateThemeSettings } from '@/services/user';

interface ThemeContextType {
  theme: ThemeSettings | null;
  updateTheme: (updates: Partial<ThemeSettings>) => Promise<void>;
  resetTheme: () => Promise<void>;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultTheme: ThemeSettings = {
  primaryColor: '#1890ff',
  darkMode: false,
  fontSize: 'medium',
  borderRadius: 'medium',
  compactMode: false,
  sidebarCollapsed: false,
  fixedHeader: true,
  fixedSidebar: true,
  contentAreaFillHeight: false,
  animationLevel: 'basic',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [loading, setLoading] = useState(true);

  // 应用主题到 DOM
  const applyThemeToDOM = useCallback((themeSettings: ThemeSettings) => {
    const root = document.documentElement;
    const body = document.body;
    
    // 设置 CSS 变量 - 使用 !important 确保优先级
    root.style.setProperty('--primary-color', themeSettings.primaryColor);
    
    // 字体大小
    const fontSizeMap = { small: '12px', medium: '14px', large: '16px' };
    root.style.setProperty('--font-size-base', fontSizeMap[themeSettings.fontSize]);
    
    // 圆角大小
    const borderRadiusMap = { small: '4px', medium: '8px', large: '12px' };
    root.style.setProperty('--border-radius-base', borderRadiusMap[themeSettings.borderRadius]);
    
    console.log('🎨 应用主题:', {
      primaryColor: themeSettings.primaryColor,
      fontSize: fontSizeMap[themeSettings.fontSize],
      borderRadius: borderRadiusMap[themeSettings.borderRadius],
      darkMode: themeSettings.darkMode,
      compactMode: themeSettings.compactMode,
      animationLevel: themeSettings.animationLevel,
    });
    
    // 深色模式
    if (themeSettings.darkMode) {
      body.setAttribute('data-theme', 'dark');
      body.classList.add('dark-mode');
    } else {
      body.removeAttribute('data-theme');
      body.classList.remove('dark-mode');
    }
    
    // 紧凑模式
    if (themeSettings.compactMode) {
      body.classList.add('compact-mode');
    } else {
      body.classList.remove('compact-mode');
    }
    
    // 动画设置
    if (themeSettings.animationLevel === 'none') {
      body.classList.add('no-animations');
    } else {
      body.classList.remove('no-animations');
    }
    
    // 强制重绘以确保样式立即生效
    body.offsetHeight; // 触发重排
  }, []);

  // 加载主题设置
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const settings = await getUserSettings();
        if (settings?.theme) {
          setTheme(settings.theme);
          applyThemeToDOM(settings.theme);
        }
      } catch (error) {
        console.error('加载主题设置失败:', error);
        // 使用默认主题
        applyThemeToDOM(defaultTheme);
      } finally {
        setLoading(false);
      }
    };
    
    loadTheme();
  }, [applyThemeToDOM]);

  // 监听主题变化，自动应用到DOM
  useEffect(() => {
    if (theme) {
      applyThemeToDOM(theme);
    }
  }, [theme, applyThemeToDOM]);

  // 更新主题
  const updateTheme = useCallback(async (updates: Partial<ThemeSettings>) => {
    const newTheme = { ...theme, ...updates };
    
    try {
      // 立即应用到 UI
      setTheme(newTheme);
      applyThemeToDOM(newTheme);
      
      // 保存到后端
      await updateThemeSettings(updates);
    } catch (error) {
      console.error('更新主题失败:', error);
      // 回滚
      setTheme(theme);
      applyThemeToDOM(theme);
      throw error;
    }
  }, [theme, applyThemeToDOM]);

  // 重置主题
  const resetTheme = useCallback(async () => {
    try {
      setTheme(defaultTheme);
      applyThemeToDOM(defaultTheme);
      
      // 保存到后端
      await updateThemeSettings(defaultTheme);
    } catch (error) {
      console.error('重置主题失败:', error);
      throw error;
    }
  }, [applyThemeToDOM]);

  // Ant Design 主题配置 - 使用 useMemo 确保每次 theme 变化时重新计算
  const antdThemeConfig = React.useMemo(() => ({
    algorithm: theme.darkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: theme.primaryColor,
      fontSize: theme.fontSize === 'small' ? 12 : theme.fontSize === 'large' ? 16 : 14,
      borderRadius: theme.borderRadius === 'small' ? 4 : theme.borderRadius === 'large' ? 12 : 8,
    },
  }), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, loading }}>
      <ConfigProvider theme={antdThemeConfig}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
