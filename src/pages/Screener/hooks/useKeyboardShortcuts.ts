/**
 * 键盘快捷键 Hook
 */

import { useEffect } from 'react';

interface KeyboardShortcutConfig {
  onSave?: () => void;
  onSearch?: () => void;
  onReset?: () => void;
  onEscape?: () => void;
}

export const useKeyboardShortcuts = (config: KeyboardShortcutConfig) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+S 或 Cmd+S - 保存筛选器
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        config.onSave?.();
      }

      // Ctrl+Enter 或 Cmd+Enter - 执行筛选
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        config.onSearch?.();
      }

      // Ctrl+R 或 Cmd+R - 重置
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        config.onReset?.();
      }

      // Escape - 关闭抽屉/弹窗
      if (event.key === 'Escape') {
        config.onEscape?.();
      }

      // Ctrl+F 或 Cmd+F - 快速搜索（聚焦到搜索框）
      if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        event.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="搜索"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [config]);
};

export default useKeyboardShortcuts;
