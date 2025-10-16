/**
 * 列表数据服务
 * 提供各类特色股票列表数据
 */

import { request } from '@/utils/request';

/**
 * 列表类型枚举
 */
export enum ListType {
  // 分红类
  MONTHLY_DIVIDEND = 'monthly_dividend',
  HIGH_DIVIDEND = 'high_dividend',
  DIVIDEND_GROWTH = 'dividend_growth',
  STABLE_DIVIDEND = 'stable_dividend',

  // 期权类
  HIGH_CALL_VOLUME = 'high_call_volume',
  HIGH_PUT_VOLUME = 'high_put_volume',
  HIGH_IV = 'high_iv',
  OPEN_INTEREST = 'open_interest',
  PUT_CALL_RATIO = 'put_call_ratio',

  // 主题类
  NEV_THEME = 'nev_theme',
  SEMICONDUCTOR_THEME = 'semiconductor_theme',
  AI_THEME = 'ai_theme',
  BIOPHARM_THEME = 'biopharm_theme',
  FIVE_G_THEME = '5g_theme',
  NEW_INFRA = 'new_infra',
  DEFENSE = 'defense',
  CONSUMPTION_UPGRADE = 'consumption_upgrade',
  CARBON_NEUTRAL = 'carbon_neutral',
  METAVERSE = 'metaverse',

  // 技术类
  NEW_HIGH = 'new_high',
  CONSECUTIVE_UP_LIMIT = 'consecutive_up_limit',
  CONSECUTIVE_DOWN_LIMIT = 'consecutive_down_limit',
  HIGH_VOLUME_UP = 'high_volume_up',
  LOW_VOLUME_DOWN = 'low_volume_down',

  // 基本面类
  LOW_PE = 'low_pe',
  LOW_PB = 'low_pb',
  HIGH_ROE = 'high_roe',
  HIGH_PROFIT_GROWTH = 'high_profit_growth',
  HIGH_REVENUE_GROWTH = 'high_revenue_growth',
  LOW_DEBT_RATIO = 'low_debt_ratio',
}

/**
 * 列表项接口
 */
export interface ListItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  indicators: Record<string, number>;
  updateTime: string;
}

/**
 * 列表元数据
 */
export interface ListMetadata {
  type: ListType;
  title: string;
  description: string;
  total: number;
  updateTime: string;
  columns: ColumnConfig[];
}

/**
 * 列配置
 */
export interface ColumnConfig {
  key: string;
  title: string;
  dataIndex: string;
  sortable?: boolean;
  format?: 'number' | 'percent' | 'currency' | 'date';
  tooltip?: string;
}

/**
 * 列表查询参数
 */
export interface ListQueryParams {
  type: ListType;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ascend' | 'descend';
  filters?: Record<string, any>;
}

/**
 * 列表响应
 */
export interface ListResponse {
  data: ListItem[];
  metadata: ListMetadata;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

class ListService {
  /**
   * 获取列表数据
   */
  async getList(params: ListQueryParams): Promise<ListResponse> {
    return request('/api/lists/data', {
      method: 'GET',
      params,
    });
  }

  /**
   * 获取列表元数据
   */
  async getListMetadata(type: ListType): Promise<ListMetadata> {
    return request(`/api/lists/metadata/${type}`, {
      method: 'GET',
    });
  }

  /**
   * 获取所有列表分类
   */
  async getAllListCategories() {
    return request('/api/lists/categories', {
      method: 'GET',
    });
  }

  /**
   * 导出列表数据
   */
  async exportList(params: ListQueryParams): Promise<Blob> {
    return request('/api/lists/export', {
      method: 'POST',
      data: params,
      responseType: 'blob',
    });
  }

  /**
   * 获取列表历史数据
   */
  async getListHistory(type: ListType, days: number = 30) {
    return request('/api/lists/history', {
      method: 'GET',
      params: { type, days },
    });
  }

  /**
   * 保存自定义列表
   */
  async saveCustomList(name: string, symbols: string[]) {
    return request('/api/lists/custom', {
      method: 'POST',
      data: { name, symbols },
    });
  }

  /**
   * 获取用户自定义列表
   */
  async getCustomLists() {
    return request('/api/lists/custom', {
      method: 'GET',
    });
  }

  /**
   * 删除自定义列表
   */
  async deleteCustomList(id: string) {
    return request(`/api/lists/custom/${id}`, {
      method: 'DELETE',
    });
  }

  // ========== 分红类列表 ==========

