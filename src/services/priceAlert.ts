/**
 * 价格提醒服务
 * 处理价格提醒的创建、查询、更新和删除
 */

import type { ApiResponse } from '@/types/api';

export interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'crypto';
  price: number;
  targetPrice: number;
  condition: 'above' | 'below';
  triggered: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export interface CreatePriceAlertDto {
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
}

export interface PriceAlertNewsItem {
  symbol: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface PriceAlertEarningsItem {
  symbol: string;
  name: string;
  date: string;
  time: 'Before Market' | 'After Market' | 'During Market';
  eps_estimate?: number;
  eps_actual?: number;
  revenue_estimate?: number;
  revenue_actual?: number;
}

/**
 * 获取用户的所有价格提醒
 */
export async function getPriceAlerts(): Promise<ApiResponse<{
  data: PriceAlert[];
  news: PriceAlertNewsItem[];
  earnings: PriceAlertEarningsItem[];
}>> {
  try {
    const response = await fetch('/api/price-alerts', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('获取价格提醒失败');
    }

    return await response.json();
  } catch (error) {
    console.error('获取价格提醒错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '获取价格提醒失败',
    };
  }
}

/**
 * 创建价格提醒
 */
export async function createPriceAlert(
  data: CreatePriceAlertDto
): Promise<ApiResponse<PriceAlert>> {
  try {
    const response = await fetch('/api/price-alerts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('创建价格提醒失败');
    }

    return await response.json();
  } catch (error) {
    console.error('创建价格提醒错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '创建价格提醒失败',
    };
  }
}

/**
 * 删除价格提醒
 */
export async function deletePriceAlert(id: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`/api/price-alerts/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('删除价格提醒失败');
    }

    return await response.json();
  } catch (error) {
    console.error('删除价格提醒错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '删除价格提醒失败',
    };
  }
}

/**
 * 批量删除价格提醒
 */
export async function deletePriceAlerts(ids: string[]): Promise<ApiResponse<void>> {
  try {
    const response = await fetch('/api/price-alerts/batch', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      throw new Error('批量删除价格提醒失败');
    }

    return await response.json();
  } catch (error) {
    console.error('批量删除价格提醒错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '批量删除价格提醒失败',
    };
  }
}

/**
 * 更新价格提醒
 */
export async function updatePriceAlert(
  id: string,
  data: Partial<CreatePriceAlertDto>
): Promise<ApiResponse<PriceAlert>> {
  try {
    const response = await fetch(`/api/price-alerts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('更新价格提醒失败');
    }

    return await response.json();
  } catch (error) {
    console.error('更新价格提醒错误:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '更新价格提醒失败',
    };
  }
}

/**
 * 分组新闻数据
 */
export function groupNews(
  news: PriceAlertNewsItem[],
  alerts: PriceAlert[]
): Record<string, PriceAlertNewsItem[]> {
  const grouped: Record<string, PriceAlertNewsItem[]> = {};
  
  news.forEach(item => {
    const alert = alerts.find(a => a.symbol === item.symbol);
    if (alert) {
      if (!grouped[item.symbol]) {
        grouped[item.symbol] = [];
      }
      grouped[item.symbol].push(item);
    }
  });
  
  return grouped;
}

/**
 * 分组财报数据
 */
export function groupEarnings(
  earnings: PriceAlertEarningsItem[]
): Record<string, PriceAlertEarningsItem[]> {
  const grouped: Record<string, PriceAlertEarningsItem[]> = {};
  
  earnings.forEach(item => {
    const dateKey = item.date;
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(item);
  });
  
  return grouped;
}
