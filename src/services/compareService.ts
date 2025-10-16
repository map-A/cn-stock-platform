/**
 * 股票对比服务
 * 提供多股票对比分析功能
 */

import { apiClient } from './apiClient';

/**
 * 对比数据接口
 */
export interface CompareData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  pe: number;
  eps: number;
  dividend: number;
  dividendYield: number;
  revenue: number;
  netIncome: number;
  grossProfit: number;
  operatingIncome: number;
  freeCashFlow: number;
  totalDebt: number;
  totalAssets: number;
  roe: number;
  roa: number;
  currentRatio: number;
  debtToEquity: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  revenueGrowth: number;
  earningsGrowth: number;
  beta: number;
  week52High: number;
  week52Low: number;
  averageVolume: number;
  [key: string]: any;
}

/**
 * 价格历史数据
 */
export interface PriceHistory {
  date: string;
  [symbol: string]: number | string;
}

/**
 * 对比服务类
 */
class CompareService {
  /**
   * 获取多股票对比数据
   */
  async compareStocks(symbols: string[]): Promise<CompareData[]> {
    const response = await apiClient.post('/api/compare/stocks', { symbols });
    return response.data;
  }

  /**
   * 获取价格历史对比
   */
  async getPriceHistory(
    symbols: string[],
    period: '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' = '1Y'
  ): Promise<PriceHistory[]> {
    const response = await apiClient.post('/api/compare/price-history', {
      symbols,
      period,
    });
    return response.data;
  }

  /**
   * 获取财务指标对比
   */
  async getFinancialMetrics(symbols: string[]): Promise<Record<string, any>> {
    const response = await apiClient.post('/api/compare/financial-metrics', { symbols });
    return response.data;
  }

  /**
   * 获取估值指标对比
   */
  async getValuationMetrics(symbols: string[]): Promise<Record<string, any>> {
    const response = await apiClient.post('/api/compare/valuation-metrics', { symbols });
    return response.data;
  }

  /**
   * 获取技术指标对比
   */
  async getTechnicalMetrics(symbols: string[]): Promise<Record<string, any>> {
    const response = await apiClient.post('/api/compare/technical-metrics', { symbols });
    return response.data;
  }

  /**
   * 获取收益率对比
   */
  async getReturnsComparison(
    symbols: string[],
    periods: string[] = ['1M', '3M', '6M', '1Y', '3Y', '5Y']
  ): Promise<Record<string, Record<string, number>>> {
    const response = await apiClient.post('/api/compare/returns', {
      symbols,
      periods,
    });
    return response.data;
  }

  /**
   * 导出对比数据
   */
  async exportComparison(symbols: string[], format: 'csv' | 'xlsx' | 'pdf' = 'csv'): Promise<Blob> {
    const response = await apiClient.post(
      '/api/compare/export',
      { symbols, format },
      { responseType: 'blob' }
    );
    return response.data;
  }

  /**
   * 保存对比配置
   */
  async saveComparisonConfig(name: string, symbols: string[]): Promise<void> {
    await apiClient.post('/api/compare/save-config', { name, symbols });
  }

  /**
   * 获取已保存的对比配置
   */
  async getSavedConfigs(): Promise<Array<{ id: string; name: string; symbols: string[] }>> {
    const response = await apiClient.get('/api/compare/configs');
    return response.data;
  }

  /**
   * 删除对比配置
   */
  async deleteConfig(configId: string): Promise<void> {
    await apiClient.delete(`/api/compare/configs/${configId}`);
  }
}

export const compareService = new CompareService();
export default compareService;
