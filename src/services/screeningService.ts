/**
 * 筛选服务
 * 提供股票多维度筛选功能
 */

import { request } from '@/utils/request';

/**
 * 筛选条件类型
 */
export enum FilterType {
  RANGE = 'range', // 范围筛选
  SELECT = 'select', // 单选/多选
  BOOLEAN = 'boolean', // 布尔值
  DATE = 'date', // 日期范围
}

/**
 * 筛选条件定义
 */
export interface FilterDefinition {
  key: string;
  label: string;
  type: FilterType;
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  unit?: string;
  tooltip?: string;
  category: string;
}

/**
 * 筛选条件值
 */
export interface FilterValue {
  key: string;
  operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'in' | 'not_in';
  value: any;
}

/**
 * 筛选参数
 */
export interface ScreeningParams {
  filters: FilterValue[];
  sortBy?: string;
  sortOrder?: 'ascend' | 'descend';
  page?: number;
  pageSize?: number;
}

/**
 * 筛选结果
 */
export interface ScreeningResult {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
  filters: FilterValue[];
}

/**
 * 筛选器配置
 */
export interface ScreenerConfig {
  categories: Array<{
    key: string;
    label: string;
    filters: FilterDefinition[];
  }>;
}

/**
 * 保存的筛选器
 */
export interface SavedScreener {
  id: string;
  name: string;
  filters: FilterValue[];
  createTime: string;
  updateTime: string;
}

class ScreeningService {
  /**
   * 获取筛选器配置
   */
  async getScreenerConfig(): Promise<ScreenerConfig> {
    // 模拟数据 - 实际应该从后端获取
    return {
      categories: [
        {
          key: 'basic',
          label: '基本信息',
          filters: [
            {
              key: 'marketCap',
              label: '市值',
              type: FilterType.RANGE,
              min: 0,
              unit: '亿元',
              category: 'basic',
            },
            {
              key: 'price',
              label: '股价',
              type: FilterType.RANGE,
              min: 0,
              unit: '元',
              category: 'basic',
            },
            {
              key: 'volume',
              label: '成交量',
              type: FilterType.RANGE,
              min: 0,
              unit: '手',
              category: 'basic',
            },
            {
              key: 'exchange',
              label: '交易所',
              type: FilterType.SELECT,
              options: [
                { label: '上交所', value: 'SSE' },
                { label: '深交所', value: 'SZSE' },
                { label: '北交所', value: 'BSE' },
              ],
              category: 'basic',
            },
            {
              key: 'board',
              label: '板块',
              type: FilterType.SELECT,
              options: [
                { label: '主板', value: 'main' },
                { label: '科创板', value: 'star' },
                { label: '创业板', value: 'gem' },
              ],
              category: 'basic',
            },
          ],
        },
        {
          key: 'valuation',
          label: '估值指标',
          filters: [
            {
              key: 'pe',
              label: '市盈率(PE)',
              type: FilterType.RANGE,
              tooltip: '股价/每股收益',
              category: 'valuation',
            },
            {
              key: 'pb',
              label: '市净率(PB)',
              type: FilterType.RANGE,
              tooltip: '股价/每股净资产',
              category: 'valuation',
            },
            {
              key: 'ps',
              label: '市销率(PS)',
              type: FilterType.RANGE,
              tooltip: '市值/营业收入',
              category: 'valuation',
            },
            {
              key: 'pcf',
              label: '市现率(PCF)',
              type: FilterType.RANGE,
              tooltip: '市值/现金流',
              category: 'valuation',
            },
          ],
        },
        {
          key: 'financial',
          label: '财务指标',
          filters: [
            {
              key: 'roe',
              label: 'ROE',
              type: FilterType.RANGE,
              unit: '%',
              tooltip: '净资产收益率',
              category: 'financial',
            },
            {
              key: 'roa',
              label: 'ROA',
              type: FilterType.RANGE,
              unit: '%',
              tooltip: '总资产收益率',
              category: 'financial',
            },
            {
              key: 'grossMargin',
              label: '毛利率',
              type: FilterType.RANGE,
              unit: '%',
              category: 'financial',
            },
            {
              key: 'netMargin',
              label: '净利率',
              type: FilterType.RANGE,
              unit: '%',
              category: 'financial',
            },
            {
              key: 'debtRatio',
              label: '资产负债率',
              type: FilterType.RANGE,
              unit: '%',
              category: 'financial',
            },
            {
              key: 'currentRatio',
              label: '流动比率',
              type: FilterType.RANGE,
              category: 'financial',
            },
          ],
        },
        {
          key: 'growth',
          label: '成长指标',
          filters: [
            {
              key: 'revenueGrowth',
              label: '营收增长率',
              type: FilterType.RANGE,
              unit: '%',
              category: 'growth',
            },
            {
              key: 'profitGrowth',
              label: '利润增长率',
              type: FilterType.RANGE,
              unit: '%',
              category: 'growth',
            },
            {
              key: 'epsGrowth',
              label: 'EPS增长率',
              type: FilterType.RANGE,
              unit: '%',
              category: 'growth',
            },
          ],
        },
        {
          key: 'dividend',
          label: '分红指标',
          filters: [
            {
              key: 'dividendYield',
              label: '股息率',
              type: FilterType.RANGE,
              unit: '%',
              category: 'dividend',
            },
            {
              key: 'payoutRatio',
              label: '分红率',
              type: FilterType.RANGE,
              unit: '%',
              category: 'dividend',
            },
            {
              key: 'dividendGrowth',
              label: '股息增长率',
              type: FilterType.RANGE,
              unit: '%',
              category: 'dividend',
            },
          ],
        },
        {
          key: 'technical',
          label: '技术指标',
          filters: [
            {
              key: 'changePercent',
              label: '涨跌幅',
              type: FilterType.RANGE,
              unit: '%',
              category: 'technical',
            },
            {
              key: 'volumeRatio',
              label: '量比',
              type: FilterType.RANGE,
              category: 'technical',
            },
            {
              key: 'turnoverRate',
              label: '换手率',
              type: FilterType.RANGE,
              unit: '%',
              category: 'technical',
            },
            {
              key: 'amplitude',
              label: '振幅',
              type: FilterType.RANGE,
              unit: '%',
              category: 'technical',
            },
          ],
        },
      ],
    };
  }

