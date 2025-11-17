/**
 * 性能优化工具函数
 */

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func(...args);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number = 300
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * requestAnimationFrame 节流
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

/**
 * 本地存储缓存
 */
export class LocalStorageCache {
  private static readonly PREFIX = 'screener_cache_';
  private static readonly DEFAULT_TTL = 1000 * 60 * 60; // 1 小时

  static set<T>(key: string, value: T, ttl: number = this.DEFAULT_TTL): void {
    try {
      const item = {
        value,
        expiry: Date.now() + ttl,
      };
      localStorage.setItem(this.PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.error('Failed to set cache:', error);
    }
  }

  static get<T>(key: string): T | null {
    try {
      const itemStr = localStorage.getItem(this.PREFIX + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }

      return item.value as T;
    } catch (error) {
      console.error('Failed to get cache:', error);
      return null;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}

/**
 * 虚拟滚动计算
 */
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  itemCount: number;
  overscan?: number;
}

export interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  totalHeight: number;
  visibleItemCount: number;
}

export function calculateVirtualScroll(
  scrollTop: number,
  config: VirtualScrollConfig
): VirtualScrollResult {
  const { itemHeight, containerHeight, itemCount, overscan = 3 } = config;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(itemCount, startIndex + visibleItemCount + overscan * 2);

  return {
    startIndex,
    endIndex,
    offsetY: startIndex * itemHeight,
    totalHeight: itemCount * itemHeight,
    visibleItemCount,
  };
}

/**
 * 批量处理工具
 */
export async function processInChunks<T, R>(
  items: T[],
  processor: (item: T, index: number) => R,
  chunkSize = 50
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);

    await new Promise(resolve => setTimeout(resolve, 0));

    const chunkResults = chunk.map((item, index) => processor(item, i + index));
    results.push(...chunkResults);
  }

  return results;
}

/**
 * 性能监控器
 */
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  start(label: string): void {
    this.marks.set(label, performance.now());
  }

  end(label: string): number | null {
    const startTime = this.marks.get(label);
    if (!startTime) return null;

    const duration = performance.now() - startTime;
    this.marks.delete(label);

    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }
}

export default {
  debounce,
  throttle,
  rafThrottle,
  LocalStorageCache,
  calculateVirtualScroll,
  processInChunks,
  PerformanceMonitor,
};
