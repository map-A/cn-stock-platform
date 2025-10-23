/**
 * useTheme Hook - 主题管理 Hook
 * 管理深色/浅色主题切换
 */

import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor?: string;
}

const THEME_STORAGE_KEY = 'app-theme-mode';

/**
 * 主题 Hook
 * @returns 主题状态和方法
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeConfig>({
    mode: 'dark',
  });

  // 初始化主题
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const mode = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme({ mode });
    applyTheme(mode);
  }, []);

  // 切换主题
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newMode = prev.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
      applyTheme(newMode);
      return { ...prev, mode: newMode };
    });
  }, []);

  // 设置主题
  const setThemeMode = useCallback((mode: ThemeMode) => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
    applyTheme(mode);
    setTheme({ mode });
  }, []);

  return {
    ...theme,
    toggleTheme,
    setThemeMode,
  };
};

/**
 * 应用主题到 DOM
 */
function applyTheme(mode: ThemeMode) {
  const html = document.documentElement;
  
  if (mode === 'dark') {
    html.classList.add('dark-theme');
    html.classList.remove('light-theme');
  } else {
    html.classList.add('light-theme');
    html.classList.remove('dark-theme');
  }
}

export default useTheme;
