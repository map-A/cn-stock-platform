/**
 * 机构持仓服务
 * 提供基金、QFII、社保等机构持仓数据
 */

import { request } from '@umijs/max';

export type InstitutionType = 'fund' | 'qfii' | 'social_security' | 'insurance' | 'trust' | 'private_equity';

export interface InstitutionalHolding {
  institutionId: string;
  institutionName: string;
  institutionType: InstitutionType;
  shares: number;
  percentage: number;
  marketValue: number;
  changeInShares: number;
  changePercentage: number;
  quarter: string;
  rank: number;
}

export interface InstitutionDetail {
  id: string;
  name: string;
  type: InstitutionType;
  totalAssets: number;
  stockCount: number;
  topHoldings: InstitutionalHolding[];
}

export interface HoldingTrend {
  quarter: string;
  institutionCount: number;
  totalShares: number;
  totalMarketValue: number;
  averagePercentage: number;
}

/**
 * 获取机构持仓列表
 */
export async function getInstitutionalHoldings(
  stockCode: string,
  params?: {
    quarter?: string;
    institutionType?: InstitutionType;
  },
) {
  return request<API.Response<InstitutionalHolding[]>>('/api/institutional/holdings', {
    method: 'GET',
    params: {
      stockCode,
      ...params,
    },
  });
}

/**
 * 获取机构持仓趋势
 */
export async function getHoldingTrend(stockCode: string, quarters: number = 8) {
  return request<API.Response<HoldingTrend[]>>('/api/institutional/trend', {
    method: 'GET',
    params: {
      stockCode,
      quarters,
    },
  });
}

/**
 * 获取机构详情
 */
export async function getInstitutionDetail(institutionId: string) {
  return request<API.Response<InstitutionDetail>>('/api/institutional/detail', {
    method: 'GET',
    params: { institutionId },
  });
}

/**
 * 格式化机构类型
 */
export function formatInstitutionType(type: InstitutionType): string {
  const labels = {
    fund: '基金',
    qfii: 'QFII',
    social_security: '社保基金',
    insurance: '保险',
    trust: '信托',
    private_equity: '私募',
  };
  return labels[type] || type;
}
