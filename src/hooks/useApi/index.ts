/**
 * useApi Hook - 统一的 API 请求 Hook
 * 处理加载状态、错误状态和数据缓存
 */

import { useState, useCallback, useEffect } from 'react';
import { client } from '@/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * 通用 API 请求 Hook
 * @param url - 请求 URL
 * @param options - 配置选项
 * @returns API 状态和方法
 */
export const useApi = <T = any>(
  url: string,
  options: UseApiOptions = {}
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { immediate = true, onSuccess, onError } = options;

  const request = useCallback(async (params?: any) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const response = await client.get<T>(url, { params });
      setState((prev) => ({ ...prev, data: response as T, loading: false }));
      onSuccess?.(response);
      return response;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState((prev) => ({ ...prev, error: err, loading: false }));
      onError?.(err);
      throw err;
    }
  }, [url, onSuccess, onError]);

  useEffect(() => {
    if (immediate && url) {
      request();
    }
  }, [url, immediate, request]);

  return {
    ...state,
    request,
  };
};

export default useApi;