  /**
   * 执行筛选
   */
  async screen(params: ScreeningParams): Promise<ScreeningResult> {
    return request('/api/screening/screen', {
      method: 'POST',
      data: params,
    });
  }

  /**
   * 保存筛选器
   */
  async saveScreener(name: string, filters: FilterValue[]): Promise<SavedScreener> {
    return request('/api/screening/save', {
      method: 'POST',
      data: { name, filters },
    });
  }

  /**
   * 获取保存的筛选器列表
   */
  async getSavedScreeners(): Promise<SavedScreener[]> {
    return request('/api/screening/saved', {
      method: 'GET',
    });
  }

  /**
   * 删除保存的筛选器
   */
  async deleteScreener(id: string): Promise<void> {
    return request(`/api/screening/saved/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * 更新筛选器
   */
  async updateScreener(id: string, name: string, filters: FilterValue[]): Promise<SavedScreener> {
    return request(`/api/screening/saved/${id}`, {
      method: 'PUT',
      data: { name, filters },
    });
  }

  /**
   * 导出筛选结果
   */
  async exportResult(params: ScreeningParams): Promise<Blob> {
    return request('/api/screening/export', {
      method: 'POST',
      data: params,
      responseType: 'blob',
    });
  }

  /**
   * 获取筛选统计
   */
  async getScreeningStats(filters: FilterValue[]) {
    return request('/api/screening/stats', {
      method: 'POST',
      data: { filters },
    });
  }

  /**
   * 快速筛选 - 预定义条件
   */
  async quickScreen(preset: string, params?: Partial<ScreeningParams>) {
    return request('/api/screening/quick', {
      method: 'GET',
      params: { preset, ...params },
    });
  }

  /**
   * 构建筛选条件
   */
  buildFilter(key: string, operator: FilterValue['operator'], value: any): FilterValue {
    return { key, operator, value };
  }

  /**
   * 验证筛选条件
   */
  validateFilters(filters: FilterValue[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    filters.forEach((filter) => {
      if (!filter.key) {
        errors.push('筛选条件缺少key');
      }
      if (!filter.operator) {
        errors.push(`筛选条件${filter.key}缺少operator`);
      }
      if (filter.value === undefined || filter.value === null) {
        errors.push(`筛选条件${filter.key}缺少value`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 解析筛选条件为可读文本
   */
  parseFiltersToText(filters: FilterValue[]): string[] {
    return filters.map((filter) => {
      let text = filter.key;

      switch (filter.operator) {
        case 'eq':
          text += ` = ${filter.value}`;
          break;
        case 'gt':
          text += ` > ${filter.value}`;
          break;
        case 'gte':
          text += ` >= ${filter.value}`;
          break;
        case 'lt':
          text += ` < ${filter.value}`;
          break;
        case 'lte':
          text += ` <= ${filter.value}`;
          break;
        case 'between':
          text += ` 在 ${filter.value[0]} 到 ${filter.value[1]} 之间`;
          break;
        case 'in':
          text += ` 包含 ${Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}`;
          break;
        case 'not_in':
          text += ` 不包含 ${Array.isArray(filter.value) ? filter.value.join(', ') : filter.value}`;
          break;
      }

      return text;
    });
  }
}

export default new ScreeningService();
