/**
 * 缓存状态管理
 */
import { create } from 'zustand';

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheState {
  // 缓存存储
  cache: Map<string, CacheEntry>;

  // Actions
  getCache: <T = any>(key: string) => T | null;
  setCache: <T = any>(key: string, data: T, maxAge?: number) => void;
  clearCache: (key?: string) => void;
  clearExpired: () => void;
}

// 默认缓存时间: 5分钟
const DEFAULT_MAX_AGE = 5 * 60 * 1000;
// 最大缓存条目数
const MAX_CACHE_ENTRIES = 200;

export const useCacheStore = create<CacheState>((set, get) => ({
  cache: new Map(),

  /**
   * 获取缓存数据
   */
  getCache: <T = any>(key: string): T | null => {
    const entry = get().cache.get(key);
    
    if (!entry) {
      return null;
    }

    // 检查是否过期
    if (Date.now() > entry.expiresAt) {
      get().clearCache(key);
      return null;
    }

    return entry.data as T;
  },

  /**
   * 设置缓存数据
   */
  setCache: <T = any>(key: string, data: T, maxAge: number = DEFAULT_MAX_AGE) => {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + maxAge,
    };

    set((state) => {
      const newCache = new Map(state.cache);
      newCache.set(key, entry);

      // 限制缓存大小
      if (newCache.size > MAX_CACHE_ENTRIES) {
        // 删除最早的条目
        const firstKey = newCache.keys().next().value;
        newCache.delete(firstKey);
      }

      return { cache: newCache };
    });
  },

  /**
   * 清除缓存
   */
  clearCache: (key?: string) => {
    set((state) => {
      if (key) {
        // 清除指定缓存
        const newCache = new Map(state.cache);
        newCache.delete(key);
        return { cache: newCache };
      } else {
        // 清除所有缓存
        return { cache: new Map() };
      }
    });
  },

  /**
   * 清除过期缓存
   */
  clearExpired: () => {
    const now = Date.now();
    set((state) => {
      const newCache = new Map(state.cache);
      
      // 遍历并删除过期条目
      for (const [key, entry] of newCache.entries()) {
        if (now > entry.expiresAt) {
          newCache.delete(key);
        }
      }

      return { cache: newCache };
    });
  },
}));

/**
 * 缓存键生成器
 */
export const CacheKeys = {
  stockQuote: (symbol: string) => `stock:quote:${symbol}`,
  stockInfo: (symbol: string) => `stock:info:${symbol}`,
  stockChart: (symbol: string, period: string) => `stock:chart:${symbol}:${period}`,
  marketMover: (type: string) => `market:mover:${type}`,
  searchResult: (keyword: string) => `search:${keyword}`,
  watchlist: () => 'user:watchlist',
  northbound: (date?: string) => `northbound:${date || 'latest'}`,
  dragonTiger: (date?: string) => `dragon-tiger:${date || 'latest'}`,
};

/**
 * 清理过期缓存定时器
 */
if (typeof window !== 'undefined') {
  setInterval(() => {
    useCacheStore.getState().clearExpired();
  }, 60 * 1000); // 每分钟清理一次
}
