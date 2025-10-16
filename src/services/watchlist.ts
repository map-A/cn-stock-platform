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
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  stockCount: number;
  createdAt: string;
  updatedAt: string;
  stocks: WatchlistStock[];
}

/**
 * 自选股服务
 */
class WatchlistService {
  /**
   * 获取用户自选股列表
   */
  async getWatchlists(): Promise<API.Response<WatchlistDetail[]>> {
    return request('/api/watchlist', {
      method: 'GET',
    });
  }

  /**
   * 获取自选股详情
   */
  async getWatchlistDetail(id: string): Promise<API.Response<WatchlistDetail>> {
    return request(`/api/watchlist/${id}`, {
      method: 'GET',
    });
  }

  /**
   * 创建自选股
   */
  async createWatchlist(data: CreateWatchlistDTO): Promise<API.Response<WatchlistDetail>> {
    return request('/api/watchlist', {
      method: 'POST',
      data,
    });
  }

  /**
   * 更新自选股信息
   */
  async updateWatchlist(
    id: string,
    data: Partial<CreateWatchlistDTO>,
  ): Promise<API.Response<WatchlistDetail>> {
    return request(`/api/watchlist/${id}`, {
      method: 'PUT',
      data,
    });
  }

  /**
   * 删除自选股
   */
  async deleteWatchlist(id: string): Promise<API.Response<void>> {
    return request(`/api/watchlist/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * 添加股票到自选股
   */
  async addStock(watchlistId: string, symbol: string): Promise<API.Response<void>> {
    return request(`/api/watchlist/${watchlistId}/stocks`, {
      method: 'POST',
      data: { symbol },
    });
  }

  /**
   * 从自选股移除股票
   */
  async removeStock(watchlistId: string, symbol: string): Promise<API.Response<void>> {
    return request(`/api/watchlist/${watchlistId}/stocks/${symbol}`, {
      method: 'DELETE',
    });
  }

  /**
   * 批量添加股票
   */
  async batchAddStocks(watchlistId: string, symbols: string[]): Promise<API.Response<void>> {
    return request(`/api/watchlist/${watchlistId}/stocks/batch`, {
      method: 'POST',
      data: { symbols },
    });
  }

  /**
   * 获取默认自选股
   */
  async getDefaultWatchlist(): Promise<API.Response<WatchlistDetail>> {
    return request('/api/watchlist/default', {
      method: 'GET',
    });
  }
}

export default new WatchlistService();
