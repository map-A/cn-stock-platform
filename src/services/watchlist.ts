import request from '@/utils/request';

export interface WatchlistStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketValue?: number;
  industry?: string;
  addedAt: string;
}

export interface CreateWatchlistDTO {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface WatchlistDetail {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  stockCount: number;
  createdAt: string;
  updatedAt: string;
  stocks: WatchlistStock[];
}

const GATEWAY_URL = 'http://localhost:3000';
const USER_ID = 1; // TODO: 从auth context获取

/**
 * 自选股服务
 */
class WatchlistService {
  /**
   * 获取用户自选股列表
   */
  async getWatchlists(): Promise<API.Response<WatchlistDetail[]>> {
    const response = await request(`${GATEWAY_URL}/api/watchlist/lists?user_id=${USER_ID}`, {
      method: 'GET',
    });
    
    // 转换数据格式以匹配前端期望的格式
    if (response.code === 200 && response.data) {
      const watchlists = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        isPublic: item.isPublic,
        stockCount: item.stockCount,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        stocks: [],
      }));
      return { success: true, data: watchlists };
    }
    
    return { success: false, data: [] };
  }

  /**
   * 获取自选股详情
   */
  async getWatchlistDetail(id: number): Promise<API.Response<WatchlistDetail>> {
    try {
      // 获取自选股基本信息
      const listsResponse = await request(`${GATEWAY_URL}/api/watchlist/lists?user_id=${USER_ID}`, {
        method: 'GET',
      });
      
      const watchlistInfo = listsResponse.data?.find((w: any) => w.id === id);
      
      if (!watchlistInfo) {
        return { success: false, data: null };
      }
      
      // 获取自选股的股票列表
      const stocksResponse = await request(`${GATEWAY_URL}/api/watchlist/lists/${id}/stocks`, {
        method: 'GET',
      });
      
      const symbols = stocksResponse.data || [];
      
      // 获取股票的实时行情数据（模拟数据，后续接入market service）
      const stocks: WatchlistStock[] = symbols.map((symbol: string) => ({
        symbol,
        name: this.getStockName(symbol),
        price: Math.random() * 100 + 10,
        change: Math.random() * 10 - 5,
        changePercent: Math.random() * 10 - 5,
        marketValue: Math.random() * 1000000000,
        industry: '未知',
        addedAt: new Date().toISOString(),
      }));
      
      return {
        success: true,
        data: {
          ...watchlistInfo,
          stocks,
        },
      };
    } catch (error) {
      console.error('获取自选股详情失败:', error);
      return { success: false, data: null };
    }
  }
  
  // 临时方法：根据股票代码获取名称
  private getStockName(symbol: string): string {
    const names: Record<string, string> = {
      'sh600519': '贵州茅台',
      'sz000651': '格力电器',
      'sh600036': '招商银行',
      'sz000858': '五粮液',
      'sz000333': '美的集团',
    };
    return names[symbol] || symbol;
  }

  /**
   * 创建自选股
   */
  async createWatchlist(data: CreateWatchlistDTO): Promise<API.Response<WatchlistDetail>> {
    const response = await request(`${GATEWAY_URL}/api/watchlist/lists`, {
      method: 'POST',
      data: {
        name: data.name,
        description: data.description,
        isPublic: data.isPublic || false,
      },
    });
    
    if (response.code === 200 && response.data) {
      return { success: true, data: response.data };
    }
    
    return { success: false, data: null };
  }

  /**
   * 更新自选股信息
   */
  async updateWatchlist(
    id: number,
    data: Partial<CreateWatchlistDTO>,
  ): Promise<API.Response<WatchlistDetail>> {
    const response = await request(`${GATEWAY_URL}/api/watchlist/lists/${id}`, {
      method: 'PUT',
      data,
    });
    
    if (response.code === 200) {
      return { success: true, data: null };
    }
    
    return { success: false, data: null };
  }

  /**
   * 删除自选股
   */
  async deleteWatchlist(id: number): Promise<API.Response<void>> {
    const response = await request(`${GATEWAY_URL}/api/watchlist/lists/${id}`, {
      method: 'DELETE',
    });
    
    return { success: response.code === 200 };
  }

  /**
   * 添加股票到自选股
   */
  async addStock(watchlistId: number, symbol: string): Promise<API.Response<void>> {
    const response = await request(`${GATEWAY_URL}/api/watchlist/lists/${watchlistId}/stocks`, {
      method: 'POST',
      data: { symbol },
    });
    
    return { success: response.code === 200 };
  }

  /**
   * 从自选股移除股票
   */
  async removeStock(watchlistId: number, symbol: string): Promise<API.Response<void>> {
    const response = await request(`${GATEWAY_URL}/api/watchlist/lists/${watchlistId}/stocks/${symbol}`, {
      method: 'DELETE',
    });
    
    return { success: response.code === 200 };
  }

  /**
   * 批量添加股票
   */
  async batchAddStocks(watchlistId: number, symbols: string[]): Promise<API.Response<void>> {
    // 批量添加，逐个调用addStock
    try {
      for (const symbol of symbols) {
        await this.addStock(watchlistId, symbol);
      }
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * 获取默认自选股
   */
  async getDefaultWatchlist(): Promise<API.Response<WatchlistDetail>> {
    const response = await this.getWatchlists();
    if (response.success && response.data && response.data.length > 0) {
      const defaultWatchlist = response.data.find(w => w.isDefault) || response.data[0];
      return this.getWatchlistDetail(defaultWatchlist.id);
    }
    return { success: false, data: null };
  }
}

export default new WatchlistService();
