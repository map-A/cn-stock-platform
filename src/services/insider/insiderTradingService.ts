/**
 * 内部交易服务
 * 提供董监高交易数据获取和分析功能
 */

import { request } from '@umijs/max';

export type TransactionType = 'buy' | 'sell' | 'grant' | 'exercise';
export type InsiderPosition = 'chairman' | 'ceo' | 'cfo' | 'director' | 'supervisor' | 'senior_manager';

export interface InsiderTransaction {
  id: string;
  stockCode: string;
  stockName: string;
  insiderName: string;
  position: InsiderPosition;
  positionName: string;
  transactionType: TransactionType;
  shares: number;
  price: number;
  value: number;
  date: string;
  filingDate: string;
  reason: string;
  sharesAfter: number;
  percentageAfter: number;
}

export interface InsiderProfile {
  name: string;
  position: InsiderPosition;
  positionName: string;
  currentShares: number;
  currentPercentage: number;
  transactions: InsiderTransaction[];
  netChange: number; // 净变动股数
  totalBuyValue: number;
  totalSellValue: number;
}

export interface InsiderSignal {
  stockCode: string;
  stockName: string;
  signalType: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';
  signalStrength: number; // 0-100
  factors: {
    transactionSize: number;
    frequency: number;
    consistency: number;
    positionWeight: number;
    timing: number;
  };
  recentTransactions: InsiderTransaction[];
  summary: string;
}

export interface InsiderCluster {
  date: string;
  stockCode: string;
  stockName: string;
  insiderCount: number;
  totalShares: number;
  totalValue: number;
  netDirection: 'buy' | 'sell';
  clusterScore: number; // 集群强度
}

/**
 * 获取股票内部交易记录
 */
export async function getInsiderTransactions(
  stockCode: string,
  params?: {
    startDate?: string;
    endDate?: string;
    transactionType?: TransactionType;
    limit?: number;
  },
) {
  return request<API.Response<InsiderTransaction[]>>('/api/insider/transactions', {
    method: 'GET',
    params: {
      stockCode,
      ...params,
    },
  });
}

/**
 * 获取内部人详细信息
 */
export async function getInsiderProfile(stockCode: string, insiderName: string) {
  return request<API.Response<InsiderProfile>>('/api/insider/profile', {
    method: 'GET',
    params: {
      stockCode,
      insiderName,
    },
  });
}

/**
 * 获取所有内部人列表
 */
export async function getInsidersList(stockCode: string) {
  return request<API.Response<InsiderProfile[]>>('/api/insider/list', {
    method: 'GET',
    params: { stockCode },
  });
}

/**
 * 获取内部交易信号
 */
export async function getInsiderSignal(stockCode: string) {
  return request<API.Response<InsiderSignal>>('/api/insider/signal', {
    method: 'GET',
    params: { stockCode },
  });
}

/**
 * 获取内部交易集群
 */
export async function getInsiderClusters(params?: {
  startDate?: string;
  endDate?: string;
  minInsiderCount?: number;
  minValue?: number;
}) {
  return request<API.Response<InsiderCluster[]>>('/api/insider/clusters', {
    method: 'GET',
    params,
  });
}

/**
 * 计算交易信号强度
 */
export function calculateSignalStrength(transactions: InsiderTransaction[]): InsiderSignal['factors'] {
  if (transactions.length === 0) {
    return {
      transactionSize: 0,
      frequency: 0,
      consistency: 0,
      positionWeight: 0,
      timing: 0,
    };
  }
  
  // 1. 交易规模评分 (0-100)
  const avgValue = transactions.reduce((sum, t) => sum + t.value, 0) / transactions.length;
  const transactionSize = Math.min((avgValue / 1000000) * 10, 100); // 100万=10分
  
  // 2. 交易频率评分 (0-100)
  const daysSpan = transactions.length > 1
    ? (new Date(transactions[0].date).getTime() - new Date(transactions[transactions.length - 1].date).getTime()) / (1000 * 60 * 60 * 24)
    : 365;
  const frequency = Math.min((transactions.length / daysSpan) * 365 * 10, 100);
  
  // 3. 方向一致性评分 (0-100)
  const buyCount = transactions.filter(t => t.transactionType === 'buy').length;
  const sellCount = transactions.filter(t => t.transactionType === 'sell').length;
  const consistency = Math.abs(buyCount - sellCount) / transactions.length * 100;
  
  // 4. 职位权重评分 (0-100)
  const positionWeights = {
    chairman: 100,
    ceo: 90,
    cfo: 80,
    director: 70,
    supervisor: 60,
    senior_manager: 50,
  };
  const avgPositionWeight = transactions.reduce((sum, t) => {
    return sum + (positionWeights[t.position] || 0);
  }, 0) / transactions.length;
  const positionWeight = avgPositionWeight;
  
  // 5. 交易时机评分 (0-100)
  // 简化逻辑：最近3个月的交易权重更高
  const now = Date.now();
  const recentWeight = transactions.reduce((sum, t) => {
    const daysDiff = (now - new Date(t.date).getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff < 90) return sum + 1;
    if (daysDiff < 180) return sum + 0.5;
    return sum + 0.25;
  }, 0);
  const timing = Math.min((recentWeight / transactions.length) * 100, 100);
  
  return {
    transactionSize,
    frequency,
    consistency,
    positionWeight,
    timing,
  };
}