  /**
   * 获取月度分红股列表
   */
  async getMonthlyDividendList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.MONTHLY_DIVIDEND,
      ...params,
    });
  }

  /**
   * 获取高股息率列表
   */
  async getHighDividendList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.HIGH_DIVIDEND,
      ...params,
    });
  }

  /**
   * 获取股息增长列表
   */
  async getDividendGrowthList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.DIVIDEND_GROWTH,
      ...params,
    });
  }

  /**
   * 获取分红稳定列表
   */
  async getStableDividendList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.STABLE_DIVIDEND,
      ...params,
    });
  }

  // ========== 期权类列表 ==========

  /**
   * 获取高看涨期权成交量列表
   */
  async getHighCallVolumeList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.HIGH_CALL_VOLUME,
      ...params,
    });
  }

  /**
   * 获取高看跌期权成交量列表
   */
  async getHighPutVolumeList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.HIGH_PUT_VOLUME,
      ...params,
    });
  }

  /**
   * 获取高隐含波动率列表
   */
  async getHighIVList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.HIGH_IV,
      ...params,
    });
  }

  /**
   * 获取未平仓合约列表
   */
  async getOpenInterestList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.OPEN_INTEREST,
      ...params,
    });
  }

  /**
   * 获取Put/Call比率异常列表
   */
  async getPutCallRatioList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.PUT_CALL_RATIO,
      ...params,
    });
  }

  // ========== 主题类列表 ==========

  /**
   * 获取新能源汽车主题列表
   */
  async getNEVThemeList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.NEV_THEME,
      ...params,
    });
  }

  /**
   * 获取半导体主题列表
   */
  async getSemiconductorThemeList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.SEMICONDUCTOR_THEME,
      ...params,
    });
  }

  /**
   * 获取人工智能主题列表
   */
  async getAIThemeList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.AI_THEME,
      ...params,
    });
  }

  /**
   * 获取生物医药主题列表
   */
  async getBiopharmThemeList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.BIOPHARM_THEME,
      ...params,
    });
  }

  /**
   * 获取5G通信主题列表
   */
  async get5GThemeList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.FIVE_G_THEME,
      ...params,
    });
  }

  /**
   * 获取新基建主题列表
   */
  async getNewInfraList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.NEW_INFRA,
      ...params,
    });
  }

  /**
   * 获取军工国防主题列表
   */
  async getDefenseList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.DEFENSE,
      ...params,
    });
  }

  /**
   * 获取消费升级主题列表
   */
  async getConsumptionUpgradeList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.CONSUMPTION_UPGRADE,
      ...params,
    });
  }

  /**
   * 获取碳中和主题列表
   */
  async getCarbonNeutralList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.CARBON_NEUTRAL,
      ...params,
    });
  }

  /**
   * 获取元宇宙主题列表
   */
  async getMetaverseList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.METAVERSE,
      ...params,
    });
  }

  // ========== 技术类列表 ==========

  /**
   * 获取新高突破列表
   */
  async getNewHighList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.NEW_HIGH,
      ...params,
    });
  }

  /**
   * 获取连续涨停列表
   */
  async getConsecutiveUpLimitList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.CONSECUTIVE_UP_LIMIT,
      ...params,
    });
  }

  /**
   * 获取连续跌停列表
   */
  async getConsecutiveDownLimitList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.CONSECUTIVE_DOWN_LIMIT,
      ...params,
    });
  }

  /**
   * 获取放量上涨列表
   */
  async getHighVolumeUpList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.HIGH_VOLUME_UP,
      ...params,
    });
  }

  /**
   * 获取缩量下跌列表
   */
  async getLowVolumeDownList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.LOW_VOLUME_DOWN,
      ...params,
    });
  }

  // ========== 基本面类列表 ==========

  /**
   * 获取低市盈率列表
   */
  async getLowPEList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.LOW_PE,
      ...params,
    });
  }

  /**
   * 获取低市净率列表
   */
  async getLowPBList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.LOW_PB,
      ...params,
    });
  }

  /**
   * 获取高ROE列表
   */
  async getHighROEList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.HIGH_ROE,
      ...params,
    });
  }

  /**
   * 获取高利润增长列表
   */
  async getHighProfitGrowthList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.HIGH_PROFIT_GROWTH,
      ...params,
    });
  }

  /**
   * 获取高营收增长列表
   */
  async getHighRevenueGrowthList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.HIGH_REVENUE_GROWTH,
      ...params,
    });
  }

  /**
   * 获取低负债率列表
   */
  async getLowDebtRatioList(params?: Partial<ListQueryParams>) {
    return this.getList({
      type: ListType.LOW_DEBT_RATIO,
      ...params,
    });
  }
}

export default new ListService();
