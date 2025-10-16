/**
 * 股东信息服务
 * 提供十大股东、股权结构等数据
 */

import { request } from '@umijs/max';

export type ShareholderType = 'state_owned' | 'institutional' | 'general_legal' | 'individual' | 'foreign';

export interface Shareholder {
  name: string;
  shareholderType: ShareholderType;
  shares: number;
  percentage: number;
  isCirculating: boolean;
  changeInShares: number;
  changePercentage: number;
  rank: number;
  quarter: string;
}

export interface OwnershipStructure {
  totalShares: number;
  circulatingShares: number;
  restrictedShares: number;
  stateOwnedPercentage: number;
  institutionalPercentage: number;
  publicPercentage: number;
  top10Percentage: number;
}

export interface ShareholderChange {
  quarter: string;
  shareholderName: string;
  changeType: 'in' | 'out' | 'increase' | 'decrease';
  shares: number;
  percentage: number;
}

/**
 * 获取十大股东
 */
export async function getTopShareholders(stockCode: string, quarter?: string) {
  return request<API.Response<Shareholder[]>>('/api/shareholder/top10', {
    method: 'GET',
    params: {
      stockCode,
      quarter,
    },
  });
}

/**
 * 获取十大流通股东
 */
export async function getTopCirculatingShareholders(stockCode: string, quarter?: string) {
  return request<API.Response<Shareholder[]>>('/api/shareholder/top10-circulating', {
    method: 'GET',
    params: {
      stockCode,
      quarter,
    },
  });
}

/**
 * 获取股权结构
 */
export async function getOwnershipStructure(stockCode: string) {
  return request<API.Response<OwnershipStructure>>('/api/shareholder/structure', {
    method: 'GET',
    params: { stockCode },
  });
}

/**
 * 获取股东变动记录
 */
export async function getShareholderChanges(stockCode: string, quarters: number = 4) {
  return request<API.Response<ShareholderChange[]>>('/api/shareholder/changes', {
    method: 'GET',
    params: {
      stockCode,
      quarters,
    },
  });
}

/**
 * 格式化股东类型
 */
export function formatShareholderType(type: ShareholderType): string {
  const labels = {
    state_owned: '国有股东',
    institutional: '机构股东',
    general_legal: '一般法人',
    individual: '个人股东',
    foreign: '境外股东',
  };
  return labels[type] || type;
}
