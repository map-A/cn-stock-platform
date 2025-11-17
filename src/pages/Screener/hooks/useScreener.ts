/**
 * 筛选逻辑 Hook
 */

import { useState, useCallback } from 'react';
import { message } from 'antd';
import screenerService from '@/services/screener';
import type { ScreenerFilters, ScreenerResult } from '../types';

export const useScreener = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScreenerResult[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState<string>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>();

  // 执行筛选
  const executeScreen = useCallback(
    async (filters: ScreenerFilters, page?: number, size?: number) => {
      setLoading(true);
      try {
        const response = await screenerService.screenStocksV2(
          filters,
          page || currentPage,
          size || pageSize,
          sortBy,
          sortOrder,
        );

        if (response.success && response.data) {
          setResults(response.data.list);
          setTotal(response.data.total);
          if (page) setCurrentPage(page);
          if (size) setPageSize(size);
          return true;
        } else {
          message.error('筛选失败，请重试');
          return false;
        }
      } catch (error) {
        console.error('Screen error:', error);
        message.error('筛选失败，请检查网络连接');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, sortBy, sortOrder],
  );

  // 更改页码
  const changePage = useCallback((page: number, size?: number) => {
    setCurrentPage(page);
    if (size) setPageSize(size);
  }, []);

  // 更改排序
  const changeSort = useCallback((field: string, order?: 'asc' | 'desc') => {
    setSortBy(field);
    setSortOrder(order);
  }, []);

  // 重置结果
  const resetResults = useCallback(() => {
    setResults([]);
    setTotal(0);
    setCurrentPage(1);
    setSortBy(undefined);
    setSortOrder(undefined);
  }, []);

  // 导出结果
  const exportResults = useCallback(
    async (filters: ScreenerFilters) => {
      try {
        const params = {
          filters,
          page: 1,
          pageSize: 10000,
          sortBy,
          sortOrder,
        };
        await screenerService.exportResults(params as any);
        message.success('导出成功');
        return true;
      } catch (error) {
        console.error('Export error:', error);
        message.error('导出失败');
        return false;
      }
    },
    [sortBy, sortOrder],
  );

  return {
    loading,
    results,
    total,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    executeScreen,
    changePage,
    changeSort,
    resetResults,
    exportResults,
  };
};
