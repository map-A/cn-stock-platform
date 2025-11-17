/**
 * 图表数据处理 Hook
 */

import { useState, useCallback, useMemo } from 'react';
import screenerService from '@/services/screener';
import type { ScreenerResult, ChartMode, ChartType } from '../types';

export const useCharts = () => {
  const [chartMode, setChartMode] = useState<ChartMode>('hidden');
  const [chartType, setChartType] = useState<ChartType>('kline');
  const [selectedStocks, setSelectedStocks] = useState<ScreenerResult[]>([]);
  const [chartData, setChartData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  // 选择股票
  const selectStock = useCallback((stock: ScreenerResult) => {
    setSelectedStocks(prev => {
      // 如果是单股模式，直接替换
      if (chartMode === 'single') {
        return [stock];
      }
      // 如果是对比模式，添加到列表（最多5只）
      const exists = prev.find(s => s.symbol === stock.symbol);
      if (exists) {
        return prev.filter(s => s.symbol !== stock.symbol);
      }
      if (prev.length >= 5) {
        return [...prev.slice(1), stock];
      }
      return [...prev, stock];
    });
  }, [chartMode]);

  // 取消选择股票
  const deselectStock = useCallback((symbol: string) => {
    setSelectedStocks(prev => prev.filter(s => s.symbol !== symbol));
  }, []);

  // 清除所有选择
  const clearSelection = useCallback(() => {
    setSelectedStocks([]);
  }, []);

  // 切换图表模式
  const toggleChartMode = useCallback((mode: ChartMode) => {
    setChartMode(mode);
    if (mode === 'single' && selectedStocks.length > 1) {
      setSelectedStocks(prev => [prev[0]]);
    }
    if (mode === 'hidden') {
      clearSelection();
    }
  }, [selectedStocks, clearSelection]);

  // 切换图表类型
  const toggleChartType = useCallback((type: ChartType) => {
    setChartType(type);
  }, []);

  // 加载图表数据
  const loadChartData = useCallback(async (symbols: string[]) => {
    if (symbols.length === 0) return;

    setLoading(true);
    try {
      const response = await screenerService.getBatchMiniCharts(symbols);
      if (response.success && response.data) {
        setChartData(response.data);
      }
    } catch (error) {
      console.error('Failed to load chart data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 生成雷达图数据
  const generateRadarData = useMemo(() => {
    if (selectedStocks.length === 0) return null;

    const indicators = [
      { key: 'peRatio', name: 'PE', max: 100 },
      { key: 'pbRatio', name: 'PB', max: 10 },
      { key: 'roe', name: 'ROE', max: 50 },
      { key: 'epsGrowth', name: 'EPS增长', max: 100 },
      { key: 'revenueGrowth', name: '营收增长', max: 100 },
    ];

    return {
      indicators: indicators.map(ind => ({ name: ind.name, max: ind.max })),
      series: selectedStocks.map(stock => ({
        name: stock.name,
        value: indicators.map(ind => {
          const value = (stock as any)[ind.key];
          return value !== undefined ? value : 0;
        }),
      })),
    };
  }, [selectedStocks]);

  // 生成散点图数据
  const generateScatterData = useMemo(() => {
    if (selectedStocks.length === 0) return null;

    return selectedStocks.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      value: [stock.peRatio || 0, stock.pbRatio || 0, stock.marketCap],
    }));
  }, [selectedStocks]);

  return {
    chartMode,
    chartType,
    selectedStocks,
    chartData,
    loading,
    selectStock,
    deselectStock,
    clearSelection,
    toggleChartMode,
    toggleChartType,
    loadChartData,
    generateRadarData,
    generateScatterData,
  };
};
