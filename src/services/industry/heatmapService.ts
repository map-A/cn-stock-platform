/**
 * 热图数据服务
 * 提供市场热图、行业热图、板块热图等可视化数据
 */

import request from '@/services/request';

/**
 * 热图单元格数据接口
 */
export interface HeatmapCell {
  /** 标识符（股票代码、行业代码等） */
  id: string;
  /** 名称 */
  name: string;
  /** 值（用于计算大小） */
  value: number;
  /** 涨跌幅（用于计算颜色） */
  changePercent: number;
  /** 分组（板块、行业等） */
  group?: string;
  /** 权重 */
  weight?: number;
  /** 额外信息 */
  extra?: Record<string, any>;
}

/**
 * 热图配置接口
 */
export interface HeatmapConfig {
  /** 热图类型 */
  type: 'market' | 'sector' | 'industry' | 'custom';
  /** 时间范围 */
  timeRange: '1d' | '5d' | '1m' | '3m' | '6m' | '1y';
  /** 分组方式 */
  groupBy?: 'sector' | 'industry' | 'marketCap' | 'none';
  /** 排序方式 */
  sortBy?: 'changePercent' | 'value' | 'name';
  /** 限制数量 */
  limit?: number;
}

/**
 * 热图数据接口
 */
export interface HeatmapData {
  /** 单元格数据 */
  cells: HeatmapCell[];
  /** 配置信息 */
  config: HeatmapConfig;
  /** 统计信息 */
  stats: {
    totalCount: number;
    avgChangePercent: number;
    maxChangePercent: number;
    minChangePercent: number;
    gainersCount: number;
    losersCount: number;
  };
  /** 更新时间 */
  updateTime: string;
}

/**
 * 获取市场热图数据
 * @param timeRange 时间范围
 * @param groupBy 分组方式
 * @param limit 限制数量
 */
export async function getMarketHeatmap(
  timeRange: '1d' | '5d' | '1m' | '3m' | '6m' | '1y' = '1d',
  groupBy: 'sector' | 'industry' | 'marketCap' = 'sector',
  limit = 100,
): Promise<HeatmapData> {
  return request.get('/api/heatmap/market', {
    params: { timeRange, groupBy, limit },
  });
}

/**
 * 获取板块热图数据
 * @param timeRange 时间范围
 */
export async function getSectorHeatmap(
  timeRange: '1d' | '5d' | '1m' | '3m' | '6m' | '1y' = '1d',
): Promise<HeatmapData> {
  return request.get('/api/heatmap/sectors', {
    params: { timeRange },
  });
}

/**
 * 获取行业热图数据
 * @param timeRange 时间范围
 * @param sectorCode 板块代码（可选）
 */
export async function getIndustryHeatmap(
  timeRange: '1d' | '5d' | '1m' | '3m' | '6m' | '1y' = '1d',
  sectorCode?: string,
): Promise<HeatmapData> {
  return request.get('/api/heatmap/industries', {
    params: { timeRange, sectorCode },
  });
}

/**
 * 获取指数成分股热图
 * @param indexCode 指数代码
 * @param timeRange 时间范围
 */
export async function getIndexHeatmap(
  indexCode: string,
  timeRange: '1d' | '5d' | '1m' | '3m' | '6m' | '1y' = '1d',
): Promise<HeatmapData> {
  return request.get(`/api/heatmap/index/${indexCode}`, {
    params: { timeRange },
  });
}

/**
 * 获取自定义热图数据
 * @param symbols 股票代码列表
 * @param timeRange 时间范围
 */
export async function getCustomHeatmap(
  symbols: string[],
  timeRange: '1d' | '5d' | '1m' | '3m' | '6m' | '1y' = '1d',
): Promise<HeatmapData> {
  return request.post('/api/heatmap/custom', {
    symbols,
    timeRange,
  });
}

/**
 * 获取热图单元格详情
 * @param id 单元格ID（股票代码或行业代码）
 * @param type 类型
 */
export async function getHeatmapCellDetail(
  id: string,
  type: 'stock' | 'industry' | 'sector',
): Promise<{
  id: string;
  name: string;
  type: string;
  current: {
    price: number;
    changePercent: number;
    volume: number;
  };
  historical: {
    date: string;
    changePercent: number;
  }[];
  relatedCells: HeatmapCell[];
}> {
  return request.get(`/api/heatmap/cell/${id}`, {
    params: { type },
  });
}

/**
 * 导出热图数据
 * @param config 热图配置
 * @param format 导出格式
 */
export async function exportHeatmapData(
  config: HeatmapConfig,
  format: 'csv' | 'json' | 'excel' = 'csv',
): Promise<Blob> {
  const response = await request.post(
    '/api/heatmap/export',
    { config },
    {
      params: { format },
      responseType: 'blob',
    },
  );
  return response;
}

/**
 * 获取热图快照（用于分享）
 * @param config 热图配置
 */
export async function createHeatmapSnapshot(config: HeatmapConfig): Promise<{
  snapshotId: string;
  shareUrl: string;
  expiresAt: string;
}> {
  return request.post('/api/heatmap/snapshot', { config });
}

/**
 * 获取热图快照数据
 * @param snapshotId 快照ID
 */
export async function getHeatmapSnapshot(snapshotId: string): Promise<HeatmapData> {
  return request.get(`/api/heatmap/snapshot/${snapshotId}`);
}

export default {
  getMarketHeatmap,
  getSectorHeatmap,
  getIndustryHeatmap,
  getIndexHeatmap,
  getCustomHeatmap,
  getHeatmapCellDetail,
  exportHeatmapData,
  createHeatmapSnapshot,
  getHeatmapSnapshot,
};