/**
 * 生成交易信号
 */
export function generateInsiderSignal(
  stockCode: string,
  stockName: string,
  transactions: InsiderTransaction[],
): InsiderSignal {
  const factors = calculateSignalStrength(transactions);
  
  // 综合评分
  const signalStrength = (
    factors.transactionSize * 0.3 +
    factors.frequency * 0.15 +
    factors.consistency * 0.25 +
    factors.positionWeight * 0.2 +
    factors.timing * 0.1
  );
  
  // 判断信号类型
  const buyTransactions = transactions.filter(t => t.transactionType === 'buy');
  const sellTransactions = transactions.filter(t => t.transactionType === 'sell');
  const buyValue = buyTransactions.reduce((sum, t) => sum + t.value, 0);
  const sellValue = sellTransactions.reduce((sum, t) => sum + t.value, 0);
  
  let signalType: InsiderSignal['signalType'];
  let summary: string;
  
  if (buyValue > sellValue * 2 && signalStrength > 70) {
    signalType = 'strong_buy';
    summary = '内部人大量增持，强烈买入信号';
  } else if (buyValue > sellValue && signalStrength > 50) {
    signalType = 'buy';
    summary = '内部人持续增持，买入信号';
  } else if (sellValue > buyValue * 2 && signalStrength > 70) {
    signalType = 'strong_sell';
    summary = '内部人大量减持，强烈卖出信号';
  } else if (sellValue > buyValue && signalStrength > 50) {
    signalType = 'sell';
    summary = '内部人持续减持，卖出信号';
  } else {
    signalType = 'neutral';
    summary = '内部交易无明显方向性';
  }
  
  return {
    stockCode,
    stockName,
    signalType,
    signalStrength,
    factors,
    recentTransactions: transactions.slice(0, 10),
    summary,
  };
}

/**
 * 检测交易集群
 */
export function detectInsiderCluster(transactions: InsiderTransaction[]): InsiderCluster[] {
  const clusters: InsiderCluster[] = [];
  
  // 按日期分组
  const groupedByDate = transactions.reduce((acc, t) => {
    const date = t.date.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {} as Record<string, InsiderTransaction[]>);
  
  // 分析每个日期的集群
  Object.entries(groupedByDate).forEach(([date, txs]) => {
    if (txs.length < 2) return; // 至少2人才算集群
    
    const buyTxs = txs.filter(t => t.transactionType === 'buy');
    const sellTxs = txs.filter(t => t.transactionType === 'sell');
    
    const buyValue = buyTxs.reduce((sum, t) => sum + t.value, 0);
    const sellValue = sellTxs.reduce((sum, t) => sum + t.value, 0);
    
    const cluster: InsiderCluster = {
      date,
      stockCode: txs[0].stockCode,
      stockName: txs[0].stockName,
      insiderCount: new Set(txs.map(t => t.insiderName)).size,
      totalShares: txs.reduce((sum, t) => sum + t.shares, 0),
      totalValue: txs.reduce((sum, t) => sum + t.value, 0),
      netDirection: buyValue > sellValue ? 'buy' : 'sell',
      clusterScore: Math.min(txs.length * 10 + Math.abs(buyValue - sellValue) / 1000000, 100),
    };
    
    clusters.push(cluster);
  });
  
  return clusters.sort((a, b) => b.clusterScore - a.clusterScore);
}

/**
 * 获取职位权重
 */
export function getPositionWeight(position: InsiderPosition): number {
  const weights = {
    chairman: 1.0,
    ceo: 0.9,
    cfo: 0.8,
    director: 0.7,
    supervisor: 0.6,
    senior_manager: 0.5,
  };
  return weights[position] || 0.5;
}

/**
 * 格式化交易类型
 */
export function formatTransactionType(type: TransactionType): string {
  const labels = {
    buy: '增持',
    sell: '减持',
    grant: '授予',
    exercise: '行权',
  };
  return labels[type] || type;
}

/**
 * 格式化职位名称
 */
export function formatPosition(position: InsiderPosition): string {
  const labels = {
    chairman: '董事长',
    ceo: '总经理',
    cfo: '财务总监',
    director: '董事',
    supervisor: '监事',
    senior_manager: '高级管理人员',
  };
  return labels[position] || position;
}
