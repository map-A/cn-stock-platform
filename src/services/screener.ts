import request from '@/utils/request';

export interface ScreenerCondition {
  field: string;
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq' | 'between' | 'in';
  value: any;
}

export interface ScreenerFilter {
  // 市值范围
  marketCapMin?: number;
  marketCapMax?: number;
  // 价格范围
  priceMin?: number;
  priceMax?: number;
  // 市盈率范围
  peRatioMin?: number;
  peRatioMax?: number;
  // 市净率范围
  pbRatioMin?: number;
  pbRatioMax?: number;
  // 股息率范围
  dividendYieldMin?: number;
  dividendYieldMax?: number;
  // 涨跌幅
  changePercentMin?: number;
  changePercentMax?: number;
  // 成交量
  volumeMin?: number;
  volumeMax?: number;
  // 行业
  industries?: string[];
  // 板块
  sectors?: string[];
  // 地区
  regions?: string[];
  // 自定义条件
  customConditions?: ScreenerCondition[];
}

export interface ScreenerResult {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio?: number;
  pbRatio?: number;
  dividendYield?: number;
  industry: string;
  sector: string;
}

export interface ScreenerParams extends ScreenerFilter {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SavedScreener {
  id: string;
  name: string;
  description?: string;
  filters: ScreenerFilter;
  createdAt: string;
  updatedAt: string;
}

/**
 * 股票筛选服务
 */
class ScreenerService {
  /**
   * 筛选股票
   */
  async screenStocks(
    params: ScreenerParams,
  ): Promise<API.Response<API.PaginatedResponse<ScreenerResult>>> {
    return request('/api/screener/stocks', {
      method: 'POST',
      data: params,
    });
  }

  /**
   * 获取可用的筛选字段
   */
  async getAvailableFields(): Promise<
    API.Response<{
      field: string;
      label: string;
      type: 'number' | 'string' | 'enum';
      options?: string[];
    }[]>
  > {
    return request('/api/screener/fields', {
      method: 'GET',
    });
  }

  /**
   * 获取行业列表
   */
  async getIndustries(): Promise<API.Response<{ code: string; name: string }[]>> {
    return request('/api/screener/industries', {
      method: 'GET',
    });
  }

  /**
   * 获取板块列表
   */
  async getSectors(): Promise<API.Response<{ code: string; name: string }[]>> {
    return request('/api/screener/sectors', {
      method: 'GET',
    });
  }

  /**
   * 保存筛选条件
   */
  async saveScreener(data: {
    name: string;
    description?: string;
    filters: ScreenerFilter;
  }): Promise<API.Response<SavedScreener>> {
    return request('/api/screener/saved', {
      method: 'POST',
      data,
    });
  }

  /**
   * 获取已保存的筛选器列表
   */
  async getSavedScreeners(): Promise<API.Response<SavedScreener[]>> {
    return request('/api/screener/saved', {
      method: 'GET',
    });
  }

  /**
   * 删除已保存的筛选器
   */
  async deleteSavedScreener(id: string): Promise<API.Response<void>> {
    return request(`/api/screener/saved/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * 获取预设筛选器
   */
  async getPresetScreeners(): Promise<
    API.Response<{ id: string; name: string; description: string; filters: ScreenerFilter }[]>
  > {
    return request('/api/screener/presets', {
      method: 'GET',
    });
  }

  /**
   * 导出筛选结果
   */
  async exportResults(params: ScreenerParams): Promise<Blob> {
    return request('/api/screener/export', {
      method: 'POST',
      data: params,
      responseType: 'blob',
    });
  }
}

export default new ScreenerService();
